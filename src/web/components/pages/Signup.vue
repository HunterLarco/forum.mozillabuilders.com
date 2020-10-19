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
            prop="username"
            :error="form_.errors.username"
          >
            <ElementInput
              placeholder="How do you want to be known?"
              v-model="form_.data.username"
              @input="form_.errors.username = null"
              :readonly="submitting_"
              @keydown.native.prevent.enter="submit_"
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
              @keydown.native.prevent.enter="submit_"
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
import debounce from 'debounce';
import emailValidator from 'email-validator';

import ElementButton from '@/vendor/element-ui/Button';
import ElementForm from '@/vendor/element-ui/Form';
import ElementFormItem from '@/vendor/element-ui/FormItem';
import ElementInput from '@/vendor/element-ui/Input';
import ElementMessage from '@/vendor/element-ui/Message';

import apiFetch from '@/src/web/helpers/net/apiFetch';

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
          username: '',
        },

        errors: {
          email: null,
          username: null,
        },

        rules: {
          username: [
            {
              trigger: 'change',
              validator: debounce((rule, value, callback) => {
                const error = this.validateUsername_(value);
                if (value && error) {
                  callback(error);
                } else if (this.form_.errors.username) {
                  callback(this.form_.errors.username);
                } else {
                  callback();
                }
              }, 300),
            },
          ],

          email: [
            {
              trigger: 'change',
              validator: debounce((rule, value, callback) => {
                const error = this.validateEmail_(value);
                if (value && error) {
                  callback(error);
                } else if (this.form_.errors.email) {
                  callback(this.form_.errors.email);
                } else {
                  callback();
                }
              }, 300),
            },
          ],
        },
      },

      submitting_: false,
      submitted_: false,
    };
  },

  methods: {
    validateUsername_(username) {
      if (!username) {
        return 'Username is required.';
      }
      if (username.length < 3) {
        return 'Usernames must contain at least 3 characters.';
      }
      if (!username.match(/^[a-zA-Z0-9_]+$/)) {
        return 'May only contain alphanumeric characters and underscores.';
      }
      return null;
    },

    validateEmail_(email) {
      if (!email) {
        return 'Email is required.';
      }
      if (!emailValidator.validate(email)) {
        return `${email} is not a valid email address.`;
      }
      return null;
    },

    submit_() {
      const email = this.form_.data.email;
      const username = this.form_.data.username;

      const emailError = this.validateEmail_(email);
      const usernameError = this.validateUsername_(username);
      this.form_.errors.email = emailError;
      this.form_.errors.username = usernameError;
      if (emailError || usernameError) {
        return;
      }

      this.submitting_ = true;
      apiFetch('aurora/accounts/create', { email, username })
        .then(() => {
          this.submitted_ = true;
        })
        .catch((error) => {
          switch (error.name) {
            case 'InvalidUsername':
            case 'UsernameAlreadyExists':
              this.form_.errors.username = error.message;
              break;
            case 'EmailAlreadyExists':
              this.form_.errors.email = error.message;
              break;
            default:
              this.form_.errors.email = error.message;
          }
        })
        .finally(() => {
          this.submitting_ = false;
        });
    },
  },

  watch: {
    '$route.query.error': {
      immediate: true,
      handler() {
        if (this.$route.query.error) {
          ElementMessage.error({ message: this.$route.query.error });
        }
      },
    },

    '$route.query.info': {
      immediate: true,
      handler() {
        if (this.$route.query.info) {
          ElementMessage.info({ message: this.$route.query.info });
        }
      },
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';
@import '@/src/web/sass/sizing';

.Host {
  @include layout-center;

  min-height: 100%;

  @include sizing-mobile {
    @include layout-vertical-center;

    & > * {
      padding: 20px;
      width: 100%;
    }
  }
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

  @include sizing-mobile {
    min-width: unset;
  }
}

.Details {
  @include fonts-caption;

  color: #606266;
  text-align: center;
}

.SubmitButton {
  display: block;
  margin: 30px 0 10px 0;
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
