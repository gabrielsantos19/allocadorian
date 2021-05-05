<template>
  <q-page class="col">
    <button @click="gerar()">Gerar</button>
    <button @click="compilar()">Compilar</button>
    {{vetores ? vetores.length : 0}} vetores
    {{vetoresTime ? `gerados em ${vetoresTime} milisegundos` : 'carregados'}}
    <div v-if="vetores" class="row">
      <div v-for="(vetor, index) in vetores" :key="index">
        <vetor-component :vetor="vetor" />
      </div>
    </div>
  </q-page>
</template>

<script>
import VetorComponent from 'src/components/Vetor.vue'
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'
import { parse } from 'src/lib/JSP'

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
  methods: {
    gerar () {
      const t0 = performance.now()
      Vetor.cartesiano(this.conjuntos)
      .then(vetores => Vetor.compilarVetores(vetores, this.conjuntos))
      .then(compilados => {
        this.vetores = compilados
        this.vetoresTime = performance.now() - t0
      })
    },
    compilar () {
      Conjunto.compilarConjuntos()
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
      .then(vetores => Vetor.compilarVetores(vetores, parsed))
      .then(compilados => Vetor.linkarVetores(compilados, parsed))
      .then(linkados => this.vetores = linkados)
    })
  }
}
</script>