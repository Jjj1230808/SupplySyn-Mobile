<template>
	<view class="container">
		<view class="tool-left">
			<view class="example-body" v-show="isCanBack">
				<button @click="backToLastPage" class="toolbtn">
					<uni-icons type="back" color="#646464" size="24"></uni-icons>
				</button>

			</view>
			<!-- 
			<view class="example-body">
				<button @click="isToIndex" class="toolbtn">
					<uni-icons type="home-filled" color="#646464" size="30"></uni-icons>
				</button>
				<fui-dialog :show="show" title="确认返回首页吗?" :buttons="buttons" maskClosable @click="onClick"
					@close="onClose">
				</fui-dialog>
			</view> -->
		</view>
		<view class="tool-middle">
			{{title}}
		</view>

		<!-- <image src="../../static/com-logo.png" mode=""></image> -->
		<view class="tool-right" @click="isLogOut" v-if="userName">
			<view class="" style="margin-right: 4rpx;">
				<view class="toolbtn">
					<image style="width: 40rpx;height: 40rpx;" src="../../static/img/person.svg" mode=""></image>
					<!-- <uni-icons type="person-filled" color="#646464" size="26"></uni-icons> -->
				</view>
				<fui-dialog :show="show1" title="确认退出登录吗?" :buttons="buttons" maskClosable @click="onClick1"
					@close="onClose1">
				</fui-dialog>
			</view>
			<view class="userName">
				{{userName}}
			</view>
		</view>
		<view class="tool-right" @click="isLogOut" v-if="!userName">
			<view class="text-icon">
				<image style="width: 32rpx;margin-top: 10rpx;color: #414546;"
					src="../../static/img/precision_manufacturing.svg">
				</image>
			</view>
			<view class="userName" style="color: #414546;">
				{{text}}
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {

				show: false,
				show1: false,
				buttons: [{
					text: '取消',
					color: '#ccc'
				}, {
					text: '确定',
					color: '#00893d'
				}]
			};
		},
		props: {
			userName: '',
			isCanBack: false,
			title: '',
			text: ''
		},
		// watch: {
		// 	userName(oldName, newName) {
		// 		console.log(oldName);
		// 		console.log(newName);
		// 	}
		// },
		onShow() {
			this.userName = uni.getStorageSync('userName')
			console.log(this.userName);
			// this.$on('userName', (res) => {
			// 	this.userName = res
			// })
		},
		onLoad() {
			this.userName = uni.getStorageSync('userName')
			console.log(this.userName);
		},
		methods: {
			backToLastPage() {
				console.log('返回首页')
				uni.navigateBack()
			},
			onClick(e) {
				console.log(e)
				if (e.index == 1) {

					uni.reLaunch({
						url: '/pages/function/function'
					})
				}
				this.onClose()
			},
			//设置maskClosable为true时（点击遮罩可关闭），需要配合@close事件一起使用，通过控制show来达到关闭效果
			onClose(e) {
				this.show = false
			},

			onClick1(e) {
				console.log(e)
				if (e.index == 1) {
					uni.clearStorageSync()

					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
				this.onClose1()
			},
			//设置maskClosable为true时（点击遮罩可关闭），需要配合@close事件一起使用，通过控制show来达到关闭效果
			onClose1(e) {
				this.show1 = false
			},
			isToIndex() {
				this.show = true
				console.log('回首页吗？')
			},
			isLogOut() {
				this.show1 = true
				console.log('退出登录吗？')
			},
			logOut() {
				uni.clearStorageSync()
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
			confirm() {},
			// 打开窗口
			showDrawer(e) {
				this.$refs[e].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				this.$refs[e].close()
			},
			// 抽屉状态发生变化触发
			change(e, type) {
				console.log((type === 'showLeft' ? '左窗口' : '右窗口') + (e ? '打开' : '关闭'));

				this[type] = e

			},

			onNavigationBarButtonTap(e) {
				if (this.showLeft) {
					this.$refs.showLeft.close()
				} else {
					this.$refs.showLeft.open()
				}
			},
			onBackPress() {
				if (this.showRight || this.showLeft) {
					this.$refs.showLeft.close()
					this.$refs.showRight.close()
					return true
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	// page {
	// 	display: flex;
	// 	flex-direction: column;
	// }

	.toolbtn {
		display: flex;
		flex-direction: row;
		background-color: #fff;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		border: none;
		margin-top: 2rpx;

	}

	.toolbtn::after {
		border: none;
	}

	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: -webkit-sticky;
		position: sticky;
		top: var(--window-top);
		z-index: 99;
		height: 108.33rpx;

		color: #646464;
		background-color: #FFF;
		position: relative;
		box-sizing: border-box;

		.tool-left {
			display: flex;
			align-items: center;
			justify-content: left;
		}

		.tool-middle {
			text-align: center;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			height: 108.33rpx;
			line-height: 108.33rpx;
			font-size: 32rpx;
			z-index: -1;
			font-weight: 700;
			color: #646464;
		}

		.tool-right {
			display: flex;
			align-items: center;
			padding-right: 30rpx;

		}


		.logout {
			width: 100rpx;
			// height: 20px;
			color: #646464;
		}

		image {
			height: 35.42rpx;
			width: 50%;

		}

		.logout-nav {
			background-color: #00893d;
			border-radius: 0;
			color: #fff;
		}

	}
</style>
