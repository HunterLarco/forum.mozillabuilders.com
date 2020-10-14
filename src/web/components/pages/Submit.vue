<template>
  <div :class="$style.Host">
    <VerticalRibbon max-width="1200px" centered>
      <PageHeader :class="$style.PageHeader">
        <template v-slot:nav>
          <router-link to="/top">Top</router-link>
          <router-link to="/new">New</router-link>
        </template>

        <template v-slot:buttons>
          <router-link to="/submit">Post a new topic</router-link>
        </template>
      </PageHeader>

      <div :class="$style.Content">
        <div :class="$style.QuestionTypes">
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

          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'opinion'"
            @click="questionType_ = 'opinion'"
            text="Post an opinion"
            :disabled="loading_"
          />
        </div>

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
          <div :class="$style.Spacer" />
          <SubmitButton @click="submitQuestion_" :loading="loading_" />
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
          <div :class="$style.Spacer" />
          <SubmitButton @click="submitUrl_" :loading="loading_" />
        </template>

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
          <div :class="$style.Spacer" />
          <SubmitButton @click="submitOpinion_" :loading="loading_" />
        </template>
      </div>
    </VerticalRibbon>
  </div>
</template>

<script>
import ElementInput from '@/vendor/element-ui/Input';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import PageHeader from '@/src/web/components/layout/PageHeader';
import SubmitButton from '@/src/web/components/input/SubmitButton';
import TextCheckbox from '@/src/web/components/input/TextCheckbox';
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

export default {
  components: {
    ElementInput,
    HorizontalLayout,
    PageHeader,
    SubmitButton,
    TextCheckbox,
    VerticalRibbon,
  },

  data() {
    return {
      questionType_: 'question',

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
    };
  },

  methods: {
    submitQuestion_() {
      this.submit_({
        type: 'question',
        question: this.form_.question.question,
        details: this.form_.question.details,
      });
    },

    submitUrl_() {
      this.submit_({
        type: 'url',
        summary: this.form_.url.summary,
        url: this.form_.url.url,
      });
    },

    submitOpinion_() {
      this.submit_({
        type: 'opinion',
        summary: this.form_.opinion.summary,
        details: this.form_.opinion.details,
      });
    },

    submit_(post) {
      this.loading_ = true;
      console.log(post);
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';

.Host {
  @include layout-fill;

  background: #F0F0F0;
  overflow-x: hidden;
  overflow-y: scroll;
}

.PageHeader {
  background: #FFF;
}

.Content {
  padding: 30px;
}

.QuestionTypes {
  margin-bottom: 30px;
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
</style>
