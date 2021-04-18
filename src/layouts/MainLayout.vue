<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class="flex">
      <div>
        Allocadorian
      </div>
      <q-tabs
          v-model="tab"
          inline-label
          class="text-white col"
      >
        <q-route-tab to="/" name="mails" icon="mail" label="Home" />
        <q-route-tab to="/tables" name="alarms" icon="alarm" label="Tables" />
      </q-tabs>
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
      tab: "tab1"
    }
  }
}
</script>
