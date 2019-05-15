<template>
  <div class="event-detail-main-component">
    <div class="main-section">
      <div v-html="editEvent.eventData"></div>
    </div>
    <!--返回组件-->
    <back-component></back-component>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import backComponent from '@/components/common/back-component'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState({
        editEvent: state => state.home.editEvent
      })
    },
    components: {
      backComponent
    },
    created () {},
    mounted () {
      console.log(this.editEvent)
    },
    activated () {
      console.log(this.editEvent)
    },
    methods: {}
  }
</script>

<style lang="scss">
  .event-detail-main-component {
    .main-section {
      height: calc(100vh - 75px - 40px - 35px);
      padding: 20px;
      overflow: auto;
    }
    // 隐藏滚动条
    .main-section::-webkit-scrollbar {
      display: none;
    }
  }
</style>
