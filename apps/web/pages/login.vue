<template>
  <div class="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {{ error }}
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>
        <p class="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?
          <NuxtLink to="/register" class="text-primary underline-offset-4 hover:underline">
            Register
          </NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    await navigateTo('/');
  } else {
    error.value = result.error || 'Login failed';
  }

  loading.value = false;
};

// Redirect if already logged in
watchEffect(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/');
  }
});
</script>
