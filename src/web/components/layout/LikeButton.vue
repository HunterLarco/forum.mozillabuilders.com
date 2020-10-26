<template>
  <div :class="liked ? $style.Host_Liked : $style.Host">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :class="$style.Chevron"
    >
      <path d="M0 15.878 l12-11.878 12 11.878-4 4.122-8-8-8 8-4-4.122z" />
    </svg>
    <label>{{ count }}</label>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },

    liked: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  @include fonts-collapsed-post-likes;

  color: #BBB;
  cursor: pointer;
  min-width: 14px;
  padding: 0 4px;
  text-align: center;
  user-select: none;

  & > * {
    cursor: inherit;
  }
}

.Host_Liked {
  @extend .Host;

  color: #E91E63;

  .Chevron path {
    fill: #E91E63;
  }
}

.Chevron {
  display: block;
  margin: 0 auto;
  width: 14px;

  path {
    fill: #BBB;
  }
}
</style>
