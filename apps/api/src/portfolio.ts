import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = new Hono();

// Schemas
const heroSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  ctaText: z.string().min(1),
  ctaLink: z.string().min(1),
  imageUrl: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  githubLink: z.string().url(),
  liveLink: z.string().url().optional(),
  tags: z.array(z.string()),
});

const skillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  category: z.string().min(1),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
  address: z.string().optional(),
});

const commentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

// Auth middleware
const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = auth.split(' ')[1];

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role?: string; email?: string };

    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return c.json({ error: 'Forbidden' }, 403);
    }

    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// Hero Routes
app.get('/api/portfolio/hero', async (c) => {
  try {
    const hero = await prisma.portfolioHero.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(hero);
  } catch (error) {
    console.error('Get hero error:', error);
    return c.json({ error: 'Failed to fetch hero' }, 500);
  }
});

app.put('/api/portfolio/hero', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const valid = heroSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    // Deactivate existing hero
    await prisma.portfolioHero.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const hero = await prisma.portfolioHero.create({
      data: {
        ...valid.data,
        isActive: true,
      },
    });

    return c.json(hero);
  } catch (error) {
    console.error('Update hero error:', error);
    return c.json({ error: 'Failed to update hero' }, 500);
  }
});

// Project Routes
app.get('/api/portfolio/projects', async (c) => {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return c.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

app.post('/api/portfolio/projects', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const valid = projectSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const maxOrder = await prisma.portfolioProject.aggregate({
      _max: { order: true },
    });

    const project = await prisma.portfolioProject.create({
      data: {
        ...valid.data,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return c.json(project, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

app.put('/api/portfolio/projects/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const valid = projectSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: valid.data,
    });

    return c.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

app.delete('/api/portfolio/projects/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await prisma.portfolioProject.delete({ where: { id } });
    return c.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// Skill Routes
app.get('/api/portfolio/skills', async (c) => {
  try {
    const skills = await prisma.portfolioSkill.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return c.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    return c.json({ error: 'Failed to fetch skills' }, 500);
  }
});

app.post('/api/portfolio/skills', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const valid = skillSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const maxOrder = await prisma.portfolioSkill.aggregate({
      _max: { order: true },
    });

    const skill = await prisma.portfolioSkill.create({
      data: {
        ...valid.data,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return c.json(skill, 201);
  } catch (error) {
    console.error('Create skill error:', error);
    return c.json({ error: 'Failed to create skill' }, 500);
  }
});

app.put('/api/portfolio/skills/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const valid = skillSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const skill = await prisma.portfolioSkill.update({
      where: { id },
      data: valid.data,
    });

    return c.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    return c.json({ error: 'Failed to update skill' }, 500);
  }
});

app.delete('/api/portfolio/skills/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await prisma.portfolioSkill.delete({ where: { id } });
    return c.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    return c.json({ error: 'Failed to delete skill' }, 500);
  }
});

// Education Routes
app.get('/api/portfolio/education', async (c) => {
  try {
    const education = await prisma.portfolioEducation.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return c.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    return c.json({ error: 'Failed to fetch education' }, 500);
  }
});

app.post('/api/portfolio/education', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const valid = educationSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const maxOrder = await prisma.portfolioEducation.aggregate({
      _max: { order: true },
    });

    const education = await prisma.portfolioEducation.create({
      data: {
        ...valid.data,
        startDate: new Date(valid.data.startDate),
        endDate: valid.data.endDate ? new Date(valid.data.endDate) : null,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return c.json(education, 201);
  } catch (error) {
    console.error('Create education error:', error);
    return c.json({ error: 'Failed to create education' }, 500);
  }
});

app.put('/api/portfolio/education/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const valid = educationSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const education = await prisma.portfolioEducation.update({
      where: { id },
      data: {
        ...valid.data,
        startDate: new Date(valid.data.startDate),
        endDate: valid.data.endDate ? new Date(valid.data.endDate) : null,
      },
    });

    return c.json(education);
  } catch (error) {
    console.error('Update education error:', error);
    return c.json({ error: 'Failed to update education' }, 500);
  }
});

app.delete('/api/portfolio/education/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await prisma.portfolioEducation.delete({ where: { id } });
    return c.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    return c.json({ error: 'Failed to delete education' }, 500);
  }
});

// Contact Routes
app.get('/api/portfolio/contact', async (c) => {
  try {
    const contact = await prisma.portfolioContact.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    return c.json({ error: 'Failed to fetch contact' }, 500);
  }
});

app.put('/api/portfolio/contact', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const valid = contactSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    // Deactivate existing contact
    await prisma.portfolioContact.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const contact = await prisma.portfolioContact.create({
      data: {
        ...valid.data,
        isActive: true,
      },
    });

    return c.json(contact);
  } catch (error) {
    console.error('Update contact error:', error);
    return c.json({ error: 'Failed to update contact' }, 500);
  }
});

// Comment Routes
app.get('/api/portfolio/comments', async (c) => {
  try {
    const includeUnapproved = c.req.query('includeUnapproved') === 'true';
    const comments = await prisma.portfolioComment.findMany({
      where: includeUnapproved ? undefined : { approved: true },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

app.post('/api/portfolio/comments', async (c) => {
  try {
    const body = await c.req.json();
    const valid = commentSchema.safeParse(body);
    if (!valid.success) {
      return c.json({ error: 'Invalid input', details: valid.error.errors }, 400);
    }

    const comment = await prisma.portfolioComment.create({
      data: valid.data,
    });

    return c.json(comment, 201);
  } catch (error) {
    console.error('Create comment error:', error);
    return c.json({ error: 'Failed to create comment' }, 500);
  }
});

app.put('/api/portfolio/comments/:id/approve', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const comment = await prisma.portfolioComment.update({
      where: { id },
      data: { approved: true },
    });
    return c.json(comment);
  } catch (error) {
    console.error('Approve comment error:', error);
    return c.json({ error: 'Failed to approve comment' }, 500);
  }
});

app.delete('/api/portfolio/comments/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await prisma.portfolioComment.delete({ where: { id } });
    return c.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return c.json({ error: 'Failed to delete comment' }, 500);
  }
});

export default app;
