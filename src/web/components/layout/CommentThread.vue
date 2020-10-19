<script>
import friendlyTime from 'friendly-time';

import Comment from '@/src/web/components/layout/Comment';
import ReplyForm from '@/src/web/components/layout/ReplyForm';

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },

    comments: {
      type: Array,
      default: () => [],
    },
  },

  render(createElement) {
    return createElement('div', { class: this.$style.Host }, [
      createElement(
        'div',
        { class: this.$style.Label },
        `${this.post.stats.comments} Comments`
      ),
      createElement(
        ReplyForm,
        { class: this.$style.ReplyForm, props: { post: this.post } },
        []
      ),
      this.renderComments_(createElement, this.comments),
    ]);
  },

  methods: {
    renderComments_(createElement, comments) {
      return createElement(
        'div',
        {},
        comments.map((comment) => {
          return createElement('div', { class: this.$style.Comment }, [
            createElement(Comment, {
              props: {
                post: this.post,
                comment,
              },
            }),
            comment.children.length
              ? createElement('div', { class: this.$style.SubComments }, [
                  this.renderComments_(createElement, comment.children),
                ])
              : null,
          ]);
        })
      );
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {}

.Label {
  @include fonts-body;

  margin-bottom: 20px;
}

.ReplyForm {
  margin-bottom: 20px;
}

.Comment {
  & ~ .Comment {
    margin-top: 20px;
  }
}

.SubComments {
  margin-left: 40px;
  margin-top: 20px;
}
</style>
