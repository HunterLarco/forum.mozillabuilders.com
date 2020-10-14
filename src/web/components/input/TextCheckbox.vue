<template>
  <div :class="[$style.Host, ...hostModifiers_]">
    <slot>{{ text }}</slot>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: null,
    },
  },

  computed: {
    hostModifiers_() {
      return this.selected ? [this.$style.Host_Selected] : [];
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  @include fonts-body;

  border-radius: 100px;
  border: 1px solid #000;
  cursor: pointer;
  display: inline-block;
  padding: 5px 14px;
  user-select: none;
}

.Host_Selected {
  background: #000;
  color: #FFF;
}
</style>
