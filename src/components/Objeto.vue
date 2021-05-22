<template>
  <div class="container">
    <div class="titulo">{{Object.values(objeto)[0]}}</div>
    <div class="descricao">{{Object.values(objeto)[1]}}</div>
    <button @click="$emit('remover')">Remover</button>
    <button @click="$emit('editar')">Editar</button>
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
  background-color: #e84545;
  border-radius: 7px;
  padding: 10px 15px;
  overflow: hidden;
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