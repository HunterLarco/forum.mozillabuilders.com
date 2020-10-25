<template>
  <VerticalRibbon max-width="1200px" centered>
    <slot></slot>
  </VerticalRibbon>
</template>

<script>
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

export default {
  components: { VerticalRibbon },
};
</script>
