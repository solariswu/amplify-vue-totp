<template>
  <div class="modal-content background-customizable modeal-content-mobile">
    <div class="modal-body">
      <h2>Sign up with a new account</h2>
      <br />
      <form id="signUp" @submit.prevent="signup">
        <label class="label-customizable">Username</label>
        <input
          id="signUpFormUsername"
          name="username"
          type="text"
          class="form-control inputField-customizable"
          placeholder="Username"
          autocapitalize="none"
          required
          v-model="username"
          :disabled="loading"
          autofocus="true"
        />
        <p />
        <label class="label-customizable">Email</label>
        <input
          id="signInFormEmail"
          name="email"
          type="text"
          class="form-control inputField-customizable"
          placeholder="name@host"
          autocapitalize="none"
          required
          v-model="email"
          :disabled="loading"
        />
        <p />
        <label class="label-customizable">Password</label>
        <input
          id="signUpFormPassword"
          name="password"
          type="password"
          class="form-control inputField-customizable"
          placeholder="Password"
          required
          v-model="password"
          :disabled="loading"
        />
        <p />
        <a-button
          :loading="loading"
          variant="success"
          type="primary"
          htmlType="submit"
          form="signUp"
          value="Submit"
          block
        >
          Ok
        </a-button>
        <p />
        <p class="redirect-customizable">
          <span>Already have an account?</span>&nbsp;<a href="/login"
            >Sign in</a
          >
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { Auth } from "@aws-amplify/auth";
import { message } from "ant-design-vue";
export default {
  components: {},
  name: "SignUp",
  data() {
    return {
      loading: false,
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async signup() {
      this.loading = true;
      try {
        await Auth.signUp({
          username: this.username,
          password: this.password,
          attributes: { email: this.email },
        });
        this.loading = false;
        message
          .info("An verification link has been sent your email address.")
          .then(() =>
            message
              .info("Please confirm your sign up by clicking the link in that email.")
              .then(() => this.$router.push("/"))
          );
      } catch (error) {
        this.loading = false;
        message.warning(error.message);
      }
    },
  },
};
</script>
