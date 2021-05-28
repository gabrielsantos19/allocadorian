<template>
  <main class="column no-wrap" style="overflow: auto;">
    <div class="menu">
      <span class="titulo">
        Soluções
      </span>
      <button @click="gerar()">
        Gerar soluções
      </button>
      <input class="filtro" placeholder="filtrar soluções" />
      <div>
        {{vetores ? vetores.length : '0'}} vetores carregados; 
        {{solucoes ? solucoes.length : '0'}} solucoes
        {{tSolucoes ? `em ${tSolucoes}ms` : ''}}
      </div>
    </div>
    <div v-if="sliced" class="solucoes">
      <div v-for="(solucao, index) in sliced" :key="index">
        <solucao-component 
          :solucao="solucao" 
          @click="$router.push('/solucao?id='+index)"/>
      </div>
    </div>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'

import * as Conjuntos from 'src/lib/conjuntos.js'
import * as Vetores from 'src/lib/vetores.js'
import * as Solucoes from 'src/lib/solucoes.js'

import SolucaoComponent from 'src/components/Solucao.vue'


export default {
  name: 'SolucoesView',
  components: {
    SolucaoComponent
  },
  data () {
    return {
      conjuntos: null,
      vetores: null,
      solucoes: null,
      tSolucoes: null,
    }
  },
  computed: {
    sliced: function () {
      if (this.solucoes) {
        return this.solucoes.slice(0, 60)
      }
      return []
    },
  },
  methods: {
    gerar () {
      if (this.conjuntos && this.vetores) {
        const t0 = performance.now()

        this.solucoes = null
        Solucoes.solucao(this.vetores, this.conjuntos)
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
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(linkados => Vetores.compilar(linkados, conjuntos))

      const solucoes = await SolucoesDAO.get()
      
      return [conjuntos, vetores, solucoes]
    }
    
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.solucoes = a[2]
    })
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: white;
  min-height: 42px;
  max-height: 42px;
  flex-shrink: 0;
  background-color: rgb(40,40,40);
}
.titulo {
  font-size: 22px;
  padding: 0px 15px 0px 15px;
  overflow: hidden;
}
.filtro {
  flex-grow: 1;
  max-width: 500px;
  margin: 0px 10px;
}
.solucoes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  padding-top: 10px;
  padding-bottom: 300px;
}
</style>