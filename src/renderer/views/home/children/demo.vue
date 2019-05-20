<template>
  <div class="demo-main-component">
    <!--<tree :folder = "trees" :select = "select"></tree>-->
    <tree :folder="trees"></tree>
  </div>
</template>

<script>
  import tree from '@/components/common/tree-component'
  import { mapState } from 'vuex'
  export default {
    data () {
      return {}
    },
    components: {
      tree
    },
    computed: {
      ...mapState({
        trees: state => state.home.trees
      })
    },
    methods: {}
  }
</script>

<style lang="scss"></style>
