<template>
  <div class="container" :title="JSON.stringify(vetor)">
    {{texto}}<br />
    Pontos: {{this.vetor.p}}
  </div>
</template>

<script>
export default {
  name: 'Vetor',
  props: {
    vetor: {
      type: Object,
      required: true
    }
  },
  computed: {
    texto () {
      let valores = []
      for (let i=0; i<this.vetor.objetos.length; ++i) {
        const objeto = this.vetor.objetos[i]
        const key = Object.keys(objeto)[0]
        valores.push(objeto[key])
      }
      return valores.join(' • ')
    }
  }
}
</script>

<style scoped>
.container {
  width: 250px;
  background-color: rgb(255, 70, 70);
  border-radius: 7px;
  padding: 5px 15px;
  margin: 0px 10px 5px 10px;
  overflow: hidden;
}
</style>