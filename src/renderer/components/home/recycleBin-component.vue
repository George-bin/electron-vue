<template>
	<div class="recycle-bin-main-component">
		<ul v-if="recycleBinList.length" class="event-list">
			<li
				v-for="item in filterEventList"
				:key="item._id">
				<div class="item-content" @click="goEventDetail(item)">
					<strong class="event-name">{{item.eventName}}</strong>
					<div class="event-date">{{ item.date }}</div>
				</div>
				<span class="edit-button" @click="destoryEvent(item)">销毁</span>
				<span class="edit-button" @click="outInRecycleBin(item)">恢复</span>
			</li>
		</ul>
		<div v-else class="sweet-tip">
			<p>回收站为空!</p>
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
				recycleBinList: state => state.home.recycleBinList
			}),
			filterEventList () {
				return this.recycleBinList.filter(item => {
					return item.eventName.indexOf(this.searchContent) > -1
				})
			}
		},
		cretead () {},
		mounted () {},
		methods: {
      ...mapActions([
        'DestoryEvent',
				'OutInRecycleBin',
				'GetEventListForRecycle'
      ]),
	    // 销毁事件
      destoryEvent (event) {
      	this.$confirm('确定清除该事件吗?', '提示', {
      		type: 'warning'
				})
					.then(() => {
						this.DestoryEvent({
							_id: event._id
						})
							.then(data => {
								this.$message({
									message: '事件销毁成功!',
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
									message: '网络错误!',
									type: 'error',
									duration: 700
								})
							})
					})
			},
			// 恢复事件
      outInRecycleBin (event) {
      	this.$confirm('确定恢复该事件吗?', '提示', {
      		type: 'warning'
				})
					.then(() => {
						this.OutInRecycleBin({
							_id: event._id
						})
							.then(data => {
								this.$message({
									message: '事件已移出回收站!',
									type: 'success',
									duration: 700
								})
							})
							.catch(err => {
								if (err.errcode) {
									this.$message({
										message: err.message,
										type: 'success',
										duration: 700
									})
									return
								}
								this.$message({
									message: '网络错误!',
									type: 'success',
									duration: 700
								})
							})
					})
			},
			// 前往事件详情
			goEventDetail () {}
		}
	}
</script>

<style lang="scss">
	.recycle-bin-main-component {
		.event-list {
			max-height: calc(100vh - 76px - 49px - 40px);
			padding: 20px;
			overflow: auto;
			li {
				position: relative;
				display: flex;
				align-items: center;
				padding: 0 10px;
				border: 1px solid #e6e6e6;
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
		.sweet-tip {
			height: 40px;
			line-height: 40px;
			text-align: center;
		}
	}
</style>
