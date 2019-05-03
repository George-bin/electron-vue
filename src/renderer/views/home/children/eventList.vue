<template>
	<div class="event-list-main-component">
		<ul v-if="eventList.length">
			<li
				v-for="item in eventList"
				:key="item._id">
				<span>{{ item.eventName }}</span>
				<!--<strong-->
					<!--@click="editEvent(item)"-->
					<!--class="item-content">{{item.eventName}}-->
				<!--</strong>-->
				<!--<template v-if="item.state === 0 || item.state === 3">-->
          <!--<span-->
						<!--class="edit-button"-->
						<!--v-if="item.state === 0"-->
						<!--@click="addNowEndEventList(item)">今日完成</span>-->
					<!--<span-->
						<!--class="edit-button"-->
						<!--v-else-if="item.state === 3"-->
						<!--@click="outInRecycleBin(item)">暂缓完成</span>-->
					<!--<span class="edit-button" @click="endEvent(item)">完成</span>-->
					<!--<span class="edit-button" @click="addRecycleBin(item)">回收</span>-->
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
	      'GetEventList'
			]),
	    // 获取事项列表
	    getEventList () {
	      this.GetEventList({
					username: 'geng',
					page: 1,
					size: 100
				})
					.then(data => {

					})
					.catch(err => {
					  console.log(err)
					})
			}
		}
	}
</script>

<style lang="scss">
	.event-list-main-component {}
</style>
