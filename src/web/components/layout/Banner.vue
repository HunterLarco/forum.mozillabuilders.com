<template>
  <div :class="$style.Host">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  @include fonts-banner;

  background: #E91E63;
  color: #FFF;
  padding: 10px 20px;
  text-align: center;

  & > a {
    color: #FFF;
  }
}
</style>
