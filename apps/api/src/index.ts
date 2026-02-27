import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Client as MinioClient } from 'minio';
import { buffer } from 'stream/consumers';

const app = new Hono();
const prisma = new PrismaClient();

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

const MINIO_CONFIG = {
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_USER || 'minioadmin',
  secretKey: process.env.MINIO_PASSWORD || 'minioadmin',
};
const minioClient = new MinioClient(MINIO_CONFIG);
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'abdurblog-images';

// CORS Middleware
app.use('/*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Ensure MinIO bucket exists
const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET);
      console.log(`Bucket "${MINIO_BUCKET}" created successfully`);
    }
  } catch (error) {
    console.error('Error ensuring bucket:', error);
  }
};

// Initialize on startup
ensureBucket();

// Helpers
const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as { id: string; role?: string; email?: string };
  } catch {
    return null;
  }
};

const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = auth.split(' ')[1];
  const payload = verifyToken(token, JWT_SECRET);
  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401);
  }
  c.set('user', payload);
  await next();
};

// Schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Auth Routes
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const valid = registerSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: valid.data.email },
    });

    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 409);
    }

    const hashed = await bcrypt.hash(valid.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: valid.data.email,
        password: hashed,
        name: valid.data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    return c.json({ user }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const valid = loginSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input' }, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: valid.data.email },
    });

    if (!user || !(await bcrypt.compare(valid.data.password, user.password))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    c.header('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    return c.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

app.post('/api/auth/refresh', async (c) => {
  try {
    const refreshToken = c.req.header('Cookie')?.match(/refreshToken=([^;]+)/)?.[1];

    if (!refreshToken) {
      return c.json({ error: 'No refresh token' }, 401);
    }

    const payload = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
    if (!payload) {
      return c.json({ error: 'Invalid refresh token' }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return c.json({ error: 'Invalid refresh token' }, 401);
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return c.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    return c.json({ error: 'Token refresh failed' }, 500);
  }
});

app.post('/api/auth/logout', async (c) => {
  try {
    const refreshToken = c.req.header('Cookie')?.match(/refreshToken=([^;]+)/)?.[1];

    if (refreshToken) {
      const payload = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
      if (payload) {
        await prisma.user.update({
          where: { id: payload.id },
          data: { refreshToken: null },
        });
      }
    }

    c.header('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed' }, 500);
  }
});

app.get('/api/auth/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
  return c.json({ user: dbUser });
});

// Post Routes
app.get('/api/posts', async (c) => {
  try {
    const publishedOnly = c.req.query('published') !== 'false';
    const posts = await prisma.post.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

app.get('/api/posts/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

app.post('/api/posts', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN') {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const formData = await c.req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true';
    const file = formData.get('image') as File | null;

    if (!title || !content) {
      return c.json({ error: 'Title and content are required' }, 400);
    }

    let imageUrl = null;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const fileBuffer = await buffer(file.stream());
      await minioClient.putObject(MINIO_BUCKET, fileName, fileBuffer, file.size, {
        'Content-Type': file.type,
      });
      imageUrl = `http://localhost:9000/${MINIO_BUCKET}/${fileName}`;
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        published,
        authorId: user.id,
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return c.json(post, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.put('/api/posts/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (user.role !== 'ADMIN' && existingPost.authorId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const formData = await c.req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true';
    const file = formData.get('image') as File | null;

    let imageUrl = existingPost.imageUrl;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const fileBuffer = await buffer(file.stream());
      await minioClient.putObject(MINIO_BUCKET, fileName, fileBuffer, file.size, {
        'Content-Type': file.type,
      });
      imageUrl = `http://localhost:9000/${MINIO_BUCKET}/${fileName}`;
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title || existingPost.title,
        content: content || existingPost.content,
        imageUrl,
        published,
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return c.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return c.json({ error: 'Failed to update post' }, 500);
  }
});

app.delete('/api/posts/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (user.role !== 'ADMIN' && existingPost.authorId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await prisma.post.delete({ where: { id } });
    return c.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return c.json({ error: 'Failed to delete post' }, 500);
  }
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
const port = parseInt(process.env.PORT || '3001', 10);
serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`);
});

export default app;
