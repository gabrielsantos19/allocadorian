<template>
  <main class="column no-wrap" style="overflow: auto; background-color: #162447;">
    <div>
      <button @click="gerar()">Gerar vetores</button>
      <button @click="gerarObrigatoriedades()">Obrigatoriedades</button>
      <button @click="compilar()">Compilar conjuntos</button>
      {{vetores ? vetores.length : 0}} vetores
      {{vetoresTime ? `gerados em ${vetoresTime} milisegundos` : 'carregados'}}
      {{conjuntos ? `${conjuntos.length} conjuntos carregados` : ''}}
    </div>
    <div v-if="vetores" class="row">
      <div v-for="(vetor, index) in sliced" :key="index">
        <vetor-component :vetor="vetor" class="vetor" />
      </div>
    </div>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as CompiladosDAO from 'src/lib/DAO/compiladosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'

import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'

import VetorComponent from 'src/components/Vetor.vue'


export default {
  name: 'Vetores',
  components: {
    VetorComponent
  },
  data () {
    return {
      conjuntos: null,
      compilados: null,
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
    gerarObrigatoriedades () {
      Vetor.gerarObrigatoriedades(this.vetores, this.compilados)
      .then(o => console.log(o))
    },
    gerar () {
      const t0 = performance.now()
      Vetor.cartesiano(this.compilados)
      .then(vetores => Vetor.linkarVetores(vetores, this.conjuntos))
      .then(linkados => {
        this.vetores = linkados
        this.vetoresTime = performance.now() - t0
      })
    },
    compilar () {
      ConjuntosDAO.get()
      .then(conjuntos => Conjunto.compilarConjuntos(conjuntos))
      .then(compilados => {
        CompiladosDAO.post(compilados)

        Conjunto.parseCompilados(compilados)
        .then(parsed => this.compilados = parsed)
      })
    }
  },
  mounted () {
    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjunto.parseConjuntos(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetor.linkarVetores(vetores, conjuntos))

      return [conjuntos, vetores]
    }

    carregar().then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
    })
  }
}
</script>

<style scoped>
.vetor {
  margin: 0px 10px 5px 10px;
}
</style>