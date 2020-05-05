<template>
  <div
    v-if="noteRightMenuPosition"
    :style="{
      left: noteRightMenuPosition.x,
      top: noteRightMenuPosition.y
    }"
    class="note-right-menu-component">
    <!--右键菜单-->
    <ul
      class="right-key-menu">
      <template v-if="activeNote.status === 1">
        <li class="right-key-menu-item" @click="handleClickDeleteNote">
          删除笔记
        </li>
        <li class="right-key-menu-item" @click="handleClickClearNote('delete')">
          永久删除笔记
        </li>
      </template>
      <template v-else-if="activeNote.status === 2">
        <li class="right-key-menu-item" @click="handleRestoreNote">
          还原笔记
        </li>
        <li class="right-key-menu-item" @click="handleClickClearNote('clear')">
          永久删除笔记
        </li>
      </template>
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
    return {}
  },
  computed: {
    ...mapState({
      activeNote: state => state.note.activeNote,
      noteRightMenuPosition: state => state.note.noteRightMenuPosition
    })
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations([
      'SET_NOTE_RIGHT_MENU_POSITION'
    ]),
    ...mapActions([
      'DeleteNote',
      'RestoreNote',
      'ClearNote'
    ]),
    // 删除笔记
    handleClickDeleteNote() {
      this.$confirm('确定删除该笔记吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.DeleteNote(this.activeNote._id)
            .then(data => {
              let { errcode, message } = data;
              if (errcode === 0) {
                this.$message({
                  type: 'success',
                  message: '将一条笔记丢入废纸篓中!'
                });
                this.$router.push('/home/noContent');
              } else {
                this.$message({
                  type: 'warning',
                  message
                });
              }
            })
            .catch(err => {
              console.error('将笔记移入废纸篓中失败:', err);
              this.$message({
                type: 'error',
                message: '将笔记移入废纸篓中失败!'
              });
            })
        })
        .catch(() => {})
    },

    // 还原笔记
    handleRestoreNote() {
      this.SET_NOTE_RIGHT_MENU_POSITION(null)
      this.$confirm('确定还原笔记吗？', '提示', {
        type: 'warning'
      })
        .then(data => {
          this.RestoreNote(this.activeNote._id)
            .then(data => {
              let { errcode, message } = data;
              if (errcode === 0) {
                this.$message({
                  type: 'success',
                  message: '从废纸篓中还原了一条笔记!'
                })
                this.$router.push('/home/noContent')
              } else {
                this.$message({
                  type: 'warning',
                  message
                })
              }
            })
            .catch(err => {
              console.error('还原笔记失败:', err)
              this.$message({
                type: 'error',
                message: '还原笔记失败!'
              })
            })
        })
        .catch(err => {
          console.log('取消还原笔记!', err)
        })
    },

    // 永久删除笔记
    handleClickClearNote(type) {
      let note = JSON.parse(JSON.stringify(this.activeNote));
      this.SET_NOTE_RIGHT_MENU_POSITION(null);
      this.$confirm('确定永久性删除该笔记吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.ClearNote({note, type})
          .then(data => {
            let { errcode, message } = data;
            if (errcode === 0) {
              this.$message({
                type: 'success',
                message: '彻底删除了一条笔记!'
              });
              this.$router.push('/home/noContent')
            } else {
              this.$message({
                type: 'warning',
                message: data.message,
              });
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '永久删除笔记失败!'
            })
            console.error('永久删除笔记失败!', err)
          })
      })
    }
  }
}
</script>

<style lang="scss">
.note-right-menu-component {
  position: fixed;
  z-index: 999;
  .right-key-menu {
    width: 180px;
    padding: 0 10px 0 20px;
    border: 1px solid #a7a7a7;
    color: #333333;
    background: #f7f7f7;
    .right-key-menu-item {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
    li + li {
      border-top: 1px solid #dfdfdf;
    }
  }
}
</style>
