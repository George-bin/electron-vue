<template>
  <div class="event-detail-main-component">
    <div v-html="editEvent.eventData"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState({
        editEvent: state => state.home.editEvent
      })
    }
  }
</script>

<style lang="scss">
  .event-detail-main-component {

  }
</style>
