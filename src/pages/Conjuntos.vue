<template>
  <q-page class="row">
    <div class="col">
      <div class="row">
        <div class="row q-my-sm">
          <div v-for="(tabela, index) in tabelasParsed" 
              :key="index"
              class="column"
          >
            <button @click="setTabelaAtual(index)">
              {{ tabela.descricao.nome }}
            </button>
            <button @click="removerTabela(index)">
              Remover {{ tabela.descricao.nome }}
            </button>
          </div>
          <button @click="criarTabela">
            Nova tabela
          </button>
        </div>
      </div>
      <div v-if="tabelaParsed" class="row">
        <div style="background-color: rgb(30,200,15)">
          <div style="font-size: 50px">
            {{tabelaParsed.descricao.nome}}
          </div>
          <button @click="editarObjetoBase">
            Editar objeto base
          </button>
          <button @click="criarObjeto">
            Novo Objeto
          </button>
        </div>
        <Item v-for="(linha, index) in tabelaParsed.objetos" 
          :key="index"
          :titulo="Object.values(linha)[0]"
          :descricao="Object.values(linha)[0]"
          @click="editarObjeto(index)"
          @remover="removerObjeto(index)"
        />
      </div>
    </div>
    <div class="column q-px-sm" style="background-color: rgb(150,150,150)">
      <div class="row">
        <div>{{editorTitulo}}</div>
        <button @click="editorSalvar(editorTexto)">Salvar</button>
        <button @click="cancelarEdicao()" style="align-self: end">Cancelar</button>
      </div>
      <div v-if="editorAberto" class="column col">
        <textarea cols="60" rows="40" v-model="editorTexto"></textarea>
      </div>
    </div>
  </q-page>
</template>

<script>
import Item from 'src/components/Item.vue'
import * as JSP from 'src/lib/JSP.js'
import * as Template from 'src/lib/template.js'

export default {
  components: { 
    Item
  },
  name: 'Tabelas',
  data () {
    return {
      // Tabela atualmente em uso
      tabela: undefined,
      tabelaParsed: undefined,

      tabelas: [],
      tabelasParsed: [],

      editorAberto: true,
      editorTitulo: 'Nada selecionado',
      editorTexto: '',
      editorSalvar: (text) => null
    }
  },
  methods: {
    criarTabela () {
      this.editorAberto = true
      this.editorTitulo = 'Nova tabela'
      this.editorTexto = Template.descricao
      this.editorSalvar = this.inserirTabela
    },
    criarObjeto () {
      this.editorAberto = true
      this.editorTitulo = 'Novo item'
      this.editorTexto = Template.objeto
      this.editorSalvar = this.inserirObjeto
    },
    inserirTabela (descricao) {
      const tabela = {
        descricao: descricao,
        objetoBase: Template.objetoBase,
        objetos: []
      }
      const tabelaParsed = {
        descricao: JSP.parse(tabela.descricao),
        objetoBase: JSP.parse(tabela.objetoBase),
        objetos: []
      }

      const lengthParsed = this.tabelasParsed.push(tabelaParsed)
      const length = this.tabelas.push(tabela)
      this.salvarTabelas()
      this.setTabelaAtual(length-1)
    },
    inserirObjeto (textoObjeto) {
      const objeto = JSP.parse(textoObjeto)
      this.tabelaParsed.objetos.push(objeto)
      this.tabela.objetos.push(textoObjeto)
      this.salvarTabelas()
    },
    editarTabela () {

    },
    editarObjeto (index) {
      this.editorAberto = true
      this.editorTitulo = `${this.tabelaParsed.descricao.nome} > ${Object.values(this.tabelaParsed.objetos[index])[0]}`
      this.editorTexto = this.tabela.objetos[index]
      this.editorSalvar = (texto) => this.atualizarObjeto(index, texto)
    },
    editarObjetoBase () {
      this.editorTitulo = `${this.tabelaParsed.descricao.nome} > Objeto base`
      this.editorTexto = this.tabela.objetoBase
      this.editorSalvar = this.atualizarObjetoBase
    },
    atualizarObjeto (index, texto) {
      this.tabelaParsed.objetos[index] = JSP.parse(texto)
      this.tabela.objetos[index] = texto
      this.salvarTabelas()
    },
    atualizarObjetoBase (textoObjeto) {
      this.tabelaParsed.objetoBase = JSP.parse(textoObjeto)
      this.tabela.objetoBase = textoObjeto
      this.salvarTabelas()
    },
    removerTabela (index) {
      this.tabelas.splice(index, 1)
      this.tabelasParsed.splice(index, 1)
      this.cancelarEdicao()
      this.salvarTabelas()
    },
    removerObjeto (index) {
      this.tabelaParsed.objetos.splice(index, 1)
      this.tabela.objetos.splice(index, 1)
      this.cancelarEdicao()
      this.salvarTabelas()
    },
    salvarTabelas () {
      localStorage.setItem('tabelas', JSON.stringify(this.tabelas))
    },
    setTabelaAtual (index) {
      this.tabela = this.tabelas[index]
      this.tabelaParsed = this.tabelasParsed[index]
    },
    cancelarEdicao () {
      this.editorTitulo = 'Nada selecionado',
      this.editorTexto = '',
      this.editorSalvar = (i) => null
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

      this.setTabelaAtual(0)
    }
  }
}
</script>
