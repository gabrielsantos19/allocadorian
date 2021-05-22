<template>
  <div class="container" @click="$emit('click')" :title="JSON.stringify(solucao)">
    {{solucao.i.length}} vetores<br />
    Pontos: {{solucao.p}}
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
}
</script>

<style scoped>
.container {
  width: 250px;
  border-radius: 7px;
  background-color: rgb(255, 70, 70);
  padding: 5px 15px;
  margin: 0px 10px 5px 10px;
  overflow: auto;
}
</style>