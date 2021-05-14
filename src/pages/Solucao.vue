<template>
  <div>
    <grafico-component v-if="solucao"
      :agrupamento="[0,1,2]"
      :vetores="solucao.vetores" />
  </div>
</template>

<script>
import * as Conjunto from 'src/lib/conjunto.js'
import * as Vetor from 'src/lib/vetor.js'
import * as Solucao from 'src/lib/solucao.js'
import GraficoComponent from 'src/components/Grafico.vue'

export default {
  name: 'Solucao',
  components: {
    GraficoComponent
  },
  data () {
    return {
      solucao: null,
      solucaoId: null,

      conjuntos: null,
      vetores: null,
      solucoes: null
    }
  },
  methods: {
    carregarVetores () {
      Vetor.getVetores()
      .then(vetores => Vetor.linkarVetores(vetores, this.conjuntos))
      .then(linkados => {
        this.vetores = linkados
        this.carregarSolucoes()
      })
    },
    carregarSolucoes () {
      Solucao.getSolucoes()
      .then(solucoes => Solucao.linkarSolucoes(solucoes, this.vetores))
      .then(linkados => {
        this.solucoes = linkados
        if (this.solucaoId) {
          this.solucao = this.solucoes[this.solucaoId]
          this.solucao.vetores.reverse()
        }
      })
    }
  },
  mounted () {
    const id = this.$route.query.id

    if (!isNaN(id)) {
      this.solucaoId = id

      Conjunto.getConjuntos()
      .then(conjuntos => Conjunto.parseConjuntos(conjuntos))
      .then(parsed => {
        this.conjuntos = parsed.map(c => c.objetos)
        this.carregarVetores()
      })
    }
  }
}
</script>

<style scoped>
</style>