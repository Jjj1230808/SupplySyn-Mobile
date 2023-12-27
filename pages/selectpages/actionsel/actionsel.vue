<template>
	<view>
		<navbar></navbar>
		<view class="back">
			<view class="" @click="backTo">
				<uni-icons type="back" style="font-size: 31.25rpx;"></uni-icons>&nbsp;&nbsp;返回
			</view>


		</view>
		<uni-list style="font-size: 83.33rpx;">
			<uni-list-item clickable v-for="(item,index) in actionList" :key="index" :title="item.actionname" note=""
				@click="selAction(item.actionname)">
			</uni-list-item>

		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				actionList: [{
					actionname: '111'
				}, {
					actionname: '121'
				}, {
					actionname: '1221'
				}, {
					actionname: '11231'
				}, {
					actionname: '33'
				}]
			};
		},
		methods: {
			backTo() {
				uni.navigateBack()
			},
			selAction(actionname) {
				uni.$emit('handleActionClick', actionname)
				uni.navigateBack()

				console.log(actionname);
				uni.showToast({
					title: actionname
				})
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
