<script setup lang="ts">
import { SeparatorRoot, type SeparatorRootProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<SeparatorRootProps & { class?: HTMLAttributes['class'] }>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SeparatorRoot
    v-bind="forwardedProps"
    :class="cn(
      'shrink-0 bg-border',
      props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      props.class,
    )"
  />
</template>
