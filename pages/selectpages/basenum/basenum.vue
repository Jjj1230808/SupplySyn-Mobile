<template>
	<view>
		<navbar :userName="userName"></navbar>
		<view class="back">
			<view class="" @click="backTo">
				<uni-icons type="back" style="font-size: 31.25rpx;"></uni-icons>&nbsp;&nbsp;返回
			</view>


		</view>
		<uni-list style="font-size: 83.33rpx;">
			<uni-list-item clickable v-for="(item,index) in stationNo" :key="index" :title="item.stationNo" note=""
				@click="selAction(item.stationNo)">
			</uni-list-item>

		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stationNo: [],
				userName: ''
			};
		},
		onLoad(options) {
			let projectId = options.projectId
			this.userName = uni.getStorageSync('userName')
			console.log(projectId);
			// let url =
			// 	`https://kimigateway.schaefflercn.com/sc/gateway/api/app/kimi-personal-scrum-board/${projectId}/station-info-list-by-project-id`
			let url = this.$Api.gateway +
				`/app/kimi-personal-scrum-board/${projectId}/station-info-list-by-project-id`
			console.log(url);
			uni.request({
				url: url,
				method: "GET",
				header: {
					'Authorization': "Bearer " + uni.getStorageSync("scToken")
				},
				success: (res) => {
					console.log(res);
					this.stationNo = res.data.data

				}
			})
		},
		methods: {
			backTo() {
				uni.navigateBack()
			},
			selAction(baseNum) {
				uni.$emit('handleBasenumClick', baseNum)
				uni.navigateBack()

			}
		}
	}
</script>

<style lang="scss">
	/deep/ .uni-list-item__content-title {
		font-size: 31.25rpx;
	}

	.back {
		// height: 20px;
		// width: 100rpx;
		background-color: #fff;
		// height: 20px;
		color: #646464;
		display: flex;
		font-size: 31.25rpx;
		justify-content: flex-start;
		margin-bottom: 10px;
		padding-left: 10px;
	}
</style>
