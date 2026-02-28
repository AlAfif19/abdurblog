<script setup lang="ts">
import { DialogRoot, useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<DialogRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<DialogRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogRoot v-bind="forwarded" :class="cn('w-full', props.class)">
    <slot />
  </DialogRoot>
</template>
