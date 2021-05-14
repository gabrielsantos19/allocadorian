<template>
  <q-page class="col">
    <button @click="gerar()">Gerar</button>
    <button @click="compilar()">Compilar</button>
    <button @click="gerarObrigatoriedades()">Obri</button>
    {{vetores ? vetores.length : 0}} vetores
    {{vetoresTime ? `gerados em ${vetoresTime} milisegundos` : 'carregados'}}
    {{conjuntos ? `${conjuntos.length} conjuntos carregados` : ''}}
    <div v-if="vetores" class="row">
      <div v-for="(vetor, index) in sliced" :key="index">
        <vetor-component :vetor="vetor" />
      </div>
    </div>
  </q-page>
</template>

<script>
import VetorComponent from 'src/components/Vetor.vue'
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'

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
        return this.vetores.slice(0, 30)
      else
        return []
    }
  },
  methods: {
    gerarObrigatoriedades () {
      Vetor.gerarObrigatoriedades(this.vetores, this.conjuntos)
      .then(o => console.log(o))
    },
    gerar () {
      const t0 = performance.now()
      Vetor.cartesiano(this.conjuntos)
      .then(vetores => Vetor.linkarVetores(vetores, this.conjuntos))
      .then(linkados => {
        this.vetores = linkados
        this.vetoresTime = performance.now() - t0
      })
    },
    compilar () {
      Conjunto.getConjuntos()
      .then(conjuntos => Conjunto.compilarConjuntos(conjuntos))
      .then(val => Conjunto.parseCompilados(val))
      .then(parsed => this.conjuntos = parsed)
    }
  },
  mounted () {
    Conjunto.getConjuntosCompilados()
    .then(compilados => Conjunto.parseCompilados(compilados))
    .then(parsed => {
      this.conjuntos = parsed

      Vetor.getVetores()
      .then(vetores => Vetor.linkarVetores(vetores, parsed))
      .then(linkados => this.vetores = linkados)
    })
  }
}
</script>