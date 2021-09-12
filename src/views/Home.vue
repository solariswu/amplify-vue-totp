<template>
  <div class="home">
    <!-- <header class="app-header"></header> -->
    <Profile msg="" />
  </div>
</template>
<script>
// @ is an alias to /src
import Profile from "@/components/Profile.vue";

export default {
  name: "Home",
  components: {
    Profile,
  },
  beforeMount: function () {
      this.$router.push("/login/");
  },
};
</script>
