<template>
  <div :class="$style.Host" tabindex="0">
    <slot>{{ text }}</slot>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Submit',
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  @include fonts-body;

  border-radius: 4px;
  border: 2px solid #0060DF;
  box-sizing: border-box;
  color: #0060DF;
  cursor: pointer;
  display: inline-block;
  font-weight: 700;
  outline: none;
  padding: 4px 24px;
  text-decoration: none;
  user-select: none;

  &:hover,
  &:focus {
    background: lighten(#0060DF, 50%);
  }

  &:active {
    background: lighten(#0060DF, 47%);
  }
}
</style>
