<template>
  <main class="container">
    <div class="menu">
      <span class="titulo">
        Vetores
      </span>
      <div>
        <button @click="gerar()">Gerar vetores</button>
      </div>
      <div>
        <button @click="limpar">Limpar</button>
      </div>
      <input class="filtro" placeholder="filtrar vetores"/>
      <div>
        <span>
          {{conjuntos ? conjuntos.length : 0}} conjuntos carregados
        </span>
        <span>
          {{vetores ? vetores.length : 0}} vetores
        </span>
        <span v-if="vetoresTime">
          gerados em {{vetoresTime}} milisegundos
        </span>
      </div>
    </div>
    <div v-if="vetores" class="vetores">
      <div v-for="(vetor, index) in sliced" :key="index">
        <vetor-component :vetor="vetor" class="vetor" />
      </div>
    </div>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'

import * as Conjuntos from 'src/lib/conjuntos.js'
import * as Vetores from 'src/lib/vetores.js'

import VetorComponent from 'src/components/Vetor.vue'


export default {
  name: 'Vetores',
  components: {
    VetorComponent
  },
  data () {
    return {
      conjuntos: null,
      vetores: null,
      vetoresTime: null,
    }
  },
  computed: {
    sliced () {
      if (this.vetores)
        return this.vetores.slice(0, 100)
      else
        return []
    }
  },
  methods: {
    gerar () {
      const t0 = performance.now()
      Vetores.cartesiano(this.conjuntos)
      .then(vetores => {
        VetoresDAO.post(vetores)
        
        Vetores.linkar(vetores, this.conjuntos)
        .then(linkados => {
          this.vetores = linkados
          this.vetoresTime = performance.now() - t0
        })
      })
    },
    limpar () {
      this.vetores = []
      VetoresDAO.post([])
    },

    carregarVetores () {
      VetoresDAO.get()
      .then(vetores => Vetores.linkar(vetores, this.conjuntos))
      .then(vetores => this.vetores = vetores)
    },
  },
  mounted () {
    ConjuntosDAO.get()
    .then(conjuntos => Conjuntos.parse(conjuntos))
    .then(conjuntos => {
      this.conjuntos = conjuntos
      this.carregarVetores()
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: auto;
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
  flex-shrink: 0;
  font-size: 22px;
  padding: 0px 15px 0px 15px;
  overflow: hidden;
}
.filtro {
  flex-grow: 1;
  max-width: 500px;
  margin: 0px 10px;
}
.vetores {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  padding-top: 10px;
  padding-bottom: 300px;
}
.vetor {
  margin: 0px 10px 5px 10px;
}
</style>