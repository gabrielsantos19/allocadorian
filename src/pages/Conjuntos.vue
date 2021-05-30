<template>
  <main class="row no-wrap col" style="overflow: auto;">
    <div class="conjuntos">
      <div class="barra">
        <span>Conjuntos</span>
        <div v-for="(c, index) in conjuntosParsed"
            :key="index">
          <button @click="setIndexAtual(index)">
            {{ c.descricao.nome }}
          </button>
        </div>
        <button @click="criarConjunto">
          Novo conjunto
        </button>
      </div>

      <div v-if="conjuntoParsed" class="cabecalho">
        <div style="font-size: 55px" class="q-px-md">
          {{conjuntoParsed.descricao.nome}}
        </div>
        <div class="column">
          <div>
            {{conjuntoParsed.objetos.length}} objetos
          </div>
          <div class="row">
            <button @click="criarObjeto(indexAtual)">
              Novo objeto
            </button>
            <button @click="editarObjetoBase(indexAtual)">
              Editar objeto base
            </button>
            <button @click="editarDescricao(indexAtual)">
              Editar descricao
            </button>
            <button @click="removerConjunto(indexAtual)">
              Remover conjunto
            </button>
          </div>
          <input v-model="filtro" placeholder="filtrar objetos"/>
        </div>
      </div>

      <div v-if="conjuntoParsed" class="objetos">
        <objeto-component v-for="wrapper in objetosFiltrados" 
          class="objeto"
          :key="wrapper.id"
          :objeto="wrapper.obj"
          @editar="editarObjeto(indexAtual, wrapper.id)"
          @remover="removerObjeto(indexAtual, wrapper.id)" />
      </div>
    </div>

    <div v-if="editorAberto" class="editor">
      <div class="barra">
        <button @click="editorSalvar(editorTexto)">Salvar</button>
        <button @click="cancelarEdicao">Cancelar</button>
        <span>{{editorTitulo}}</span>
      </div>
      <div class="column col">
        <textarea v-model="editorTexto" class="col" style="resize: none;" />
      </div>
    </div>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'

import * as JSP from 'src/lib/JSP.js'
import * as Template from 'src/lib/template.js'
import * as Conjunto from 'src/lib/conjunto.js'
import * as Conjuntos from 'src/lib/conjuntos.js'

import ObjetoComponent from 'src/components/Objeto.vue'


