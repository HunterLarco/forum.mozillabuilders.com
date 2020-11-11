<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
      <PageHeader>
        <template v-slot:nav>
          <router-link to="/hot">Hot</router-link>
          <router-link to="/new">New</router-link>
        </template>

        <template v-slot:buttons>
          <router-link to="/submit">
            <span v-if="$sizing.gt('mobile')">Post a new topic</span>
            <span v-else>Post</span>
          </router-link>
        </template>
      </PageHeader>

      <PageRibbon>
        <div :class="$style.QuestionTypes">
          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'text'"
            @click="questionType_ = 'text'"
            text="Post text"
            :disabled="loading_"
          />

          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'link'"
            @click="questionType_ = 'link'"
            text="Share a URL"
            :disabled="loading_"
          />
        </div>

        <template v-if="questionType_ == 'text'">
          <ElementInput
            placeholder="What's on your mind?"
            v-model="form_.text.title"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span :class="$style.InputPrepend">Title</span>
            </template>
          </ElementInput>
          <div :class="$style.Spacer" />
          <ElementInput
            :class="$style.Textarea"
            placeholder="Tell us more about it..."
            type="textarea"
            :disabled="loading_"
            v-model="form_.text.text"
            :autosize="{ minRows: 2 }"
          />
        </template>

        <template v-if="questionType_ == 'link'">
          <ElementInput
            placeholder="What is this URL about?"
            v-model="form_.link.title"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span :class="$style.InputPrepend">Title</span>
            </template>
          </ElementInput>
          <div :class="$style.Spacer" />
          <ElementInput
            placeholder="https://..."
            v-model="form_.link.link"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span :class="$style.InputPrepend">URL</span>
            </template>
          </ElementInput>
        </template>

        <div :class="$style.Spacer" />
        <div :class="$style.Spacer" />

        <HorizontalLayout vertical-center spacing="10">
          <template v-slot:left>
            <SubmitButton @click="submit_" :loading="loading_" />
          </template>

          <div :class="$style.Error" v-if="error_">{{ error_ }}</div>
        </HorizontalLayout>
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import Avatar from '@/src/web/components/layout/Avatar';
import ElementInput from '@/vendor/element-ui/Input';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';
import SubmitButton from '@/src/web/components/input/SubmitButton';
import TextCheckbox from '@/src/web/components/input/TextCheckbox';

import CurrentUserStore from '@/src/web/stores/CurrentUser';
import FeedStore from '@/src/web/stores/Feed';
import PostStore from '@/src/web/stores/Post';

export default {
  components: {
    Avatar,
    ElementInput,
    HorizontalLayout,
    PageFooter,
    PageHeader,
    PageRibbon,
    SubmitButton,
    TextCheckbox,
  },

  data() {
    return {
      questionType_: 'text',

      form_: {
        text: {
          title: '',
          text: '',
        },

        link: {
          title: '',
          link: '',
        },
      },

      loading_: false,
      error_: false,
    };
  },

  methods: {
    submit_() {
      const request = {};
      if (this.questionType_ == 'text') {
        request.title = this.form_.text.title;
        request.content = { text: this.form_.text.text };
      } else if (this.questionType_ == 'link') {
        request.title = this.form_.link.title;
        request.content = { link: this.form_.link.link };
      }

      this.loading_ = true;
      PostStore.dispatch('createPost', request)
        .then((post) => {
          FeedStore.commit('prependPost', {
            postId: post.id,
            feed: {
              index: 'new',
            },
          });
          FeedStore.commit('prependPost', {
            postId: post.id,
            feed: {
              index: 'new',
              filters: {
                author: CurrentUserStore.state.account.id,
              },
            },
          });
          this.error_ = null;
          this.$router.push(`/post/${post.id}`);
        })
        .catch((error) => {
          this.error_ = error.message;
        })
        .finally(() => {
          this.loading_ = false;
        });
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';

.Host {
  @include layout-fill;

  overflow-x: hidden;
  overflow-y: scroll;
}

.QuestionTypes {
  margin: 30px 0;
}

.QuestionType {
  margin-top: 10px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
}

.InputPrepend {
  display: inline-block;
  min-width: 70px;
}

.Spacer {
  height: 10px;
}

.Textarea {
  & > textarea {
    font-family: Arial;
    font-size: 14px;
    line-height: 30px;
  }
}

.Error {
  @include fonts-body;

  color: #E91E63;
}
</style>
