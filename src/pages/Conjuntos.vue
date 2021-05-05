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
            Novo conjunto
          </button>
        </div>
      </div>
      <div v-if="tabelaParsed" class="row" style="align-items: center;">
        <div style="font-size: 55px" class="q-px-md">
          {{tabelaParsed.descricao.nome}}
        </div>
        <div class="q-px-md">
          {{tabelaParsed.objetos.length}} objetos
        </div>
        <div>
          <button @click="editarObjetoBase">
            Editar objeto base
          </button>
        </div>
        <div>
          <button @click="criarObjeto">
            Novo objeto
          </button>
        </div>
      </div>
      <div v-if="tabelaParsed" class="row">
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
import * as Conjunto from 'src/lib/conjunto.js'

export default {
  components: { 
    Item
  },
  name: 'Conjuntos',
  data () {
    return {
      // Tabela atualmente em uso
      tabela: null,
      tabelaParsed: null,

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
      this.editorTitulo = `${this.tabelaParsed.descricao.nome} > Novo objeto`
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
      this.tabela = null
      this.tabelaParsed = null
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
      localStorage.setItem('conjuntos', JSON.stringify(this.tabelas))
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
    Conjunto.getConjuntos()
    .then(conjuntos => {
      this.tabelas = conjuntos

      Conjunto.parseConjuntos(conjuntos)
      .then(parsed => {
        this.tabelasParsed = parsed
        this.setTabelaAtual(0)
      })
    })
  }
}
</script>
