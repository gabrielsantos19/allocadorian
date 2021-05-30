<template>
  <main class="container">
    <div>
      <span>Gabriel O. Santos </span>
      <a href="https://github.com/gabrielsantos19">
        GitHub
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
  name: 'SobreView',
}
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
</style>