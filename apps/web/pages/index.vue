<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold">Welcome to abdurblog</h1>
      <p class="mt-2 text-muted-foreground">A personal blog and portfolio</p>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <div class="text-muted-foreground">Loading posts...</div>
    </div>

    <div v-else-if="error" class="rounded-md bg-destructive/10 p-4 text-destructive">
      Failed to load posts. Please try again later.
    </div>

    <div v-else-if="posts.length === 0" class="py-12 text-center text-muted-foreground">
      No posts yet. Be the first to publish something!
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="post in posts"
        :key="post.id"
        class="cursor-pointer transition-shadow hover:shadow-lg"
        @click="navigateTo(`/posts/${post.slug}`)"
      >
        <div v-if="post.imageUrl" class="relative aspect-video overflow-hidden">
          <img
            :src="post.imageUrl"
            :alt="post.title"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <CardHeader>
          <CardTitle class="line-clamp-1">{{ post.title }}</CardTitle>
          <p class="text-sm text-muted-foreground">
            By {{ post.author?.name || 'Unknown' }}
            <span class="mx-2">•</span>
            {{ formatDate(post.createdAt) }}
          </p>
        </CardHeader>
        <CardContent>
          <p class="line-clamp-3 text-muted-foreground">
            {{ post.content }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  } | null;
}

const config = useRuntimeConfig();

const { data: posts, pending, error } = await useFetch<Post[]>('/api/posts', {
  baseURL: config.public.apiBase,
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

useHead({
  title: 'Home - abdurblog',
});
</script>
