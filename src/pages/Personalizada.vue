<template>
  <div class="container">
    <div class="solucao">
      <div class="menu">
        <span class="titulo">Personalizada</span>
        <input v-model="filtroSolucao"
          class="filtro" 
          placeholder="filtrar vetores" />
        <input v-model="agrupamento" />
      </div>

      <div class="painel">
        <div class="info">
          <span>{{personalizadaP}} pontos</span>
        </div>
        <div class="info">
          <span>{{personalizadaI ? personalizadaI.length : 0}} vetores</span>
        </div>
        <span class="erro" v-if="!valida">Solução inválida</span>
      </div>

      <grafico-component v-if="personalizadaVetores"
        class="grafico"
        :agrupamento="JSON.parse(agrupamento)"
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
          <input type="checkbox" :value="objeto.origem" v-model="personalizadaI" />
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

      personalizadaI: [],
      personalizadaVetores: [],
      personalizadaP: null,
      valida: null,

      filtroSolucao: '',
      agrupamento: '[0, 1, 2]',
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
      async function construir (i, vetores, conjuntos) {
        const nova = {i: i}
        nova.compilada = await Solucao.compilar(nova, vetores)
        nova.p = await Solucao.pontuarSolucao(nova, vetores, conjuntos)
        nova.vetores = await Solucao.linkar(nova, vetores)

        const valida = Solucao.filtrarSolucao(nova, vetores, conjuntos)

        return [nova, valida]
      }

      construir(this.personalizadaI, this.vetores, this.conjuntos)
      .then(s => {
        this.personalizadaP = s[0].p
        this.personalizadaVetores = s[0].vetores
        this.valida = s[1]
      })
    },
  },
  mounted () {
    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetores.compilar(vetores, conjuntos))
      .then(vetores => Vetores.linkar(vetores, conjuntos))

      const personalizada = await PersonalizadaDAO.get()
      personalizada.vetores = await Solucao.linkar(personalizada, vetores)

      return [conjuntos, vetores, personalizada]
    }
    
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.personalizadaI = a[2].i
      this.personalizadaP = a[2].p
      this.personalizadaVetores = a[2].vetores
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