<template>
	<div class="event-list-main-component">
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
          <span
						class="edit-button"
						v-if="item.status === 0"
						@click="addNowEndEventList(item)">今日完成</span>
					<span
						class="edit-button"
						v-else-if="item.status === 3"
						@click="outInRecycleBin(item)">暂缓完成</span>
					<span class="edit-button" @click="endEvent(item)">完成</span>
					<span class="edit-button" @click="addRecycleBin(item)">删除</span>
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
	    return {}
		},
		computed: {
	    ...mapState({
        eventList: state => state.home.eventList
			})
		},
		mounted () {
	    this.getEventList()
		},
		methods: {
	    ...mapActions([
	      'GetEventList',
				'AddRecycleBin'
			]),
	    // 获取事项列表
	    getEventList () {
	      this.GetEventList({
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
			// 编辑事件
      editEvent () {},
			// 今日完成
      addNowEndEventList () {},
			// 暂缓完成
      outInRecycleBin () {},
			// 完成
      endEvent () {},
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
		.event-list {
			max-height: calc(100vh - 45px);
			padding: 0 20px;
			overflow: auto;
			li {
				position: relative;
				display: flex;
				height: 40px;
				padding: 0 10px;
				border-bottom: 1px solid #dfdfdf;
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
