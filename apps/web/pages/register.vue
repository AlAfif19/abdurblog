<template>
  <div class="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input
              id="name"
              v-model="name"
              type="text"
              placeholder="Your Name"
              required
            />
          </div>
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
              minlength="6"
            />
          </div>
          <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {{ error }}
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </Button>
        </form>
        <p class="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?
          <NuxtLink to="/login" class="text-primary underline-offset-4 hover:underline">
            Sign In
          </NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  error.value = '';
  loading.value = true;

  const result = await authStore.register(email.value, password.value, name.value);

  if (result.success) {
    await navigateTo('/login');
  } else {
    error.value = result.error || 'Registration failed';
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
