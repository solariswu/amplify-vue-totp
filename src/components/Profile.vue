<template>
            <div v-if="needInput !== null">
              <center>
                <QrcodeVue v-bind:value="qrstr" v-if="qrstr !== null" />
              </center>
              <form id="inputCode" @submit.prevent="inputdone">
                <input
                  id="inputCode"
                  name="inputText"
                  type="text"
                  class="form-control inputField-customizable"
                  v-bind:placeholder="needInput"
                  autocapitalize="none"
                  required
                  v-model="inputText"
                />
                <p />
                <center>
                  <a-button
                    :loading="loading"
                    variant="success"
                    type="primary"
                    htmlType="submit"
                    form="inputCode"
                    value="Submit"
                    block
                  >
                    Ok
                  </a-button>
                </center>
              </form>
            </div>
            <div v-else-if="needInput === 'done' && user !== null">
              UserInfo:
              {{
                user.signInUserSession
                  ? user.signInUserSession.idToken.payload.email
                  : ""
              }}
            </div>
            <div v-else-if="needInput === null && user === null">
              <div>
                <h2>Login</h2>
                <br />
                <div>
                  <form id="signInForm" @submit.prevent="login">
                    <div>
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
                      />
                    </div>
                    <p />
                    <div>
                      <input
                        id="signInFormPassword"
                        name="password"
                        type="password"
                        class="form-control inputField-customizable"
                        placeholder="Password"
                        required
                        v-model="password"
                        :disabled="loading"
                      />
                    </div>
                    <div style="text-align: left">
                    <a
                      class="redirect-customizable"
                      href="/forgotPassword?response_type=token&amp;client_id=7nca7db89qqeddmt2rh90587c5&amp;redirect_uri=https://google.com&amp;state=STATE&amp;scope=aws.cognito.signin.user.admin+openid+email+profile"
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
                    <div style="text-align:left">
                      <p class="redirect-customizable">
                        <span>Need an account?</span>&nbsp;<a
                          href="/signup?response_type=token&amp;client_id=7nca7db89qqeddmt2rh90587c5&amp;redirect_uri=https://google.com&amp;state=STATE&amp;scope=aws.cognito.signin.user.admin+openid+email+profile"
                          >Sign up</a
                        >
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <center v-else class="simple-spinner"></center>
</template>
<script>
import { Auth } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import QrcodeVue from "qrcode.vue";
export default {
  components: { QrcodeVue },
  name: "UserProfile",
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      user: null,
      qrstr: null,
      inputText: null,
      needInput: null,
    };
  },
  mounted: function() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log("event:", event);
      switch (event) {
        case "cognitoHostedUI":
        case "signIn":
          this.loading = false;
          Auth.currentAuthenticatedUser().then((userData) => {
            console.log("user", userData);
            this.user = userData;
          });
          break;
        case "signOut":
          // setUser(null);
          this.loading = false;
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          this.loading = false;
          break;
        default:
          break;
      }
    });
  },
  methods: {
    toast(msg) {
      alert(msg);
    },
    async inputdone() {
      this.loading = true;
      switch (this.needInput) {
        case "MFA":
          Auth.confirmSignIn(
            this.user, // Return object from Auth.signIn()
            this.inputText, // Confirmation code
            this.user.challengeName // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
          ).then((loggedUser) => {
            this.user = loggedUser;
            this.inputText = null;
            this.needInput = "done";
          });
          break;
        case "NewPwd":
          Auth.completeNewPassword(this.user, this.inputText).then(
            (loggedUser) => {
              this.user = loggedUser;
              this.inputText = null;
              this.needInput = "done";
              this.needTOTPSetup(this.user);
            }
          );
          break;
        case "TOTP":
          // // Then you will have your TOTP account in your TOTP-generating app (like Google Authenticator)
          // // Use the generated one-time password to verify the setup
          this.loading = true;
          Auth.verifyTotpToken(this.user, this.inputText)
            .then(() => {
              // don't forget to set TOTP as the preferred MFA method
              Auth.setPreferredMFA(this.user, "TOTP");
              this.loading = false;
              this.inputText = null;
              this.needInput = "done";
              this.qrstr = null;
            })
            .catch((e) => {
              console.log("TOTP setup error:", e);
              this.loading = false;
              this.inputText = null;
              this.needInput = null;
              // Token is not verified
            });
          break;
        default:
          break;
      }
    },
    async needTOTPSetup(userData) {
      Auth.getPreferredMFA(userData, {
        // Optional, by default is false.
        // If set to true, it will get the MFA type from server side instead of from local cache.
        bypassCache: true,
      }).then((data) => {
        console.log("data:", data);
        if (data === "NOMFA") {
          Auth.setupTOTP(this.user).then((code) => {
            this.qrstr =
              "otpauth://totp/AWSCognito:" +
              userData.signInUserSession.idToken.payload.email +
              "?secret=" +
              code +
              "&issuer=CognitoJSPOC";
          });
          Auth.setPreferredMFA(this.user, "NOMFA");
          this.needInput = "TOTP";
        }
      });
    },
    async login() {
      this.loading = true;
      Auth.signIn(this.username, this.password)
        .then((userData) => {
          // console.log("user", userData);
          this.user = userData;
          this.loading = false;
          console.log("challenge_name:", userData.challengeName);
          switch (userData.challengeName) {
            case "NEW_PASSWORD_REQUIRED":
              this.needInput = "NewPwd";
              break;
            case "SOFTWARE_TOKEN_MFA":
            case "SMS_MFA":
              this.needInput = "MFA";
              break;
            case "MFA_SETUP":
            default:
              this.needTOTPSetup(userData);
              break;
          }
        })
        .catch((err) => {
          console.log(err.message);
          this.toast(err.message, "Warning");
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.simple-spinner {
  height: 48px;
  width: 48px;
  border: 5px solid rgba(150, 150, 150, 0.2);
  border-radius: 50%;
  border-top-color: rgb(150, 150, 150);
  animation: rotate 1s 0s infinite ease-in-out alternate;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
