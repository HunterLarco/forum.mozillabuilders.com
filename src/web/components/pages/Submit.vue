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
            :selected="questionType_ == 'opinion'"
            @click="questionType_ = 'opinion'"
            text="Post an opinion"
            :disabled="loading_"
          />

          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'question'"
            @click="questionType_ = 'question'"
            text="Ask a question"
            :disabled="loading_"
          />

          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'url'"
            @click="questionType_ = 'url'"
            text="Share a URL"
            :disabled="loading_"
          />
        </div>

        <template v-if="questionType_ == 'opinion'">
          <ElementInput
            placeholder="What's the 80/20 of what you're thinking about?"
            v-model="form_.opinion.summary"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span :class="$style.InputPrepend">Summary</span>
            </template>
          </ElementInput>
          <div :class="$style.Spacer" />
          <ElementInput
            :class="$style.Textarea"
            placeholder="Tell us more about it..."
            type="textarea"
            :disabled="loading_"
            v-model="form_.opinion.details"
            :autosize="{ minRows: 2 }"
          />
        </template>

        <template v-if="questionType_ == 'question'">
          <ElementInput
            placeholder="What's on your mind?"
            v-model="form_.question.question"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span :class="$style.InputPrepend">Question</span>
            </template>
          </ElementInput>
          <div :class="$style.Spacer" />
          <ElementInput
            :class="$style.Textarea"
            placeholder="Tell us more about it..."
            :disabled="loading_"
            type="textarea"
            v-model="form_.question.details"
            :autosize="{ minRows: 2 }"
          />
        </template>

        <template v-if="questionType_ == 'url'">
          <ElementInput
            placeholder="What is this URL about?"
            v-model="form_.url.summary"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span :class="$style.InputPrepend">Summary</span>
            </template>
          </ElementInput>
          <div :class="$style.Spacer" />
          <ElementInput
            placeholder="https://..."
            v-model="form_.url.url"
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
import ElementInput from '@/vendor/element-ui/Input';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';
import SubmitButton from '@/src/web/components/input/SubmitButton';
import TextCheckbox from '@/src/web/components/input/TextCheckbox';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
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
      questionType_: 'opinion',

      form_: {
        question: {
          question: '',
          details: '',
        },

        url: {
          summary: '',
          url: '',
        },

        opinion: {
          summary: '',
          details: '',
        },
      },

      loading_: false,
      error_: false,
    };
  },

  methods: {
    submit_() {
      const request = {};
      if (this.questionType_ == 'question') {
        request.type = 'question';
        request.question = this.form_.question.question;
        request.details = this.form_.question.details;
      } else if (this.questionType_ == 'url') {
        request.type = 'url';
        request.summary = this.form_.url.summary;
        request.url = this.form_.url.url;
      } else if (this.questionType_ == 'opinion') {
        request.type = 'opinion';
        request.summary = this.form_.opinion.summary;
        request.details = this.form_.opinion.details;
      }

      this.loading_ = true;
      apiFetch('aurora/posts/create', request)
        .then(({ id }) => {
          this.error_ = null;
          this.$router.push(`/post/${id}`);
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
