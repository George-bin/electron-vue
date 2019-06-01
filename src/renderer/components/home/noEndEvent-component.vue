<template>
  <div class="no-enc-event-main-component">
    <ul v-if="eventList.length" class="event-list">
      <li
        v-for="item in filterEventList"
        v-if="item.status !== 2"
        :key="item._id">
        <div class="item-content" @click="goEventDetail(item)">
          <strong class="event-name">{{item.eventName}}</strong>
          <div class="event-date">{{ item.createTime }}</div>
        </div>
        <span class="edit-button" @click="endEvent(item)">完成</span>
        <span class="edit-button" @click="addRecycleBin(item)">丢弃</span>
        <!--<template v-if="item.status === 0 || item.status === 3">-->
          <!--<span class="edit-button" v-if="item.status === 0" @click="addNowEndEventList(item)">今日完成</span>-->
          <!--<span class="edit-button" v-else-if="item.status === 3" @click="outInRecycleBin(item)">暂缓完成</span>-->
          <!--<span class="edit-button" @click="endEvent(item)">完成</span>-->
          <!--<span class="edit-button" @click="addRecycleBin(item)">丢弃</span>-->
        <!--</template>-->
        <!--<template v-else-if="item.state === 1">-->
          <!--<span class="edit-button" @click="addToNoEndEvent(item)">尚未完成</span>-->
        <!--</template>-->
        <!--<template v-else>-->
          <!--<span class="edit-button" @click="clearEvent(item)">销毁</span>-->
          <!--<span class="edit-button" @click="outInRecycleBin(item)">恢复</span>-->
        <!--</template>-->
      </li>
    </ul>
    <div v-else class="sweet-tip">
      <p>待办事项为空!</p>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    props: {
      searchContent: {
        type: String,
        default: ''
      }
    },
    data () {
      return {}
    },
    computed: {
      ...mapState({
        eventList: state => state.home.eventList
      }),
      filterEventList () {
        return this.eventList.filter(item => {
          return item.eventName.indexOf(this.searchContent) > -1
        })
      }
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'AddRecycleBin',
        'EndEvent'
      ]),
      // 查看事件详情
      goEventDetail (event) {
        console.log(this.$router)
        this.$router.push('/home/eventDetail')
      },

      // 添加到完成事件
      endEvent (item) {
        let data = {
          _id: item._id
        }
        this.EndEvent(data)
          .then(() => {
            this.$message({
              message: '已添加至完成事件!',
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
              message: err,
              type: 'error',
              duration: 1500
            })
          })
      },

      // 删除(移入回收站)
      addRecycleBin (event) {
        this.$confirm('确定删除该事件吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.AddRecycleBin({
              _id: event._id
            })
              .then(data => {
                this.$message({
                  message: '事件已移入回收站!',
                  type: 'success',
                  duration: 1500
                })
              })
              .catch(err => {
                console.log(err)
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
      }
    }
  }
</script>

<style lang="scss">
  .no-enc-event-main-component {
    .event-list {
      max-height: calc(100vh - 76px - 50px - 40px);
      /*padding: 0 20px;*/
      padding: 20px;
      overflow: auto;
      li {
        position: relative;
        display: flex;
        align-items: center;
        /*height: 60px;*/
        padding: 0 10px;
        border: 1px solid #e6e6e6;
        /*line-height: 60px;*/
        color: #333333;
        border-radius: 5px;
        box-shadow: 0 0 10px #dedede;
        .item-content {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          .event-name {
            line-height: 40px;
          }
          .event-date {
            line-height: 20px;
            font-size: 12px;
            color: gray;
          }
        }
        .edit-button {
          margin-left: 10px;
          cursor: pointer;
        }
        .edit-button:hover {
          color: orange;
        }
      }
      li + li {
        margin-top: 10px;
      }
      li:hover {
        border: 1px solid #dfdfdf;
        background: #f7f7f7;
      }
    }
    // 隐藏滚动条
    .event-list::-webkit-scrollbar {
      display: none;
    }
  }
</style>
