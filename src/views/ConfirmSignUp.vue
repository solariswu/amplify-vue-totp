<template>
  <div class="modal-content background-customizable modeal-content-mobile">
    <div class="modal-body">
      <h2>Active Account</h2>
      <br />
      <div>
        <div style="text-align: left">
          Didn't receive the link?<br />
          We can resend you a new link to your email
        </div>
        <p />
        <form id="confirmSignUpForm" @submit.prevent="resend">
          <input
            id="confirmSignUpUsername"
            name="username"
            type="text"
            class="form-control inputField-customizable"
            placeholder="Username"
            autocapitalize="none"
            required
            v-model="username"
            :disabled="loading"
          />
          <p />
          <a-button
            variant="success"
            type="primary"
            form="confirmSignUpForm"
            value="Submit"
            htmlType="submit"
            :loading="loading"
            block
          >
            Resend
          </a-button>
          <p />
          <p class="redirect-customizable">
            <span>Account already confirmed?</span>&nbsp;<a href="/login/"
              >Sign in</a
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { Auth } from "@aws-amplify/auth";
import { message } from "ant-design-vue";

export default {
  components: {},
  name: "ConfirmSignUp",
  data() {
    return {
      loading: false,
      username: "",
    };
  },
  methods: {
    async resend() {
      this.loading = true;
      Auth.resendSignUp(this.username)
        .then((userData) => {
          this.loading = false;
          console.log("resent:", userData);
          message
            .success(
              "An verification email with a link has been sent to your email."
            )
            .then(() => {
              this.$router.push("/login/");
            });
        })
        .catch((err) => {
          console.log(err.message);
          message.warning(err.message);
          this.loading = false;
        });
    },
  },
};
</script>
