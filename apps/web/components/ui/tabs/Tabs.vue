<script setup lang="ts">
import { TabsRoot, type TabsRootEmits, type TabsRootProps, useForwardPropsEmits } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/components/lib/utils';

const props = defineProps<TabsRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<TabsRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TabsRoot v-bind="forwarded" :class="cn('w-full', props.class)">
    <slot />
  </TabsRoot>
</template>
