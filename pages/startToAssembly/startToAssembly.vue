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
		<view v-if="!isShowSearch" class="search-bar">
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
				<view>剩余数量 <span style="color: #f2b704;">{{topData.remainingQuantitys<0 ? 0 :topData.remainingQuantitys }}</span></view>
			</view>
		</view>
		<scroll-view class="material-list">
			<material-list :materialList="materialList" cardtitle="开始装配"></material-list>
		</scroll-view>
		<view class="action-buttons" v-if="!isShowSearch">
			<button @click="returnMaterial">
				
				
				物料退回
			</button>
			<button hover-class="none" @click="scrapMaterial">
				
				
				物料报废
			</button>
			<button @click="finishAssembly">
				
		
				装配完成
			</button>
			<button hover-class="none" @click="scanAssembly">
				
		
				扫码装配
			</button>
		</view>
		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">

		</view>
		<scan-dialog :show="showScan" v-on:close="closeMask" :outWidth="420" :outHeight="280" :padding="50"
			:iconWidth="120" :iconHeight="120" maskClosable>
		</scan-dialog>
		<assembly-qty-dialog v-if="showAssemblyQty" :show="showAssemblyQty" :title="title" :num=1 :buttons="buttons" maskClosable @click="onClick1"
			@close="onClose1" :materialInfo="materialInfo"></assembly-qty-dialog>
		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>
		<fui-dialog :show="showFinishConfirm" title="确认完成装配" content="请确认该工位装配是否已完成？" :buttons="buttons" maskClosable
			@click="onClickConfirm" @close="onCloseConfirm">
		</fui-dialog>
		<fui-dialog :show="showReturnConfirm" title="物料退回" content="是否发起物料退回？" :buttons="buttons" maskClosable
			@click="onClickReturnConfirm" @close="onCloseReturnConfirm">
		</fui-dialog>
		<fui-dialog :show="showScrapConfirm" title="物料报废" content="是否发起物料报废？" :buttons="buttons" maskClosable
			@click="onClickScrapConfirm" @close="onCloseScrapConfirm">
		</fui-dialog>
		<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
		<!-- <view v-show="show2" class="mark">
		<view  class="location-choose">
			
		<view class="choose-title" >
				<button style="height: 100rpx;background-color: #fff;color: black;font-size: 35rpx;">剩余物料确认</button>
		</view>
			<view style="height: 280rpx; margin-bottom: 20rpx;">
				<view class="tipsA">
					系统计算无剩余物料，是否要手动录入剩余物料，以创建退库单？
				</view>
				<view class="tipsB">
			
						<image src="../../static/img/tips-logo.svg" 
						style="width: 35rpx;height: 45rpx;margin-top:5rpx;"
						 mode=""></image>
					
					<view class="">
						手动修改数据生成的退库单和报废单需要装配经理审批
					</view>
				</view>
			</view>
			<view style="height: 100rpx;" class="createNo">
				<button @click="createNo()" style="color: white;background-color: #00893d;border-radius: 15rpx;">不创建</button>
			</view> -->
			<!-- <view class="createHandler"> -->
				<!-- <button class="createHandler" @click="createHandler()" >手动创建退库单</button> -->
			<!-- </view> -->
		<!-- <view style="height: 100rpx;" class="closec">
			<button @click="createNo()" style="color: #646464;border-radius: 15rpx;">取消</button>
		</view> -->
			
		<!-- </view>
	</view> -->
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
				showReturnConfirm: false,
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
				showScrapConfirm:false,
				materialList: [],
				topData: {},
				Id: '',
				showError: false,
				message: '',
				materialInfo: {},
				show2:false
			};
		},
		onLoad(options) {
			this.Id = JSON.parse((options.ListData)).id;
			this.materialList = JSON.parse((options.ListData)).data
			this.topData = JSON.parse((options.topData))
		console.log('onLoad');
		

		},
		onHide() {
			console.log('onhide')
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
			scanDevice.stopScan()
			this.unregisterScan()
		},
		onShow() {
			scanDevice.setOutScanMode(0); // 扫描模式=广播
			this.getfreshData();
			console.log('onShow');
			this.initScan()
			this.registerScan()
		},
		watch: {

		},
	
		methods: {
			closeMask() {
				this.showScan = false

			},
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
					// let url = BaseApi + '/Assemble/AssembleNumber?Mid=' + _this.materialInfo.materialId +
					// 	'&quantityUsed=' + e.currentNum;
					let url = BaseApi + '/Assemble/AssembleNumber';
					let data = {
						mid:_this.materialInfo.materialId,
						quantityUsed:e.currentNum
					}
					console.log(url)
					uni.request({
						url: url,
						method: 'POST',
						data:data,
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
								_this.getfreshData()
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
			refesh(){
				this.$router.go(0)
			}
			,
			onClickConfirm(e) {
				let _this = this

				if (e.index === 1 ) {
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
							uni.hideLoading()
							if (res.data.statusCode !== 200) {
								
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

				} else  {
					this.onCloseConfirm()
				}
			},
			getfreshData() {
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
						console.log(res1.data.data,res2.data.data);
						// uni.redirectTo({
						// 	url: `/pages/startToAssembly/startToAssembly?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}`,
						// })
						this.Id = res1.data.data.id;
						this.materialList = res1.data.data.data
						this.topData = res2.data.data
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
										_this.showScan = false;
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
				this.showScan = true;
				scanDevice.setOutScanMode(0); // 扫描模式=广播
			},
			finishAssembly() {
				this.showFinishConfirm = true
			},
			returnMaterial() {
				this.showReturnConfirm = true
			},
			onCloseReturnConfirm() {
				this.showReturnConfirm = false
			},
			onClickReturnConfirm(e) {
				if (e.index === 1) {


					this.showReturnConfirm = false
					let _this = this
					uni.showLoading({
						title: '正在查询'
					})

					let url1 = BaseApi + '/GetMaterialFallbackDataSources?Id=' + this.Id
					let url2 = BaseApi + '/Basedata/Topdata?Id=' + this.Id
					console.log(uni.getStorageSync("scToken"))

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
						console.log(res1);
						console.log(res2)
						if (res1.data.statusCode !== 200) {
							uni.hideLoading()
							_this.message = res1.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else if (res2.data.statusCode !== 200) {
							uni.hideLoading()
							_this.message = res2.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							uni.hideLoading()
							uni.navigateTo({
								url: `/pages/materialReturn/materialReturn?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}`,
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
				} else {
					this.showReturnConfirm = false
				}
			},
			onClickScrapConfirm(e) {
				if (e.index === 1) {
			
			
					this.showScrapConfirm = false
					let _this = this
					uni.showLoading({
						title: '正在查询'
					})
			
					let url1 = BaseApi + '/GetMaterialScrapDataSources?Id=' + this.Id
					let url2 = BaseApi + '/Basedata/Topdata?Id=' + this.Id
					console.log(uni.getStorageSync("scToken"))
			
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
						console.log(res1);
						console.log(res2)
						if (res1.data.statusCode !== 200) {
							uni.hideLoading()
							_this.message = res1.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else if (res2.data.statusCode !== 200) {
							uni.hideLoading()
							_this.message = res2.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							uni.hideLoading()
							uni.navigateTo({
								url: `/pages/materialScrap/materialScrap?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}`,
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
				} else {
					this.showScrapConfirm = false
				}
			},
			onCloseScrapConfirm(){
				this.showScrapConfirm = false
			},
			enterMaterialCode(e) {
				console.log(e)
				let _this = this;
				this.isShowSearch = false
				uni.showLoading({
					title: '正在搜索'
				})
				console.log(this.Id)
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

				// scanDevice.startScan()
				this.isShowSearch = true

			},
			scrapMaterial(){
				this.showScrapConfirm = true
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
		
		width: 25%;
		height: 100%;
		margin: unset;
		padding: unset;
	border: #fff;
	
	}

	
.action-buttons>button:nth-child(1) {
		margin: unset;
		padding: unset;
			
		background-color: #fff;
		color: #646464;
		box-sizing: border-box;

	}
	.action-buttons>button:nth-child(2) {
		margin: unset;
		padding: unset;
			
		background-color: #fff;
		color: #e62c27;
		box-sizing: border-box;

	}

	.action-buttons>button:nth-child(3) {
		margin: unset;
		padding: unset;
		
		background-color: #fff;
		color: #00893d;
		box-sizing: border-box;
	}
	button {
	    margin: unset;
	    padding: unset;
		background-color: white;
		border-radius: 0%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}
	button:after {
	
		border-top:none;
		border-bottom: none;
border-right:1rpx solid #ced5da;
border-left:1rpx solid #ced5da;
		border-radius: 0%;
	font-weight: 600;
	}

	.action-buttons>button:nth-child(4) {
		margin: unset;
		padding: unset;
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
	.location-choose{
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
	    margin: 320rpx 80rpx;
			width: 580rpx;
			height: 690rpx;
			
			background-color: white;
		 position: fixed;
		 z-index: 1000;
		 top: 0;
		 right: 0;
		 left: 0;
		 bottom: 0;
padding: 0 30rpx 0 30rpx;

		 // transition-property: all;
		 // transition-timing-function: ease-in;
		 // transition-duration: 0.2s;
		 // display: flex;
		 // transform: scale3d(1, 1, 0);
		 // visibility: hidden;
		}
		.choose-title{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 35rpx;
	
			border-radius: 15rpx;
		}
		.choose-title>button{
			border: unset;
			padding: unset;
		}
		.choose-title>button:after {
			border: unset;
		
		}
			.createNo {
				margin-bottom: 20rpx;
						
			}
			// .createHandler{
			// 	margin-bottom: 20rpx;
			// 			background-color: blue;
			// }
		.createNo>button:after {
			border: unset;
					
		}
		// .createHandler>button{
		// 	border: unset;
		// 	padding: unset;
		// }
		.createHandler {
		border: #00893d 2rpx solid;
		
		border-radius: 15rpx;
		margin-bottom: 30rpx;
		}
		.closec{
			
		}
		.closec>button:after {
			border: unset;
		
		}
		.tipsA{
			height: 114rpx;
			font-size: 32rpx;
			color: #646464;
			
		}
		.tipsB{
			font-size: 30rpx;
			height: 114rpx;
			width: 100%;
			color: #1d9bb2;
			background-color: rgba(29, 155, 178, 0.10);
			padding: 20rpx;
			display: flex;
			flex-direction: row;
		}
		
		.mark{
		   	 
		   	position:absolute;
		   	height: 100%; 
		   	color: #fff;
		   	background: rgba(0, 0, 0, 0.5); 
		   	left: 0%;
		   	right: 0%;
		   top: 0%;
		   	font-size: 26rpx;
		   	text-align: center;
		   	box-shadow: 2px -3px 100px -5px  #FFFFFF;
		   
		   }
</style>
