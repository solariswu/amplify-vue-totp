//import VueRouter from "vue-router";
import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/Signup.vue";
import ChangePassword from "../views/Changepassword.vue";
import ForgotPassword from "../views/Forgotpassword.vue";
import TOTPSetup from "../views/Totpsetup.vue";
import MFAInput from "../views/Mfainput.vue";
import ConfirmSignUp from "../views/ConfirmSignUp.vue";

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
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/changepassword",
    name: "ChangePassword",
    component: ChangePassword,
    props: true,
  },
  {
    path: "/forgotpassword",
    name: "ForgotPassword",
    component: ForgotPassword
  },
  {
    path: "/mfainput",
    name: "MFAInput",
    component: MFAInput,
    props: true, 
  },
  {
    path: "/totpsetup",
    name: "TOTPSetup",
    component: TOTPSetup 
  },
  {
    path: "/confirmsignup",
    name: "ConfirmSignUp",
    component: ConfirmSignUp
  },
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
