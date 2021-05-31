<template>
  <div class="container">
    <div class="solucao">
      <div class="menu">
        <span class="titulo">Personalizada</span>
        <button @click="limpar">Limpar</button>
        <input v-model="filtroSolucao"
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

      <div class="painel">
        <div class="info">
          <span>{{personalizadaP}} pontos</span>
        </div>
        <div class="info">
          <span>{{personalizadaI ? personalizadaI.length : 0}} vetores</span>
        </div>
        <div v-if="!valida" class="erro">
          <span>{{erro}}</span>
        </div>
      </div>

      <grafico-component v-if="personalizadaVetores"
        class="grafico"
        :agrupamento="agrupamento"
        :vetores="solucaoRelevantes" />
    </div>

    <div class="coluna-vetores">
      <div class="filtro-vetor">
        <input v-model="filtroVetores" />
      </div>

      <div class="vetores">
        <div v-for="objeto in vetoresRelevantesSliced" 
            :key="objeto.origem"
            class="flex no-wrap q-px-sm" 
            style="align-items: center;"
            @click="vetorCheck(objeto.origem)">
          <input type="checkbox" 
            :checked="personalizadaI.includes(objeto.origem)" />
          <vetor-component :vetor="objeto.v" class="vetor" />
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
import * as Obrigatoriedades from 'src/lib/obrigatoriedades.js'
import * as Solucao from 'src/lib/solucao.js'

import GraficoComponent from 'src/components/Grafico.vue'
import VetorComponent from 'src/components/Vetor.vue'


export default {
  name: 'PersonalizadaView',
  components: {
    GraficoComponent,
    VetorComponent
  },
  data () {
    return {
      conjuntos: null,
      vetores: null,
      obrigatoriedades: null,

      personalizadaI: [],
      personalizadaVetores: [],
      personalizadaP: null,
      valida: null,
      erro: null,

      filtroSolucao: '',
      agrupamento: [],

      filtroVetores: '',
      vetoresRelevantesLimite: 25,
    }
  },
  computed: {
    vetoresRelevantes () {
      const vetores = this.vetores
      const filtroVetores = this.filtroVetores
      const resultado = []

      if (vetores) {
        for (let i=0; i<vetores.length; ++i) {
          const vetor = vetores[i]
          if (vetor.string.includes(filtroVetores)) {
            resultado.push({
              origem: i,
              v: vetor
            })
          }
        }
      }
      return resultado
    },
    vetoresRelevantesSliced () {
      return this.vetoresRelevantes.slice(0, this.vetoresRelevantesLimite)
    },
    solucaoRelevantes () {
      const vetores = this.personalizadaVetores
      const filtroSolucao = this.filtroSolucao
      const resultado = []
      for (let i=0; i<vetores.length; ++i) {
        const vetor = vetores[i]
        if (vetor.string.includes(filtroSolucao)) {
          resultado.push(vetor)
        }
      }
      return resultado
    },
  },
  watch: {
    personalizadaI () {
      async function construir (i, obrigatoriedades, vetores, conjuntos) {
        const nova = {i: i}
        nova.compilada = await Solucao.compilar(nova, vetores)
        nova.p = await Solucao.pontuarSolucao(nova, vetores, conjuntos)
        nova.vetores = await Solucao.linkar(nova, vetores)

        let valida = Solucao.filtrarSolucao(nova, vetores, conjuntos)
        if (valida.valor) {
          valida = await Obrigatoriedades.filtrar(nova, obrigatoriedades)
        }

        return [nova, valida]
      }

      construir(this.personalizadaI, this.obrigatoriedades, this.vetores, this.conjuntos)
      .then(s => {
        this.personalizadaP = s[0].p
        this.personalizadaVetores = s[0].vetores
        this.valida = s[1].valor
        this.erro = s[1].erro
        PersonalizadaDAO.post({
          i: this.personalizadaI,
          p: s[0].p,
        })
      })
    },
  },
  methods: {
    vetorCheck (index) {
      const i = this.personalizadaI
      let o = 0
      while (o < i.length && i[o] < index) ++o
      if (i[o] == index) {
        i.splice(o, 1)
      } else {
        i.splice(o, 0, index)
      }
    },
    limpar () {
      this.personalizadaI = []
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

    carregarVetores () {
      VetoresDAO.get()
      .then(vetores => Vetores.compilar(vetores, this.conjuntos))
      .then(vetores => Vetores.linkar(vetores, this.conjuntos))
      .then(vetores => {
        for (let i=0; i<vetores.length; ++i) {
          vetores[i].string = JSON.stringify(vetores[i].objetos)
        }
        this.vetores = vetores

        this.carregarObrigatoriedades()
        this.carregarPersonalizada()
      })
    },
    carregarObrigatoriedades () {
      Vetores.gerarObrigatoriedades(this.vetores, this.conjuntos)
      .then(os => this.obrigatoriedades = os)
    },
    carregarPersonalizada () {
      PersonalizadaDAO.get()
      .then(p => {
        this.personalizadaI = p.i
        this.personalizadaP = p.p
        Solucao.linkar(p, this.vetores)
      })
      .then(link => {
        this.personalizadaVetores = link
      })
    }
  },
  mounted () {
    ConjuntosDAO.get()
    .then(conjuntos => Conjuntos.parse(conjuntos))
    .then(conjuntos => {
      this.conjuntos = conjuntos

      const agrup = []
      for (let i=0; i<conjuntos.length; ++i) {
        agrup.push(i)
      }
      this.agrupamento = agrup
      this.carregarVetores()
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  overflow: auto;
}
.solucao {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}
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

.painel {
  display: flex;
  flex-flow: row;
  color: white;
  padding: 3px 10px;
}
.info {
  margin-right: 5px;
  padding: 5px;
  border-radius: 7px;
  background-color: grey;
}
.erro {
  margin-right: 5px;
  padding: 5px;
  border-radius: 7px;
  background-color: red;
}

.grafico {
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: auto;
}

.coluna-vetores {
  display: flex;
  flex-flow: column nowrap;
  min-width: 350px;
}
.filtro-vetor {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  min-height: 42px;
  padding: 0px 5px;
  background-color: rgb(40, 40, 40);
}
.vetores {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  overflow: auto;
  background-color: rgb(130,130,130); 
}
.vetor {
  margin: 5px;
}
</style>