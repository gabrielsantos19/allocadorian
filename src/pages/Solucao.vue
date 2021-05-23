<template>
  <div class="flex" style="overflow: auto;">
    <grafico-component v-if="solucao"
      :agrupamento="[2,1,0]"
      :vetores="solucao.vetores" />
  </div>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'

import * as Conjuntos from 'src/lib/conjuntos.js'
import * as Vetores from 'src/lib/vetores.js'
import * as Solucoes from 'src/lib/solucoes.js'

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
  mounted () {
    const id = this.$route.query.id
    if (isNaN(id)) {
      return
    }

    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      .then(conjuntos => Conjuntos.parse(conjuntos))

      const vetores = await VetoresDAO.get()
      .then(vetores => Vetores.linkar(vetores, conjuntos))

      const solucoes = await SolucoesDAO.get()
      .then(solucoes => Solucoes.linkar(solucoes, vetores))

      return [conjuntos, vetores, solucoes]
    }
    
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.solucoes = a[2]
      if (id) {
        this.solucaoId = id
        this.solucao = a[2][id]
      }
    })
  }
}
</script>

<style scoped>
</style>