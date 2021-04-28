<template>
  <q-page class="col">
    <div>
      <button @click="gerarSolucoes">
        Gerar Soluções
      </button>
      <button @click="gerarVetores">
        Gerar vetores
      </button>
    </div>
    <div>
      <div>{{`${vetores.length} vetores. ${solucoes.length} soluções`}}</div>
    </div>
    <div v-for="(solucao, index) in solucoes" :key="index">
      {{JSON.stringify(solucao)}}
    </div>
  </q-page>
</template>

<script>
import {multiplicar, Vetor} from 'src/lib/cartesiano.js'
import {Solucao} from 'src/lib/solucao.js'
import * as JSP from 'src/lib/JSP.js'


async function solucao1 (vetores) {
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

async function solucao2 (vetores) {
  let arvore = []
  for (let vetor of vetores) {
    let solucoesIsoladas = [new Solucao()]
    let solucaoUnitaria = new Solucao()
    solucaoUnitaria.push(vetor)
    solucoesIsoladas.push(solucaoUnitaria)
    arvore.push(solucoesIsoladas)
  }
  if (arvore.length % 2) {
    arvore.push([new Solucao()])
  }

  while (arvore.length > 1) {
    for (let i=1; i<arvore.length; i+=2) {
      let produtos = []
      for (let s1 of arvore[i]) {
        for (let s2 of arvore[i-1]) {
          let produto = s1.multiplicar(s2)
          
          if (produto.eValida()) {
            produtos.push(produto)
          }
        }
      }
      arvore[i] = produtos
    }
    arvore = arvore.filter((val, index) => index%2)
  }
  
  return arvore[0]
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
    gerarVetores () {
      let vetores = this.tabelasParsed[0].objetos.map(o => ({...this.tabelasParsed[0].objetoBase, ...o}))
      console.log(this.tabelasParsed[0].objetoBase)
      for (let i=1; i < this.tabelasParsed.length; ++i) {
        vetores = multiplicar(vetores, this.tabelasParsed[i].objetos)
      }
      console.log(vetores)
      this.vetores = vetores
    },
    gerarSolucoes () {
      solucao2(this.vetores).then(value => this.solucoes = value)
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
          objetoBase: JSP.parse(obj.objetoBase),
          objetos: obj.objetos.map(r => JSP.parse(r))
        }
      }
    }
  }
}
</script>
