<template>
  <ul
    class="tree-main-component">
    <li
      v-for="(item, index) in folder"
      :key="index"
      class="tree-item">
      <!-- :style="{
        height: item.show ? 40 * (item.children.length+1) + 'px' : 40 + 'px'
      }" -->
      <div
        class="notebook-name"
        @click="handleSelectNode(item)"
        @click.right="handleClickShowRightKeyMenu($event, item)"
        :style="{
          'padding-left': item.grade * 20 + 'px',
          'background': item.isActive && activeModule === 'tree' ? '#525252' : ''
        }">
        <img
          v-if="item.children && item.children.length"
          src="../../../../static/img/sanjiaoxing.png"
          :style="{'left': item.grade * 20 - 12 + 'px'}"
          :class="{ 'expand-node': item.show }"
          class="triangle-icon"
          alt="icon" />
        <img class="folder-icon" src="../../../../static/img/folder.png" alt="icon" />
        <span class="content ellipsis" :title="item.name">{{item.name}}</span>
        <span class="note-num" v-if="item.grade === 3">({{item.total ? item.total : 0}})</span>
        <!-- 一级目录 -->
        <i
          v-if="item.grade === 1"
          class="el-icon-plus"
          @click.stop="handleStartCreateNotebook(item)"
          title="创建笔记本">
        </i>
      </div>
      <!-- 子节点 -->
      <tree
        v-show="item.children && item.show"
        :folder="item.children"
        class="son-tree">
      </tree>
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  props: ["folder"],
  name: "tree",
  data() {
    return {
      activeNode: ""
    };
  },
  components: {},
  computed: {
    ...mapState({
      activeModule: state => state.home.activeModule,
      activeNotebook: state => state.home.activeNotebook
    })
  },
  watch: {},
  mounted() {
    console.log('folder', this.folder)
  },
  methods: {
    ...mapActions(["GetNoteById"]),
    ...mapMutations([
      "SET_ACTIVE_NOTEBOOK",
      "SET_ACTIVE_NODE",
      "SET_ACTIVE_NOTE",
      'SET_RIGHT_MENU_POSITION'
    ]),
    ...mapActions(["DeleteNotebook", "GetNoteList"]),

    // 开始创建笔记本
    handleStartCreateNotebook(item) {
      this.SET_ACTIVE_NOTEBOOK(item);
      this.$emit('showCreateNotebookDialog');
    },

    // 显示右键菜单
    handleClickShowRightKeyMenu(event, item) {
      this.SET_ACTIVE_NOTEBOOK(item);
      this.$nextTick(() => {
        this.SET_RIGHT_MENU_POSITION({
          x: event.x + 'px',
          y: event.y + 'px'
        });
      });
    },

    // 选择节点
    handleSelectNode(item) {
      this.activeNode = item._id;
      this.SET_ACTIVE_NODE(item);

      let noteBook = JSON.parse(JSON.stringify(item));
      delete noteBook.children;
      this.SET_ACTIVE_NOTEBOOK(noteBook);

      this.GetNoteList(item._id)
        .then(data => {
          let { noteList } = data;
          if (noteList && noteList.length) {
            this.GetNoteById(noteList[0]._id)
              .then(() => {
                this.$router.push("/home/noteDetail");
              })
              .catch(err => {
                this.SET_ACTIVE_NOTE({});
                this.$router.push("/home/noContent");
                this.$message({
                  type: "warning",
                  message: "获取笔记失败!"
                });
              });
          } else {
            this.SET_ACTIVE_NOTE({});
            this.$router.push("/home/noContent");
          }
        })
        .catch(err => {
          console.error('获取笔记失败!', err)
        });
    },

    // 删除笔记本
    handleDeleteBotebook(item) {
      this.$confirm("确定删除该笔记本吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.DeleteNotebook(item._id)
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
    }
  }
};
</script>

<style lang="scss">
.tree-main-component {
  .tree-item {
    .notebook-name {
      position: relative;
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      cursor: pointer;
      .triangle-icon {
        position: absolute;
        width: 8px;
        height: 8px;
        transition: all 0.5s;
      }
      .expand-node {
        transform: rotate(90deg);
      }
      .content {
        flex: 1;
        margin-left: 5px;
      }
      .note-num {
        margin: 0 10px;
      }
      .el-icon-plus {
        margin-right: 10px;
        font-size: 16px;
      }
      .folder-icon {
        width: 24px;
        height: 24px;
      }
    }
    .active-node {
      background: #525252;
    }
    .notebook-name:hover {
      background: #8e8e8e;
    }
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
        height: 28px;
        line-height: 28px;
        text-align: left;
        cursor: pointer;
      }
      li + li {
        border-top: 1px solid #dfdfdf;
      }
    }
  }
}
</style>
