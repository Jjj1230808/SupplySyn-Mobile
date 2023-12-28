<template>

	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="开始装配" :isCanBack="true"
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
			<material-list :materialList="materialList" cardtitle="开始装配"></material-list>
		</scroll-view>
		<view class="action-buttons" v-if="!isShowSearch">
			<button>
				<image style="width: 36rpx;height: 36rpx;" src="../../static/img/assignment_return.svg">
				</image>
				物料退回
			</button>
			<button @click="finishAssembly">
				<image style="width: 36rpx;height: 36rpx;" src="../../static/img/icon-wrapper.svg">
				</image>
				装配完成
			</button>
			<button @click="scanAssembly">
				<image style="width: 36rpx;height: 36rpx;" src="../../static/img/qr_code.svg">
				</image>
				扫码装配
			</button>
		</view>
		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">

		</view>
		<scan-dialog :show="showScan" :outWidth="420" :outHeight="280" :padding="50" :iconWidth="120" :iconHeight="120"
			maskClosable>
		</scan-dialog>
		<assembly-qty-dialog :show="showAssemblyQty" :title="title" :buttons="buttons" maskClosable @click="onClick1"
			@close="onClose1" :materialInfo="materialInfo"></assembly-qty-dialog>
		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>
		<fui-dialog :show="showFinishConfirm" title="确认完成装配" content="请确认该工位装配是否已完成？" :buttons="buttons" maskClosable
			@click="onClickConfirm" @close="onCloseConfirm">
		</fui-dialog>
		<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
	</view>
