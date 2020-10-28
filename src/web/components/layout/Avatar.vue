<template>
  <div :class="$style.Host">
    <ElementIcon name="user" :class="$style.Placeholder" />
  </div>
</template>

<script>
import ElementIcon from '@/vendor/element-ui/Icon';

export default {
  components: {
    ElementIcon,
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/layout';

.Host {
  border-radius: 50%;
  cursor: pointer;
  height: 50px;
  overflow: hidden;
  width: 50px;
}

.Placeholder {
  @include layout-center;
  @include layout-max-dimensions;

  color: #FFF;
  font-size: 20px;
}
</style>
