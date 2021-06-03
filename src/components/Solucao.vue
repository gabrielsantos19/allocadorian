<template>
  <div class="container" @click="$emit('click')" :title="JSON.stringify(solucao)">
    <div class="quantidade">
      {{solucao.i.length}} vetores
    </div>
    <div class="pontuacao">
      {{solucao.p.p}}
    </div>
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
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  min-width: 200px;
  color: white;
  border-radius: 7px;
  background-color: #00104a;
  padding: 5px 15px;
  margin: 0px 10px 5px 10px;
  overflow: auto;
}
.quantidade {
  font-size: 19px;
  flex-grow: 1;
}
.pontuacao {
  font-size: 25px;
  font-weight: bold;
  padding: 5px 0px 5px 15px;
}
</style>