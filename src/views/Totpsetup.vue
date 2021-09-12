<template>
  <QrcodeVue v-bind:value="qrstr" v-if="qrstr !== null" />
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
  </form>
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
      username: "",
      password: "",
      user: null,
      qrstr: null,
      inputText: null,
      needInput: null,
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
          "&issuer=CognitoJSPOC";
      });
    });
  },
  methods: {
    toast(msg) {
      alert(msg);
    },
    async inputdone() {
      this.loading = true;
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
    },
  },
};
</script>
