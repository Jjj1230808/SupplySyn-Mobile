<template>
<!-- 	<view @tap="maskClose" :style="{background:maskBackground}" class="fui-dialog__wrap" -->
		<view :style="{background:maskBackground}" class="fui-dialog__wrap"
		:class="{'fui-wrap__show':show}" @touchmove.stop.prevent="stop" v-if="visible || !isNvue" ref="fui_dialog_ani">
		<view class="fui-dialog__inner" :style="{background:background,borderRadius:radius+'rpx'}" @tap.stop="stop">
			<text class="fui-dialog__title" :style="{color:color}" v-if="title">{{title}}</text>
			<view class="dialog_tips" v-if="title==='撤回退库物料'">
				<image src="../../static/img/tips-logo.svg" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"
					mode="">
				</image>
				<text>撤回的物料将变为待处理状态</text>
			</view>
			<view class="dialog_header" v-if="title!=='物料退回'">
				<image src="../../static/img/watch_later.svg" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"
					mode="">
				</image>
				
				<view v-if="title!=='物料报废' && title!=='撤回退库物料'&& title!=='撤回报废物料' && title!=='确认入库签收数量'" style="margin-right: 8rpx;color: #646464;font-size: 32rpx;">待装配</view>
				<view v-if="title==='撤回退库物料'|| title==='撤回报废物料' || title==='确认入库签收数量' " style="margin-right: 8rpx;color: #646464;font-size: 32rpx;">待签收</view>
				<view v-if="title==='物料报废'" style="margin-right: 8rpx;color: #646464;font-size: 32rpx;">待处理</view>
				<view v-if="title!=='撤回退库物料'&& title!=='撤回报废物料'" style="color: #F2B704;font-size: 32rpx;">{{materialInfo.remainingQuantity<0? 0 :materialInfo.remainingQuantity}}</view>
				<view  v-if="title==='撤回退库物料'"style="color: #F2B704;font-size: 32rpx;">{{materialInfo.returnQuantity<0? 0 :materialInfo.returnQuantity}}</view>
				<view  v-if="title==='撤回报废物料'"style="color: #F2B704;font-size: 32rpx;">{{materialInfo.scrapQuantity<0? 0 :materialInfo.scrapQuantity}}</view>
				<view  v-if="title==='确认入库签收数量'"style="color: #F2B704;font-size: 32rpx;">{{materialInfo.returnQuantity}}</view>
			</view>
			<view class="fui-dialog__body">
				<view class="material-text">
					<view style="white-space:nowrap">物料名称</view>
					<view >{{materialInfo.materialName}}</view>
					<!-- <view class="">123</view> -->
				</view>
				<view class="material-text">
					<view>物料编号</view>
					<view>{{materialInfo.materialNo}}</view>
				</view>
				<view class="material-text">
					<view>物料位置</view>
					<view>
						{{materialInfo.workshopAreaName}}{{materialInfo.materialCarNo? '-'+materialInfo.materialCarNo :''}}{{ materialInfo.materialBoxNo?'-'+materialInfo.materialBoxNo : ''}}
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
				<view  v-if="title==='物料退回'"  class="three-numbox">
					<view class="assembly-num" style="margin-bottom: 10rpx;">
						<view >本次装配退回</view>
						<cc-numbox :maxNum="materialInfo.quantityUsed" @change="changeNum0" ></cc-numbox>
					</view>
					<view class="assembly-num" style="margin-bottom: 10rpx;">
						<view>本次退库退回</view>
						<cc-numbox :maxNum="materialInfo.returnQuantity" @change="changeNum1"></cc-numbox>
					</view>
					<view class="assembly-num" style="margin-bottom: 10rpx;">
						<view>本次报废退回</view>
						<cc-numbox :maxNum="materialInfo.scrapQuantity" @change="changeNum2"></cc-numbox>
					</view>
				</view>
				<view  v-if="title ==='选择装配数量'"  class="assembly-num">
					<view>{{numText}}</view>
					<cc-numbox :maxNum="materialInfo.totalQuantity - materialInfo.quantityUsed" @change="changeNum"></cc-numbox>
				</view>
				<!-- 退库 实际退库数量 覆盖操作 默认数量为系统计算的退库 -->
				<view  v-if="title==='退库'"   class="assembly-num">
					<view>{{numText}}</view>
					<cc-numbox  @change="changeNum3" ></cc-numbox>
				</view>
				<!-- 报废 数量 覆盖操作 默认数量为系统计算的报废 -->
				<view  v-if="title==='物料报废'"   class="assembly-num">
					<view>{{numText}}</view>
					<cc-numbox  @change="changeNum4"  ></cc-numbox>
				</view>
			</view>
			<!-- //备注文本框 -->
			<view v-if="title ==='退库' || title ==='物料报废'  " style="padding: 0rpx 30rpx 30rpx 30rpx;">
			<textarea class="comment" v-model="comments"  placeholder="备注(可选)" />
			</view>
		
			<view v-if="title === '撤回退库物料'|| title ==='撤回报废物料'   " style="padding: 0rpx 30rpx 30rpx 30rpx;">
			<textarea class="comment" v-model="comments"  placeholder="请填写撤回原因(必填)" />
			</view>
			<view v-if="title==='拒签退库物料'|| title ==='拒签报废物料'    " style="padding: 0rpx 30rpx 30rpx 30rpx;">
			<textarea class="comment" v-model="comments"  placeholder="请填写拒签原因(必填)" />
			</view>
			
			<view class="fui-dialog__footer">
				<text v-for="(item,index) in buttons" :key="index" :style="{color: (comments) ? item.color : item.color }"
					class="fui-dialog__btn" :class="{'fui-dialog__btn-first':index===0}"
					@tap="$noMultipleClicks(handleClick, index)">{{item.text}}</text>
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
			//remainingQuantity：currentNum，
			// quantityUsed:currentNum0,
			// 本次退库数量 returnQuantity:currentNum1,
			// scrapQuantity:currentNum2，
			//实际退库数量：currentNum3
			
			
			
			// "totalQuantity": 24,
			// "quantityUsed": 20,
			// "remainingQuantity": 1,
			// "returnQuantity": 3,
			// "scrapQuantity": 0,
			// "workshopAreaName": "A8",
			// "materialCarNo": "L050",
			// "materialBoxNo": "",
			// "materialType": 10,
			// "state": 20
			return {
				noClick:true,
				visible: false,
				isNvue: isNvue,
				currentNum: 0,
				currentNum0: 0,
				currentNum1:0,
				currentNum2: 0,
				currentNum3:0,
				currentNum4:0,
				isSetcover: true,
				comments:''
				
				
				
				
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
			changeNum0(num) {
				console.log(num)
				this.currentNum0 = num
			},
			changeNum1(num) {
				console.log(num)
				this.currentNum1 = num
			},
			changeNum2(num) {
				console.log(num)
				this.currentNum2 = num
			},
			changeNum3(num) {
				console.log(num)
				this.currentNum3 = num
			},
			changeNum4(num) {
				console.log(num)
				this.currentNum4 = num
			},
			handleClick(index) {
				this.$emit('click', {
					index,
					...this.buttons[index],
					currentNum: this.currentNum,
					currentNum0: this.currentNum0,
					currentNum1: this.currentNum1,
					currentNum2: this.currentNum2,
					currentNum3: this.currentNum3,
					currentNum4: this.currentNum4,
					comments:this.comments,
					totalQuantity:this.materialInfo.totalQuantity,
					quantityUsed:this.materialInfo.quantityUsed,
					remainingQuantity:this.materialInfo.remainingQuantity,
					returnQuantity:this.materialInfo.returnQuantity,
					scrapQuantity:this.materialInfo.scrapQuantity
				});
			},
			// maskClose() {
			// 	if (!this.maskClosable) return;
			// 	this.$emit('close', {});
			// },
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
		font-size: 32rpx;
		position: fixed;
		z-index: 998;
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
		overflow: auto;

		/* #ifndef APP-NVUE */
		display: flex;
		/* max-height: 90%; */
		/* #endif */
		flex-direction: column;
		transform: translateY(-100rpx);
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
		text-align: left;
	}

	.material-text {
		display: flex;
		align-items: flex-start;
		margin-left: 25rpx;
		margin-top: 8rpx;
	}

	.material-text>view:nth-child(1) {
		color: #9CA2A5;
		font-size: 32rpx;
	}

	.material-text>view:nth-child(2) {
		color: #414546;
		margin-left: 20rpx;
		font-size: 32rpx;
	}


	.fui-dialog__descr {
		font-size: 32rpx;
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
	.dialog_tips{
			display: flex;
			align-items: center;
			width: calc(100% - 60rpx);
			height: 60rpx;
			background-color:  rgba(29, 155, 178, 0.10);
			padding: 0 16rpx;
			border-radius: 4rpx;
			justify-content: center;
		margin-left: 30rpx;
			margin-bottom: 20rpx;
			color:  rgba(29, 155, 178, 1);
			font-size: 32rpx
		}
	.three-numbox{
		background-color: #ebeef0;
	}

	.assembly-num {
		display: flex;
		align-items: center;
		justify-content: right;
	}

	.assembly-num>view {
		margin-right: 10rpx;
		color: #9CA2A5;
		font-size: 32rpx;
	}
	.comment{
		width: 100%;
		padding: 20rpx;
		max-height: 160rpx;
		border: #ced5da 2rpx solid;
		text-align: left
	}
</style>
