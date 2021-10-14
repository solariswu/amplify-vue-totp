import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Button from 'ant-design-vue/lib/button';
import Message from 'ant-design-vue/lib/message';

import Amplify from "@aws-amplify/core";
import awsconfig from "./aws-exports";

import "./assets/styles/bootstrap.min.css";
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/message/style/css';
import "./assets/styles/cognito-login.css";

Amplify.configure(awsconfig);

const app = createApp(App);

// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
app.config.isCustomElement = tag => tag === 'ion-icon'


app.use(Button);
app.use(Message);
app.use(router);

app.mount("#app");
