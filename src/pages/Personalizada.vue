<template>
  <div class="container">
    <div class="solucao">
      <div class="menu">
        <span class="titulo">Personalizada</span>
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
        :vetores="personalizadaVetores" />
    </div>

    <div class="coluna-vetores">
      <div class="filtro-vetor">
        <input v-model="filtroVetores" />
      </div>

      <div class="vetores">
        <div v-for="objeto in vetoresRelevantes" 
            :key="objeto.origem"
            class="flex no-wrap q-px-sm" 
            style="align-items: center;">
          <input type="checkbox" 
            :checked="personalizadaI.includes(objeto.origem)"
            @click="(e) => vetorCheck(e, objeto.origem)" />
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
  name: 'Personalizada',
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
    }
  },
  computed: {
    vetoresRelevantes () {
      const vetores = this.vetores
      const filtroVetores = this.filtroVetores
      
      const limite = 50
      const resultado = []

      if (vetores) {
        let i=0
        while (i<vetores.length && resultado.length < limite) {
          const vetor = vetores[i]
          if (JSON.stringify(vetor).includes(filtroVetores)) {
            resultado.push({
              origem: i,
              v: vetor
            })
          }
          ++i
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
      })
    },
  },
  methods: {
    vetorCheck (ev, index) {
      const i = this.personalizadaI
      let o = 0
      while (o < i.length && i[o] < index) ++o
      if (ev.target.checked) {
        i.splice(o, 0, index)
      } else {
        i.splice(o, 1)
      }
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
    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetores.compilar(vetores, conjuntos))
      .then(vetores => Vetores.linkar(vetores, conjuntos))

      const obrigatoriedades = await Vetores.gerarObrigatoriedades(vetores, conjuntos)

      const personalizada = await PersonalizadaDAO.get()
      personalizada.vetores = await Solucao.linkar(personalizada, vetores)

      return [conjuntos, vetores, obrigatoriedades, personalizada]
    }
    
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.obrigatoriedades = a[2]
      this.personalizadaI = a[3].i
      this.personalizadaP = a[3].p
      this.personalizadaVetores = a[3].vetores

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
  position: absolute;
  top: 45px;
  left: 10px;
  display: flex;
  flex-flow: row;
  color: white;
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
  padding-top: 50px;
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