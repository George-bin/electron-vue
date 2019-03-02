<template>
  <div
    class="loading-template"
    v-if="loadingShow">
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="loading-bg"></div>
  </div>
</template>

<script>
export default {
  props: {
    loadingShow: {
      type: Boolean
    }
  },
  data () {
    return {}
  }
}
</script>

<style>
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 40px;
    margin: 0 auto;
    margin-top: -20px;
    margin-left: -40px;
    z-index: 99999;
  }

  .loading span {
    display: inline-block;
    width: 8px;
    height: 100%;
    border-radius: 4px;
    background: lightgreen;
    -webkit-animation: load 1s ease infinite;
  }

  @-webkit-keyframes load {
    0%, 100% {
      height: 40px;
      background: lightgreen;
    }
    50%{
      height: 70px;
      margin: -15px 0;
      background: lightblue;
    }
  }

  .loading span:nth-child(2) {
    -webkit-animation-delay: 0.2s;
  }

  .loading span:nth-child(3) {
    -webkit-animation-delay: 0.4s;
  }

  .loading span:nth-child(4) {
    -webkit-animation-delay: 0.6s;
  }

  .loading span:nth-child(5) {
    -webkit-animation-delay: 0.8s;
  }

  .loading-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
  }
</style>
