<template>
  <div class="grafico">
    <div v-for="(grupo, key) in agrupados" :key="key" class="elemento" :style="{ 'background-color': backgroundColor }">
      <div :title="JSON.stringify(grupo[0])">
        {{titulo(grupo)}}
      </div>
      <grafico-component :vetores="grupo" :agrupamento="agrupamento.slice(1)" />
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
      const cores = [
        '#282a35',
        '#6e0000',
        '#027d50',
        '#00104a',
      ]
      return cores[this.agrupamento.length % cores.length]
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
      const tit = Object.values(objeto).slice(0, 3)
      return tit.join(' · ')
    }
  }
}
</script>

<style scoped>
.grafico {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: white;
}
.elemento {
  padding: 7px;
  margin: 4px;
  border-radius: 7px;
}
</style>