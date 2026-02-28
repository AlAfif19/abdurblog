<script setup lang="ts">
import { SelectValue, type SelectValueProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<SelectValueProps & { class?: HTMLAttributes['class'] }>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <SelectValue v-bind="delegatedProps" :class="cn('text-sm', props.class)">
    <slot />
  </SelectValue>
</template>
