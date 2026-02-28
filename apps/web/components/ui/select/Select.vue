<script setup lang="ts">
import { SelectRoot, useForwardPropsEmits, type SelectRootEmits, type SelectRootProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<SelectRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<SelectRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SelectRoot v-bind="forwarded" :class="cn('w-full', props.class)">
    <slot />
  </SelectRoot>
</template>
