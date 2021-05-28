<template>
  <div class="solucao">
    <div class="barra">
      <span class="titulo">Solução</span>
      <button @click="personalizar">
        Personalizar
      </button>
      <input
        class="filtro" 
        placeholder="filtrar vetores" />

      <button v-for="(i, index) in agrupamento" :key="i"
          :id="index"
          draggable="true"
          @dragstart="agrupamentoDragstart"
          @drop="agrupamentoDrop"
          @dragover="agrupamentoDragover">
        {{conjuntos[i].descricao.nome}}
      </button>
    </div>

    <grafico-component v-if="solucao"
      :agrupamento="agrupamento"
      :vetores="solucao.vetores" 
      class="grafico"/>
  </div>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'
import * as PersonalizadaDAO from 'src/lib/DAO/personalizadaDAO.js'

import * as Conjuntos from 'src/lib/conjuntos.js'
import * as Vetores from 'src/lib/vetores.js'
import * as Solucoes from 'src/lib/solucoes.js'

import GraficoComponent from 'src/components/Grafico.vue'


export default {
  name: 'Solucao',
  components: {
    GraficoComponent
  },
  data () {
    return {
      solucao: null,
      solucaoId: null,

      conjuntos: null,
      vetores: null,
      solucoes: null,

      agrupamento: null,
    }
  },
  methods: {
    personalizar () {
      PersonalizadaDAO.post(this.solucao)
      .then(this.$router.push('/personalizada'))
    },
    agrupamentoDragstart (ev) {
      ev.dataTransfer.setData('text', ev.target.id)
    },
    agrupamentoDrop (event) {
      event.preventDefault()
      const origem = event.dataTransfer.getData("text")
      const destino = event.target.id

      const agrup = this.agrupamento.slice()
      const temp = agrup[origem]
      agrup[origem] = agrup[destino]
      agrup[destino] = temp
      this.agrupamento = agrup
    },
    agrupamentoDragover (ev) {
      ev.preventDefault()
    },
  },
  mounted () {
    const id = this.$route.query.id
    if (isNaN(id)) {
      return
    }

    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetores.linkar(vetores, conjuntos))

      const solucoes = await SolucoesDAO.get()
      .then(solucoes => Solucoes.linkar(solucoes, vetores))

      return [conjuntos, vetores, solucoes]
    }
    
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.solucoes = a[2]
      if (id) {
        this.solucaoId = id
        this.solucao = a[2][id]
      }

      const agrup = []
      for (let i=0; i<a[0].length; ++i) {
        agrup.push(i)
      }
      this.agrupamento = agrup
    })
  }
}
</script>

<style scoped>
.solucao {
  display: flex;
  flex-flow: column nowrap;
  overflow: auto;
}
.barra {
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  min-height: 42px;
  align-items: center;
  color: white;
  background-color: rgb(40,40,40);
  overflow: auto;
}
.titulo {
  flex-shrink: 0;
  font-size: 22px;
  padding: 0px 15px 0px 15px;
  overflow: hidden;
}
.filtro {
  flex-grow: 1;
  max-width: 500px;
  min-width: 100px;
  margin: 0px 10px;
}
.grafico {
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: auto;
}
</style>