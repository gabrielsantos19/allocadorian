<template>
  <div class="container">
    <div class="row">
      <div>{{titulo}}</div>
      <button @click="confirmar(novoTexto)">Salvar</button>
      <button @click="cancelar()">Cancelar</button>
    </div>
    <textarea cols="60" v-model="novoTexto"></textarea>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  props: {
    titulo: {
      type: String
    },
    texto: {
      type: String,
    },
    confirmar: {
      type: Function
    },
    cancelar: {
      type: Function
    }
  },
  data () {
    return {
      novoTexto: ''
    }
  },
  created () {
    this.novoTexto = this.texto
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: lightgreen;
}
textarea {
  flex-grow: 1;
  font-family: "Courier New";
}
</style>