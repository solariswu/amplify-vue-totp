import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Button from 'ant-design-vue/lib/button';

import Amplify from "@aws-amplify/core";
import awsconfig from "./aws-exports";

import "./assets/styles/bootstrap.min.css";
import 'ant-design-vue/lib/button/style/css';
import "./assets/styles/cognito-login.css";

Amplify.configure(awsconfig);

const app = createApp(App);

app.use(Button);
app.use(router);

app.mount("#app");
