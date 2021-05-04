<template>
  <div class="container" @click="$emit('click')">
    <button @click="$emit('remover')">Remover</button>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    vetor: {
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
  height: 110px;
  background-color: rgb(255, 70, 70);
  padding: 5px 15px;
  margin: 0px 10px 5px 10px;
}
</style>