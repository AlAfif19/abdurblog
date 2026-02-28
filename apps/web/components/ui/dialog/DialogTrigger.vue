<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<DialogTriggerProps & { class?: HTMLAttributes['class'] }>();
</script>

<template>
  <DialogTrigger :class="cn(props.class)">
    <slot />
  </DialogTrigger>
</template>
