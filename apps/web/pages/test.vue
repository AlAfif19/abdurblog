<template>
  <div class="min-h-screen bg-background p-8">
    <h1 class="text-4xl font-bold mb-8">Portfolio Debug Page</h1>

    <div class="space-y-8">
      <!-- API Test -->
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <Button @click="testApi" :disabled="testing">
              {{ testing ? 'Testing...' : 'Test API Connection' }}
            </Button>
            <div v-if="apiResult" class="p-4 bg-muted rounded">
              <pre>{{ apiResult }}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Component Test -->
      <Card>
        <CardHeader>
          <CardTitle>Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <Button>Button Works</Button>
            <Card>
              <CardHeader>
                <CardTitle>Card Works</CardTitle>
                <CardDescription>Card description works</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content works</p>
              </CardContent>
            </Card>
            <Badge>Badge Works</Badge>
            <Progress :value="50" />
          </div>
        </CardContent>
      </Card>

      <!-- Motion Test -->
      <Card>
        <CardHeader>
          <CardTitle>Motion Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <MotionDiv
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            class="p-4 bg-primary/10 rounded"
          >
            Motion component works!
          </MotionDiv>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MotionDiv } from '@/components/motion';

const testing = ref(false);
const apiResult = ref<any>(null);

const testApi = async () => {
  testing.value = true;
  try {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.apiBase}/api/health`);
    const data = await response.json();
    apiResult.value = {
      status: '✅ API is working!',
      data,
    };
  } catch (error) {
    apiResult.value = {
      status: '❌ API connection failed',
      error: error.message,
    };
  } finally {
    testing.value = false;
  }
};
</script>
