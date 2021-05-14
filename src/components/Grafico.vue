<template>
  <div class="container">
    <div v-for="(grupo, key) in agrupados" :key="key" class="elemento" :style="{ 'background-color': backgroundColor}">
      <div>
        {{titulo(grupo)}}
      </div>
      <grafico-component 
        :vetores="grupo" 
        :agrupamento="agrupamento.slice(1)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraficoComponent',
  props: {
    agrupamento: {
      type: Array,
      required: true
    },
    vetores: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    agrupados () {
      if (this.agrupamento.length > 0) {
        const index = this.agrupamento[0]
        return this.agrupar(this.vetores, v => v.i[index])
      }
      return {}
    },
    backgroundColor () {
      const i = this.agrupamento.length
      return `rgb(75,100,${i*60})`
    }
  },
  methods: {
    agrupar (vetores, f) {
      const resultado = {}
      for (let i=0; i<vetores.length; ++i) {
        const vetor = vetores[i]
        const property = f(vetor)
        if (resultado.hasOwnProperty(property)) {
          resultado[property].push(vetor)
        } else {
          resultado[property] = [vetor]
        }
      }
      return resultado
    },
    titulo (grupo) {
      const objeto = grupo[0].objetos[this.agrupamento[0]]
      return Object.values(objeto)[0]
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.elemento {
  padding: 10px;
  margin: 5px;
}
</style>