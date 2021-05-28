<template>
  <main class="container">
    <div class="column">
      <span>MongoDB</span>
      <div>
        <input />
        <button>Conectar</button>
      </div>
      
      <span>Arquivo</span>
      <button onclick="this.children[0].click()">
        <input id="input-importar" type="file" @change="importar" style="display: none;">
        Importar sessão a partir de arquivo
      </button>

      <label>Destino</label>
      <input v-model="exportarDestino" />
      <a :href="exportarHref"
          :download="exportarDestino">
        <button :disabled="conjuntos == null">
          Exportar sessão para arquivo
        </button>
      </a>
    </div>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'
import * as PersonalizadaDAO from 'src/lib/DAO/personalizadaDAO.js'


export default {
  name: 'ConfiguracoesView',
  data () {
    return {
      conjuntos: null,
      vetores: null,
      solucoes: null,
      personalizada: null,

      exportarDestino: 'allocadorian.json'
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
      const file = document.getElementById('input-importar').files[0]
      file.text()
      .then(raw => {
        const dados = JSON.parse(raw)
        console.log(dados)

        ConjuntosDAO.post(dados.conjuntos)
        VetoresDAO.post(dados.vetores)
        SolucoesDAO.post(dados.solucoes)
        PersonalizadaDAO.post(dados.personalizada)
      })
    }
  },
  mounted () {
    async function carregar () {
      const conjuntos = await ConjuntosDAO.get()
      const vetores = await VetoresDAO.get()
      const solucoes = await SolucoesDAO.get()
      const personalizada = await PersonalizadaDAO.get()
      
      return [conjuntos, vetores, solucoes, personalizada]
    }
    
    carregar()
    .then(a => {
      this.conjuntos = a[0]
      this.vetores = a[1]
      this.solucoes = a[2]
      this.personalizada = a[3]
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
</style>