export default {
  components: { 
    ObjetoComponent
  },
  name: 'ConjuntosView',
  data () {
    return {
      indexAtual: null,

      conjuntos: null,
      conjuntosParsed: null,

      filtro: '',

      editorAberto: true,
      editorTitulo: 'Nada selecionado',
      editorTexto: '',
      editorSalvar: (raw) => null,
    }
  },
  computed: {
    conjunto () {
      if (this.conjuntos != null && this.indexAtual != null) {
        return this.conjuntos[this.indexAtual]
      }
      return null
    },
    conjuntoParsed () {
      if (this.conjuntos != null && this.indexAtual != null) {
        return this.conjuntosParsed[this.indexAtual]
      }
      return null
    },
    objetosFiltrados () {
      const filtro = this.filtro
      const objetos = this.conjunto.objetos
      const parsed = this.conjuntoParsed.objetos
      const resultado = []
      for (let i=0; i<objetos.length; ++i) {
        if (objetos[i].includes(filtro)) {
          resultado.push({
            id: i,
            obj: parsed[i],
          })
        }
      }
      return resultado
    },
  },
  methods: {
    setIndexAtual (index) {
      this.indexAtual = index
    },
    cancelarEdicao () {
      this.editorTitulo = 'Nada selecionado'
      this.editorTexto = ''
      this.editorSalvar = (raw) => null
    },

    criarConjunto () {
      this.editorTitulo = 'Novo conjunto'
      this.editorTexto = Template.descricao
      this.editorSalvar = this.inserirConjunto
    },
    inserirConjunto (descricaoRaw) {
      const novo = {
        descricao: descricaoRaw,
        objetoBase: Template.objetoBase,
        objetos: [],
      }
      const parsed = Conjunto.parse(novo)
      this.conjuntos.push(novo)
      const index = this.conjuntosParsed.push(parsed)
      this.indexAtual = index-1
      ConjuntosDAO.post(this.conjuntos)
    },
    removerConjunto (conjuntoI) {
      this.conjuntos.splice(conjuntoI, 1)
      this.conjuntosParsed.splice(conjuntoI, 1)
      this.indexAtual = null
      ConjuntosDAO.post(this.conjuntos)
    },

    editarDescricao (conjuntoI) {
      const conjunto = this.conjuntos[conjuntoI]
      const parsed = this.conjuntosParsed[conjuntoI]
      this.editorTitulo = `${parsed.descricao.nome} > Descrição`
      this.editorTexto = conjunto.descricao
      this.editorSalvar = (raw) => this.atualizarDescricao(raw, conjuntoI)
    },
    atualizarDescricao (raw, conjuntoI) {
      this.conjuntos[conjuntoI].descricao = raw
      this.conjuntosParsed[conjuntoI].descricao = JSP.parse(raw)
      ConjuntosDAO.post(this.conjuntos)
    },

    editarObjetoBase (conjuntoI) {
      const conjunto = this.conjuntos[conjuntoI]
      const parsed = this.conjuntosParsed[conjuntoI]
      this.editorTitulo = `${parsed.descricao.nome} > Objeto base`
      this.editorTexto = conjunto.objetoBase
      this.editorSalvar = (raw) => this.atualizarObjetoBase(raw, conjuntoI)
    },
    atualizarObjetoBase (raw, conjuntoI) {
      this.conjuntos[conjuntoI].objetoBase = raw
      this.conjuntosParsed[conjuntoI].objetoBase = JSP.parse(raw)
      ConjuntosDAO.post(this.conjuntos)
    },

    criarObjeto (conjuntoI) {
      const conjunto = this.conjuntosParsed[conjuntoI]
      this.editorTitulo = `${conjunto.descricao.nome} > Novo objeto`
      this.editorTexto = Template.objeto
      this.editorSalvar = (raw) => this.inserirObjeto(raw, conjuntoI)
    },
    inserirObjeto (raw, conjuntoI) {
      const parsed = JSP.parse(raw)
      this.conjuntos[conjuntoI].objetos.push(raw)
      this.conjuntosParsed[conjuntoI].objetos.push(parsed)
      ConjuntosDAO.post(this.conjuntos)
    },
    editarObjeto (conjuntoI, objetoI) {
      const conjunto = this.conjuntoParsed
      const objeto = conjunto.objetos[objetoI]
      this.editorTitulo = `${conjunto.descricao.nome} > ${Object.values(objeto)[0]}`
      this.editorTexto = this.conjuntos[conjuntoI].objetos[objetoI]
      this.editorSalvar = (raw) => this.atualizarObjeto(raw, conjuntoI, objetoI)
    },
    atualizarObjeto (raw, conjuntoI, objetoI) {
      this.conjuntos[conjuntoI].objetos[objetoI] = raw
      this.conjuntosParsed[conjuntoI].objetos[objetoI] = JSP.parse(raw)
      ConjuntosDAO.post(this.conjuntos)
    },
    removerObjeto (conjuntoI, objetoI) {
      this.conjuntos[conjuntoI].objetos.splice(objetoI, 1)
      this.conjuntosParsed[conjuntoI].objetos.splice(objetoI, 1)
      ConjuntosDAO.post(this.conjuntos)
    },
  },
  mounted () {
    ConjuntosDAO.get()
    .then(conjuntos => {
      this.conjuntos = conjuntos

      Conjuntos.parse(conjuntos)
      .then(parsed => {
        this.conjuntosParsed = parsed
        if (parsed.length > 0)
          this.setIndexAtual(0)
      })
    })
  }
}
</script>

<style scoped>
.conjuntos {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  min-width: 400px;
}
.barra {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: white;
  min-height: 42px;
  max-height: 42px;
  flex-shrink: 0;
  background-color: rgb(40,40,40);
}

.cabecalho {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-bottom: 10px;
}

.objetos {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  padding: 10px 0px;
  box-shadow: 0 1px 3px 0 grey inset;
}
.objeto {
  margin: 0px 0px 5px 10px;
}

.editor {
  display: flex;
  flex-flow: column;
  min-width: 550px;
  background-color: rgb(150,150,150);
}
</style>