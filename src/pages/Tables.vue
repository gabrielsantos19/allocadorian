<template>
  <q-page class="row">
    <div class="col">
      <q-tabs
          v-model="tab"
          inline-label
          class="bg-primary text-white"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
        <q-tab name="photos" icon="photo" label="Photos" />
        <q-tab name="videos" icon="slow_motion_video" label="Videos" />
        <q-tab name="addressbook" icon="people" label="Address Book" />
      </q-tabs>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Tables',
  data () {
    return {
      tab:'mails'
    }
  },
  methods: {
    
  }
}
</script>
