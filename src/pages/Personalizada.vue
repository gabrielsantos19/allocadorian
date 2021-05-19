<template>
  <div class="container">
    {{personalizadaI}}
    <div>
      <grafico-component v-if="personalizada"
      :agrupamento="[0,1,2]"
      :vetores="personalizada.vetores" />
    </div>

    <div class="column">
      <div v-for="(vetor, index) in vetores" :key="index" class="flex no-wrap">
        <input type="checkbox" :value="index" v-model="personalizadaI"/>
        <vetor-component :vetor="vetor" />
      </div>
    </div>
  </div>
</template>

<script>
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'
import * as Solucao from 'src/lib/solucao.js'
import GraficoComponent from 'src/components/Grafico.vue'
import VetorComponent from 'src/components/Vetor.vue'

export default {
  name: 'Solucao',
  components: {
    GraficoComponent,
    VetorComponent
  },
  data () {
    return {
      conjuntos: null,
      vetores: null,
      personalizadaI: [],
      personalizada: null
    }
  },
  watch: {
    personalizadaI () {
      const pers = {i: this.personalizadaI}
      Solucao.linkar(pers, this.vetores)
      .then(link => {
        pers.vetores = link
        this.personalizada = pers
      })
    }
  },
  methods: {
    carregarVetores () {
      Vetor.getVetores()
      .then(vetores => Vetor.linkarVetores(vetores, this.conjuntos))
      .then(linkados => {
        this.vetores = linkados
        this.carregarPersonalizada()
      })
    },
    carregarPersonalizada () {
      const raw = localStorage.getItem('personalizada')
      const pers = JSON.parse(raw)
      this.personalizadaI = pers.i
    }
  },
  mounted () {
    Conjunto.getConjuntos()
    .then(conjuntos => Conjunto.parseConjuntos(conjuntos))
    .then(parsed => {
      this.conjuntos = parsed.map(c => c.objetos)
      this.carregarVetores()
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
</style>