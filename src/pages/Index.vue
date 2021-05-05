<template>
  <q-page class="col">
    <div>
      <button @click="gerarSolucoes()">Gerar Soluções</button>
      {{compilados ? compilados.length : '0'}} conjuntos carregados
      {{vetores ? vetores.length : '0'}} vetores carregados
      {{solucoes ? solucoes.length : '0'}} solucoes
    </div>
    <div v-if="solucoes" class="row">
      <div v-for="(solucao, index) in solucoes" :key="index">
        <solucao-component :solucao="solucao" />
      </div>
    </div>
  </q-page>
</template>

<script>
import SolucaoComponent from 'src/components/Solucao.vue'
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'
import * as Solucao from 'src/lib/solucao.js'

export default {
  name: 'PageIndex',
  components: {
    SolucaoComponent
  },
  data () {
    return {
      compilados: null,
      vetores: null,
      solucoes: null
    }
  },
  methods: {
    gerarSolucoes () {
      if (this.compilados && this.vetores) {
        this.solucoes = null
        Solucao.solucao(this.vetores, this.compilados)
        .then(solucoes => Solucao.linkarSolucoes(solucoes, this.vetores))
        .then(linkados => this.solucoes = linkados)
      }
    },
    carregarVetores () {
      Vetor.getVetores()
      .then(vetores => Vetor.compilarVetores(vetores, this.compilados))
      .then(compilados => Vetor.linkarVetores(compilados, this.compilados))
      .then(linkados => {
        this.vetores = linkados
        this.carregarSolucoes()
      })
    },
    carregarSolucoes () {
      Solucao.getSolucoes()
      .then(solucoes => Solucao.linkarSolucoes(solucoes, this.vetores))
      .then(linkados => this.solucoes = linkados)
    }
  },
  mounted () {
    Conjunto.getConjuntosCompilados()
    .then(compilados => Conjunto.parseCompilados(compilados))
    .then(parsed => {
      this.compilados = parsed
      this.carregarVetores()
    })
  }
}
</script>
