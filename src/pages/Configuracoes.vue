<template>
  <main class="container">
    <div class="column">
      <span class="titulo">Dados carregados</span>
      <span>{{conjuntos.length}} conjuntos carregados</span>
      <span>{{vetores.length}} vetores carregados</span>
      <span>{{solucoes.length}} solucoes carregados</span>
      <span>Personalizada com {{personalizada.i.length}} vetores</span>
      
      <span class="titulo">Importar dados</span>
      <span v-if="importarMensagem">{{importarMensagem}}</span>
      <button onclick="this.children[0].click()">
        <input id="input-importar" type="file" @change="importar" style="display: none;">
        Importar a partir de arquivo
      </button>
      <span class="titulo">Exportar dados</span>
      <label>Nome do arquivo</label>
      <input v-model="exportarDestino" />
      <a :href="exportarHref" :download="exportarDestino" style="display:flex; flex-direction: column;">
        <button :disabled="conjuntos == null">
          Exportar para arquivo
        </button>
      </a>

      <span class="titulo">Limpar localStorage</span>
      <button @click="deletarDados">
        Deletar dados
      </button>

      <span class="titulo">MongoDB</span>
      <input placeholder="url da API" />
      <button disabled>Conectar</button>
      <button disabled>Desconectar</button>
    </div>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'
import * as PersonalizadaDAO from 'src/lib/DAO/personalizadaDAO.js'
import { solucao } from 'src/lib/solucoes'


export default {
  name: 'ConfiguracoesView',
  data () {
    return {
      conjuntos: [],
      vetores: [],
      solucoes: [],
      personalizada: {i: []},

      importarMensagem: '',
      
      exportarDestino: 'allocadorian.json',
    }
  },
  computed: {
    exportarHref () {
      const prefix = 'data:text/json;charset=utf-8,'
      const dados = {
        conjuntos: this.conjuntos,
        vetores: this.vetores,
        solucoes: this.solucoes,
        personalizada: this.personalizada,
      }
      const uri = prefix + encodeURIComponent(JSON.stringify(dados, null, 2))
      return uri
    },
  },
  methods: {
    importar (e) {
      this.importarMensagem = 'Importanto dados'

      const file = document.getElementById('input-importar').files[0]
      async function post (dados) {
        await ConjuntosDAO.post(dados.conjuntos)
        await VetoresDAO.post(dados.vetores)
        await SolucoesDAO.post(dados.solucoes)
        await PersonalizadaDAO.post(dados.personalizada)
      }
      file.text()
      .then(raw => {
        const dados = JSON.parse(raw)
        return post(dados)
      })
      .then(r => {
        this.importarMensagem = 'Sucesso ao importar'
        this.carregar()
      })
      .catch(e => this.importarMensagem = 'Erro ao importar')
    },
    deletarDados () {
      localStorage.clear()
      this.carregar()
    },

    carregar () {
      this.carregarConjuntos()
      this.carregarVetores()
      this.carregarSolucoes()
      this.carregarPersonalizada()
    },
    carregarConjuntos () {
      ConjuntosDAO.get()
      .then(conjuntos => this.conjuntos = conjuntos)
    },
    carregarVetores () {
      VetoresDAO.get()
      .then(vetores => {
        this.vetores = vetores
      })
    },
    carregarSolucoes () {
      SolucoesDAO.get()
      .then(solucoes => {
        this.solucoes = solucoes
      })
    },
    carregarPersonalizada () {
      PersonalizadaDAO.get()
      .then(personalizada => this.personalizada = personalizada)
    },
  },
  mounted () {
    this.carregar()
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
.titulo {
  font-size: 35px;
  margin: 10px 0px 5px 0px;
}
</style>