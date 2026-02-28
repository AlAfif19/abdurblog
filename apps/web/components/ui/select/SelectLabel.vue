<script setup lang="ts">
import { SelectLabel, type SelectLabelProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes['class'] }>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <SelectLabel v-bind="delegatedProps" :class="cn('py-1.5 pl-2 pr-8 font-semibold', props.class)">
    <slot />
  </SelectLabel>
</template>
