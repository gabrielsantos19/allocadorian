<template>
  <div class="container" style="overflow: auto;">
    <div class="info">
      <div>
        {{personalizadaP}} pontos
      </div>
      <div>
        {{personalizadaI ? personalizadaI.length : 0}} vetores
      </div>
    </div>

    <div class="flex" style="overflow: auto;">
      <grafico-component v-if="personalizadaVetores"
      :agrupamento="[0,1,2]"
      :vetores="personalizadaVetores" />
    </div>

    <div class="column no-wrap">
      <div class="column">
        <input />
      </div>

      <div class="column no-wrap" style="overflow: auto;">
        <div v-for="(vetor, index) in vetoresSlice" :key="index" class="flex no-wrap q-px-sm" style="align-items: center;">
          <input type="checkbox" :value="index" v-model="personalizadaI" />
          <vetor-component :vetor="vetor" class="vetor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as PersonalizadaDAO from 'src/lib/DAO/personalizadaDAO.js'

import * as Conjuntos from 'src/lib/conjuntos.js'
import * as Vetores from 'src/lib/vetores.js'
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
  computed: {
    vetoresSlice () {
      if (this.vetores) {
        return this.vetores.slice(0, 20)
      }
      return []
    }
  },
  watch: {
    personalizadaI () {
      async function construir (i, vetores, conjuntos) {
        const nova = {i: i}
        nova.compilada = await Solucao.compilar(nova, vetores)
        nova.p = await Solucao.pontuarSolucao(nova, vetores, conjuntos)
        nova.vetores = await Solucao.linkar(nova, vetores)

        return nova
      }
      construir(this.personalizadaI, this.vetores, this.conjuntos)
      .then(s => {
        this.personalizadaP = s.p
        this.personalizadaVetores = s.vetores
      })
    },
  },
  mounted () {
    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetores.compilar(vetores, conjuntos))
      .then(vetores => Vetores.linkar(vetores, conjuntos))

      const personalizada = await PersonalizadaDAO.get()
      personalizada.vetores = await Solucao.linkar(personalizada, vetores)

      return [conjuntos, vetores, personalizada]
    }
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.personalizadaI = a[2].i
      this.personalizadaP = a[2].p
      this.personalizadaVetores = a[2].vetores
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
  position: absolute;
}
.info div {
  margin: 5px;
  padding: 5px;
  border-radius: 7px;
  color: white;
  background-color: grey;
}
.vetor {
  margin: 5px;
}
</style>