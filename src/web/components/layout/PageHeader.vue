<template>
  <div :class="$style.Host">
    <PageRibbon>
      <HorizontalLayout
        :class="$style.NavBar"
        :left-class="$style.Logo"
        :middle-class="$style.Nav"
        vertical-center
      >
        <template v-slot:left>
          <router-link to="/">
            <img :src="logo_" />
          </router-link>
        </template>

        <router-link to="/hot" :selected="$route.path.startsWith('/hot')"
          >Hot</router-link
        >
        <router-link to="/new" :selected="$route.path.startsWith('/new')"
          >New</router-link
        >

        <template v-slot:right>
          <div :class="$style.Buttons">
            <router-link to="/submit">
              <span v-if="$sizing.gt('mobile')">Post a new topic</span>
              <span v-else>Post</span>
            </router-link>
          </div>

          <div :class="$style.Icons">
            <NotificationBadge v-if="loggedIn_" />
            <AccountBadge />
          </div>
        </template>
      </HorizontalLayout>
    </PageRibbon>
  </div>
</template>

<script>
import AccountBadge from '@/src/web/components/features/AccountBadge';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import NotificationBadge from '@/src/web/components/features/NotificationBadge';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import MozillaBuildersLogo from '@/src/web/assets/logos/MozillaBuilders.png';
import MozillaLogo from '@/src/web/assets/logos/Mozilla.png';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: { AccountBadge, HorizontalLayout, NotificationBadge, PageRibbon },

  computed: {
    logo_() {
      return this.$sizing(MozillaBuildersLogo, { mobile: MozillaLogo });
    },

    loggedIn_() {
      return !!CurrentUserStore.state.authToken;
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

.Icons {
  color: #FFF;

  & > * {
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
  }

  & > a {
    color: inherit;
    text-decoration: none;
  }
}
</style>
