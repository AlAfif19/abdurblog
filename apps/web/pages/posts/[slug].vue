<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="flex justify-center py-12">
      <div class="text-muted-foreground">Loading post...</div>
    </div>

    <div v-else-if="error || !post" class="rounded-md bg-destructive/10 p-4 text-destructive">
      Post not found.
    </div>

    <article v-else class="mx-auto max-w-3xl">
      <!-- Back Button -->
      <NuxtLink
        to="/"
        class="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to all posts
      </NuxtLink>

      <!-- Cover Image -->
      <div v-if="post.imageUrl" class="mb-8 overflow-hidden rounded-lg">
        <img
          :src="post.imageUrl"
          :alt="post.title"
          class="w-full object-cover"
          loading="lazy"
        />
      </div>

      <!-- Title and Metadata -->
      <div class="mb-8">
        <h1 class="mb-4 text-4xl font-bold">{{ post.title }}</h1>
        <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ post.author?.name || 'Unknown' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="prose prose-slate max-w-none">
        <div class="whitespace-pre-wrap">{{ post.content }}</div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

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

const { data: post, pending, error } = await useFetch<Post>(`/api/posts/${route.params.slug}`, {
  baseURL: config.public.apiBase,
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Set page title
watchEffect(() => {
  if (post.value) {
    useHead({
      title: `${post.value.title} - abdurblog`,
    });
  }
});
</script>
