//import VueRouter from "vue-router";
import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import ChangePassword from "../views/Changepassword.vue";
import TOTPSetup from "../views/Totpsetup.vue";
import MFAInput from "../views/Mfainput.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login 
  },
  {
    path: "/changepassword",
    name: "ChangePassword",
    component: ChangePassword,
    props: true,
  },
  {
    path: "/mfainput",
    name: "MFAInput",
    component: MFAInput 
  },
  {
    path: "/totpsetup",
    name: "TOTPSetup",
    component: TOTPSetup 
  }
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: () =>
  //     import(/* webpackChunkName: "register" */ "../views/Register.vue")
  // },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () =>
  //     import(/* webpackChunkName: "login" */ "../views/Login.vue")
  // },
  // {
  //   path: "/landing",
  //   name: "Landing",
  //   component: Landing
  // },
  // {
  //   path: "/userinfo",
  //   name: "UserInfo",
  //   component: UserInfo
  // },
  // {
  //   path: "/forgotpassword",
  //   name: "ForgotPassword",
  //   component: ForgotPassword
  // },
  // {
  //   path: "/resetpassword",
  //   name: "ResetPassword",
  //   component: ResetPassword
  // }
];

//base: process.env.BASE_URL,

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
