<template>
  <div class="modal-content background-customizable modeal-content-mobile">
    <div class="modal-body">
      <h2>Login</h2>
      <br />
      <div>
        <form id="signInForm" @submit.prevent="login">
          <label class="label-customizable">Username</label>
          <input
            id="signInFormUsername"
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
          <label class="label-customizable">Password</label>
          <input
            id="signInFormPassword"
            name="password"
            type="password"
            class="form-control inputField-customizable"
            v-bind:class="{ divshake: needShake }"
            placeholder="Password"
            required
            v-model="password"
            :disabled="loading"
          />
          <div style="text-align: left">
            <a class="redirect-customizable" href="/forgotpassword"
              >Forgot your password?</a
            >
          </div>
          <p />
          <a-button
            variant="success"
            type="primary"
            form="signInForm"
            value="Submit"
            htmlType="submit"
            :loading="loading"
            block
          >
            Sign In
          </a-button>
          <p />
          <p class="redirect-customizable">
            <span>Need an account?</span>&nbsp;<a href="/signup">Sign up</a>
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
  name: "Login",
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      needShake: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.needShake = false;
      const metaData = { IP: "1.1.1.1" }; // test only
      Auth.signIn(this.username, this.password, metaData)
        .then((userData) => {
          this.user = userData;
          this.loading = false;
          console.log("userdata", userData);
          // console.log("challenge_name:", userData.challengeName);
          switch (userData.challengeName) {
            case "NEW_PASSWORD_REQUIRED":
              console.log("userData:", userData);
              this.$router.push({
                name: "ChangePassword",
                params: {
                  user: JSON.stringify(userData),
                  type: "forceChangePassword",
                },
              });
              break;
            case "SOFTWARE_TOKEN_MFA":
            case "SMS_MFA":
              this.$router.push({
                name: "MFAInput",
                params: {
                  user: JSON.stringify(userData),
                },
              });
              break;
            case "MFA_SETUP":
            default:
              this.$router.push("/totpsetup/");
              break;
          }
        })
        .catch((err) => {
          console.log(err.message);
          message.warning(err.message).then(() => {
            this.loading = false;
            switch (err.code) {
              case "UserNotConfirmedException":
                this.$router.push("/confirmsignup/");
                break;
              default:
                break;
            }
          });
          this.needShake = true;
        });
    },
  },
};
</script>
