<template>
  <q-page class="row">
    <div class="col">
      <div class="row">
        <div class="row q-my-sm">
          <button v-for="(tabela, index) in tabelasParsed" 
            :key="index"
            @click="setTabelaAtual(index)"
          >
            {{ index }} {{ tabela.descricao.nome }}
          </button>
          <button @click="criarTabela">
            Nova tabela
          </button>
        </div>
      </div>
      <div v-if="tabelaParsed" class="flex row">
        <div>
          <div>{{tabelaParsed.descricao.nome}}</div>
          <button @click="criarLinha">
            Novo item
          </button>
        </div>
        <div v-for="(linha, index) in tabelaParsed.rows" :key="index">
          {{ linha }}
        </div>
      </div>
    </div>
    <Editor v-if="editando" 
      :titulo="editorTitulo" 
      :texto="editorTexto"
      :confirmar="editorConfirmar"
      :cancelar="cancelarEdicao"
    />
  </q-page>
</template>

<script>
import Editor from 'src/components/Editor.vue'
import * as JSP from 'src/lib/JSP.js'

export default {
  components: { Editor },
  name: 'Tabelas',
  data () {
    return {
      // Tabela atualmente em uso
      tabela: undefined,
      tabelaParsed: undefined,

      tabelas: [],
      tabelasParsed: [],

      editando: false,
      editorTitulo: undefined,
      editorTexto: undefined,
      editorConfirmar: undefined
    }
  },
  methods: {
    criarTabela () {
      this.editando = true
      this.editorTitulo = 'Nova tabela'
      this.editorTexto = `{\n    nome: 'Nova tabela',\n}`
      this.editorConfirmar = this.inserirTabela
    },
    inserirTabela (descricao) {
      const tabela = {
        descricao: descricao,
        geral: '{}',
        rows: []
      }
      const tabelaParsed = {
        descricao: JSP.parse(tabela.descricao),
        geral: JSP.parse(tabela.geral),
        rows: []
      }

      const lengthParsed = this.tabelasParsed.push(tabelaParsed)
      const length = this.tabelas.push(tabela)
      this.cancelarEdicao()
      this.salvarTabelas()
      this.setTabelaAtual(length-1)
    },
    salvarTabelas () {
      console.log(`Salvar tabelas ${JSON.stringify(this.tabelas)}`)
      localStorage.setItem('tabelas', JSON.stringify(this.tabelas))
    },
    setTabelaAtual (index) {
      this.tabela = this.tabelas[index]
      this.tabelaParsed = this.tabelasParsed[index]
    },
    criarLinha () {
      this.editando = true
      this.editorTitulo = 'Novo item'
      this.editorTexto = `{\n    nome: 'Novo item',\n}`
      this.editorConfirmar = this.inserirLinha
    },
    inserirLinha (textoObjeto) {
      const objeto = JSP.parse(textoObjeto)
      this.tabelaParsed.rows.push(objeto)
      this.tabela.rows.push(textoObjeto)
      this.cancelarEdicao()
      this.salvarTabelas()
    },
    cancelarEdicao () {
      this.editando = false,
      this.editorTitulo = undefined,
      this.editorTexto = undefined,
      this.editorConfirmar = undefined
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

      this.setTabelaAtual(0)
    }
  }
}
</script>
