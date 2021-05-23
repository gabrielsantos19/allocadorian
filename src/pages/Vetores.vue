<template>
  <main class="column no-wrap" style="overflow: auto; background-color: #162447;">
    <div>
      <button @click="gerar()">Gerar vetores</button>
      <button @click="gerarObrigatoriedades()">Obrigatoriedades</button>
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
    gerarObrigatoriedades () {
      Vetores.gerarObrigatoriedades(this.vetores, this.conjuntos)
      .then(o => console.log(o))
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
  },
  mounted () {
    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetores.linkar(vetores, conjuntos))

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