<template>
	<div class="recycle-bin-main-component">
		<ul v-if="filterEventList.length" class="event-list">
			<li
				v-for="item in filterEventList"
				:key="item._id">
				<strong
					@click="editEvent(item)"
					class="item-content">{{item.eventName}}
				</strong>
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
	  data () {
	    return {}
		},
		computed: {
	    ...mapState({
        eventList: state => state.home.eventList
			}),
			filterEventList () {
	      return this.eventList.filter(item => {
	        return item.status === 2
				})
			}
		},
		methods: {
      ...mapActions([
        'DestoryEvent',
				'OutInRecycleBin'
      ]),
	    // 销毁事件
      destoryEvent (event) {
        this.DestoryEvent({
          _id: event._id
				})
					.then(data => {
					  this.$message({
							message: '事件销毁成功!',
							type: 'success'
						})
					})
					.catch(err => {
					  if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error'
              })
							return
						}
            this.$message({
              message: '网络错误!',
              type: 'error'
            })
					})
			},
			// 恢复事件
      outInRecycleBin (event) {
        this.OutInRecycleBin({
					_id: event._id
				})
					.then(data => {
					  this.$message({
							message: '事件已移出回收站!',
							type: 'success'
						})
					})
					.catch(err => {
					  if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'success'
              })
							return
						}
            this.$message({
              message: '网络错误!',
              type: 'success'
            })
					})
			}
		}
	}
</script>

<style lang="scss">
	.recycle-bin-main-component {
		.event-list {
			max-height: calc(100vh - 56px);
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
