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
}
</script>

<style scoped>
textarea {
  font-family: "Courier New";
}
</style>