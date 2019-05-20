<template>
  <div class="note-list-main-component">
    <ul class="note-list">
      <li
         v-for="item in noteList"
         :key="item._id"
         class="note-list-item"
         @click="goNoteDetail(item)"
         :style="{'background': activeNoteId === item._id ? '#DFDFDF' : '#FFFFFF'}"
      >
        <p class="note-title ellipsis">{{ item.noteName }}</p>
        <!--<p class="note-content">{{ item.noteContent }}</p>-->
        <p class="note-footer">
          <span class="note-createTime">{{ item.createTime }}</span>
          <span class="delete-btn" @click="deleteNote(item)">删除笔记</span>
        </p>
        <!--右键菜单-->
        <!--<ul>-->
          <!--<li>删除笔记</li>-->
        <!--</ul>-->
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
        activeNoteId: ''
      }
    },
    computed: {
      ...mapState({
        noteList: state => state.home.noteList
      })
    },
    watch: {
      noteList: {
        handler: function(val, oldVal) {
          // debugger
        },
        deep: true
      }
    },
    methods: {
      ...mapMutations([
        'SET_ACTIVE_NOTE'
      ]),
      ...mapActions([
        'DeleteNote'
      ]),
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
              _id: note._id
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
                    duration: 700
                  })
                  return
                }
                this.$message({
                  message: '网络错误!',
                  type: 'error',
                  duration: 700
                })
              })
          })
          .catch(() => {})
      }
    }
  }
</script>

<style lang="scss">
  .note-list-main-component {
    height: calc(100vh - 31px) !important;
    border-right: 1px solid #CCCCCC;
    overflow: auto;
    .note-list {
      width: 200px;
      padding: 5px;
      .note-list-item {
        padding: 5px;
        border-bottom: 2px solid #FFFFFF;
        cursor: pointer;
        .note-title {
          color: #000000;
        }
        .note-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          color: #4674B3;
          font-size: 14px;
        }
      }
      .note-list-item:hover {
        background: #DFDFDF !important;
      }
    }
  }
</style>
