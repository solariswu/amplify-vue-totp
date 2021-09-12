<template>
        <div
          class="modal-content background-customizable modeal-content-mobile"
        >
          <div class="modal-body">
    <h2>Change password</h2>
    <br />
    <div>
      <form id="changepasswordform" @submit.prevent="changePassword">
        <input
          id="new_password"
          v-model="newpassword"
          class="form-control inputField-customizable"
          type="password"
          name="password"
          placeholder="New Password"
          required=""
        />
        <p />
        <input
          id="confirm_password"
          v-model="newpwddup"
          class="form-control inputField-customizable"
          type="password"
          name="confirmPassword"
          placeholder="New Password Again"
          required=""
        />
        <br />
        <a-button
          variant="success"
          type="primary"
          form="changepasswordform"
          value="Submit"
          htmlType="submit"
          :loading="loading"
          block
        >
          <span>Change Password</span>
        </a-button>
        <p />
        <div style="text-align:center">
          <a class="redirect-customizable" href="/login"> Return to login</a>
        </div>
      </form>
    </div>
    </div>
  </div>
</template>
<script>
import { Auth } from "@aws-amplify/auth";
import awsConfig from "../aws-exports";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

export default {
  name: "ChangePassword",
  props: {
    user: String,
    type: String,
  },
  data() {
    return {
      loading: false,
      newpassword: "",
      newpwddup: "",
    };
  },
  mounted: function() {
    console.log("entree changepwd.");
    console.log("type:", this.type);

    if (!this.user) {
      alert("No user found, back to login");
      this.$router.push("/login");
    }
  },
  methods: {
    // toast(msg, type = "info") {
    //   this.$bvToast.toast(msg, {
    //     title: type,
    //     toaster: "b-toaster-top-center",
    //     solid: true,
    //     static: true,
    //     appendToast: true,
    //     variant: type === "info" ? "success" : type,
    //   });
    // },
    changePassword() {
      console.log("pwd change.");
      if (this.newpassword.length < 5) {
        this.toast("input valid password!", "warning");
      } else if (this.newpassword !== this.newpwddup) {
        this.toast("password not match!", "warning");
      } else {
        this.loading = true;

        let obj = JSON.parse(this.user);

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

        Auth.completeNewPassword(
          cognitoUser, // the Cognito User Object
          this.newpassword // the new password
        )
          .then(() => {
            this.loading = false;
            //check whether user has MFA setup
            // at this time the user is logged in if no MFA required
            if (Auth.getPreferredMFA === "NOMFA") {
              //set TOTP
              this.$$router.push("totpsetup");
            }
            // Todo:
            // this.$router.push("/userinfo");
          })
          .catch((e) => {
            this.loading = false;
            this.toast(e.message, "warning");
          });
      }
    },
  },
};
</script>
