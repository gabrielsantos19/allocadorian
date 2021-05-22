<template>
  <div class="fullscreen column no-wrap">
    <nav class="mnav">
      <div class="q-mx-lg" style="font-size: 28px; color: white">
        Allocadorian
      </div>
      <div class="row no-wrap">
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
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
}
</script>

<style scoped>
.mnav {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center; 
  background-color: rgb(70,70,70); 
  overflow: auto;
}
</style>
