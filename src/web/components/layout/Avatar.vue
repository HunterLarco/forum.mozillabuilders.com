<template>
  <div :class="$style.Host" :style="hostStyle_">
    <img :src="src" :class="$style.Image" v-if="src" />
    <ElementIcon
      name="user"
      :class="$style.Placeholder"
      :style="placeholderStyle_"
      v-else
    />
  </div>
</template>

<script>
import ElementIcon from '@/vendor/element-ui/Icon';

export default {
  components: {
    ElementIcon,
  },

  props: {
    src: {
      type: String,
      default: null,
    },

    size: {
      type: Number,
      default: 50,
    },
  },

  computed: {
    hostStyle_() {
      const style = {
        width: `${this.size}px`,
        height: `${this.size}px`,
      };

      return Object.entries(style)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
    },

    placeholderStyle_() {
      const style = {
        transform: `scale(${this.size / 50})`,
        'transform-origin': '0% 0%',
      };

      return Object.entries(style)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/layout';

.Host {
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}

.Placeholder {
  @include layout-center;

  font-size: 20px;
  height: 50px;
  width: 50px;
}

.Image {
  @include layout-max-dimensions;
}
</style>
