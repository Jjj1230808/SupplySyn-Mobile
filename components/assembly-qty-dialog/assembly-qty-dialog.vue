<template>
	<view @tap="maskClose" :style="{background:maskBackground}" class="fui-dialog__wrap"
		:class="{'fui-wrap__show':show}" @touchmove.stop.prevent="stop" v-if="visible || !isNvue" ref="fui_dialog_ani">
		<view class="fui-dialog__inner" :style="{background:background,borderRadius:radius+'rpx'}" @tap.stop="stop">
			<text class="fui-dialog__title" :style="{color:color}" v-if="title">{{title}}</text>
			<view class="dialog_header">
				<image src="../../static/img/watch_later.svg" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"
					mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">待装配</view>
				<view style="color: #F2B704;font-size: 24rpx;">{{materialInfo.remainingQuantity}}</view>
			</view>
			<view class="fui-dialog__body">
				<view class="material-text">
					<view>物料名称</view>
					<view>{{materialInfo.description}}</view>
				</view>
				<view class="material-text">
					<view>物料编号</view>
					<view>{{materialInfo.materialNo}}</view>
				</view>
				<view class="material-text">
					<view>物料位置</view>
					<view>
						{{materialInfo.workshopAreaName}}-{{materialInfo.materialCarNo}}-{{materialInfo.materialBoxNo}}
					</view>
				</view>
				<view class="material-text">
					<view>领料数量</view>
					<view>{{materialInfo.totalQuantity}}</view>
				</view>
				<view class="material-text">
					<view>装配数量</view>
					<view style="color: #00893d;">{{materialInfo.quantityUsed}}</view>
				</view>
				<view class="material-text">
					<view>退库数量</view>
					<view>{{materialInfo.returnQuantity}}</view>
				</view>
				<view class="material-text">
					<view>报废数量</view>
					<view>{{materialInfo.scrapQuantity}}</view>
				</view>
				<view class="assembly-num">
					<view>{{numText}}</view>
					<cc-numbox :maxNum="materialInfo.quantityUsed" @change="changeNum"></cc-numbox>
				</view>
			</view>
			<view class="fui-dialog__footer">
				<text v-for="(item,index) in buttons" :key="index" :style="{color:item.color || '#333333'}"
					class="fui-dialog__btn" :class="{'fui-dialog__btn-first':index===0}"
					@tap="handleClick(index)">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	export default {
		name: 'fui-dialog',
		emits: ['click', 'close'],
		props: {
			materialInfo: {
				type: Object,
				default: function() {
					return {};
				}
			},
			numText: {
				type: String,
				default: '本次装配数量'
			},
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '温馨提示'
			},
			color: {
				type: String,
				default: '#333'
			},
			content: {
				type: String,
				default: ''
			},
			contentColor: {
				type: String,
				default: '#7F7F7F'
			},
			buttons: {
				type: Array,
				default () {
					return [{
						text: '取消'
					}, {
						text: '确定',
						color: '#465CFF'
					}]
				}
			},
			background: {
				type: String,
				default: '#fff'
			},
			radius: {
				type: [Number, String],
				default: 10
			},
			maskBackground: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			maskClosable: {
				type: Boolean,
				default: true
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				visible: false,
				isNvue: isNvue,
				currentNum: 1
			}
		},
		// #ifdef APP-NVUE
		watch: {
			show: {
				handler(newVal) {
					if (newVal) {
						this.open();
					} else {
						this.close();
					}
				},
				immediate: true
			}
		},
		// #endif
		methods: {
			changeNum(num) {
				console.log(num)
				this.currentNum = num
			},
			handleClick(index) {
				this.$emit('click', {
					index,
					...this.buttons[index],
					currentNum: this.currentNum
				});
			},
			maskClose() {
				if (!this.maskClosable) return;
				this.$emit('close', {});
			},
			// #ifdef APP-NVUE
			open() {
				this.visible = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this._animation(true);
					}, 50);
				});
			},
			close(type) {
				this._animation(false);
			},
			_animation(type) {
				let styles = {
					opacity: type ? 1 : 0
				};
				if (!this.$refs['fui_dialog_ani']) return;
				animation.transition(
					this.$refs['fui_dialog_ani'].ref, {
						styles,
						duration: 200, //ms
						timingFunction: 'ease-in',
						needLayout: false,
						delay: 0 //ms
					},
					() => {
						if (!type) {
							this.visible = false;
						}
					}
				);
			},
			// #endif
			stop() {}
		}
	}
