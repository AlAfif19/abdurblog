<script setup lang="ts">
import { SelectGroup, type SelectGroupProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<SelectGroupProps & { class?: HTMLAttributes['class'] }>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <SelectGroup v-bind="delegatedProps" :class="cn(props.class)">
    <slot />
  </SelectGroup>
</template>
