<template>
  <div :class="$style.Host">
    <router-link to="/account/settings">
      <ElementIcon :class="$style.UserIcon" name="user" />
    </router-link>
  </div>
</template>

<script>
import ElementIcon from '@/vendor/element-ui/Icon';

export default {
  components: { ElementIcon },
};
</script>

<style module lang="sass">
.Host {
}

.UserIcon {
  color: #FFF;
  cursor: pointer;
  font-size: 24px;
}
</style>
