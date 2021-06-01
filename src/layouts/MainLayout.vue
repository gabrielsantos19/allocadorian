<template>
  <div class="fullscreen column no-wrap">
    <nav class="mnav">
      <div class="logo">
        Allocadorian
      </div>
      <div class="menu">
        <router-link to="/" tag="button">
          Conjuntos
        </router-link>
        <router-link to="/vetores" tag="button">
          Vetores
        </router-link>
        <router-link to="/solucoes" tag="button">
          Soluções
        </router-link>
        <router-link to="/personalizada" tag="button">
          Personalizada
        </router-link>
        
        <router-link to="/configuracoes" tag="button">
          Configurações
        </router-link>
        <router-link to="/sobre" tag="button">
          Sobre
        </router-link>
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
.logo {
  margin: 0px 24px;
  font-size: 28px;
  color: white;
}
.menu {
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  flex-shrink: 0;
}
</style>
