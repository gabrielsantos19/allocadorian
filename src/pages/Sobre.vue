<template>
  <main class="container">
    <br />
    <div>Feito por:</div>
    <span>Gabriel O. Santos </span>
    <a href="https://github.com/gabrielsantos19">github.com/gabrielsantos19</a>
    <a href="https://www.linkedin.com/in/gabrielsantos19">linkedin.com/in/gabrielsantos19</a>
    <br />
    <br />
    <div>Com a ajuda de:</div>
    <span>Quasar</span>
    <a href="https://quasar.dev/">quasar.dev</a>
    <br />
    <span>Vue.js</span>
    <a href="https://vuejs.org/">vuejs.org</a>
    <br />
    <span>Parallel.js</span>
    <a href="https://parallel.js.org/">parallel.js.org</a>
  </main>
</template>

<script>
import * as ConjuntosDAO from 'src/lib/DAO/conjuntosDAO.js'
import * as VetoresDAO from 'src/lib/DAO/vetoresDAO.js'
import * as SolucoesDAO from 'src/lib/DAO/solucoesDAO.js'
import * as PersonalizadaDAO from 'src/lib/DAO/personalizadaDAO.js'


export default {
  name: 'SobreView',
}
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
.container div {
  font-size: 20px;
}
.container span {
  font-size: 40px;
}
.container a {
  font-size: 20px;
}
</style>