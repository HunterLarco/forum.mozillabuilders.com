<template>
  <div :class="$style.Host">
    <ContentLoader
      :class="$style.Svg"
      :speed="2"
      :width="$sizing(1600, { tablet: 1000, mobile: 700 })"
      :height="80"
      viewBox="$sizing('0 0 1600 80', { tablet: '0 0 1000 80', mobile: '0 0 700 80' })"
    >
      <template v-if="$sizing.gt('tablet')">
        <rect x="35" y="20" rx="10" ry="30" width="40" height="40" />
        <rect x="110" y="10" rx="10" ry="30" width="1480" height="20" />
        <rect x="110" y="48" rx="10" ry="30" width="440" height="20" />
        <rect x="570" y="48" rx="10" ry="30" width="290" height="20" />
      </template>

      <template v-if="$sizing.lte('tablet') && $sizing.gt('mobile')">
        <rect x="35" y="20" rx="10" ry="30" width="40" height="40" />
        <rect x="110" y="10" rx="10" ry="30" width="855" height="20" />
        <rect x="110" y="48" rx="10" ry="30" width="380" height="20" />
        <rect x="510" y="48" rx="10" ry="30" width="200" height="20" />
      </template>

      <template v-if="$sizing.lte('mobile')">
        <rect x="35" y="20" rx="10" ry="30" width="40" height="40" />
        <rect x="110" y="10" rx="10" ry="30" width="555" height="20" />
        <rect x="110" y="48" rx="10" ry="30" width="310" height="20" />
        <rect x="440" y="48" rx="10" ry="30" width="160" height="20" />
      </template>
    </ContentLoader>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';

export default {
  components: { ContentLoader },
};
</script>

<style module lang="sass">
.Host {
  padding: 20px 0;

  & ~ .Host {
    border-top: 1px solid #F0F0F0;
  }
}

.Svg {
  height: 38px;
}
</style>
