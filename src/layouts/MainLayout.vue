<template>
  <q-layout view="hHh lpr fFf" class="col">
    <q-header class="row" style="align-items: center; background-color: rgb(70,70,70)">
      <div style="font-size: 28px" class="q-mx-lg">
        Allocadorian
      </div>
      <div>
        <router-link to="/personalizada">
          <button>Personalizada</button>
        </router-link>
        <router-link to="/">
          <button>Soluções</button>
        </router-link>
        <router-link to="/vetores">
          <button>Vetores</button>
        </router-link>
        <router-link to="/conjuntos">
          <button>Conjuntos</button>
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
