<template>
  <main class="column no-wrap" style="overflow: auto;">
    <div>
      <button @click="gerarSolucoes()">Gerar Soluções</button>
      <button @click="gerarArvore()">Gerar Árvore</button>
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
  </main>
</template>

<script>
import * as CompiladosDAO from 'src/lib/DAO/compiladosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'

import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'
import * as Solucao from 'src/lib/solucao.js'

import SolucaoComponent from 'src/components/Solucao.vue'


export default {
  name: 'SolucoesView',
  components: {
    SolucaoComponent
  },
  data () {
    return {
      compilados: null,
      vetores: null,
      solucoes: null,
      tSolucoes: null,
    }
  },
  computed: {
    sliced: function () {
      if (this.solucoes) {
        return this.solucoes.slice(0, 25)
      }
      return []
    },
  },
  methods: {
    gerarArvore () {
      Solucao.gerarArvore(this.vetores, this.compilados)
    },
    gerarSolucoes () {
      if (this.compilados && this.vetores) {
        const t0 = performance.now()

        this.solucoes = null
        Solucao.solucao(this.vetores, this.compilados)
        .then(sols => {
          SolucoesDAO.post(sols)
          this.solucoes = sols
          this.tSolucoes = performance.now() - t0
        })
      }
    },
  },
  mounted () {
    async function carregar () {
      const parsed = await CompiladosDAO.get()
      .then(compilados => Conjunto.parseCompilados(compilados))

      const vetores = await VetoresDAO.get()
      .then(linkados => Vetor.compilarVetores(linkados, parsed))

      const solucoes = await SolucoesDAO.get()
      
      return [parsed, vetores, solucoes]
    }
    
    carregar()
    .then(a => {
      this.compilados = a[0]
      this.vetores = a[1]
      this.solucoes = a[2]
    })
  }
}
</script>
