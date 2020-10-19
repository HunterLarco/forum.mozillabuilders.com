<script>
import friendlyTime from 'friendly-time';

import Comment from '@/src/web/components/layout/Comment';
import ReplyForm from '@/src/web/components/layout/ReplyForm';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

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
      CurrentUserStore.state.authToken
        ? createElement(
            ReplyForm,
            { class: this.$style.ReplyForm, props: { post: this.post } },
            []
          )
        : createElement(
            'router-link',
            {
              class: this.$style.LoginToComment,
              props: {
                to: {
                  path: '/signup',
                  query: {
                    info: 'You must be logged in to comment.',
                  },
                },
              },
            },
            'Log in to add a comment'
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
@import '@/src/web/sass/sizing';

.Host {}

.Label {
  @include fonts-body;

  margin-bottom: 20px;
}

.ReplyForm {
  margin-bottom: 20px;
}

.LoginToComment {
  @include fonts-caption;

  color: inherit;
  display: block;
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

  @include sizing-mobile {
    margin-left: 20px;
  }
}
</style>
