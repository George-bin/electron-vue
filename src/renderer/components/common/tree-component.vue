<template>
  <ul class="tree-main-component">
    <li class="tree-item" v-for="item in folder">
      <div
        class="notebook-name"
        @click="selectNode(item)"
        @click.right="showRightKeyMenu($event, item)"
        :style="{'padding-left': item.nodeClass * 20 + 'px', 'background': item.isActive && activeModule === 'tree' ? '#525252' : '#333333'}"
        :class="[{'top-level-node': item.nodeClass === 1}]"
      >
        <img v-if="item.children && item.children.length" src="../../../../static/img/sanjiaoxing.png" style="width: 12px; height: 12px;" :class="{'expand-node': item.show}" alt="icon" />
        <i class="iconfont icon-bijiben"></i>
        <span class="content ellipsis" :title="item.label">{{ item.label }}</span>
        <span class="note-num" v-if="item.nodeClass === 3">({{ item.noteNum }})</span>
        <i v-if="item.nodeClass === 1" class="iconfont icon-jiahao" @click.stop="startCreateNotebook(item)" title="创建笔记本"></i>
      </div>
      <!--右键菜单 笔记本-->
      <ul
        v-if="item.rightKeyMenu && item.nodeClass && item.nodeClass < 3"
        class="right-key-menu-list"
        :style="{'top': rightKeyMenuPosition.y, 'left': rightKeyMenuPosition.x}"
      >
        <li @click="startCreateNotebook(item)">在“{{ item.label }}”中创建笔记本</li>
        <li v-if="item.nodeClass !== 1" @click="startUpdateNotebook(item)">重命名</li>
        <li v-if="item.nodeClass !== 1" @click="deleteBotebook(item)">删除</li>
      </ul>
      <!--右键菜单 笔记-->
      <ul
        v-if="item.rightKeyMenu && item.nodeClass === 3"
        class="right-key-menu-list"
        :style="{'top': rightKeyMenuPosition.y, 'left': rightKeyMenuPosition.x}"
      >
        <li v-if="item.nodeClass !== 1" @click="startUpdateNotebook(item)">重命名</li>
        <li @click="startCreateNote(item)">新建笔记</li>
        <li @click="deleteBotebook(item)">删除笔记本</li>
      </ul>
      <tree v-if="item.children && item.show" :folder="item.children"></tree>
    </li>
  </ul>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    props: ['folder'],
    name: 'tree',
    data () {
      return {
        activeNode: '',
        // 右键菜单的位置
        rightKeyMenuPosition: {
          x: 0,
          y: 0
        }
      }
    },
    components: {},
    computed: {
      ...mapState({
        activeModule: state => state.home.activeModule
      })
    },
    watch: {},
    mounted () {},
    methods: {
      ...mapMutations([
        'SET_PARENT_NODE',
        'SET_ACTIVE_NOTEBOOK',
        'SET_RIGHT_KEY_MENU_TREE',
        'SET_ACTIVE_NODE',
        'SET_UPDATE_NOTEBOOK',
        'SET_ACTIVE_NOTE'
      ]),
      ...mapActions([
        'DeleteNotebook',
        'GetNoteList'
      ]),
      // 开始创建笔记本
      startCreateNotebook (item) {
        this.SET_PARENT_NODE(item)
      },
      // 开始创建笔记
      startCreateNote (item) {
        let activeNode = JSON.parse(JSON.stringify(item))
        delete activeNode.children
        this.SET_ACTIVE_NOTEBOOK(activeNode)
        this.$router.push({ name: 'createNode', params: { type: 'createNote' }})
      },
      // 显示右键菜单
      showRightKeyMenu (event, item) {
        this.rightKeyMenuPosition.x = event.x + 'px'
        this.rightKeyMenuPosition.y = event.y + 'px'
        this.$nextTick(() => {
          this.SET_RIGHT_KEY_MENU_TREE(item)
        })
      },
      // 选择节点
      selectNode (item) {
        this.activeNode = item._id
        this.SET_ACTIVE_NODE(item)

        let noteBook = JSON.parse(JSON.stringify(item))
        delete noteBook.children
        this.SET_ACTIVE_NOTEBOOK(noteBook)

        this.GetNoteList({
          username: localStorage.getItem('username'),
          notebookCode: item.notebookCode
        })
          .then(data => {
            if (data.length) {
              this.SET_ACTIVE_NOTE(data[0])
              this.$router.push('/home/noteDetail')
            } else {
              this.SET_ACTIVE_NOTE({})
              this.$router.push('/home/noContent')
            }
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
      },
      // 删除笔记本
      deleteBotebook (item) {
        this.$confirm('确定删除该笔记本吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.DeleteNotebook({
              _id: item._id
            })
              .then(data => {
                this.$message({
                  message: '笔记本已删除!',
                  type: 'success',
                  duration: 1500
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
      // 准备更新笔记本
      startUpdateNotebook (notebook) {
        this.SET_UPDATE_NOTEBOOK(notebook)
      }
    }
  }
</script>

<style lang="scss">
  body {
    padding-top: 100px;
  }
  .expand-node {
    transform: rotate(90deg);
  }
  .tree-main-component {
    .tree-item {
      .notebook-name {
        display: flex;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
        .content {
          flex: 1;
          margin-left: 5px;
        }
        .note-num {
          margin: 0 10px;
        }
        .icon-jiahao {
          margin: 0 20px;
          font-size: 12px;
        }
        .icon-bijiben {
          margin-left: 10px;
          font-size: 20px;
        }
      }
      .top-level-node {
        height: 40px;
        font-size: 16px;
      }
      .active-node {
        background: #525252;
      }
      .notebook-name:hover {
        background: #525252 !important;
      }
      .right-key-menu-list {
        position: fixed;
        width: 200px;
        padding: 0 10px 0 20px;
        border: 1px solid #A7A7A7;
        font-size: 12px;
        color: #333333;
        background: #F7F7F7;
        z-index: 999;
        li {
          height: 28px;
          line-height: 28px;
          text-align: left;
          cursor: pointer;
        }
        li + li {
          border-top: 1px solid #DFDFDF;
        }
      }
    }
  }
</style>
