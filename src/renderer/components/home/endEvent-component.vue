<template>
  <div class="end-event-main-component">
    <ul v-if="endEventList.length" class="event-list">
      <li
        v-for="item in filterEventList"
        :key="item._id">
        <strong @click="editEvent(item)" class="item-content">{{item.eventName}}</strong>
        <span class="edit-button" @click="addToNoEndEvent(item)">未完成</span>
      </li>
    </ul>
    <div v-else class="sweet-tip">
      <p>未完成任何事件!</p>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
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
        endEventList: state => state.home.endEventList
      }),
      filterEventList () {
        return this.endEventList.filter(item => {
          return item.eventName.indexOf(this.searchContent) > -1
        })
      }
    },
    methods: {
      ...mapActions([
        'AddToNoEndEvent'
      ]),
      // 将完成事件移至未完成事件
      addToNoEndEvent (event) {
        let data = {
          _id: event._id
        }
        this.AddToNoEndEvent(data)
          .then(() => {
            this.$message({
              message: '事件已移至未完成!',
              type: 'success',
              duration: 700
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
              message: err,
              type: 'error',
              duration: 700
            })
          })
        this.$store.commit('showLoading');
        request.tonoendevent(`/toNoEndEvent/${event._id}`, 'put', data, (res) => {
          this.$store.commit('hideLoading');
          // 全局函数-showTips
          this.showTips(res)
          if (res.data.errcode === 0) {
            this.$emit('updateData', res.data.eventList, 'end');
            return;
          }
        });
      },
    }
  }
</script>

<style lang="scss">
  .end-event-main-component {
    .event-list {
      max-height: calc(100vh - 76px - 49px - 40px);
      padding: 20px;
      overflow: auto;
      li {
        position: relative;
        display: flex;
        height: 60px;
        padding: 0 10px;
        border: 1px solid #e6e6e6;
        line-height: 60px;
        color: #333333;
        border-radius: 5px;
        box-shadow: 0 0 10px #dedede;
        .item-content {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
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
