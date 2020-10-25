<template>
  <div :class="$style.Host">
    <Banner
      >Let's
      <a href="https://www.mozilla.org/en-US/firefox/unfck/" target="blank"
        >#unfck</a
      >
      the internet, together!
      <router-link to="/submit">Tell us how</router-link>.</Banner
    >

    <PageRibbon :class="$style.CenteredContent">
      <a href="https://mozilla.org" :class="$style.Logo">
        <img src="~@/src/web/assets/logos/Mozilla_InvertColors.svg" />
      </a>

      <div :class="$style.Links">
        <div>
          <a href="https://www.mozilla.org/en-US/privacy/" target="blank"
            >Privacy Policy</a
          >
          <a href="https://builders.mozilla.community/#programs" target="blank"
            >Become A Builder</a
          >
          <a href="https://builders.mozilla.community/faqs.html" target="blank"
            >FAQ</a
          >
          <a href="https://builders.mozilla.community/rules.html" target="blank"
            >Rules</a
          >
        </div>
      </div>
    </PageRibbon>
  </div>
</template>

<script>
import Banner from '@/src/web/components/layout/Banner';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

export default {
  components: { Banner, PageRibbon },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';
@import '@/src/web/sass/sizing';

.Host {
  background: #000;
}

.CenteredContent {
  padding: 35px 30px;

  @include sizing-mobile {
    padding: 25px;
  }
}

.Logo {
  & img {
    height: 24px;
  }
}

.Links {
  @include layout-horizontal;

  margin-top: 24px;

  & a {
    @include fonts-nav-link;

    color: #FFF;
    display: block;
    font-weight: 500;
    margin-top: 8px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    @include sizing-tablet {
      margin-top: 5px;
    }
  }

  @include sizing-tablet {
    margin-top: 16px;
  }

  @include sizing-mobile {
    margin-top: 12px;
  }
}
</style>
