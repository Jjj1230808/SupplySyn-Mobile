<template>
	<view class="numBox">
		<view class="ccMyNumBox">
			<text @click="minus">
				<image v-if="num===1" src="../../static/img/mins-disable.svg"
					style="width: 32rpx;height: 32rpx;margin-top: 14rpx;" mode=""></image>
				<image v-if="num>1" src="../../static/img/mins.svg"
					style="width: 32rpx;height: 32rpx;margin-top: 14rpx;" mode="">
				</image>
			</text>
			<view>{{num}}</view>
			<text @click="add">
				<image v-if="num>=maxNum" src="../../static/img/add.svg"
					style="width: 32rpx;height: 32rpx;margin-top: 14rpx;" mode="">
				</image>
				<image v-if="num<maxNum" src="../../static/img/add-active.svg"
					style="width: 32rpx;height: 32rpx;margin-top: 14rpx;" mode="">
				</image>
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: 1
			}
		},
		created() {
this.num = 1
		},


		methods: {
			minus() {
				if (this.num == 1) {
					uni.showToast({
						title: '数量不能小于1',
						'icon': 'none'
					});
					return;
				}
				this.num--
				this.$emit('change', this.num)
			},
			add() {
				if (this.num >= this.maxNum) {
					// uni.showToast({
					// 	title: '数量不能大于库存',
					// 	'icon': 'none'
					// });
					return;
				}
				this.num++
				this.$emit('change', this.num)
			}
		},

		props: {
			title: {
				type: String,
				default: ""
			},
			maxNum: {
				type: [Number, String],
				default: 9999999999
			},
			isSetMax: {
				type: Boolean,
				default: false
			},
		}
	}
</script>

<style>
	.numBox {
		display: flex;
	}



	.ccMyNumBox {
		display: flex;
		border: 2rpx solid #ced5da;
		font-size: 30rpx;
		box-sizing: border-box;
	}

	.ccMyNumBox text {
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		width: 50rpx;
		color: #666;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ccMyNumBox view {
		border-left: 1px solid #ced5da;
		border-right: 1px solid #ced5da;
		text-align: center;
		line-height: 50rpx;
		width: 80rpx;
		box-sizing: border-box;
		color: #414546;
	}
</style>
