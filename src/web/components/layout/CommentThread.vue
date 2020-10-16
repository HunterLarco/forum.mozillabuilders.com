<script>
import friendlyTime from 'friendly-time';

import Comment from '@/src/web/components/layout/Comment';

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
    return this.renderComments_(createElement, this.comments);
  },

  methods: {
    renderComments_(createElement, comments) {
      return createElement(
        'div',
        { class: this.$style.Host },
        comments.map((comment) => {
          return createElement('div', { class: this.$style.Comment }, [
            createElement(Comment, {
              props: {
                post: this.post,
                comment,
              },
            }),
            createElement('div', { class: this.$style.SubComments }, [
              this.renderComments_(createElement, comment.children),
            ]),
          ]);
        })
      );
    },
  },
};

function renderComments(createElement, comments) {}
</script>

<style module lang="sass">
.Host {}

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
