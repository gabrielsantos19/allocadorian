<template>
  <div class="container" @click="$emit('click')">
    <div class="titulo">{{titulo}}</div>
    <div class="descricao">{{descricao}}</div>
    <button @click="$emit('remover')">Remover</button>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    titulo: {
      type: String,
      required: true
    },
    descricao: {
      type: String,
      default: ''
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