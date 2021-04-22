<template>
  <q-page class="col">
    <div>
      <button @click="computar">
        COMPUTAR
      </button>
    </div>
    <div>
      <div>{{`${vetores.length} vetores. ${solucoes.length} soluções`}}</div>
    </div>
  </q-page>
</template>

<script>
import {multiplicar, Vetor} from 'src/lib/cartesiano.js'
import {Solucao} from 'src/lib/solucao.js'
import * as JSP from 'src/lib/JSP.js'


async function solucionar (vetores) {
  const solucoes = [new Solucao()]
  let i=0
  for (const vetor of vetores) {
    const novasSolucoes = []
    for (let solucao of solucoes) {
      let novaSolucao = new Solucao()
      solucao.map(v => novaSolucao.push(v))
      novaSolucao.push(vetor)

      if (novaSolucao.eValida()) {
        novasSolucoes.push(novaSolucao)
      }
    }
    novasSolucoes.map(s => solucoes.push(s))
    console.log(i++)
  }
  return solucoes
}


export default {
  name: 'PageIndex',
  data () {
    return {
      tabelas: [],
      tabelasParsed: [],

      vetores: [],
      solucoes: []
    }
  },
  methods: {
    computar () {
      let vetores = this.tabelasParsed[0].rows
      for (let i=1; i < this.tabelasParsed.length; ++i) {
        vetores = multiplicar(vetores, this.tabelasParsed[i].rows)
      }
      console.log(vetores)

      solucionar(vetores).then(value => this.solucoes = value)
    }
  },
  mounted () {
    const tabelasRaw = localStorage.getItem('tabelas')
    if (tabelasRaw) { 
      console.log(`Carregando tabelas do localStorage`)
      
      this.tabelas = JSON.parse(tabelasRaw)
      
      this.tabelasParsed = this.tabelas.map(t => parseTabela(t))
      function parseTabela (obj) { 
        return {
          descricao: JSP.parse(obj.descricao),
          geral: JSP.parse(obj.geral),
          rows: obj.rows.map(r => JSP.parse(r))
        }
      }
    }
  }
}
</script>
