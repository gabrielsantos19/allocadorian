<template>
  <q-page class="col">
    <div>
      <button @click="gerarSolucoes()">Gerar Soluções</button>
      {{compilados ? compilados.length : '0'}} conjuntos carregados
      {{vetores ? vetores.length : '0'}} vetores carregados
      {{solucoes ? solucoes.length : '0'}} solucoes
    </div>
    <div v-if="solucoes">
      <div v-for="(solucao, index) in solucoes" :key="index">
        {{JSON.stringify(solucao)}}
      </div>
    </div>
  </q-page>
</template>

<script>
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'
import * as Solucao from 'src/lib/solucao.js'

export default {
  name: 'PageIndex',
  data () {
    return {
      compilados: null,
      vetores: null,
      solucoes: null
    }
  },
  methods: {
    gerarSolucoes () {
      Solucao.solucao2(this.vetores).then(solucoes => {
        this.solucoes = solucoes
      })
    }
  },
  mounted () {
    Solucao.getSolucoes().then(solucoes => {
      this.solucoes = solucoes
    })
    this.compilados = Conjunto.getConjuntosCompilados()
    Vetor.getVetores().then(vetores => {
      this.vetores = vetores
    })
  }
}
</script>
