<template>
  <div :class="$style.Host">
    <template v-if="loggedIn_">
      <ElementPopover placement="bottom" trigger="click" v-model="open_">
        <ElementIcon
          :class="$style.UserIcon"
          :name="open_ ? 'user-solid' : 'user'"
          slot="reference"
        />

        <div :class="$style.Popover">
          <div :class="$style.Title">Account</div>

          <router-link to="/account/settings" :class="$style.Button"
            >Settings</router-link
          >
          <router-link to="/logout" :class="$style.Button">Log Out</router-link>
        </div>
      </ElementPopover>
    </template>

    <template v-else>
      <router-link to="/signup">
        <ElementIcon :class="$style.UserIcon" name="user" />
      </router-link>
    </template>
  </div>
</template>

<script>
import ElementIcon from '@/vendor/element-ui/Icon';
import ElementPopover from '@/vendor/element-ui/Popover';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: { ElementIcon, ElementPopover },

  data() {
    return {
      open_: false,
    };
  },

  computed: {
    loggedIn_() {
      return !!CurrentUserStore.state.authToken;
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  display: inline-block;
}

.UserIcon {
  color: #FFF;
  cursor: pointer;
  font-size: 24px;
  outline: none;
}

.Popover {
  min-width: 350px;
}

.Title {
  @include fonts-post-title;

  margin: 10px;
}

.Button {
  @include fonts-nav-button;

  color: #848484;
  cursor: pointer;
  display: block;
  padding: 10px;
  text-align: center;
  text-decoration: underline;

  &:hover {
    color: #000;
  }
}
</style>
