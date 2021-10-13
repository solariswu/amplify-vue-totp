<template>
  <div class="modal-content background-customizable modeal-content-mobile">
    <div class="modal-body">
      <p>{{ msg }}</p>
      <a-button
        variant="success"
        type="primary"
        click="callback"
        block
      >
        {{ cbMsg }}
      </a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "MessageBoard",
  props: {
    msg: String,
    cbMsg: String,
    cbUri: String,
  },
  methods: {
    callback: function() {
      this.$router.push(cbUri);
    },
  },
};
</script>
