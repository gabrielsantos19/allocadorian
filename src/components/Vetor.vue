<template>
  <div class="vetor" :title="JSON.stringify(vetor)">
    <div class="objetos">
      <div v-for="(objeto, index) in texto" :key="index" class="objeto">
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
        const keys3 = Object.keys(objeto).slice(0, 3)
        const resultado = []
        for (let k=0; k<keys3.length; ++k) {
          resultado.push(String(objeto[keys3[k]]))
        }
        valores.push(resultado.join(' · '))
      }
      return valores
    }
  }
}
</script>

<style scoped>
.vetor {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  
  width: 270px;
  font-size: 15px;
  color: white;
  background: #027d50;
  border-radius: 7px;
  padding: 5px 15px;
  overflow: hidden;
}
.objetos {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  flex-grow: 1;
  overflow: auto;
}
.objeto {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pontuacao {
  padding-left: 15px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}
</style>