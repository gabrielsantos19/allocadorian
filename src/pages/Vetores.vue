<template>
  <q-page class="col">
    <button @click="gerar()">Gerar</button>
    <button @click="compilar()">Compilar</button>
    {{vetores ? vetores.length : 0}} vetores
    {{vetoresTime ? `gerados em ${vetoresTime} milisegundos` : 'carregados'}}
    <div v-if="vetores">
      <div v-for="(vetor, index) in vetores" :key="index">
        {{JSON.stringify(vetor)}}
      </div>
    </div>
  </q-page>
</template>

<script>
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'

export default {
  name: 'Vetores',
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
      Vetor.cartesiano(this.conjuntos).then(vetores => {
        this.vetores = vetores
        this.vetoresTime = performance.now() - t0
      })
    },
    compilar () {
      Conjunto.compilarConjuntos().then(val => {
        this.conjuntos = Conjunto.parseCompilados(val)
      })
    }
  },
  mounted () {
    Vetor.getVetores().then(vetores => {
      this.vetores = vetores
    })
  }
}
</script>