<script setup lang="ts">
import { TabsIndicator, type TabsIndicatorProps } from 'radix-vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<TabsIndicatorProps & { class?: HTMLAttributes['class'] }>();
</script>

<template>
  <TabsIndicator :class="cn('absolute bottom-0 left-0 h-[2px] w-[--radix-tabs-indicator-size] transition-[width,transform] duration-300', props.class)">
    <slot />
  </TabsIndicator>
</template>
