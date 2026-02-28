<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { type HTMLAttributes } from 'vue';
import { cn } from '@/components/lib/utils';

interface MotionProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  whileInView?: Record<string, any>;
  viewport?: Record<string, any>;
  class?: HTMLAttributes['class'];
}

const props = defineProps<MotionProps>();
const elementRef = ref<HTMLElement | null>(null);

const animationStyles = computed(() => {
  const styles: Record<string, any> = {};

  if (props.initial) {
    styles.opacity = props.initial.opacity ?? 1;
    if (props.initial.y !== undefined) styles.transform = `translateY(${props.initial.y}px)`;
    if (props.initial.x !== undefined) styles.transform = `translateX(${props.initial.x}px)`;
  } else {
    // Default initial state for scroll animations
    styles.opacity = 0;
    styles.transform = 'translateY(20px)';
  }

  if (props.transition) {
    styles.transition = `all ${props.transition.duration || 0.6}s ease${props.transition.delay ? ` ${props.transition.delay}s` : ''}`;
  } else {
    styles.transition = 'all 0.6s ease';
  }

  return styles;
});

let intersectionObserver: IntersectionObserver | null = null;

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && elementRef.value) {
      // Apply animation styles when in view
      if (props.whileInView) {
        if (props.whileInView.opacity !== undefined) {
          elementRef.value.style.opacity = props.whileInView.opacity.toString();
        }
        if (props.whileInView.y !== undefined) {
          elementRef.value.style.transform = `translateY(${props.whileInView.y}px)`;
        }
        if (props.whileInView.x !== undefined) {
          elementRef.value.style.transform = `translateX(${props.whileInView.x}px)`;
        }
      } else {
        // Default animation when in view
        elementRef.value.style.opacity = '1';
        elementRef.value.style.transform = 'translateY(0)';
      }
    }
  });
};

onMounted(() => {
  if (elementRef.value && props.whileInView) {
    intersectionObserver = new IntersectionObserver(handleIntersection, {
      threshold: props.viewport?.amount || 0.1,
      rootMargin: props.viewport?.margin || '0px',
    });
    intersectionObserver.observe(elementRef.value);
  } else if (elementRef.value && props.animate) {
    // Apply animation immediately if no whileInView
    if (props.animate.opacity !== undefined) {
      elementRef.value.style.opacity = props.animate.opacity.toString();
    }
    if (props.animate.y !== undefined) {
      elementRef.value.style.transform = `translateY(${props.animate.y}px)`;
    }
    if (props.animate.x !== undefined) {
      elementRef.value.style.transform = `translateX(${props.animate.x}px)`;
    }
  }
});

onUnmounted(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
});
</script>

<template>
  <div
    ref="elementRef"
    :class="cn(props.class)"
    :style="animationStyles"
  >
    <slot />
  </div>
</template>
