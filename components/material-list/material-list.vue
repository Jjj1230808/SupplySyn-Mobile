<template>
	<view class="">
		<view class="material-item" v-for="(item,index) in materialList">
			<view class="material-info">
				<view class="material-type-regular" v-if="item.materialType===10">
					<image style="width: 64rpx;height: 64rpx;" src="../../static/img/Frame.svg" mode=""></image>
					<view>常规件</view>
				</view>
				<view class="material-type-kanban" v-if="item.materialType===20">
					<image style="width: 64rpx;height: 64rpx;" src="../../static/img/kanban.svg" mode=""></image>
					<view>看板件</view>
				</view>
				<view class="material-label">
					<view>
						<view>物料名称</view>
						<view>{{item.description}}</view>
					</view>
					<view>
						<view>物料编号</view>
						<view>{{item.materialNo}}</view>
					</view>
					<view>
						<view>物料位置</view>
						<view>{{item.workshopAreaName}}-{{item.materialCarNo}}-{{item.materialBoxNo}}</view>
					</view>
				</view>
			</view>
			<view class="material-qty">
				<view>
					<view>领料数量</view>
					<view style="color: #414546">{{item.totalQuantity}}</view>
					<span></span>
				</view>
				<view>
					<view>装配数量</view>
					<view style="color: #00893d;">{{item.quantityUsed}}</view>
					<span></span>
				</view>
				<view>
					<view>退库数量</view>
					<view>{{item.returnQuantity}}</view>
					<span></span>
				</view>
				<view>
					<view>报废数量</view>
					<view>{{item.scrapQuantity}}</view>
				</view>
			</view>
			<view class="material-action">
				<view v-if="['开始装配','补打标签'].includes(cardtitle) && item.remainingQuantity === 0" class="to-do-disable">
					<image src="../../static/img/check_circle.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">待装配</view>
					<view style="color: #646464;font-size: 24rpx;">{{item.remainingQuantity}}</view>
				</view>
				<view v-if="['开始装配','补打标签'].includes(cardtitle) && item.remainingQuantity != 0 " class="to-do">
					<image src="../../static/img/watch_later.svg" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"
						mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">待装配</view>
					<view style="color: #F2B704;font-size: 24rpx;">{{item.remainingQuantity}}</view>
				</view>
				<view v-if="cardtitle === '物料退回' " class="done">
					<image src="../../static/img/check_circle_active.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">已装配</view>
					<view style="color: #129B49;font-size: 24rpx;">{{item.quantityUsed}}</view>
				</view>
				<view v-if="cardtitle === '退库' && item.remainingQuantity != 0  " class="to-do">
					<image src="../../static/img/watch_later.svg" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"
						mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">待处理</view>
					<view style="color: #f2b704;font-size: 24rpx;">{{item.remainingQuantity}}</view>
				</view>
				<view v-if="cardtitle === '退库' && item.remainingQuantity === 0  " class="to-do-disable">
					<image src="../../static/img/check_circle.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">待处理</view>
					<view style="color: #646464;font-size: 24rpx;">{{item.remainingQuantity}}</view>
				</view>
				<view v-if="cardtitle === '退库单' " class="returned">
					<image src="../../static/img/assignment_returned.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">退库</view>
					<view style="color: #FF9800;font-size: 24rpx;">{{item.returnQuantity}}</view>
				</view>
				<view @click="reprintLabel" v-if="cardtitle === '物料退回' || cardtitle ==='退库' || cardtitle === '补打标签'  "
					class="print-label">
					<image src="../../static/img/print.svg" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"
						mode="">
					</image>
					<view style="margin-right: 8rpx;color: #00893d;font-size: 24rpx;">补打标签</view>
				</view>
				<view v-if="['物料退回'].includes(cardtitle)" class="back">
					<view style="color: #fff;font-size: 24rpx;">退回</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		emits: ['click', 'close'],
		props: {
			materialList: {
				type: Array,
				default: ''
			},
			cardtitle: {
				type: String,
				default: ''
			}
		},
		mounted() {
			const materialList = this.materialList
		},
		methods: {
			reprintLabel() {
				console.log('打印')
				this.$emit('click', {})
			}
		}
	}
</script>

<style>
	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 276rpx;
		padding-top: 20rpx;
		overflow: auto;
		padding-bottom: 130rpx;
		z-index: 9999 !important;
	}

	.material-item {
		height: 350rpx;
		background-color: #fff;
		border-radius: 10rpx;
		margin: 0 20rpx 20rpx 20rpx;
	}

	.material-info {
		padding: 24rpx;
	}

	.material-info::after {
		display: block;
		clear: both;
		content: "";
	}

	.material-type-regular {
		width: 100rpx;
		height: 100rpx;
		background: rgba(29, 155, 178, 0.10);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		float: left;
	}

	.material-type-regular>view {
		position: absolute;
		bottom: 0;
		height: 38rpx;
		background-color: #1d9bb2;
		color: #fff;
		font-size: 24rpx;
		line-height: 38rpx;
		left: 0;
		right: 0;
		text-align: center;
	}

	.material-type-kanban {
		width: 100rpx;
		height: 100rpx;
		background: rgba(86, 180, 150, 0.10);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		float: left;
	}

	.material-type-kanban>view {
		position: absolute;
		bottom: 0;
		height: 38rpx;
		background: var(--Light-charts-chart-6, #56B496);
		color: #fff;
		font-size: 24rpx;
		line-height: 38rpx;
		left: 0;
		right: 0;
		text-align: center;
	}

	.material-label {
		float: left;
		font-size: 26rpx;
	}

	.material-label>view {
		display: flex;
		align-items: center;
		margin-left: 30rpx;
	}

	.material-qty {
		display: flex;
		align-items: center;
		height: 74rpx;
	}

	.material-qty>view {
		flex: 1;
		position: relative;
	}

	.material-qty>view>view:nth-child(1) {
		text-align: center;
		color: #9CA2A5;
		font-size: 24rpx;
	}

	.material-qty>view>view:nth-child(2) {
		text-align: center;
		color: #414546;
		font-size: 24rpx;
	}

	.material-qty>view>span {
		position: absolute;
		right: 0;
		top: 12rpx;
		height: 34rpx;
		width: 1rpx;
		background-color: #DDE3E6;
	}

	.material-action {
		border-top: 1px solid #CED5DA;
		display: flex;
		align-items: center;
		justify-content: right;
		padding: 24rpx;
		margin-top: 12rpx;
	}

	.back {
		display: flex;
		align-items: center;
		width: 108rpx;
		height: 50rpx;
		background: #E62C27;
		padding: 0 12rpx;
		border-radius: 4rpx;
		justify-content: center;
	}

	.done {
		display: flex;
		align-items: center;
		width: 166rpx;
		height: 50rpx;
		background: rgba(18, 155, 73, 0.10);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.to-do {
		display: flex;
		align-items: center;
		width: 166rpx;
		height: 50rpx;
		background-color: rgba(252, 207, 70, 0.2);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.returned {
		display: flex;
		align-items: center;
		width: 158rpx;
		height: 50rpx;
		background: rgba(255, 152, 0, 0.15);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.to-do-disable {
		display: flex;
		align-items: center;
		width: 166rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		background: rgba(156, 162, 165, 0.10);
	}

	.print-label {
		display: flex;
		align-items: center;
		width: 172rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		color: #00893d;
		border: 1rpx solid #00893d;
		box-sizing: border-box;
		background-color: white;
	}

	.material-action>view:not(:last-child) {
		margin-right: 20rpx;
	}
</style>
