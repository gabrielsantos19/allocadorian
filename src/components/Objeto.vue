<template>
  <div class="container">
    <span class="titulo" :title="JSON.stringify(objeto)">
      {{valores.length > 0 ? valores[0] : 'Vazio'}}
    </span>
    <div>
      <span v-if="valores.length > 1" class="descricao">
        {{valores[1]}}
      </span>
      <span v-if="valores.length > 2" class="descricao">
        · {{valores[2]}}
      </span>
    </div>
    <div>
      <button @click="$emit('editar')">Editar</button>
      <button @click="$emit('remover')">Remover</button>
    </div>
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
  },
  computed: {
    valores () {
      const values = Object.values(this.objeto)
      const resultados = values.slice(0, 3)
      return resultados
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  width: 250px;
  min-height: 115px;
  color: white;
  background-color: #c41b1b;
  border-radius: 7px;
  padding: 5px 15px;
  overflow: hidden;
}
.titulo {
  flex-grow: 1;
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