<template>
  <div class="container">
    <div class="info">
      <div>
        {{personalizadaP}} pontos
      </div>
      <div>
        {{personalizadaI ? personalizadaI.length : 0}} vetores
      </div>
    </div>

    <div style="margin-top: 50px;">
      <grafico-component v-if="personalizadaVetores"
      :agrupamento="[0,1,2]"
      :vetores="personalizadaVetores" />
    </div>

    <div class="column">
      <div>
        <input />
      </div>

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
      personalizadaVetores: [],
      personalizadaP: null
    }
  },
  watch: {
    personalizadaI () {
      async function construir (i, vetores, conjuntos) {
        const pers = {i: i}
        pers.compilada = await Solucao.compilarSolucao(pers, vetores)
        pers.p = await Solucao.pontuarSolucao(pers, vetores, conjuntos)
        pers.vetores = await Solucao.linkar(pers, vetores)

        return pers
      }
      construir(this.personalizadaI, this.vetores, this.conjuntos)
      .then(s => {
        this.personalizadaP = s.p
        this.personalizadaVetores = s.vetores
      })
    },
  },
  methods: {
    carregarVetores () {
      Vetor.getVetores()
      .then(vetores => Vetor.compilarVetores(vetores, this.conjuntos))
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
      this.personalizadaP = pers.p
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
.info {
  top: 30px;
  position: fixed;
}
.info div {
  margin: 5px;
  padding: 5px;
  border-radius: 7px;
  color: white;
  background-color: grey;
}
</style>