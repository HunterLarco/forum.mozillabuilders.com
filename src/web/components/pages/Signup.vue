<template>
  <div :class="$style.Host">
    <div>
      <router-link :class="$style.Logo" to="/">
        <img src="~@/src/web/assets/logos/Mozilla.png" />
        <label>Unfck Forum</label>
      </router-link>

      <div :class="$style.Content">
        <div :class="$style.Title">Sign up</div>

        <ElementForm
          :class="$style.Form"
          :model="form_.data"
          :rules="form_.rules"
          @submit.native.prevent="submit_"
        >
          <ElementFormItem
            label="Screen Name"
            prop="screenName"
            :error="form_.errors.screenName"
          >
            <ElementInput
              placeholder="How do you want to be known?"
              v-model="form_.data.screenName"
              @input="form_.errors.screenName = null"
              :readonly="submitting_"
            />
          </ElementFormItem>

          <ElementFormItem
            label="Email"
            prop="email"
            :error="form_.errors.email"
          >
            <ElementInput
              placeholder="Enter your email address..."
              v-model="form_.data.email"
              @input="form_.errors.email = null"
              :readonly="submitting_"
            />
          </ElementFormItem>

          <ElementFormItem v-if="submitted_">
            <div :class="$style.Details">
              We just sent you a temporary login link.<br />
              Please check your inbox.
            </div>
          </ElementFormItem>

          <ElementButton
            :class="$style.SubmitButton"
            @click="submit_"
            :loading="submitting_"
            >Continue with email</ElementButton
          >
        </ElementForm>
      </div>
      <div :class="$style.Redirect">
        Already have a account?
        <router-link to="/login">Log in</router-link> instead.
      </div>
    </div>
  </div>
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';
import ElementForm from '@/vendor/element-ui/Form';
import ElementFormItem from '@/vendor/element-ui/FormItem';
import ElementInput from '@/vendor/element-ui/Input';
import ElementMessage from '@/vendor/element-ui/Message';

export default {
  components: {
    ElementButton,
    ElementForm,
    ElementFormItem,
    ElementInput,
  },

  data() {
    return {
      form_: {
        data: {
          email: '',
          screenName: '',
        },

        errors: {
          email: null,
          screenName: null,
        },
      },

      submitting_: false,
      submitted_: false,
    };
  },

  methods: {
    submit_() {},
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';

.Host {
  @include layout-center;
  @include layout-fill;
}

.Logo {
  color: inherit;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;

  & > * {
    display: inline-block;
    vertical-align: middle;
  }

  & > img {
    height: 24px;
  }

  & > label {
    @include fonts-nav-link;

    cursor: pointer;
    padding: 0 8px;
  }
}

.Content {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 30px;
  margin-bottom: 10px;
}

.Title {
  @include fonts-body;

  font-weight: 700;
  margin-bottom: 20px;
}

.Form {
  min-width: 300px;
}

.Details {
  @include fonts-body;

  color: #606266;
  text-align: center;
}

.SubmitButton {
  display: block;
  margin-bottom: 10px;
  width: 100%;
}

.Redirect {
  @include fonts-caption;

  text-align: center;

  & > a {
    color: inherit;
    font-weight: 700;
  }
}
</style>
