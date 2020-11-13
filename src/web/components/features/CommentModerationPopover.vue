<template>
  <ModerationPopover :type="type">
    <slot name="label" slot="label"></slot>

    <div :class="$style.Popover">
      <div :class="$style.Button">
        <ShadowBanCommentButton :comment-id="comment.id" />
      </div>

      <div :class="$style.Button">
        <ShadowBanAccountButton :account-id="comment.authorId" />
      </div>
    </div>
  </ModerationPopover>
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';
import ModerationPopover from '@/src/web/components/features/ModerationPopover';
import ShadowBanAccountButton from '@/src/web/components/features/moderation/ShadowBanAccountButton';
import ShadowBanCommentButton from '@/src/web/components/features/moderation/ShadowBanCommentButton';

export default {
  components: {
    ElementButton,
    ModerationPopover,
    ShadowBanAccountButton,
    ShadowBanCommentButton,
  },

  props: {
    type: {
      type: String,
      required: true,
    },

    comment: {
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
