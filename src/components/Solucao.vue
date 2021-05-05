<template>
  <div class="container" @click="$emit('click')">
    {{solucao}}
  </div>
</template>

<script>
export default {
  name: 'Solucao',
  props: {
    solucao: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.container {
  width: 250px;
  height: 200px;
  background-color: rgb(255, 70, 70);
  padding: 5px 15px;
  margin: 0px 10px 5px 10px;
  overflow: auto;
}
</style>