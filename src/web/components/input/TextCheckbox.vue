<template>
  <div :class="[$style.Host, ...hostModifiers_]" @click="onClick_">
    <slot>{{ text }}</slot>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    hostModifiers_() {
      const modifiers = [];

      if (this.selected) {
        modifiers.push(this.$style.Host_Selected);
      }

      if (this.disabled) {
        modifiers.push(this.$style.Host_Disabled);
      }

      return modifiers;
    },
  },

  methods: {
    onClick_() {
      if (!this.disabled) {
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

  border-radius: 100px;
  border: 1px solid #000;
  cursor: pointer;
  display: inline-block;
  padding: 5px 14px;
  user-select: none;
}

.Host_Selected {
  background: #000;
  color: #FFF;
}

.Host_Disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