</script>

<style>
	.fui-dialog__wrap {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		transition-property: all;
		transition-timing-function: ease-in;
		transition-duration: 0.2s;
		display: flex;
		transform: scale3d(1, 1, 0);
		visibility: hidden;
		/* #endif */
		align-items: center;
		justify-content: center;
		opacity: 0;
	}

	.fui-dialog__inner {
		width: 680rpx;
		text-align: center;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		display: flex;
		max-height: 90%;
		/* #endif */
		flex-direction: column;
	}

	.fui-dialog__title {
		font-weight: 700;
		font-size: 32rpx;
		text-align: center;
		margin: 30rpx 0;
	}

	.fui-dialog__body {
		/* #ifndef APP-NVUE */
		word-break: break-all;
		-webkit-hyphens: auto;
		hyphens: auto;
		/* #endif */
		padding: 24rpx;
		background-color: #F6F7F8;
		width: calc(100% - 60rpx);
		margin: 30rpx auto;
	}

	.material-text {
		display: flex;
		align-items: center;
		margin-left: 30rpx;
	}

	.material-text>view:nth-child(1) {
		color: #9CA2A5;
		font-size: 26rpx;
	}

	.material-text>view:nth-child(2) {
		color: #414546;
		margin-left: 20rpx;
		font-size: 26rpx;
	}


	.fui-dialog__descr {
		font-size: 30rpx;
		font-weight: normal;
		text-align: center;
	}

	.fui-dialog__mtop {
		margin-top: 32rpx;
	}

	.fui-dialog__footer {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
		line-height: 112rpx;
		height: 112rpx;

		/* #ifdef APP-NVUE */
		border-top-width: 0.5px;
		border-top-style: solid;
		border-top-color: #EEEEEE;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.fui-dialog__footer:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid var(--fui-color-border, #EEEEEE);
		transform-origin: 0 0;
		transform: scaleY(.5)
	}

	/* #endif */

	.fui-dialog__btn {
		/* #ifndef APP-NVUE */
		display: block;
		text-decoration: none;
		/* #endif */
		flex: 1;
		height: 112rpx;
		line-height: 112rpx;
		font-weight: 700;
		position: relative;
		font-size: 34rpx;

		/* #ifdef APP-NVUE */
		border-left-width: 0.5px;
		border-left-style: solid;
		border-left-color: #EEEEEE;
		/* #endif */
		text-align: center;
	}

	.fui-dialog__btn:active {
		/* #ifndef APP-NVUE */
		background-color: var(--fui-bg-color-hover, rgba(0, 0, 0, 0.2));
		/* #endif */

		/* #ifdef APP-NVUE */
		background-color: rgba(0, 0, 0, 0.2);
		/* #endif */
	}

	/* #ifdef APP-NVUE */
	.fui-dialog__btn-first {
		border-left-width: 0;
	}

	/* #endif */


	/* #ifndef APP-NVUE */
	.fui-dialog__btn::after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-left: 1px solid var(--fui-color-border, #EEEEEE);
		transform-origin: 0 0;
		transform: scaleX(.5)
	}

	.fui-dialog__btn-first::after {
		width: 0;
		border-left: 0 !important;
	}

	/* #endif */
	/* #ifndef APP-NVUE */
	.fui-wrap__show {
		opacity: 1;
		transform: scale3d(1, 1, 1);
		visibility: visible;
	}

	/* #endif */

	.dialog_header {
		display: flex;
		align-items: center;
		width: calc(100% - 60rpx);
		height: 60rpx;
		background-color: rgba(252, 207, 70, 0.20);
		padding: 0 16rpx;
		border-radius: 4rpx;
		justify-content: center;
		margin: auto;
	}

	.assembly-num {
		display: flex;
		align-items: center;
		justify-content: right;
	}

	.assembly-num>view {
		margin-right: 10rpx;
		color: #9CA2A5;
		font-size: 26rpx;
	}
</style>
