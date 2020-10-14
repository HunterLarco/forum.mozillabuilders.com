<template>
  <div :class="[$style.Host, ...hostModifiers_]" tabindex="0" @click="onClick_">
    <slot>{{ text }}</slot>
    <ElementIcon :class="$style.LoadingIcon" name="loading" v-if="loading" />
  </div>
</template>

<script>
import ElementIcon from '@/vendor/element-ui/Icon';

export default {
  components: { ElementIcon },

  props: {
    text: {
      type: String,
      default: 'Submit',
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    hostModifiers_() {
      const modifiers = [];

      if (this.loading || this.disabled) {
        modifiers.push(this.$style.Host_Disabled);
      }

      return modifiers;
    },
  },

  methods: {
    onClick_() {
      if (!this.disabled && !this.loading) {
        this.$emit('click');
      }
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  @include fonts-body;

  border-radius: 4px;
  border: 2px solid #0060DF;
  box-sizing: border-box;
  color: #0060DF;
  cursor: pointer;
  display: inline-block;
  font-weight: 700;
  outline: none;
  padding: 4px 24px;
  text-decoration: none;
  user-select: none;

  &:hover,
  &:focus {
    background: lighten(#0060DF, 50%);
  }

  &:active {
    background: lighten(#0060DF, 47%);
  }
}

.Host_Disabled {
  background: none !important;
  cursor: not-allowed;
  opacity: 0.5;
}

.LoadingIcon {
  margin-left: 5px;
}
</style>
