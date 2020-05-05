<template>
  <div
    id="wrapper"
    :style="{
      paddingTop: isMac ? '0' : '26px'
    }"
    @click="recovalNormal">
    <el-container
      class="event-list-box">
      <el-aside
        class="aside-menu-section">
        <!-- 用户信息 -->
        <user-info></user-info>
        <div
          :style="{
            height: isMac ? 'calc(100vh - 56px - 50px)' : 'calc(100vh - 26px - 56px - 50px)'
          }"
          class="catalog-section">
          <!-- 结构树 -->
          <tree
            :folder="notebookTree"
            @showCreateNotebookDialog="onShowCreateNotebookDialog">
          </tree>
        </div>
        <div
          class="recycle-bin"
          @click="getRecycleBinNoteList"
          :style="{
            background: activeModule === 'recycleBin' ? '#525252' : ''
          }">
          <img class="trash-icon" src="../../../../static/img/trash.png" alt="icon" />
          <span>废纸篓</span>
        </div>
      </el-aside>

      <!--右侧显示-->
      <el-main
        :style="{borderTop: isMac ? 0 : '1px solid #cccccc'}">
        <!--当前笔记本中的笔记-->
        <div class="left-section">
          <note-list></note-list>
        </div>
        <div class="right-section">
          <!--子路由-->
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
    <!-- 文件夹右键菜单 -->
    <notebook-right-menu
      @showCreateNotebookDialog="onShowCreateNotebookDialog"
      @showUpdateNotebookDialog="onShowUpdateNotebookDialog">
    </notebook-right-menu>
    <!-- 笔记右键菜单 -->
    <note-right-menu></note-right-menu>
    <!-- 创建笔记本 -->
    <create-notebook-dialog ref="createNotebookDialog"></create-notebook-dialog>
    <!--重命名笔记本-->
    <update-notebook-dialog ref="updateNotebookDialog"></update-notebook-dialog>
  </div>
  <!-- https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.4.0/winCodeSign-2.4.0.7z -->
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Home",
  components: {
    tree: () => import('@/components/home/tree-component.vue'),
    noteList: () => import('@/components/note/note-list-component.vue'),
    UserInfo: () => import('@/components/home/user-info-component.vue'),
    UpdateNotebookDialog: () => import('@/components/notebook/update-notebook-dialog.vue'),
    CreateNotebookDialog: () => import('@/components/notebook/create-notebook-dialog.vue'),
    NotebookRightMenu: () => import('@/components/notebook/notebook-right-menu-component.vue'),
    NoteRightMenu: () => import('@/components/note/note-right-menu-component')
  },
  data() {
    return {
      isPlayingFlag: false
    };
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      notebookTree: state => state.notebook.notebookTree,
      activeModule: state => state.home.activeModule,
      activeNotebook: state => state.notebook.activeNotebook
    })
  },
  watch: {},
  created() {
    this.initData();
    console.log(this.$route);
  },
  mounted() {},
  methods: {
    ...mapMutations([
      'SET_RIGHT_MENU_POSITION',
      "SET_NOTE_RIGHT_MENU_POSITION",
      "SET_ACTIVE_NOTE"
    ]),
    ...mapActions([
      "GetNotebookTree",
      "CreateNotebook",
      "GetRecycleBinNoteList",
    ]),
    // 初始化页面信息
    initData() {
      this.GetNotebookTree();
    },

    onShowCreateNotebookDialog() {
      this.$refs.createNotebookDialog.$emit('showDialog')
    },

    onShowUpdateNotebookDialog() {
      this.$refs.updateNotebookDialog.$emit('showDialog')
    },

    goBack() {
      this.$router.back();
    },

    // 恢复默认行为
    recovalNormal() {
      this.SET_NOTE_RIGHT_MENU_POSITION(null);
      this.SET_RIGHT_MENU_POSITION(null);
    },

    // 获取废纸篓中的数据
    getRecycleBinNoteList() {
      this.GetRecycleBinNoteList()
        .then(data => {
          let { errcode, noteList } = data;
          if (errcode === 0) {
            if (noteList && noteList.length) {
              this.SET_ACTIVE_NOTE(noteList[0]);
              this.$router.push("/home/noteDetail");
            } else {
              this.$router.push("/home/noContent");
            }
          } else {
            this.$message({
              type: 'warning',
              message
            });
          }
        })
        .catch(err => {
          console.error('获取废纸篓中的数据失败:', err);
          this.$message({
            type: 'error',
            message: '获取废纸篓中的数据失败!'
          });
        });
    },

    // 播放音乐
    // playMusic () {
    //   if (this.isPlayingFlag) {
    //     this.$refs.audioElement.pause()
    //     this.isPlayingFlag = false
    //     return
    //   }
    //   this.isPlayingFlag = true
    //   this.$refs.audioElement.play()
    // },
  }
};
</script>

<style lang="scss">
#wrapper {
  .event-list-box {
    .aside-menu-section {
      width: 220px !important;
      text-align: left;
      line-height: 30px;
      background: #333333;
      color: white;
      overflow: hidden;
      transition: left 1s;
      .catalog-section {
        overflow: auto;
        &::-webkit-scrollbar {
          display:none
        }
      }
      .recycle-bin {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 20px;
        background: #3c3c3c;
        &:hover {
          // background: #8e8e8e !important;
          cursor: pointer;
        }
        .trash-icon {
          width: 24px;
          height: 24px;
        }
        span {
          margin-left: 4px;
        }
      }
      .el-menu {
        width: 100%;
        .el-submenu__title {
          display: flex;
          align-items: center;
          height: 45px;
          /*line-height: 45px;*/
          padding: 0 !important;
        }
        .el-menu-item {
          height: 45px;
          line-height: 45px;
        }
      }
    }
    .el-main {
      padding: 0;
      display: flex;
      .right-section {
        flex: 1;
      }
    }
  }
}
</style>