</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'

	function utf8ByteToUnicodeStr(utf8Bytes) {
		var unicodeStr = "";
		for (var pos = 0; pos < utf8Bytes.length;) {
			var flag = utf8Bytes[pos];
			var unicode = 0;
			if ((flag >>> 7) === 0) {
				unicodeStr += String.fromCharCode(utf8Bytes[pos]);
				pos += 1;

			} else if ((flag & 0xFC) === 0xFC) {
				unicode = (utf8Bytes[pos] & 0x3) << 30;
				unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
				unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
				unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
				unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
				unicode |= (utf8Bytes[pos + 5] & 0x3F);
				unicodeStr += String.fromCodePoint(unicode);
				pos += 6;

			} else if ((flag & 0xF8) === 0xF8) {
				unicode = (utf8Bytes[pos] & 0x7) << 24;
				unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
				unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
				unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
				unicode |= (utf8Bytes[pos + 4] & 0x3F);
				unicodeStr += String.fromCodePoint(unicode);
				pos += 5;

			} else if ((flag & 0xF0) === 0xF0) {
				unicode = (utf8Bytes[pos] & 0xF) << 18;
				unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
				unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
				unicode |= (utf8Bytes[pos + 3] & 0x3F);
				unicodeStr += String.fromCodePoint(unicode);
				pos += 4;

			} else if ((flag & 0xE0) === 0xE0) {
				unicode = (utf8Bytes[pos] & 0x1F) << 12;;
				unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
				unicode |= (utf8Bytes[pos + 2] & 0x3F);
				unicodeStr += String.fromCharCode(unicode);
				pos += 3;

			} else if ((flag & 0xC0) === 0xC0) { //110
				unicode = (utf8Bytes[pos] & 0x3F) << 6;
				unicode |= (utf8Bytes[pos + 1] & 0x3F);
				unicodeStr += String.fromCharCode(unicode);
				pos += 2;

			} else {
				unicodeStr += String.fromCharCode(utf8Bytes[pos]);
				pos += 1;
			}
		}
		return unicodeStr;
	}

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
			this.Id = JSON.parse((options.ListData)).id;
			this.materialList = JSON.parse((options.ListData)).data
			this.topData = JSON.parse((options.topData))

		},
		onHide() {
			console.log('onhide')
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
			scanDevice.stopScan()
			this.unregisterScan()
		},
		onShow() {
			scanDevice.setOutScanMode(0); // 扫描模式=广播
			this.initScan()
			this.registerScan()
		},
		watch: {

		},
		methods: {
			onClose1(e) {
				this.showAssemblyQty = false
			},
			onClick1(e) {
				console.log(e)
				let _this = this

				if (e.index === 1) {
					uni.showLoading({
						title: '正在确认'
					})
					let url = BaseApi + '/Assemble/AssembleNumber?Mid=' + _this.materialInfo.materialId +
						'&returnQuantity=' + e.currentNum;
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
								uni.hideLoading()
								this.onClose1()
								this.showMessage = true
								setTimeout(() => {
									this.showMessage = false
								}, 3000)

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

				} else {
					this.onClose1()
				}


			},
			onClickConfirm(e) {
				let _this = this

				if (e.index === 1) {
					uni.showLoading({
						title: '正在确认'
					})

					let url = BaseApi + '/Assemble/Assemblefinished?Id=' + _this.Id;
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

								_this.onCloseConfirm()
								_this.getReturnData()

								// this.showMessage = true
								// uni.navigateTo({
								// 	url: '/pages/returnToWMS/returnToWMS?id=' + _this.Id
								// })
								// setTimeout(() => {
								// 	this.showMessage = false
								// }, 3000)

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
					// this.onCloseConfirm()

				} else {
					this.onCloseConfirm()
				}
			},
			getReturnData() {
				let _this = this;
				let url1 = BaseApi + '/Basedata/Listdata?Id=' + _this.Id;
				let url2 = BaseApi + '/Basedata/Topdata?Id=' + _this.Id;
				let request1 = new Promise((resolve, reject) => {
					uni.request({
						url: url1,
						method: 'GET',
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
							'Content-Type': 'application/json;charset=utf-8'
						},
						success: (res) => {
							resolve(res);
						},
						fail: (err) => {
							reject(err);
						}
					});
				});

				let request2 = new Promise((resolve, reject) => {
					uni.request({
						url: url2,
						method: 'GET',
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
							'Content-Type': 'application/json;charset=utf-8'
						},
						success: (res) => {
							resolve(res);
						},
						fail: (err) => {
							reject(err);
						}
					});
				});

				Promise.all([request1, request2]).then(([res1, res2]) => {
					if (res1.data.statusCode !== 200) {
						_this.message = res1.data.message
						_this.showError = true
						setTimeout(() => {
							_this.showError = false
						}, 3000)
						return
					} else if (res2.data.statusCode !== 200) {
						_this.message = res2.data.message
						_this.showError = true
						setTimeout(() => {
							_this.showError = false
						}, 3000)
						return
					} else {
						uni.hideLoading()
						uni.navigateTo({
							url: `/pages/returnToWMS/returnToWMS?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}`,
						})
					}
					// 在这里写你的逻辑
				}).catch(err => {
					this.showError = true
					this.message = '请求失败'
					setTimeout(() => {
						_this.showError = false
					}, 3000)
					console.log(err)
					// 处理请求失败的情况
				});
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
				this.showScan = false
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

						let url = BaseApi + '/GetDetail?Mid=' + codeStr;
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
									uni.hideLoading()
									_this.showAssemblyQty = true
									_this.materialInfo = res.data.data
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
						// scanDevice.stopScan(); // 停止扫描

					}
				});
			},
			scanAssembly() {
				this.showScan = true
				scanDevice.setOutScanMode(0); // 扫描模式=广播
				scanDevice.startScan()
				setTimeout(() => {
					this.showScan = false
				}, 3000)
			},
			finishAssembly() {
				this.showFinishConfirm = true
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
				// this.enterMaterialCode({
				// 	detail: {
				// 		value: ''
				// 	}
				// })
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
		top: 276rpx;
		padding-top: 20rpx;
		overflow: auto;
		padding-bottom: 130rpx;
		z-index: -1;
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
