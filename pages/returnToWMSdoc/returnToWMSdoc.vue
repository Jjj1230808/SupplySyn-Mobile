<template>

	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="退库单" :isCanBack="true" :text="topData.stationNo">
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
			<view class="visual-bar" @click="displaySearchBar">
				<uni-icons type="search" color="#646464" size="20" style="margin-right: 6rpx;"></uni-icons>
				请输入物料信息或扫码查询
			</view>
		</view>
		<scroll-view class="material-list">
			<view class="material-item" v-for="item in 6">
				<view class="material-info">
					<!-- <view class="material-type-regular">
						<image style="width: 64rpx;height: 64rpx;" src="../../static/img/Frame.svg" mode=""></image>
						<view>常规件</view>
					</view> -->
					<view class="material-type-kanban">
						<image style="width: 64rpx;height: 64rpx;" src="../../static/img/kanban.svg" mode=""></image>
						<view>看板件</view>
					</view>
					<view class="material-label">
						<view>
							<view>物料名称</view>
							<view>黑灰色PC板</view>
						</view>
						<view>
							<view>物料编号</view>
							<view>M-10567434AA-K17001</view>
						</view>
						<view>
							<view>物料位置</view>
							<view>XXXX</view>
						</view>
					</view>
				</view>
				
				<view class="material-action">
					<view>
						<image src="../../static/img/check_circle.svg"
							style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
						</image>
						<view style="margin-right: 8rpx;color: #646464;font-size: 24rpx;">退库</view>
						<view style="color: #F2B704;font-size: 24rpx;">2</view>
					</view>
				</view>
			</view>

		</scroll-view>
		
		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">
		
		</view>
		
		
		
		
	</view>
</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'

	// function utf8ByteToUnicodeStr(utf8Bytes) {
	// 	var unicodeStr = "";
	// 	for (var pos = 0; pos < utf8Bytes.length;) {
	// 		var flag = utf8Bytes[pos];
	// 		var unicode = 0;
	// 		if ((flag >>> 7) === 0) {
	// 			unicodeStr += String.fromCharCode(utf8Bytes[pos]);
	// 			pos += 1;

	// 		} else if ((flag & 0xFC) === 0xFC) {
	// 			unicode = (utf8Bytes[pos] & 0x3) << 30;
	// 			unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
	// 			unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
	// 			unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
	// 			unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
	// 			unicode |= (utf8Bytes[pos + 5] & 0x3F);
	// 			unicodeStr += String.fromCodePoint(unicode);
	// 			pos += 6;

	// 		} else if ((flag & 0xF8) === 0xF8) {
	// 			unicode = (utf8Bytes[pos] & 0x7) << 24;
	// 			unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
	// 			unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
	// 			unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
	// 			unicode |= (utf8Bytes[pos + 4] & 0x3F);
	// 			unicodeStr += String.fromCodePoint(unicode);
	// 			pos += 5;

	// 		} else if ((flag & 0xF0) === 0xF0) {
	// 			unicode = (utf8Bytes[pos] & 0xF) << 18;
	// 			unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
	// 			unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
	// 			unicode |= (utf8Bytes[pos + 3] & 0x3F);
	// 			unicodeStr += String.fromCodePoint(unicode);
	// 			pos += 4;

	// 		} else if ((flag & 0xE0) === 0xE0) {
	// 			unicode = (utf8Bytes[pos] & 0x1F) << 12;;
	// 			unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
	// 			unicode |= (utf8Bytes[pos + 2] & 0x3F);
	// 			unicodeStr += String.fromCharCode(unicode);
	// 			pos += 3;

	// 		} else if ((flag & 0xC0) === 0xC0) { //110
	// 			unicode = (utf8Bytes[pos] & 0x3F) << 6;
	// 			unicode |= (utf8Bytes[pos + 1] & 0x3F);
	// 			unicodeStr += String.fromCharCode(unicode);
	// 			pos += 2;

	// 		} else {
	// 			unicodeStr += String.fromCharCode(utf8Bytes[pos]);
	// 			pos += 1;
	// 		}
	// 	}
	// 	return unicodeStr;
	// }

	// var main, receiver, filter;
	// var ScanDeviceClass = plus.android.importClass("android.device.ScanDevice");
	// var scanDevice;
	// scanDevice = new ScanDeviceClass();
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
				materialList: []
			};
		},
		onLoad(options) {
			console.log(this.$route.query)
		},
		watch: {

		},
		methods: {
			onClose1(e) {
				this.showAssemblyQty = false
			},
			onClick1(e) {
				console.log(e)
				if (e.index === 1) {
					this.onClose1()
					this.showMessage = true
					setTimeout(() => {
						this.showMessage = false
					}, 3000)
				} else {
					this.onClose1()
				}


			},
			onClickConfirm() {
				this.onCloseConfirm()
				uni.navigateTo({
					url: '/pages/returnToWMS/returnToWMS'
				})
			},
			onCloseConfirm() {
				this.showFinishConfirm = false
			},
			registerScan() {
				main.registerReceiver(receiver, filter);
			},
			unregisterScan() {
				main.unregisterReceiver(receiver);
			},
			initScan() {
				console.log('---------------进入了扫描------------')
				let _this = this;
				main = plus.android.runtimeMainActivity(); //获取activity  
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				filter = new IntentFilter();
				filter.addAction("scan.rcv.message"); // 换你的广播动作  
				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {

					onReceive: function(context, intent) {
						plus.android.importClass(intent);
						let code = intent.getByteArrayExtra('barocode');
						//	let codeStr = String.fromCharCode(...code);

						let codeStr = utf8ByteToUnicodeStr(code);

						console.log('codeStr:', codeStr);


						// scanDevice.stopScan(); // 停止扫描

					}
				});
			},
			scanAssembly() {
				this.showAssemblyQty = true
				// this.showScan = true
				
				// setTimeout(() => {
				// 	this.showScan = false
				// }, 3000)
			},
			finishAssembly() {
				this.showFinishConfirm = true
			},
			enterMaterialCode(e) {

				console.log(e)
				this.isShowSearch = false
			},
			closeSearch() {
				this.isShowSearch = false
			},
			displaySearchBar() {
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
		height: 115rpx;
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

	.number-summarize {
		height: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		color: #9CA2A5;
		font-size: 30rpx;
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

	.action-buttons {
		height: 130rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		border-top: 1rpx solid #ced5da;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.action-buttons>button {
		width: 213rpx;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		font-size: 28rpx;
		outline: none;
	}

	.action-buttons>button>image {
		margin-right: 6rpx;
	}

	.action-buttons>button:nth-child(1) {
		border: 2px solid #e62c27;
		background-color: #fff;
		color: #e62c27;
		box-sizing: border-box;

	}

	.action-buttons>button:nth-child(2) {
		border: 2px solid #00893d;
		background-color: #fff;
		color: #00893d;
		box-sizing: border-box;
	}

	.action-buttons>button:nth-child(3) {
		background-color: #00893d;
		color: #fff;
	}

	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 226rpx;
		padding-top: 20rpx;
		overflow: auto;
		padding-bottom: 10rpx;
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
		width: 126rpx;
		height: 50rpx;
		background-color: rgba(252, 207, 70, 0.20);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.link-top {
		position: fixed;
		bottom: 40rpx;
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
