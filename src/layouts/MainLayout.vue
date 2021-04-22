<template>
  <q-layout view="hHh lpr fFf" class="col">
    <q-header class="row">
      <div style="font-size: 28px" class="q-mx-lg">
        Allocadorian
      </div>
      <div>
        <router-link to="/">
          <button>Soluções</button>
        </router-link>
        <router-link to="/">
          <button>Vetores</button>
        </router-link>
        <router-link to="/tabelas">
          <button>Tabelas</button>
        </router-link>
        
        <button>Importar sessão</button>
        <button>Exportar sessão</button>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {  },
  data () {
    return {
      
    }
  }
}
</script>
