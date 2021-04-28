<template>
  <q-page class="col">
    Vetores
    <div v-for="(c, index) in conjuntos" :key="index">
      {{JSON.stringify(c)}}
    </div>
  </q-page>
</template>

<script>
import * as Conjunto from 'src/lib/conjunto.js'

export default {
  name: 'Vetores',
  data () {
    return {
      conjuntos: null
    }
  },
  methods: {
    
  },
  mounted () {
    this.conjuntos = Conjunto.getConjuntosCompilados()
  }
}
</script>