<template>
  <div
    id="wrapper"
    @click="recovalNormal">
    <el-container
      :style="{
        paddingTop: isMac ? 0 : '30px'
      }"
      class="event-list-box">
      <el-aside
        :style="{
          height: isMac ? '100vh' : 'calc(100vh - 30px)'
        }"
        class="aside-menu-section"
        style="width: 240px">
        <div class="create-note" @click="handleStartCreateNote">
          <i
            class="iconfont icon-jiahao"
            :style="{
              background:
                activeNotebook.nodeClass === 3 ||
                activeNotebook.notebookCode === '-2'
                  ? 'orange'
                  : 'gray'
            }"
          ></i>
          <span>新建笔记</span>
        </div>
        <div class="catalog-section">
          <tree :folder="notebookTree"></tree>
          <div
            class="recycle-bin"
            @click="getRecycleBinNoteList"
            :style="{
              background: activeModule === 'recycleBin' ? '#525252' : 'none'
            }"
          >
            <i class="iconfont icon-huishouzhan"></i>
            <span>废纸篓({{ recycleBinNoteNum }})</span>
          </div>
        </div>
      </el-aside>

      <!--右侧显示-->
      <el-main
        :style="{
          borderTop: isMac ? 0 : '1px solid #cccccc'
        }">
        <!--当前笔记本中的笔记-->
        <div class="left-section">
          <note-list></note-list>
        </div>
        <!--<i v-else class="iconfont icon-fanhui back-btn" title="返回" @click="goBack"></i>-->
        <!--<i class="iconfont icon-bofang play-music-btn" :class="{ 'play-music-btn-remote': isPlayingFlag }" @click="playMusic" title="静心聆听"></i>-->
        <!--<audio src="../../../../static/music/花粥-纸短情长.mp3" loop ref="audioElement"></audio>-->
        <div class="right-section">
          <!--子路由-->
          <router-view></router-view>
        </div>
      </el-main>
      <!--创建笔记本-->
      <create-notebook-dialog
        ref="createNotebookDialog"
      ></create-notebook-dialog>
      <!--重命名笔记本-->
      <update-notebook-dialog
        ref="updateNotebookDialog"
      ></update-notebook-dialog>
    </el-container>
  </div>
</template>

<script>
import Aplayer from "vue-aplayer";
import tree from "@/components/common/tree-component";
import eventlistTemplate from "@/components/eventlist-template";
import windowFrame from "@/components/common/windowFrame-component.vue";
import createNotebookDialog from "@/components/home/createNotebook-dialog.vue";
import updateNotebookDialog from "@/components/home/updateNotebook-dialog.vue";
import noteList from "@/components/home/noteList-component.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "landing-page",
  data() {
    return {
      eventData: "", // 添加事件名字
      eventList: [], // 当前显示事件列表
      allEventList: [], // 总的事件列表
      activeClass: "no-end", // 当前选中分类
      isPlayingFlag: false,
      // 开始编辑事件名称
      isEditEventNameFlag: false,
      // 新的事件名称
      newEventName: "",
      defaultProps: {
        children: "children",
        label: "notebookName"
      }
    };
  },
  components: {
    windowFrame,
    eventlistTemplate,
    Aplayer,
    tree,
    createNotebookDialog,
    noteList,
    updateNotebookDialog
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      username: state => state.user.username,
      editEvent: state => state.home.editEvent,
      showLeftMenuFlag: state => state.home.showLeftMenuFlag,
      notebookTree: state => state.home.notebookTree,
      parentNode: state => state.home.parentNode,
      recycleBinNoteNum: state => state.home.recycleBinNoteNum,
      activeModule: state => state.home.activeModule,
      updateNotebook: state => state.home.updateNotebook,
      activeNotebook: state => state.home.activeNotebook
    })
  },
  watch: {
    parentNode: function(val, oldVal) {
      if (!val) return;
      this.$refs.createNotebookDialog.$emit("showDialog");
    },
    updateNotebook: function(val, oldVal) {
      if (!val) return;
      this.$refs.updateNotebookDialog.$emit("showDialog", val);
    }
  },
  created() {
    this.initData();
    console.log(this.$route);
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "RECOVER_NOTEBOOK_TREE",
      "SET_NOTE_RIGHT_KEY_MENU",
      "SET_ACTIVE_NOTE"
    ]),
    ...mapActions([
      "GetNotebookTree",
      "CreateNotebook",
      "GetRecycleBinNoteList",
      "GetRecycleBinNoteNum"
    ]),
    // 初始化页面信息
    initData() {
      this.GetNotebookTree();
      this.GetRecycleBinNoteNum();
    },

    goBack() {
      this.$router.back();
    },

    // 恢复默认行为
    recovalNormal() {
      this.RECOVER_NOTEBOOK_TREE();
      this.SET_NOTE_RIGHT_KEY_MENU("");
    },

    // 获取废纸篓中的数据
    getRecycleBinNoteList() {
      this.GetRecycleBinNoteList({
        username: localStorage.getItem("username")
      }).then(data => {
        let { noteList } = data;
        if (noteList && noteList.length) {
          this.SET_ACTIVE_NOTE(noteList[0]);
          this.$router.push("/home/noteDetail");
        } else {
          this.$router.push("/home/noContent");
        }
      });
    },

    // 开始新建笔记
    handleStartCreateNote() {
      if (
        this.activeNotebook.nodeClass === 3 ||
        this.activeNotebook.notebookCode === "-2"
      ) {
        this.$router.push({
          name: "createNode",
          params: { type: "createNote" }
        });
      }
    }

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
  height: 100%;
  .event-list-box {
    height: 100%;
    .aside-menu-section {
      text-align: left;
      line-height: 30px;
      background: #333333;
      color: white;
      overflow: hidden;
      transition: left 1s;
      .create-note,
      .create-note-book {
        display: flex;
        align-items: center;
        height: 45px;
        padding: 0 20px;
        font-size: 16px;
        color: #e6e6e6;
        .icon-jiahao {
          width: 28px;
          height: 28px;
          line-height: 28px;
          font-size: 16px;
          text-align: center;
          color: white;
          background: orange;
          border-radius: 50%;
        }
        span {
          margin-left: 10px;
        }
      }
      .create-note:hover {
        color: white;
        cursor: pointer;
      }
      .catalog-section {
        height: calc(100vh - 75px);
        overflow: auto;
      }
      .recycle-bin {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
      }
      .recycle-bin:hover {
        background: #525252 !important;
        cursor: pointer;
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
      display: flex;
      padding: 0;
      transition: margin-left 1s;
      .el-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 45px !important;
        border-bottom: 1px solid #cccccc;
        text-align: right;
        background: #f7f7f7;
        .edit-event-name {
          width: 320px;
          text-align: center;
          cursor: pointer;
        }
        .back-btn {
          font-size: 24px;
          cursor: pointer;
        }
        .edit-event-name-input {
          width: 300px;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          border: none;
          outline: none;
          background: #dfdfdf;
        }
        strong {
          margin-right: 10px;
          color: orange;
        }
        span {
          cursor: pointer;
        }
        .play-music-btn {
          font-size: 24px;
          cursor: pointer;
        }
        .play-music-btn-remote {
          animation: rotate 3s linear infinite;
        }
        @keyframes remote {
          from {
            -webkit-transform: rotate(0deg);
          }
          to {
            -webkit-transform: rotate(360deg);
          }
        }
      }
      .right-section {
        flex: 1;
      }
    }
  }
}
</style>
