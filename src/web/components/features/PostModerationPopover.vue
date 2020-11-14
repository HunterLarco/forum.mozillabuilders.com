<template>
  <ModerationPopover :type="type">
    <slot name="label" slot="label"></slot>

    <div :class="$style.Popover">
      <div :class="$style.Button">
        <StickyPostButton :post-id="post.id" />
      </div>

      <div :class="$style.Button">
        <ShadowBanPostButton :post-id="post.id" />
      </div>

      <div :class="$style.Button">
        <ShadowBanAccountButton :account-id="post.authorId" />
      </div>
    </div>
  </ModerationPopover>
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';
import ModerationPopover from '@/src/web/components/features/ModerationPopover';
import ShadowBanAccountButton from '@/src/web/components/features/moderation/ShadowBanAccountButton';
import ShadowBanPostButton from '@/src/web/components/features/moderation/ShadowBanPostButton';
import StickyPostButton from '@/src/web/components/features/moderation/StickyPostButton';

export default {
  components: {
    ElementButton,
    ModerationPopover,
    ShadowBanAccountButton,
    ShadowBanPostButton,
    StickyPostButton,
  },

  props: {
    type: {
      type: String,
      required: true,
    },

    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style module lang="sass">
.Host {
}

.Button {
  margin: 10px;

  & > * {
    width: 100%;
  }
}
</style>
