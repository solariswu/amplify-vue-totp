import { createApp } from "vue";
import App from "./App.vue";

import Amplify from "@aws-amplify/core";
import awsconfig from "./aws-exports";

import "bootstrap/dist/css/bootstrap.css";

import "./assets/styles/cognito-login.css";

Amplify.configure(awsconfig);

createApp(App).mount("#app");
