<script>
import friendlyTime from 'friendly-time';

export default {
  props: {
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
            createElement(
              'div',
              { class: this.$style.Meta },
              `Posted ${friendlyTime(new Date(comment.dateCreated))}`
            ),
            createElement(
              'div',
              { class: this.$style.Content },
              comment.content.text
            ),
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
@import '@/src/web/sass/fonts';

.Host {
}

.Comment {
}

.Meta {
  @include fonts-collapsed-post-metadata;
}

.Content {
  @include fonts-collapsed-post-title;
}

.SubComments {
  padding-left: 20px;
}
</style>
