<template>
  <div :class="$style.Host">
    <PageRibbon>
      <HorizontalLayout
        :class="$style.NavBar"
        :left-class="$style.Logo"
        :middle-class="$style.Nav"
        :right-class="$style.Buttons"
        vertical-center
      >
        <template v-slot:left>
          <router-link to="/">
            <img :src="logo_" />
          </router-link>
        </template>

        <slot name="nav"></slot>

        <template v-slot:right>
          <slot name="buttons"></slot>
        </template>
      </HorizontalLayout>
    </PageRibbon>
  </div>
</template>

<script>
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import MozillaBuildersLogo from '@/src/web/assets/logos/MozillaBuilders.png';
import MozillaLogo from '@/src/web/assets/logos/Mozilla.png';

export default {
  components: { HorizontalLayout, PageRibbon },

  computed: {
    logo_() {
      return this.$sizing(MozillaBuildersLogo, { mobile: MozillaLogo });
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';
@import '@/src/web/sass/sizing';

.Host {
  background: #000;
}

.NavBar {
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

    color: #FFF;
    cursor: pointer;
    line-height: 89px;
    padding: 2px 24px;
    text-decoration: none;

    &[selected] {
      border-bottom: 2px solid #FFF;
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

    background: #FFF;
    border-radius: 4px;
    color: #000;
    cursor: pointer;
    padding: 6px 24px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
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
