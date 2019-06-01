<template>
  <div class="note-list-main-component">
    <div class="search-section">
      <div class="search-content">
        <input class="search-input" v-model="searchContent" placeholder="输入关键字查询!" type="text" />
        <i v-if="searchContent" class="el-icon-error" @click="clearSearchContent"></i>
      </div>
    </div>
    <ul class="note-list">
      <li
         v-for="item in filterNoteList"
         :key="item._id"
         class="note-list-item"
         @click="goNoteDetail(item)"
         @click.right="showRightKeyMenu($event, item)"
         :style="{'background': activeNoteId === item._id ? '#DFDFDF' : '#FFFFFF'}"
      >
        <p class="note-title ellipsis">{{ item.noteName }}</p>
        <!--<p class="note-content">{{ item.noteContent }}</p>-->
        <p class="note-footer">
          <span class="note-createTime">{{ item.createTime }}</span>
        </p>
        <!--右键菜单-->
        <ul
          v-if="item.rightKeyMenu"
          class="right-key-menu"
          :style="{'top': rightKeyMenuPosition.y, 'left': rightKeyMenuPosition.x}"
        >
          <template v-if="item.status === 0">
            <li class="right-key-menu-item" @click="deleteNote(item)">删除笔记</li>
          </template>
          <template v-else-if="item.status === 2">
            <li class="right-key-menu-item" @click="restoreNote(item)">还原笔记</li>
            <li class="right-key-menu-item" @click="">永久删除笔记</li>
          </template>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapMutations,mapActions } from 'vuex'
  export default {
    data () {
      return {
        // 当前选中笔记的id
        activeNoteId: '',
        searchContent: '',
        // 右键菜单的位置
        rightKeyMenuPosition: {
          x: 0,
          y: 0
        }
      }
    },
    computed: {
      ...mapState({
        noteList: state => state.home.noteList
      }),
      filterNoteList () {
        return this.noteList.filter(item => {
          return item.noteName.indexOf(this.searchContent) > -1
        })
      }
    },
    watch: {
      noteList: {
        handler: function(val, oldVal) {
          // debugger
          if (val.length) {
            this.activeNoteId = val[0]._id
            this.SET_ACTIVE_NOTE(val[0])
            this.$router.push('/home/noteDetail')
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapMutations([
        'SET_ACTIVE_NOTE',
        'SET_NOTE_RIGHT_KEY_MENU'
      ]),
      ...mapActions([
        'DeleteNote',
        'RestoreNote'
      ]),
      // 显示右键菜单
      showRightKeyMenu (event, note) {
        console.log(event)
        this.rightKeyMenuPosition.x = event.x + 'px'
        this.rightKeyMenuPosition.y = event.y + 'px'
        this.SET_NOTE_RIGHT_KEY_MENU(note._id)
        this.activeNoteId = note._id
        this.SET_ACTIVE_NOTE(note)
      },
      // 清空搜索框
      clearSearchContent () {
        this.searchContent = ''
      },
      // 查看笔记详情
      goNoteDetail (note) {
        this.activeNoteId = note._id
        this.SET_ACTIVE_NOTE(note)
        this.$router.push('/home/noteDetail')
      },
      // 删除笔记
      deleteNote (note) {
        this.$confirm('确定删除该笔记吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.DeleteNote({
              _id: note._id,
              notebookCode: note.notebookCode
            })
              .then(data => {
                this.$message({
                  message: '笔记已删除，可在废纸篓中查看!'
                })
              })
              .catch(err => {
                if (err.errcode) {
                  this.$message({
                    message: err.message,
                    type: 'error',
                    duration: 1500
                  })
                  return
                }
                this.$message({
                  message: '网络错误!',
                  type: 'error',
                  duration: 1500
                })
              })
          })
          .catch(() => {})
      },
      // 还原笔记
      restoreNote (note) {
        this.$confirm('确定还原笔记吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.RestoreNote({
              _id: note._id,
              notebookCode: note.notebookCode
            })
          })
          .catch(err => {
            if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error',
                duration: 1500
              })
              return
            }
            this.$message({
              message: '网络错误!',
              type: 'error',
              duration: 1500
            })
          })
      }
    }
  }
</script>

<style lang="scss">
  .note-list-main-component {
    height: calc(100vh - 31px) !important;
    border-right: 1px solid #CCCCCC;
    overflow: auto;
    .search-section {
      padding: 0 5px;
      padding-top: 5px;
      .search-content {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 5px;
        border: 1px solid #CCCCCC;
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
      padding: 5px;
      .note-list-item {
        padding: 5px;
        /*border-bottom: 2px solid #FFFFFF;*/
        border-bottom: 1px solid #DFDFDF;
        cursor: pointer;
        .note-title {
          color: #000000;
        }
        .note-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          color: #4674B3;
          font-size: 12px;
        }
        .right-key-menu {
          position: fixed;
          width: 180px;
          padding: 0 10px 0 20px;
          border: 1px solid #A7A7A7;
          color: #333333;
          background: #F7F7F7;
          z-index: 999;
          .right-key-menu-item {
            height: 24px;
            line-height: 24px;
          }
          li + li {
            border-top: 1px solid #DFDFDF;
          }
        }
      }
      .note-list-item:hover {
        background: #DFDFDF !important;
      }
    }
  }
</style>
