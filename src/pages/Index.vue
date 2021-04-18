<template>
  <q-page class="row flex-center">
    <textarea class="col" style="height: 800px" v-model="tabelasRaw">

    </textarea>
    <button @click="computar">
      COMPUTAR
    </button>
    <button @click="atualizar">
      ATT
    </button>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      tabelasRaw: '',
      tabelas: [],
      solucoes: []
    }
  },
  methods: {
    computar: function () {
      let combinacoes = this.tabelas[0].rows
      for (let i=1; i < this.tabelas.length; ++i) {
        combinacoes = this.cartesiano(combinacoes, this.tabelas[i].rows)

        for (let combinacao of combinacoes) {
          console.log(`${JSON.stringify(combinacao)}`)
        }
        console.log(`${combinacoes.length} possibilidades`)
      }
    },
    filtrar: function (arr) {
      const merged = {}
      for (let a of arr) {
        Object.assign(merged, a)
      }
      for (let a of arr) {
        if (a.filtrar && a.filtrar(merged) === false) {
          return false
        }
      }
      return true
    },
    cartesiano: function (a, b) {
      let resultado = []
      for (let i of a) {
        for (let x of b) {
          const combinacao = [i, x].flat()

          // Só adiciona se for uma opção possível
          if (this.filtrar(combinacao)) {
            resultado.push(combinacao)
          }
        }
      }
      return resultado
    },
    atualizar: function () {
      this.tabelas = this.looseJsonParse(this.tabelasRaw)
      console.log(this.tabelas)
    },
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
    looseJsonParse: function (obj) {
      return Function('"use strict";return (' + obj + ')')()
    }
  }
}
</script>
