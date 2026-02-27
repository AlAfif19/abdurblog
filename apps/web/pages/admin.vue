<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <p class="mt-2 text-muted-foreground">Create and manage your blog posts</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Create Post Form -->
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input
                id="title"
                v-model="title"
                type="text"
                placeholder="Enter post title"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="image">Cover Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                @change="handleFileChange"
              />
              <p v-if="previewUrl" class="mt-2">
                <img
                  :src="previewUrl"
                  alt="Preview"
                  class="max-h-48 w-full rounded-md object-cover"
                />
              </p>
            </div>

            <div class="space-y-2">
              <Label for="content">Content</Label>
              <Textarea
                id="content"
                v-model="content"
                placeholder="Write your post content here..."
                class="min-h-[200px]"
                required
              />
            </div>

            <div class="flex items-center space-x-2">
              <input
                id="published"
                v-model="published"
                type="checkbox"
                class="h-4 w-4 rounded border-input"
              />
              <Label for="published" class="cursor-pointer">
                Publish immediately
              </Label>
            </div>

            <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {{ error }}
            </div>

            <Button type="submit" class="w-full" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Post' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Recent Posts List -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="pendingPosts" class="flex justify-center py-8">
            <div class="text-muted-foreground">Loading posts...</div>
          </div>
          <div v-else-if="posts.length === 0" class="py-8 text-center text-muted-foreground">
            No posts yet. Create your first post!
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="post in posts"
              :key="post.id"
              class="flex items-start justify-between gap-3 rounded-md border p-3"
            >
              <div class="flex-1">
                <h3 class="font-medium line-clamp-1">{{ post.title }}</h3>
                <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span :class="post.published ? 'text-green-600' : 'text-amber-600'">
                    {{ post.published ? 'Published' : 'Draft' }}
                  </span>
                  <span>•</span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
              </div>
              <NuxtLink :to="`/posts/${post.slug}`">
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Button>
              </NuxtLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const config = useRuntimeConfig();

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

// Check if user is admin
const isAdmin = computed(() => authStore.isAdmin);

if (!isAdmin.value) {
  await navigateTo('/');
}

const title = ref('');
const content = ref('');
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const published = ref(false);
const loading = ref(false);
const error = ref('');

// Fetch all posts (including drafts)
const { data: posts, pending: pendingPosts } = await useFetch<Post[]>('/api/posts?published=false', {
  baseURL: config.public.apiBase,
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (selectedFile) {
    file.value = selectedFile;
    previewUrl.value = URL.createObjectURL(selectedFile);
  }
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', content.value);
  formData.append('published', String(published.value));
  if (file.value) {
    formData.append('image', file.value);
  }

  const result = await authStore.createPost(formData);

  if (result.success) {
    // Reset form
    title.value = '';
    content.value = '';
    file.value = null;
    previewUrl.value = null;
    published.value = false;

    // Refresh posts list
    await refreshNuxtData();
  } else {
    error.value = result.error || 'Failed to create post';
  }

  loading.value = false;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

useHead({
  title: 'Admin - abdurblog',
});
</script>
