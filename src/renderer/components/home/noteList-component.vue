<template>
  <div
    :style="{
      height: isMac ? '100vh' : 'calc(100vh - 31px)'
    }"
    class="note-list-main-component">
    <!-- 搜索区域 -->
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
    <!-- 列表区域 -->
    <ul class="note-list">
      <li
        v-for="item in filterNoteList"
        :key="item._id"
        class="note-list__item"
        @click="handleGoNoteDetail(item)"
        @click.right="handleShowRightKeyMenu($event, item)"
        :class="{ 'active-note-style': activeNote._id === item._id }"
        :title="item.title">
        <div class="note-list__item-content">
          <div class="left-box">
            <div class="title">
              <span
                :style="{
                  background: item.type === 'draft' ? '#0a419b' : 'rgb(241,201,63)'
                }"
                class="icon">
                <i v-if="item.type === 'draft'" class="iconfont icon-biji"></i>
                <i v-else class="el-icon-tickets" style="margin-top: 2px"></i>
              </span>
              <p class="note-title ellipsis">{{ item.title ? item.title : '无标题文档' }}</p>
            </div>
            <p class="time">
              <span class="note-createTime">{{ $moment(item.createTime).format('YYYY-MM-DD HH:mm') }}</span>
              <button class="introduction-btn" @click.stop="handleClickUpdateIntroduction(item)">简介</button>
            </p>
          </div>
          <div class="right-box">
            <img class="cover-img" :src="item.img ? item.img : '../../../../static/img/normal-cover.jpeg'" alt="cover" />
          </div>
        </div>
      </li>
    </ul>
    <!-- 添加笔记简介 -->
    <note-introduction ref="noteIntroduction"></note-introduction>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    NoteIntroduction: () => import('@/components/Note/noteIntroduction.vue')
  },
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
      if (note._id === this.activeNote._id) return;
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
    },
    // 更新简介
    handleClickUpdateIntroduction(note) {
      this.$refs.noteIntroduction.$emit('showDialog', note)
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
    .note-list__item {
      border-bottom: 1px solid #f1f1f1;
      padding: 6px 10px;
      cursor: pointer;
      &:hover {
        background: rgba(37, 215, 255, 0.2);
      }
      .note-list__item-content {
        display: flex;
        align-items: center;
        .left-box {
          flex: 1;
          .title {
            display: flex;
            align-items: center;
            .icon {
              width: 18px;
              height: 18px;
              line-height: 18px;
              margin-right: 5px;
              text-align: center;
              border-radius: 4px;
              i {
                font-size: 14px;
                font-weight: bold;
                color: #fff;
              }
            }
            .note-title {
              width: 140px;
              color: #000000;
              overflow: hidden;
            }
          }
          .time {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            color: #0a419b;
            font-size: 12px;
            .introduction-btn {
              margin-right: 10px;
              font-size: 10px;
              font-weight: bold;
              color: #0a419b;
              border: none;
              background: none;
              outline: none;
              cursor: pointer;
            }
          }
        }
        .right-box {
          .cover-img {
            width: 60px;
            height: 44px;
            overflow: hidden;
          }
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
