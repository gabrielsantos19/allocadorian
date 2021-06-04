<template>
  <div class="container">
    <div class="solucao">
      <div class="barra">
        <span class="barra-h1">Personalizada</span>
        <button class="barra-opcao" @click="limpar">Limpar</button>
        <input v-model="solucaoFiltro"
          class="barra-filtro" 
          placeholder="filtrar solução" />
        <span class="barra-h2" v-if="agrupamento.length > 0">Agrupamento</span>
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

      <div class="painel">
        <div class="info">
          <span>{{personalizadaI ? personalizadaI.length : 0}} vetores</span>
        </div>
        <div v-for="(value, key) in personalizadaP" class="info" :key="key">
          <span :title="value">{{key}}: {{value}}</span>
        </div>
        <div v-if="!valida" class="erro">
          <span>{{erro}}</span>
        </div>
      </div>

      <grafico-component v-if="personalizadaVetores"
        class="grafico"
        :agrupamento="agrupamento"
        :vetores="solucaoFiltrados" />
    </div>

    <div class="coluna-vetores">
      <div class="filtro-vetor">
        <input v-model="vetoresFiltro" placeholder="filtrar vetores"/>
      </div>

      <div class="vetores" ref="vetores" @scroll="vetoresScroll">
        <div v-for="objeto in vetoresSliced" 
            :key="objeto.origem"
            class="svetor" 
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
      personalizadaVetores: null,
      personalizadaP: null,
      valida: null,
      erro: null,

      solucaoFiltro: '',
      agrupamento: [],

      vetoresFiltro: '',
      vetoresLimite: 10,
    }
  },
  computed: {
    vetoresFiltrados () {
      const filtro = this.vetoresFiltro
      const vetores = this.vetores
      const resultado = []
      if (vetores) {
        for (let i=0; i<vetores.length; ++i) {
          const vetor = vetores[i]
          if (vetor.string.includes(filtro)) {
            resultado.push({
              origem: i,
              v: vetor
            })
          }
        }
      }
      return resultado
    },
    vetoresSliced () {
      return this.vetoresFiltrados.slice(0, this.vetoresLimite)
    },
    solucaoFiltrados () {
      const filtro = this.solucaoFiltro
      const vetores = this.personalizadaVetores
      const resultado = []
      if (vetores) {
        for (let i=0; i<vetores.length; ++i) {
          const vetor = vetores[i]
        if (vetor.string.includes(filtro)) {
          resultado.push(vetor)
          }
        }
      }
      return resultado
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
      this.atualizarPersonalizada()
    },
    vetoresScroll (ev) {
      const target = ev.target
      if (target.scrollHeight <= target.scrollTop + target.clientHeight) {
        this.vetoresLimite = this.vetoresLimite + 10
      }
    },
    limpar () {
      this.personalizadaI = []
      this.atualizarPersonalizada()
      PersonalizadaDAO.apagar()
    },

    atualizarPersonalizada () {
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

    carregarConjuntos () {
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
        return Solucao.linkar(p, this.vetores)
      })
      .then(link => {
        this.personalizadaVetores = link
        this.atualizarPersonalizada()
      })
    }
  },
  mounted () {
    this.carregarConjuntos()
  },
  updated () {
    const target = this.$refs.vetores
    if (target
    && target.scrollHeight <= target.scrollTop + target.clientHeight
    && this.vetoresFiltrados.length > this.vetoresLimite) {
      this.vetoresLimite = this.vetoresLimite + 10
    }
  },
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
  padding: 0px 10px;
  overflow: auto;
  background-color: rgb(130,130,130); 
}
.svetor {
  display: flex;
  flex-flow: row nowrap;
}
.vetor {
  margin: 5px;
}
</style>