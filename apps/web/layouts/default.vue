<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-card">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <NuxtLink to="/" class="text-xl font-bold">
          abdurblog
        </NuxtLink>
        <nav class="flex items-center gap-4">
          <NuxtLink to="/" class="text-sm font-medium text-muted-foreground hover:text-foreground">
            Home
          </NuxtLink>
          <div v-if="authStore.isAuthenticated">
            <NuxtLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Admin
            </NuxtLink>
            <Button variant="ghost" size="sm" @click="authStore.logout()">
              Logout
            </Button>
          </div>
          <div v-else class="flex gap-2">
            <NuxtLink to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </NuxtLink>
            <NuxtLink to="/register">
              <Button size="sm">
                Register
              </Button>
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    <slot />
    <footer class="border-t bg-card mt-auto">
      <div class="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {{ new Date().getFullYear() }} abdurblog. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

// Initialize auth on app load
onMounted(() => {
  authStore.initAuth();
});
</script>
