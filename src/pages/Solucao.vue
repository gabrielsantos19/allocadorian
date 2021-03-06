<template>
  <div class="solucao">
    <div class="barra">
      <span class="barra-h1">Solução</span>
      <button class="barra-opcao" @click="personalizar">
        Personalizar
      </button>
      <input
        v-model="solucaoFiltro"
        class="barra-filtro" 
        placeholder="filtrar vetores" />
      <span class="barra-h2">
        Agrupamento
      </span>
      <button v-for="(i, index) in agrupamento" :key="i"
          class="barra-opcao"
          :id="index"
          draggable="true"
          @dragstart="agrupamentoDragstart"
          @drop="agrupamentoDrop"
          @dragover="agrupamentoDragover">
        {{conjuntos[i].descricao.nome}}
      </button>
    </div>

    <div v-if="solucao" class="painel">
      <div class="info">
        <span>{{solucao.i.length}} vetores</span>
      </div>
      <div v-for="(value, key) in solucao.p" class="info" :key="key">
        <span :title="value">{{key}}: {{value}}</span>
      </div>
    </div>

    <grafico-component v-if="solucao"
      :agrupamento="agrupamento"
      :vetores="solucaoFiltrados" 
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
import * as Solucao from 'src/lib/solucao.js'

import GraficoComponent from 'src/components/Grafico.vue'


export default {
  name: 'SolucaoView',
  components: {
    GraficoComponent
  },
  data () {
    return {
      solucaoId: null,
      solucao: null,

      conjuntos: null,
      vetores: null,
      solucoes: null,

      solucaoFiltro: '',
      agrupamento: null,
    }
  },
  computed: {
    solucaoFiltrados () {
      const filtro = this.solucaoFiltro
      const solucao = this.solucao
      let vetores = []
      if (solucao) {
        vetores = solucao.vetores
      }
      
      const resultado = []
        for (let i=0; i<vetores.length; ++i) {
          const vetor = vetores[i]
          if (vetor.string.includes(filtro)) {
            resultado.push(vetor)
          }
        }
      return resultado
    },
  },
  watch: {
    conjuntos () {
      VetoresDAO.get()
      .then(vetores => Vetores.linkar(vetores, this.conjuntos))
      .then(vetores => Vetores.compilar(vetores, this.conjuntos))
      .then(vetores => {
        for (let i=0; i<vetores.length; ++i) {
          vetores[i].string = JSON.stringify(vetores[i].objetos)
        }
        this.vetores = vetores
      })
    },
    vetores () {
      SolucoesDAO.get()
      .then(solucoes => Solucoes.linkar(solucoes, this.vetores))
      .then(l => this.solucoes = l)
    },
    solucoes () {
      const solucoes = this.solucoes
      const id = this.solucaoId
      if (solucoes && id && solucoes.length > id) {
        this.solucao = solucoes[id]
      }
    },
    solucao () {
      Solucao.compilar(this.solucao, this.vetores)
      .then(c => {
        this.solucao.compilada = c
        Solucao.pontuarSolucao(this.solucao, this.vetores, this.conjuntos)
        .then(p => this.solucao.p = p)
      })
    },
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
    let id = this.$route.query.id
    if (isNaN(id) || id < 0) {
      id = null
      return
    }

    ConjuntosDAO.get()
    .then(conjuntos => Conjuntos.parse(conjuntos))
    .then(conjuntos => {
      const agrup = []
      for (let i=0; i<conjuntos.length; ++i) {
        agrup.push(i)
      }
      this.conjuntos = conjuntos
      this.agrupamento = agrup
      this.solucaoId = id
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
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: white;
  flex-shrink: 0;
  overflow: auto;
  background-color: rgb(40,40,40);
}
.barra-h1 {
  font-size: 23px;
  padding: 0px 15px;
}
.barra-h2 {
  font-size: 18px;
  padding: 0px 10px;
}
.barra-opcao {
  flex-shrink: 0;
  margin: 6px 0px;
  min-height: 30px;
}
.barra-filtro {
  flex-grow: 1;
  max-width: 500px;
  min-height: 30px;
  margin: 0px 10px;
}

.painel {
  display: flex;
  flex-flow: row wrap;
  font-size: 15px;
  color: white;
  padding: 0px 10px;
}
.info {
  padding: 7px;
  border-radius: 7px;
  background-color: grey;
  white-space: nowrap;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px 5px;
}
.erro {
  padding: 7px;
  border-radius: 7px;
  background-color: red;
  white-space: nowrap;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px 5px;
}

.grafico {
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: auto;
}
</style>