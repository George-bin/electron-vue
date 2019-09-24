<template>
  <div class="note-list-main-component">
    <div class="search-section">
      <div class="search-content">
        <input
          class="search-input"
          v-model="searchContent"
          placeholder="输入关键字查询!"
          type="text"
        />
        <i
          v-if="searchContent"
          class="el-icon-error"
          @click="clearSearchContent"
        ></i>
      </div>
    </div>
    <ul class="note-list">
      <li
        v-for="item in filterNoteList"
        :key="item._id"
        class="note-list-item"
        @click="handleGoNoteDetail(item)"
        @click.right="handleShowRightKeyMenu($event, item)"
        :class="{ 'active-note-style': activeNote._id === item._id }"
      >
        <p class="note-title ellipsis">{{ item.noteName }}</p>
        <p class="note-footer">
          <span class="note-createTime">{{ item.createTime }}</span>
        </p>
        <!--右键菜单-->
        <ul
          v-if="item.rightKeyMenu"
          class="right-key-menu"
          :style="{ top: rightKeyMenuPosition.y, left: rightKeyMenuPosition.x }"
        >
          <template v-if="item.status === 0">
            <li class="right-key-menu-item" @click="handleDeleteNote(item)">
              删除笔记
            </li>
          </template>
          <template v-else-if="item.status === 2">
            <li class="right-key-menu-item" @click="handleRestoreNote(item)">
              还原笔记
            </li>
            <li class="right-key-menu-item" @click="handleClearNote(item)">
              永久删除笔记
            </li>
          </template>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      searchContent: "",
      // 右键菜单的位置
      rightKeyMenuPosition: {
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    ...mapState({
      noteList: state => state.home.noteList,
      activeNote: state => state.home.activeNote
    }),
    filterNoteList() {
      return this.noteList.filter(item => {
        return item.noteName.indexOf(this.searchContent) > -1;
      });
    }
  },
  watch: {},
  methods: {
    ...mapMutations(["SET_ACTIVE_NOTE", "SET_NOTE_RIGHT_KEY_MENU"]),
    ...mapActions(["DeleteNote", "RestoreNote", "ClearNote", "GetNoteById"]),
    // 显示右键菜单
    handleShowRightKeyMenu(event, note) {
      // console.log(event);
      this.rightKeyMenuPosition.x = event.x + "px";
      this.rightKeyMenuPosition.y = event.y + "px";
      this.SET_NOTE_RIGHT_KEY_MENU(note._id);
      this.SET_ACTIVE_NOTE(note);
    },
    // 清空搜索框
    clearSearchContent() {
      this.searchContent = "";
    },

    // 查看笔记详情
    handleGoNoteDetail(note) {
      this.SET_ACTIVE_NOTE({});
      this.GetNoteById(note._id)
        .then(() => {
          this.$router.push("/home/noteDetail");
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "获取笔记失败!"
          });
        });
    },

    // 删除笔记
    handleDeleteNote(note) {
      this.$confirm("确定删除该笔记吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.DeleteNote({
            _id: note._id,
            notebookCode: note.notebookCode
          })
            .then(data => {
              this.$message({
                message: "笔记已删除，可在废纸篓中查看!"
              });
              this.$router.push("/home/noContent");
            })
            .catch(err => {
              if (err.errcode) {
                this.$message({
                  message: err.message,
                  type: "error",
                  duration: 1500
                });
                return;
              }
              this.$message({
                message: "网络错误!",
                type: "error",
                duration: 1500
              });
            });
        })
        .catch(() => {});
    },

    // 还原笔记
    handleRestoreNote(note) {
      this.SET_NOTE_RIGHT_KEY_MENU("");
      this.$confirm("确定还原笔记吗？", "提示", {
        type: "warning"
      })
        .then(data => {
          this.RestoreNote({
            _id: note._id,
            notebookCode: note.notebookCode
          })
            .then(data => {
              if (data.errcode !== 0) {
                this.$message({
                  message: data.message,
                  type: "error",
                  duration: 1500
                });
              }
              this.$router.push("/home/noContent");
            })
            .catch(err => {
              this.$message({
                message: "网络错误!",
                type: "error",
                duration: 1500
              });
            });
        })
        .catch(err => {
          console.log("取消还原笔记!", err);
        });
    },

    // 永久删除笔记
    handleClearNote(note) {
      this.SET_NOTE_RIGHT_KEY_MENU("");
      this.$confirm("确定永久性删除该笔记吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.ClearNote(note)
          .then(data => {
            if (data.errcode === 0) {
              this.$message({
                type: "success",
                message: "删除笔记成功!",
                duration: 1500
              });
              this.$router.push("/home/noContent");
            } else {
              this.$message({
                type: "warning",
                message: data.message,
                duration: 1500
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "网络错误!",
              type: "error",
              duration: 1500
            });
            console.log("永久删除笔记失败!", err);
          });
      });
    }
  }
};
</script>

<style lang="scss">
.note-list-main-component {
  height: calc(100vh - 31px) !important;
  border-right: 1px solid #cccccc;
  .search-section {
    padding: 5px;
    .search-content {
      display: flex;
      align-items: center;
      height: 28px;
      padding: 0 5px;
      border: 1px solid #cccccc;
      .search-input {
        flex: 1;
        border: 0;
        background: none;
        outline: none;
      }
      i {
        cursor: pointer;
      }
    }
  }
  .note-list {
    width: 200px;
    height: calc(100% - 45px) !important;
    padding: 0 5px;
    padding-bottom: 5px;
    overflow: auto;
    .note-list-item {
      padding: 5px;
      /*border-bottom: 2px solid #FFFFFF;*/
      border-bottom: 1px solid #dfdfdf;
      cursor: pointer;
      &:hover {
        background: rgba(37, 215, 255, 0.2);
      }
      .note-title {
        color: #000000;
      }
      .note-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        color: #4674b3;
        font-size: 12px;
      }
      .right-key-menu {
        position: fixed;
        width: 180px;
        padding: 0 10px 0 20px;
        border: 1px solid #a7a7a7;
        color: #333333;
        background: #f7f7f7;
        z-index: 999;
        .right-key-menu-item {
          height: 24px;
          line-height: 24px;
        }
        li + li {
          border-top: 1px solid #dfdfdf;
        }
      }
    }
    .active-note-style {
      background: #dfdfdf;
      &:hover {
        background: #dfdfdf;
      }
    }
  }
}
</style>
