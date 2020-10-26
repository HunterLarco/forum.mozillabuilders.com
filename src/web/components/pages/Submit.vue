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
        <div :class="$style.Content">
          <div :class="$style.FormLabel">Post a new topic</div>

          <ElementInput
            :class="$style.Title"
            placeholder="What's on your mind?"
            v-model="form_.opinion.summary"
            :disabled="loading_"
          >
            <template v-slot:prepend>
              <span>Title</span>
            </template>
          </ElementInput>
          <div :class="$style.Spacer" />
          <ElementInput
            :class="$style.Textarea"
            placeholder="Tell us more..."
            type="textarea"
            :disabled="loading_"
            v-model="form_.opinion.details"
            :autosize="{ minRows: 2 }"
          />
          <div :class="$style.Spacer" />
          <ElementDropdown @command="topic_ = $event">
            <ElementButton>
              <label v-if="topic_">{{ topic_ }}</label>
              <label v-else>Tag your post</label>
              <ElementIcon name="arrow-down" />
            </ElementButton>
            <ElementDropdownMenu slot="dropdown">
              <ElementDropdownItem
                :command="topic"
                v-for="topic in topics_"
                :key="topic"
                >{{ topic }}</ElementDropdownItem
              >
            </ElementDropdownMenu>
          </ElementDropdown>

          <div :class="$style.Spacer" />
          <div :class="$style.Spacer" />

          <HorizontalLayout vertical-center spacing="10">
            <template v-slot:left>
              <SubmitButton @click="submit_" :loading="loading_" />
            </template>

            <div :class="$style.Error" v-if="error_">{{ error_ }}</div>
          </HorizontalLayout>
        </div>
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';
import ElementDropdown from '@/vendor/element-ui/Dropdown';
import ElementDropdownItem from '@/vendor/element-ui/DropdownItem';
import ElementDropdownMenu from '@/vendor/element-ui/DropdownMenu';
import ElementIcon from '@/vendor/element-ui/Icon';
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
    ElementButton,
    ElementDropdown,
    ElementDropdownItem,
    ElementDropdownMenu,
    ElementIcon,
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

      topics_: [
        'Collaboration & Society',
        'Decentralized Web',
        'Messaging & Social Networking',
        'Surveillance Capitalism',
        'Misinformation & Content',
        'Artificial Intelligence',
        'Web Assembly',
        'Search',
      ],
      topic_: null,

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

.Content {
  border-radius: 5px;
  border: 1px solid #000;
  margin: 30px;
  padding: 30px;
  position: relative;
}

.FormLabel {
  @include fonts-nav-link;

  margin-bottom: 20px;
  opacity: 0.4;
  text-transform: uppercase;
}

.Title {
  @include fonts-post-title;

  font-weight: normal;
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
