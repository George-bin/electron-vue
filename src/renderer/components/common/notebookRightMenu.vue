<template>
  <div v-if="visible" class="notebook-right-click-menu-component">
    <!--右键菜单 grade: 1、2-->
    <ul
      v-if="
        activeNotebook.grade &&
        activeNotebook.grade < 3 &&
        activeNotebook.notebookCode !== '-2'
      "
      class="right-key-menu-list"
      :style="{ top: notebookRightMenuPosition.y, left: notebookRightMenuPosition.x }">
      <li @click="handleStartCreateNotebook(activeNotebook)">
        在“{{ activeNotebook.name }}”中创建文件夹
      </li>
      <li v-if="activeNotebook.grade !== 1" @click="handleClickStartUpdateNotebook(activeNotebook)">
        重命名
      </li>
      <li
        v-if="activeNotebook.grade !== 1"
        :style="{
          color: activeNotebook.children.length ? 'gray' : '#333'
        }"
        @click="handleDeleteBotebook">
        删除文件夹
      </li>
    </ul>
    <!--右键菜单 grade: 3-->
    <ul
      v-if="activeNotebook.grade === 3"
      class="right-key-menu-list"
      :style="{ top: notebookRightMenuPosition.y, left: notebookRightMenuPosition.x }">
      <li @click="handleClickCreateNote">新建笔记</li>
      <li v-if="activeNotebook.grade !== 1" @click="handleClickStartUpdateNotebook">重命名</li>
      <li
        :style="{
          color: activeNotebook.children.length ? 'gray' : '#333'
        }"
        @click="handleDeleteBotebook">
        删除文件夹
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      // 显示/隐藏
      visible: false
    }
  },
  computed: {
    ...mapState({
      notebookRightMenuPosition: state => state.notebook.notebookRightMenuPosition,
      activeNotebook: state => state.notebook.activeNotebook,
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    notebookRightMenuPosition: function(val, oldval) {
      if (!val) {
        this.visible = false
      } else {
        this.visible = true;
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations([
      'SET_ACTIVE_NOTE'
    ]),
    ...mapActions([
      'DeleteNotebook',
      'CreateNote'
    ]),

    // 开始创建笔记本
    handleStartCreateNotebook() {
      this.$emit('showCreateNotebookDialog');
    },

    // 准备更新笔记本
    handleClickStartUpdateNotebook() {
      this.$emit('showUpdateNotebookDialog');
    },

    // 删除笔记本
    handleDeleteBotebook() {
      if (this.activeNotebook.children.length) return;
      this.$confirm("确定删除该笔记本吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.DeleteNotebook(this.activeNotebook._id)
            .then(data => {
              let { errcode, message } = data
              if (errcode === 0) {
                this.$message({
                  message: "删除了一个笔记本!",
                  type: "success"
                });
              } else {
                this.$message({
                  message: message,
                  type: "warning"
                });
              }
            })
            .catch(err => {
              console.error('删除笔记本失败:', err)
              this.$message({
                message: "删除笔记本失败!",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },

    // 开始创建笔记
    handleClickCreateNote() {
      // this.$router.push('/home/createNote');
      this.CreateNote({
        title: '无标题笔记', // 笔记标题
        content: '', // 笔记内容
        status: 1, // 笔记状态 0：未完成 1：已完成 2：进入回收站
        createTime: null, // 创建时间
        updateTime: null, // 更新时间
        label: 'draft', // 关联标签 draft：草稿 main：正文
        account: this.userInfo.account, // 关联账户
        notebookId: this.activeNotebook._id // 笔记本id
      })
        .then(data => {
          let { errcode, message } = data
          if (errcode === 0) {
            this.$message({
              type: 'success',
              message: '新建了一条笔记!',
              duration: 1000
            })
            this.$router.push('/home/noteDetail')
          } else {
            this.$message({
              type: 'warning',
              message,
            })
          }
        })
        .catch(err => {
          console.error('新建笔记失败:', err)
          this.$message({
            type: 'error',
            message: '新建笔记失败!'
          })
        })
    },
  }
}
</script>

<style lang="scss">
.notebook-right-click-menu-component {
  .right-key-menu-list {
    position: fixed;
    width: 200px;
    padding: 0 10px 0 20px;
    border: 1px solid #a7a7a7;
    font-size: 12px;
    color: #333333;
    background: #f7f7f7;
    z-index: 999;
    li {
      height: 30px;
      line-height: 30px;
      text-align: left;
      cursor: pointer;
    }
    li + li {
      border-top: 1px solid #dfdfdf;
    }
  }
}
</style>
