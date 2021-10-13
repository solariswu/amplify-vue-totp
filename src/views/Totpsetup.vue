<template>
  <div class="modal-content background-customizable modeal-content-mobile">
    <div class="modal-body">
      <h2>Welcome! {{ user.username }}</h2>
      <p />
      1. Scan QR in your Authenticator App
      <p />
      <center>
        <QrcodeVue v-bind:value="qrstr" v-if="qrstr !== null" />
      </center>
      <p />
      2. Copy OTP code from Authenticator App in here
      <form id="inputCode" @submit.prevent="inputdone">
        <input
          id="inputCode"
          name="inputText"
          type="text"
          class="form-control inputField-customizable"
          autocapitalize="none"
          required
          v-model="inputText"
        />
        <p />
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
        <p />
        <p class="redirect-customizable">
          <span>Back to</span>&nbsp;<a href="/login">Sign in</a>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { Auth } from "@aws-amplify/auth";
import QrcodeVue from "qrcode.vue";
export default {
  components: { QrcodeVue },
  name: "TOTPSetup",
  data() {
    return {
      loading: false,
      user: null,
      qrstr: null,
      inputText: null,
    };
  },
  beforeMount: function() {
    Auth.currentAuthenticatedUser().then((userData) => {
      this.user = userData;
      Auth.setupTOTP(this.user).then((code) => {
        this.qrstr =
          "otpauth://totp/AWSCognito:" +
          userData.signInUserSession.idToken.payload.email +
          "?secret=" +
          code +
          "&issuer=CognitoJsPOC";
      });
    });
  },
  methods: {
    async inputdone() {
      this.loading = true;
      // // Then you will have your TOTP account in your TOTP-generating app (like Google Authenticator)
      // // Use the generated one-time password to verify the setup
      Auth.verifyTotpToken(this.user, this.inputText)
        .then(() => {
          // don't forget to set TOTP as the preferred MFA method
          Auth.setPreferredMFA(this.user, "TOTP").then(() => {
            this.loading = false;
            this.$router.push("/");
          });
        })
        .catch((e) => {
          console.log("TOTP setup error:", e);
          this.loading = false;
          // Token is not verified
        });
    },
  },
};
</script>
