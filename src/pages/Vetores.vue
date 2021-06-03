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
      <input v-model="filtro" class="filtro" placeholder="filtrar vetores"/>
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
    <div v-if="vetores" class="vetores" 
        ref="vetores"
        @scroll="vetoresScroll">
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
  name: 'VetoresView',
  components: {
    VetorComponent
  },
  data () {
    return {
      conjuntos: null,
      vetores: null,
      vetoresTime: null,

      filtro: '',
      limite: 10,
    }
  },
  computed: {
    sliced () {
      return this.filtrados.slice(0, this.limite)
    },
    filtrados () {
      const valor = this.filtro
      const vetores = this.vetores
      const resultado = []
      for (let i=0; i<vetores.length; ++i) {
        if (vetores[i].string.includes(valor)) {
          resultado.push(vetores[i])
        }
      }
      return resultado
    },
  },
  methods: {
    vetoresScroll (ev) {
      const target = ev.target
      if (target.scrollHeight == target.scrollTop + target.clientHeight) {
        this.limite = this.limite + 30
      }
    },
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
      this.vetores = null
      VetoresDAO.apagar()
    },

    carregarConjuntos() {
      ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))
      .then(conjuntos => {
        this.conjuntos = conjuntos
        this.carregarVetores()
      })
    },
    carregarVetores () {
      VetoresDAO.get()
      .then(vetores => Vetores.linkar(vetores, this.conjuntos))
      .then(vetores => {
        for (let i=0; i<vetores.length; ++i) {
          vetores[i].string = JSON.stringify(vetores[i].objetos)
        }
        this.vetores = vetores
      })
    },
  },
  mounted () {
    this.carregarConjuntos()
  },
  updated () {
    const target = this.$refs.vetores
    if (target
    && target.scrollHeight == target.scrollTop + target.clientHeight
    && this.vetores.length > this.limite) {
      this.limite = this.limite + 20
    }
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
  padding-bottom: 10px;
}
.vetor {
  margin: 0px 10px 5px 10px;
}
</style>