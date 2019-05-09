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
			<div
				class="no-finish-event-num"
				:class="{'active-switch-tab': activeClass === 'noEnd'}"
			  @click="swicthTabToNoEnd"
			>
				待完成{{eventList.length}}
			</div>
			<div
				class="finish-event-num"
				:class="{'active-switch-tab': activeClass === 'end'}"
			  @click="swicthTabToEnd"
			>
				已完成0
			</div>
			<div
				class="finish-event-num"
				:class="{'active-switch-tab': activeClass === 'recycle'}"
				@click="swicthTabToRecycle"
			>
				废纸篓{{eventlistForRecycleBin.length}}
			</div>
		</div>
		<ul v-if="eventList.length" class="event-list">
			<li
				v-for="item in eventList"
				v-if="item.status !== 2"
				:key="item._id">
				<strong
					@click="editEvent(item)"
					class="item-content">{{item.eventName}}
				</strong>
				<template v-if="item.status === 0 || item.status === 3">
          <!--<span-->
						<!--class="edit-button"-->
						<!--v-if="item.status === 0"-->
						<!--@click="addNowEndEventList(item)">今日完成</span>-->
					<!--<span-->
						<!--class="edit-button"-->
						<!--v-else-if="item.status === 3"-->
						<!--@click="outInRecycleBin(item)">暂缓完成</span>-->
					<span class="edit-button" @click="endEvent(item)">完成</span>
					<span class="edit-button" @click="addRecycleBin(item)">丢弃</span>
				</template>
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
	import { mapState, mapActions } from 'vuex'
	export default {
	  data () {
	    return {
        activeDate: '',
				activeClass: 'noEnd'
			}
		},
		computed: {
	    ...mapState({
        eventList: state => state.home.eventList,
				eventlistForRecycleBin: state => state.home.eventlistForRecycleBin
			})
		},
		mounted () {
	    this.getEventList()
			this.activeDate = new Date()
		},
		methods: {
	    ...mapActions([
	      'GetEventList',
				'AddRecycleBin'
			]),
	    // 获取事项列表（未完成）
	    getEventList () {
	      let time = new Date()
        let startTime = Date.parse(new Date(`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`))
        let endTime = new Date().setTime((startTime / 1000 + 24 * 60 * 60 - 1) * 1000)
	      this.GetEventList({
          startTime: startTime,
					endTime: endTime,
					username: localStorage.getItem('username'),
					page: 1,
					size: 100
				})
					.then(data => {

					})
					.catch(err => {
					  console.log(err)
					})
			},
			// 获取已完成事件
      getEventListToEnd () {},
			// 获取指定日期的事件
      getEventListToDate () {},
      swicthTabToNoEnd () {
	    	this.activeClass = 'noEnd'
			},
      swicthTabToEnd () {
				this.activeClass = 'end'
			},
			swicthTabToRecycle () {
				this.activeClass = 'recycle'
			},
			// 编辑事件
      editEvent () {},
			// 今日完成
      addNowEndEventList () {},
			// 暂缓完成
      outInRecycleBin () {},
			// 完成
      endEvent () {
				let data = {
					_id: item._id
				};
				this.$store.commit('showLoading');
				request.endevent(`/endevent/${data._id}`, 'put', data, (res) => {
					this.$store.commit('hideLoading');
					// 全局函数-showTips
					this.showTips(res)
					if (res.data.errcode === 0) {
						this.$emit('updateData', res.data.eventList, 'no-end');
						return;
					}
				});
			},
			// 删除(移入回收站)
      addRecycleBin (event) {
        this.AddRecycleBin({
          _id: event._id
				})
					.then(data => {
					  this.$message({
							message: '事件已移入回收站!',
							type: 'success',
							duration: 700
						})
					})
					.catch(err => {
						console.log(err)
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
			}
		}
	}
</script>

<style lang="scss">
	.event-list-main-component {
		.event-list-nav {
			display: flex;
			align-items: center;
			padding: 5px 20px;
			.el-date-editor {
				width: 170px;
			}
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
				background: gray;
			}
		}
		.event-list {
			max-height: calc(100vh - 76px - 38px);
			padding: 0 20px;
			overflow: auto;
			li {
				position: relative;
				display: flex;
				height: 40px;
				padding: 0 10px;
				border-bottom: 1px solid #f3f3f3;
				line-height: 40px;
				color: #333333;
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
			li:hover {
				background: #f7f7f7;
			}
		}
		// 隐藏滚动条
		.event-list::-webkit-scrollbar {
			display: none;
		}
		.sweet-tip {
			height: 40px;
			line-height: 40px;
			text-align: center;
		}
	}
</style>
