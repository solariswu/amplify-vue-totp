<template>
  <div id="app">
    <div class="container center">
      <div class="modal-dialog">
        <!-- <div
          class="modal-content background-customizable modeal-content-mobile"
        > -->
          <!-- <div class="modal-body"> -->
            <router-view v-slot="{ Component }">
              <transition name="fade">
                <component :is="Component" />
              </transition>
            </router-view>
          <!-- </div> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "@aws-amplify/auth";
import { message } from 'ant-design-vue';


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
