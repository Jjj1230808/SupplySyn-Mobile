<template>

	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="补打标签" :isCanBack="true"
			:text="topData.stationNo">
		</navbar>
		<view class="search-input-container" v-if="isShowSearch" @click="isShowSearch= false">
			<view class="search-area" @click.stop="">
				<view class="filter-bar">
					<uni-icons type="search" color="#646464" size="20" style="margin-right: 6rpx;"></uni-icons>
					<input focus="true" id="searchInput" ref="searchInput" v-model="materialCode"
						@confirm="enterMaterialCode($event)" type="text">
					<image @click="closeSearch" style="width: 32rpx;height: 32rpx;" src="../../static/img/close.svg"
						mode=""></image>
				</view>
			</view>
		</view>
		<view class="search-bar">
			<view class="visual-bar" @click="displaySearchBar" v-if="!materialCode">
				<uni-icons type="search" color="#646464" size="20" style="margin-right: 6rpx;"></uni-icons>
				请输入物料信息或扫码查询
			</view>
			<view class="visual-bar-fill" @click="displaySearchBar" v-if="materialCode">
				<uni-icons type="search" color="#646464" size="20" style="margin-right: 6rpx;"></uni-icons>
				{{materialCode}}
			</view>
			<view class="number-summarize">
				<view>领料总数 <span style="color: #414546;">{{topData.totalQuantitys}}</span></view>
				<view>已用数量 <span style="color: #00893d;">{{topData.quantityUseds}}</span></view>
				<view>剩余数量 <span style="color: #f2b704;">{{topData.remainingQuantitys}}</span></view>
			</view>
		</view>
		<scroll-view class="material-list">
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
				<view class="material-action" @click="print">
					<view>
						<image src="../../static/img/watch_later.svg"
							style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
						</image>
						<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">待装配</view>
						<view style="color: #F2B704;font-size: 24rpx;">{{item.remainingQuantity}}</view>
					</view>
				</view>
			</view>

		</scroll-view>

		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">

		</view>
		<scan-dialog :show="showScan" :outWidth="420" :outHeight="280" :padding="50" :iconWidth="120" :iconHeight="120"
			maskClosable>
		</scan-dialog>

		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>

		<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
	</view>
</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'



	var main, receiver, filter;
	var ScanDeviceClass = plus.android.importClass("android.device.ScanDevice");
	var scanDevice;
	scanDevice = new ScanDeviceClass();
	export default {
		data() {
			return {
				isShowSearch: false,
				materialCode: '',
				showScan: false,
				showAssemblyQty: false,
				title: '选择装配数量',
				buttons: [{
					text: '取消',
					color: '#646464'
				}, {
					text: '确定',
					color: '#00893d'
				}],
				showMessage: false,
				showFinishConfirm: false,
				materialList: [],
				topData: {},
				Id: '',
				showError: false,
				message: '',
				materialInfo: {}
			};
		},
		onLoad(options) {
			console.log(JSON.parse((options.ListData)))
			this.Id = JSON.parse((options.ListData)).id;
			this.materialList = JSON.parse((options.ListData)).data
			this.topData = JSON.parse((options.topData))

		},
		onHide() {
			console.log('onhide')
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
		},
		onShow() {
			scanDevice.setOutScanMode(1); // 扫描模式=输入框

		},
		watch: {

		},
		methods: {
			print() {
				console.log('打印')
			},
			enterMaterialCode(e) {
				console.log(e)
				let _this = this;
				this.isShowSearch = false
				uni.showLoading({
					title: '正在搜索'
				})
				let url = BaseApi + '/Search?Id=' + this.Id + '&Info=' + e.detail.value;
				console.log(url)
				uni.request({
					url: url,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
						'Content-Type': 'application/json;charset=utf-8'
					},
					success: (res) => {
						console.log(res)
						if (res.data.statusCode !== 200) {
							uni.hideLoading()
							_this.message = res.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							_this.materialList = res.data.data.data
							uni.hideLoading()

						}
					},
					fail: (err) => {
						uni.hideLoading()
						_this.showError = true
						_this.message = '请求失败'
						setTimeout(() => {
							_this.showError = false
						}, 3000)
						console.log(err)
					}
				});

			},
			closeSearch() {
				this.materialCode = ''
				this.isShowSearch = false
			},
			displaySearchBar() {
				scanDevice.setOutScanMode(1); // 扫描模式=广播
				scanDevice.startScan()
				this.isShowSearch = true

			},
			linkToTop() {
				console.log('锚链接')
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
			}
		}
	}
</script>

<style lang="scss">
	.search-bar {
		height: 170rpx;
		position: fixed;
		top: 108rpx;
		left: 0;
		right: 0;
		background-color: #fff;
		border-top: 1rpx solid #ced5da;

	}

	.visual-bar {
		width: 680rpx;
		height: 70rpx;
		justify-content: center;
		display: flex;
		align-items: center;
		background-color: #f6f7f8;
		margin: 20rpx auto;
		color: #9ca2a5;
		font-size: 28rpx;
		border-radius: 10rpx;
	}

	.visual-bar-fill {
		width: 680rpx;
		height: 70rpx;
		justify-content: left;
		display: flex;
		align-items: center;
		background-color: #f6f7f8;
		margin: 20rpx auto;
		color: #000;
		font-size: 28rpx;
		border-radius: 10rpx;
		padding-left: 20rpx;
	}

	.number-summarize {
		height: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		color: #9CA2A5;
		font-size: 26rpx;
		margin-top: 24rpx;
	}

	.number-summarize>view:nth-child(1),
	.number-summarize>view:nth-child(2) {
		border-right: 1rpx solid #dde3e6;
	}

	.number-summarize>view {
		flex: 1;
		text-align: center;
		line-height: 28rpx;
		height: 28rpx;
	}

	.number-summarize>view>span {
		font-size: 28rpx;
		margin-left: 6rpx;
	}


	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 276rpx;
		padding-top: 20rpx;
		overflow: auto;
		z-index: -1;
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

	.material-label>view>view:nth-child(1) {
		color: #9CA2A5;
	}

	.material-label>view>view:nth-child(2) {
		color: #414546;
		margin-left: 20rpx
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

	.material-action>view {
		display: flex;
		align-items: center;
		width: 156rpx;
		height: 50rpx;
		background-color: rgba(252, 207, 70, 0.20);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.link-top {
		position: fixed;
		bottom: 200rpx;
		right: 20rpx;
		background: url('../../static/img/Fab-standard.svg');
		background-size: 100% 100%;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-input-container {
		position: fixed;
		top: 108rpx;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.70);
		z-index: 9999;
		border-top: 1px solid #CED5DA;
	}


	.search-area {
		width: 100%;
		height: 110rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.filter-bar {
		height: 70rpx;
		display: flex;
		align-items: center;
		background-color: #F6F7F8;
		border-radius: 10rpx;
		width: 680rpx;
		margin: auto;
		padding: 0 20rpx;
	}

	.filter-bar input {
		width: 580rpx;
		font-size: 28rpx;
	}
</style>
