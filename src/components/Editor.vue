<template>
  <div class="column col">
    <textarea cols="60" :value="texto"></textarea>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  props: {
    texto: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
textarea {
  flex-grow: 1;
  font-family: "Courier New";
}
</style>