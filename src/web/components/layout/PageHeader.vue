<template>
  <HorizontalLayout
    :class="$style.Host"
    :left-class="$style.Logo"
    :middle-class="$style.Nav"
    :right-class="$style.Buttons"
    vertical-center
  >
    <template v-slot:left>
      <img src="~@/src/web/assets/logos/Mozilla.png" />
    </template>

    <slot name="nav"></slot>

    <template v-slot:right>
      <slot name="buttons"></slot>
    </template>
  </HorizontalLayout>
</template>

<script>
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';

export default {
  components: { HorizontalLayout },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';
@import '@/src/web/sass/sizing';

.Host {
  padding: 30px;
}

.Logo {
  & > img {
    height: 24px;
    margin-right: 24px;

    @include sizing-tablet {
      margin-right: 16px;
    }

    @include sizing-mobile {
      margin-right: 8px;
    }
  }
}

.Nav {
  & > * {
    display: inline-block;
    vertical-align: middle;
  }

  & > a {
    @include fonts-nav-link;

    padding: 0 24px;
    color: inherit;
    cursor: pointer;
    text-decoration: none;

    @include sizing-tablet {
      padding: 0 16px;
    }

    @include sizing-mobile {
      padding: 0 8px;
    }
  }
}

.Buttons {
  & > * {
    display: inline-block;
    vertical-align: middle;
  }

  & > a {
    @include fonts-nav-button;

    border-radius: 4px;
    border: 2px solid #0060DF;
    color: #0060DF;
    cursor: pointer;
    padding: 4px 24px;
    text-decoration: none;

    &:hover {
      background: lighten(#0060DF, 50%);
    }
  }
}
</style>
