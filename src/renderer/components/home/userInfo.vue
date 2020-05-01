<template>
  <div class="user-info-component">
    <img class="avatar-icon" src="../../../../static/img/logo.png" alt="avatar" />
    <span class="user-name">{{userInfo.username}}</span>
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
  height: 55px;
  padding: 0 14px;
  background: #3c3c3c;
  .avatar-icon {
    width: 42px;
    height: 42px;
    border-radius: 50%;
  }
  .user-name {
    margin-left: 5px;
    font-size: 18px;
  }
}
</style>
