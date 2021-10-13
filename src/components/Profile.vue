<template>
  <div class="profile">
    <div class="profile-pic">
      <div class="header-color"></div>
      <div v-if="this.email ? 1 === 1 : 1 === 0" class="user-image">
        <img v-bind:src="'https://gravatar.com/avatar/' + this.gravatar + '?s=200'" />
      </div>
      <div v-else class="user-image">
        <img src="https://gravatar.com/avatar/000000" />
      </div>
    </div>
    <div class="title">
      <h1>{{ this.username }}</h1>
    </div>
    <div class="user-info">
      <p class="user-name">UID:{{ this.username ? this.username : "--" }}</p>
      <p class="user-email">
        <i class="icon ion-md-mail"> </i>
        {{ this.email ? this.email : "--" }}
      </p>
      <p class="user-title">Role: {{ this.role ? this.role : "--" }}</p>
      <p class="user-title">Group: {{ this.group ? this.group : "--" }}</p>
      <p class="user-title">Token Expires on: {{ this.exp ? this.exp : "--" }}</p>
      <p class="user-title">Timezone: {{ this.timezone ? this.timezone : "" }}
      </p>
      <p class="user-title">Linked IdPs: {{ this.idp_names ? this.idp_names : "--" }}
      </p>
    </div>
    <div class="social-links">
      <a href="#"><i class="icon ion-logo-facebook"></i></a>
      <a href="#"><i class="icon ion-logo-twitter"></i></a>
      <a href="#"><i class="icon ion-logo-instagram"></i></a>
    </div>
    
    <a-button
      size="sm"
      variant="outline-dark"
      class="text-light"
      v-on:click="logout()"
    >
      <b-icon icon="power" aria-hidden="true"></b-icon>
      Logout
    </a-button>
  </div>
</template>
<script>
import * as CryptoJS from "crypto-js";
import { Auth } from "@aws-amplify/auth";
import { message } from "ant-design-vue";

export default {
  name: "UserInfo",
  data() {
    return {
      username: "",
      role: "",
      email: "",
      group: "",
      exp: "",
      timezone: "",
      gravatar: "",
      idp_names: "",
    };
  },
  mounted: function() {
    try {
      Auth.currentSession()
        .then((data) => this.transformUserInfo(data.getIdToken().getJwtToken()))
        .catch((err) => console.log(err));
    } catch {
      message.warning("You have not login yet.");
    }
  },
  methods: {
    transformUserInfo(idtoken) {
      const tokens = idtoken.split(".");
      const tokenObj = JSON.parse(Buffer.from(tokens[1], "base64").toString());
      const currentDate = new Date(tokenObj["exp"] * 1000);

      console.log("tokenobj", tokenObj);

      if (tokenObj) {
        for (
          let i = 0;
          tokenObj.identities && i < tokenObj.identities.length;
          i++
        ) {
          if (i > 0)
            this.idp_names =
              this.idp_names + ", " + tokenObj.identities[i].providerName;
          else this.idp_names = tokenObj.identities[i].providerName;
        }

        (this.username = tokenObj["cognito:username"]),
          (this.role = tokenObj["cognito:roles"]
            ? tokenObj["cognito:roles"].join()
            : "---"),
          (this.group = tokenObj["cognito:groups"]
            ? tokenObj["cognito:groups"].join()
            : "---"),
          (this.email = tokenObj["email"]),
          (this.exp = currentDate.toLocaleString()),
          (this.timezone = currentDate
            .toString()
            .match(/\((.*)\)/)
            .pop()),
          (this.gravatar = CryptoJS.MD5(
            (this.email ? this.email : "").trim().toLowerCase()
          ).toString());
      }
    },
    async logout() {
      Auth.signOut({ global: true })
        .then((data) => {
          console.log("logout:", data);
        })
        .catch((err) => console.log(err));

      await Auth.signOut();
      this.$router.push("/");
    },
  },
};
</script>
