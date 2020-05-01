<template>
  <div
    :style="{
      height: isMac ? '100vh' : 'calc(100vh - 31px)'
    }"
    class="note-list-main-component">
    <div class="search-section">
      <input
        class="search-input"
        v-model="searchContent"
        placeholder="输入关键字查询!"
        type="text" />
      <i
        v-if="searchContent"
        class="el-icon-error"
        @click="clearSearchContent">
      </i>
    </div>
    <ul class="note-list">
      <li
        v-for="item in filterNoteList"
        :key="item._id"
        class="note-list-item"
        @click="handleGoNoteDetail(item)"
        @click.right="handleShowRightKeyMenu($event, item)"
        :class="{ 'active-note-style': activeNote._id === item._id }"
        :title="item.title">
        <span
          :style="{
            background: item.label === 'draft' ? '#0a419b' : 'rgb(241,201,63)'
          }"
          class="icon">
          <i v-if="item.label === 'draft'" class="iconfont icon-biji"></i>
          <i v-else class="el-icon-tickets" style="margin-top: 2px"></i>
        </span>
        <div class="content">
          <p class="note-title ellipsis">{{ item.title ? item.title : '无标题文档' }}</p>
          <p class="note-footer">
            <span class="note-createTime">{{ $moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      searchContent: ''
    }
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      noteList: state => state.note.noteList,
      activeNote: state => state.note.activeNote
    }),
    filterNoteList() {
      return this.noteList.filter(item => {
        return item.title.indexOf(this.searchContent) > -1
      })
    }
  },
  watch: {},
  methods: {
    ...mapMutations([
      'SET_ACTIVE_NOTE',
      'SET_NOTE_RIGHT_MENU_POSITION'
    ]),
    ...mapActions([
      'DeleteNote',
      'RestoreNote',
      'ClearNote',
      'GetNoteById'
    ]),
    // 显示右键菜单
    handleShowRightKeyMenu(event, note) {
      this.SET_NOTE_RIGHT_MENU_POSITION({
        x: event.x + 'px',
        y: event.y + 'px'
      });
      this.SET_ACTIVE_NOTE(note)
    },
    // 清空搜索框
    clearSearchContent() {
      this.searchContent = ''
    },
    // 查看笔记详情
    handleGoNoteDetail(note) {
      this.SET_ACTIVE_NOTE({})
      this.GetNoteById(note._id)
        .then(data => {
          let { errcode, message } = data;
          if (errcode === 0) {
            this.$router.push('/home/noteDetail')
          } else {
            this.$message({
              type: 'warning',
              message
            })
          }
        })
        .catch(err => {
          console.error('获取笔记列表失败:', err)
          this.$message({
            type: 'error',
            message: '获取笔记列表失败!'
          })
        })
    }
  }
}
</script>

<style lang="scss">
.note-list-main-component {
  width: 240px;
  border-right: 1px solid #cccccc;
  .search-section {
    position: relative;
    display: flex;
    align-items: center;
    height: 54px;
    padding: 0 5px;
    border-bottom: 1px solid #ccc;
    .search-input {
      flex: 1;
      height: 36px;
      padding-left: 10px;
      padding-right: 20px;
      border: 1px solid #f1f1f1;
      background: none;
      outline: none;
    }
    i {
      position: absolute;
      right: 10px;
      cursor: pointer;
    }
  }
  .note-list {
    height: calc(100vh - 60px) !important;
    padding-bottom: 5px;
    overflow: auto;
    .note-list-item {
      display: flex;
      height: 56px;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid #f1f1f1;
      cursor: pointer;
      &:hover {
        background: rgba(37, 215, 255, 0.2);
      }
      .icon {
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-right: 10px;
        text-align: center;
        border-radius: 4px;
        i {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
        }
      }
      .content {
        flex: 1;
        .note-title {
          width: 180px;
          color: #000000;
          overflow: hidden;
        }
        .note-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          color: #0a419b;
          font-size: 12px;
        }
      }
    }
    .active-note-style {
      background: #f1f1f1;
      &:hover {
        background: #f1f1f1;
      }
    }
  }
}
</style>
