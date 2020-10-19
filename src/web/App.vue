<template>
  <div :class="$style.Host">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';

* {
  font-size: inherit;
  margin: 0;
  padding: 0;
}

html body {
  @include fonts-clear;
}

body {
  @include layout-fill;
}

[hidden] {
  display: none !important;
}
</style>

<style module lang="sass">
@import '@/src/web/sass/layout';

.Host {
  @include layout-max-dimensions;
}
</style>
