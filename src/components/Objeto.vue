<template>
  <div class="container" @click="$emit('click')">
    <div class="titulo">{{Object.values(objeto)[0]}}</div>
    <div class="descricao">{{Object.values(objeto)[1]}}</div>
    <button @click="$emit('remover')">Remover</button>
  </div>
</template>

<script>
export default {
  name: 'ObjetoComponent',
  props: {
    objeto: {
      type: Object,
      required: true
    }
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
.titulo {
  font-size: 24pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.descricao {
  font-size: 14pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>