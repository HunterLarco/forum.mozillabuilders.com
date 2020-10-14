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
            @click.native="questionType_ = 'question'"
            text="Ask a question"
          />

          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'url'"
            @click.native="questionType_ = 'url'"
            text="Share a URL"
          />

          <TextCheckbox
            :class="$style.QuestionType"
            :selected="questionType_ == 'opinion'"
            @click.native="questionType_ = 'opinion'"
            text="Post an opinion"
          />
        </div>
      </div>
    </VerticalRibbon>
  </div>
</template>

<script>
import ElementInput from '@/vendor/element-ui/Input';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import PageHeader from '@/src/web/components/layout/PageHeader';
import TextCheckbox from '@/src/web/components/input/TextCheckbox';
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

export default {
  components: {
    ElementInput,
    HorizontalLayout,
    PageHeader,
    TextCheckbox,
    VerticalRibbon,
  },

  data() {
    return {
      questionType_: 'question',
    };
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
  background: #FFFFFF;
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
</style>
