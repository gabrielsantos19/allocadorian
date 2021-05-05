<template>
  <q-page class="col">
    <div>
      <button @click="gerarSolucoes()">Gerar Soluções</button>
      {{compilados ? compilados.length : '0'}} conjuntos carregados
      {{vetores ? vetores.length : '0'}} vetores carregados
      {{solucoes ? solucoes.length : '0'}} solucoes
      {{tSolucoes ? `em ${tSolucoes}ms` : ''}}
    </div>
    <div v-if="sliced" class="row">
      <div v-for="(solucao, index) in sliced" :key="index">
        <solucao-component 
          :solucao="solucao" 
          @click="$router.push('/solucao?id='+index)"/>
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
      solucoes: null,
      tSolucoes: null
    }
  },
  computed: {
    sliced: function () {
      if (this.solucoes) {
        return this.solucoes.slice(0, 25)
      }
      return []
    }
  },
  methods: {
    gerarSolucoes () {
      if (this.compilados && this.vetores) {
        const t0 = performance.now()

        this.solucoes = null
        Solucao.solucao(this.vetores, this.compilados)
        .then(solucoes => Solucao.linkarSolucoes(solucoes, this.vetores))
        .then(linkados => {
          this.solucoes = linkados
          this.tSolucoes = performance.now() - t0
        })
      }
    },
    carregarVetores () {
      Vetor.getVetores()
      .then(vetores => Vetor.linkarVetores(vetores, this.compilados))
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
