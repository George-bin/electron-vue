<template>
  <div class="user-info-component">
    <div class="user-info">
      <img class="avatar-icon" src="../../../../static/img/logo.png" alt="avatar" />
      <span class="user-name">{{userInfo.username}}</span>
    </div>
    <i class="el-icon-menu"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      userInfo: state => state.user.userInfo
    })
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.user-info-component {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 11px 0 12px;
  background: #3c3c3c;
  // -webkit-app-region: drag;
  .user-info {
    display: flex;
    align-items: center;
    .avatar-icon {
      width: 42px;
      height: 42px;
    }
    .user-name {
      margin-left: 5px;
      font-size: 18px;
    }
  }
  .el-icon-menu {
    font-size: 14px;
    color: #ccc;
    &:hover {
      // color: #0a419b;
      color: #ed1925;
      cursor: pointer;
    }
  }
}
</style>
