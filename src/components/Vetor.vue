<template>
  <div class="container" :title="JSON.stringify(vetor)">
    <div class="objetos">
      <div v-for="(objeto, index) in texto" :key="index">
        {{objeto}}
      </div>
    </div>
    <div class="pontuacao">
      {{vetor.p}}
    </div>
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
      return valores
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  
  width: 250px;
  font-size: 15px;
  color: aliceblue;
  background: #1f4068;
  font-weight: bold;
  border-radius: 7px;
  padding: 5px 15px;
  overflow: hidden;
}
.objetos {
  flex-grow: 1;
}
.pontuacao {
  padding: 5px;
  font-size: 30px;
}
</style>