<template>
  <div id="app">
    <div class="container center">
      <div class="modal-dialog">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "@aws-amplify/auth";
import { message } from "ant-design-vue";

export default {
  name: "App",
  methods: {
    async logout() {
      try {
        await Auth.signOut();
      } catch (error) {
        message.warning(error.message);
      }
    },
  },
};
</script>
<style scoped>
.fade-enter.fade-enter-active,
.fade-appear.fade-appear-active {
  -webkit-animation-name: none;
  animation-name: none;
}

.fade-leave.fade-leave-active {
  -webkit-animation-name: none;
  animation-name: none;
}
</style>
