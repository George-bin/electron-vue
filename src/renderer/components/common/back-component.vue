<template>
  <div class="back-main-component">
    <span class="back-btn"><i class="iconfont icon-fanhui" title="返回" @click="goBack"></i></span>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      goBack () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="scss">
  .back-main-component {
    display: flex;
    align-items: center;
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    border-top: 1px solid #CCCCCC;
    cursor: pointer;
    .back-btn {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      border: 1px solid #CCCCCC;
      text-align: center;
      background: #F7F7F7;
      border-radius: 4px;
    }
  }
</style>
