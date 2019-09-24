<template>
  <div class="no-content-main-component">
    <img class="logon" src="../../../../../static/img/logo.png" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.no-content-main-component {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 75px);
  .logon {
    width: 70px;
    height: 70px;
    opacity: 0.3;
  }
}
</style>
