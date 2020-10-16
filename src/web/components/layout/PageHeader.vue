<template>
  <HorizontalLayout
    :class="$style.Host"
    :left-class="$style.Logo"
    :middle-class="$style.Nav"
    :right-class="$style.Buttons"
    vertical-center
  >
    <template v-slot:left>
      <router-link to="/">
        <img src="~@/src/web/assets/logos/Mozilla.png" />
      </router-link>
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
  min-height: 93px;
  padding: 0 30px;

  @include sizing-mobile {
    min-height: 73px;
    padding: 0 20px;
  }
}

.Logo {
  & img {
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

    color: inherit;
    cursor: pointer;
    line-height: 89px;
    padding: 2px 24px;
    text-decoration: none;

    &[selected] {
      border-bottom: 2px solid #000;
      padding-bottom: 0;
    }

    @include sizing-tablet {
      padding: 2px 16px;
    }

    @include sizing-mobile {
      line-height: 69px;
      padding: 2px 8px;
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

    @include sizing-tablet {
      padding: 4px 16px;
    }

    @include sizing-mobile {
      padding: 4px 8px;
    }
  }
}
</style>
