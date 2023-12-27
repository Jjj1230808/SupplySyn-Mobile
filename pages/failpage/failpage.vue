<template>
	<view>
		<navbar :userName="userName"></navbar>
		<view class="pagecontainer">
			<image class="imginfo" src="../../static/WMS UI design/notice-fail.svg" mode=""></image>
			<view class="actiontext">
				啊哦,上架失败了
			</view>
			<view class="jump1" @click="backToForm">
				<button class="jumpbtn">点击返回重新上架</button>

			</view>
			<view class="jump" @click="backToFunction">
				返回首页
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
		methods: {
			backToForm() {
				uni.navigateBack()
			},
			backToFunction() {
				uni.reLaunch({
					url: '/pages/function/function'
				})
			}
		},
		onLoad() {
			this.userName = uni.getStorageSync('userName')
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
	}

	.imginfo {
		margin-top: 52.08rpx;
		margin: 0 auto;
	}

	.actiontext {
		color: #646464;
		font-size: 31.25rpx;
		margin-top: 31.25rpx;
		margin: 0 auto;
	}

	.jump {
		font-size: 27.08rpx;

		margin: 10px auto;
		text-decoration: underline;
	}

	.jumpbtn {
		font-size: 29.17rpx;
		color: #00893d;
		border: #00893d 1px solid;

	}

	.jump1 {
		// font-size: 27.08rpx;
		color: #00893d;

		margin: 10px auto;
	}
</style>
