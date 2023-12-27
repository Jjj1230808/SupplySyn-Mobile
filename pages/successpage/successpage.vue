<template>
	<view>
		<navbar :userName="userName"></navbar>
		<view class="pagecontainer">
			<image class="imginfo" src="../../static/WMS UI design/notice-success.svg" mode=""></image>
			<view class="actiontext">
				物料上架成功！

			</view>
			<view class="jump">
				即将返回首页...
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName: ''
			};
		},
		onLoad() {
			this.userName = uni.getStorageSync('userName')
			// 五秒后跳转
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/function/function'
				})
			}, 3000)
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.pagecontainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 104.17rpx;


		// margin: 0 auto;
		height: 100%;
		background-color: #fff;
	}

	.imginfo {
		margin-top: 52.08rpx;
		margin: 0 auto;
	}

	.actiontext {
		color: #646464;
		font-size: 33.33rpx;
		margin-top: 31.25rpx;
		margin: 0 auto;
	}

	.jump {
		color: #9ca2a5;
		font-size: 27.08rpx;
		margin: 10px auto;
	}
</style>
