<template>
  <div class="modal-content background-customizable modeal-content-mobile">
    <div class="modal-body">
      <h2>MFA Code Input</h2>
      <p />
      Your One Time Code
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
import awsConfig from "../aws-exports";
import { message } from "ant-design-vue";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

export default {
  name: "MFAInput",
  props: {
    user: String,
  },
  data() {
    return {
      loading: false,
      inputText: null,
    };
  },
  mounted: function() {
    if (!this.user) {
      message
        .info("No pending session found, back to login")
        .then(() => this.$router.push("/"));
    }
  },
  methods: {
    async inputdone() {
      this.loading = true;
      let obj = null;

      try {
        obj = JSON.parse(this.user);
      }
      catch (err) {
        message.error ('User session not found, please login again').then(()=> this.$router.push ('/login'));
      }

      const poolData = {
        UserPoolId: awsConfig.aws_user_pools_id,
        ClientId: awsConfig.aws_user_pools_web_client_id,
      };
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const userData = {
        Username: obj.username,
        Pool: userPool,
      };

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.Session = obj.Session;
      cognitoUser.challengeName = obj.challengeName;

      Auth.confirmSignIn(
        cognitoUser, // Return object from Auth.signIn()
        this.inputText, // Confirmation code
        cognitoUser.challengeName // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
      )
        .then((loggedUser) => {
          message
            .success("Welcome " + loggedUser.username)
            .then(() => this.$router.push("/"));
        })
        .catch((error) => message.error(error.message));
    },
  },
};
</script>
