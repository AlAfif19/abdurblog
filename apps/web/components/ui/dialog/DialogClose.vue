<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<DialogCloseProps & { class?: HTMLAttributes['class'] }>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <DialogClose v-bind="delegatedProps" :class="cn(props.class)">
    <slot />
  </DialogClose>
</template>
