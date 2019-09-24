<template>
  <div class="event-list-main-component">
    <div class="event-list-nav">
      <el-date-picker
        v-model="activeDate"
        type="date"
        size="mini"
        placeholder="选择日期"
        @change="getEventListToDate"
      >
      </el-date-picker>
      <div class="switch-tab-section">
        <div
          class="no-finish-event-num"
          :class="{ 'active-switch-tab': activeClass === 'noEnd' }"
          @click="swicthTabToNoEnd"
        >
          待完成{{ eventList.length }}
        </div>
        <div
          class="finish-event-num"
          :class="{ 'active-switch-tab': activeClass === 'end' }"
          @click="swicthTabToEnd"
        >
          已完成{{ endEventList.length }}
        </div>
        <div
          class="finish-event-num"
          :class="{ 'active-switch-tab': activeClass === 'recycle' }"
          @click="swicthTabToRecycle"
        >
          废纸篓{{ recycleBinList.length }}
        </div>
      </div>
      <!--搜索区域-->
      <div class="search-section">
        <i class="el-icon-search"></i>
        <input
          v-model="searchContent"
          placeholder="输入关键字搜索!"
          type="text"
        />
        <i
          v-show="searchContent"
          class="el-icon-error"
          @click="clearSearchContent"
          style="width: 14px;"
        ></i>
      </div>
    </div>
    <!--<router-view></router-view>-->
    <noend-event-component
      v-show="activeClass === 'noEnd'"
      :searchContent="searchContent"
    ></noend-event-component>
    <end-event-component
      v-show="activeClass === 'end'"
      :searchContent="searchContent"
    ></end-event-component>
    <recycle-bin-component
      v-show="activeClass === 'recycle'"
      :searchContent="searchContent"
    ></recycle-bin-component>

    <!--新增事件按钮-->
    <div class="add-event-btn" @click="goAddEvent">
      <i class="iconfont icon-xinzeng"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import noendEventComponent from "../../../components/home/noEndEvent-component";
import endEventComponent from "../../../components/home/endEvent-component";
import recycleBinComponent from "../../../components/home/recycleBin-component";
export default {
  data() {
    return {
      activeDate: "",
      activeClass: "noEnd",
      searchContent: ""
    };
  },
  components: {
    noendEventComponent,
    endEventComponent,
    recycleBinComponent
  },
  computed: {
    ...mapState({
      eventList: state => state.home.eventList,
      endEventList: state => state.home.endEventList,
      recycleBinList: state => state.home.recycleBinList
    })
  },
  mounted() {
    this.getEventList();
    this.activeDate = new Date();
  },
  methods: {
    ...mapActions(["GetEventList"]),
    // 清空搜索内容
    clearSearchContent() {
      this.searchContent = "";
    },
    // 获取事项列表（未完成）
    getEventList(date) {
      let time = date ? new Date(date) : new Date();
      let startTime = Date.parse(
        new Date(
          `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
        )
      );
      let endTime = new Date().setTime(
        (startTime / 1000 + 24 * 60 * 60 - 1) * 1000
      );
      this.GetEventList({
        startTime: startTime,
        endTime: endTime,
        username: localStorage.getItem("username"),
        page: 1,
        size: 100
      })
        .then(data => {})
        .catch(err => {
          console.log(err);
          if (err.errcode) {
            this.$message({
              messgae: err.message,
              type: "error",
              duration: 1500
            });
            return;
          }
          this.$message({
            message: "网络错误!",
            type: "error",
            duration: 1500
          });
        });
    },
    // 获取指定日期的事件
    getEventListToDate(event) {
      // console.log(event)
      let date = this.moment(event).format("YYYY-MM-DD HH:mm:ss");
      this.getEventList(date);
    },
    swicthTabToNoEnd() {
      this.activeClass = "noEnd";
    },
    swicthTabToEnd() {
      this.activeClass = "end";
    },
    swicthTabToRecycle() {
      this.activeClass = "recycle";
    },
    // 编辑事件
    editEvent() {},
    // 今日完成
    addNowEndEventList() {},
    // 暂缓完成
    outInRecycleBin() {},
    // 完成
    endEvent() {
      let data = {
        _id: item._id
      };
      this.$store.commit("showLoading");
      request.endevent(`/endevent/${data._id}`, "put", data, res => {
        this.$store.commit("hideLoading");
        // 全局函数-showTips
        this.showTips(res);
        if (res.data.errcode === 0) {
          this.$emit("updateData", res.data.eventList, "no-end");
          return;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.event-list-main-component {
  .event-list-nav {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #cccccc;
    .el-date-editor {
      width: 170px;
    }
    .switch-tab-section {
      flex: 1;
      display: flex;
      .no-finish-event-num,
      .finish-event-num {
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        margin-left: 10px;
        cursor: pointer;
        border-radius: 6px;
      }
      .active-switch-tab {
        color: white;
        background: #383838;
      }
    }
    .search-section {
      display: flex;
      align-items: center;
      width: 180px;
      padding: 4px 5px;
      border-radius: 5px;
      background: #f3f3f3;
      input {
        flex: 1;
        width: 140px;
        padding: 0 5px;
        border: none;
        font-family: "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
        outline: none;
        background: none;
      }
    }
  }
  .sweet-tip {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .add-event-btn {
    position: fixed;
    bottom: 30px;
    right: 20px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #ffffff;
    background: #333333;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px #666666;
    .icon-xinzeng {
      font-size: 20px;
    }
  }
}
</style>
