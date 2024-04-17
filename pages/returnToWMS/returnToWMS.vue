<template>
	<!-- 退库变为装配完成  只能由开始装配页面的装配完成按钮跳转-->
	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="装配完成 " :isCanBack="true"
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
				<view>剩余数量 <span
						style="color: #f2b704;">{{topData.remainingQuantitys<0?0:topData.remainingQuantitys}}</span>
				</view>
			</view>
		</view>
		<view class="tip" v-if="topData.remainingQuantitys>0">
			<image style="width: 32rpx;height: 32rpx;margin-right: 10rpx;color: #000; ;"
				src="../../static/img/qr_code_scanner.svg" mode=""></image>
			请处理剩余物料
		</view>
		<scroll-view class="material-list" :style="{ top: topData.remainingQuantitys>0 ? 333+'rpx' : 276+'rpx' }">
			<material-list :materialList="materialList" @returnMaterial="returnMaterial" cardtitle="退库"></material-list>

		</scroll-view>
		<view class="action-buttons" v-if="!isShowSearch">

			<button @click="scanAssembly()" class="scan-btn-active">
				<image style="width: 36rpx;height: 36rpx;" src="../../static/img/green-scan.svg">
				</image>
				扫码退库
			</button>

			<!-- <button @click="finishAssembly" class="finish-assembly-btn-active" v-if="topData.remainingQuantitys<=0">
				</image>
				结束装配
			</button> -->
			<button @click="finishAssembly()" class="finish-assembly-btn-active">

				结束装配
			</button>
		</view>
		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">

		</view>
		<scan-dialog :show="showScan" v-on:close="closeMask" :outWidth="420" :outHeight="280" :padding="50"
			:iconWidth="120" :iconHeight="120" maskClosable>
		</scan-dialog>
		<assembly-qty-dialog v-if="showAssemblyQty" :show="showAssemblyQty" :title="title" :buttons="buttons"
			maskClosable @click="onClick1" numText="本次退库数量" @close="onClose1" :materialInfo="materialInfo">
		</assembly-qty-dialog>
		<assembly-qty-dialog v-if="showAssemblyQty2" :show="showAssemblyQty2" :title="title2" :buttons="buttons"
			maskClosable @click="onClick2" numText="本次报废数量" @close="onClose2" :materialInfo="materialInfo2">
		</assembly-qty-dialog>
		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>
		<!-- <scan-dialog :show="assemblefinish" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable> -->
		</scan-dialog>
		<fui-dialog :show="showFinishConfirm" title="结束装配" content="退库单与报废单将提交设计部门审批,是否继续？" :buttons="buttons"
			maskClosable @click="onClickConfirm" @close="onCloseConfirm">
		</fui-dialog>
		<fui-dialog :show="showFinishConfirmA" :title="title3" content="实际剩余物料数量与系统计算值不符" :buttons="buttons"
			maskClosable @click="onClickConfirmA" @close="onCloseConfirmA">
		</fui-dialog>
		<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
		<tipsdialog :isWithdraw="tdf" :show2="show2"></tipsdialog>
		<tipsdialog-fail :show3="show3" @sonmsg="openMsg"></tipsdialog-fail>
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
				AllNumberFlag:true,
				noClick: true,
				tdf: "zp",
				isShowSearch: false,
				materialCode: '',
				showScan: false,
				showAssemblyQty: false,
				showAssemblyQty2: false,
				// 选择退库数量
				title: '退库',
				title2: '物料报废',
				title3: '',
				buttons: [{
					text: '取消',
					color: '#646464'
				}, {
					text: '确定',
					color: '#00893d'
				}],
				showMessage: false,
				showFinishConfirm: false,
				showFinishConfirmA: false,
				materialList: [],
				message: '',
				showError: false,
				materialInfo: {},
				sigleReturn: false,
				returnQuantity: '',
				comments: '',
				materialInfo2: {},
				scrapQuantity: '',
				comments2: '',
				show2: false,
				show3: false,
				saveCondition:''
			};
		},
		onLoad(options) {
			this.Id = JSON.parse((options.ListData)).id;
			this.materialList = JSON.parse((options.ListData)).data.filter(item => item.materialType !== 20)
			this.topData = JSON.parse((options.topData))
			
			console.log('装配完成onLoad');
		},
		onHide() {
			console.log('装配完成onHide');
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
			scanDevice.stopScan()
			this.unregisterScan()
		},
		onUnload() {
		// 扫描模式=输入框
			// scanDevice.stopScan()
			// this.unregisterScan()
			console.log('装配完成onUnLoad');
			
		},
		onShow() {
		scanDevice.setOutScanMode(0); // 扫描模式=广播
		this.initScan()
		this.registerScan()
		},
		watch: {

		},
		methods: {
			countNumber(){
			for(const item of this.materialList ){
				if (item.totalQuantity - item.quantityUsed - item.returnQuantity -item.scrapQuantity < 0){
					this.AllNumberFlag = false;
					break;
				}
			}	
			},
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
					//现在的待装配数量 = 总-装配数量-填退库的数字-报废数量
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
					this.returnQuantity = e.currentNum3,
						this.comments = e.comments
					let currentRemaining = e.totalQuantity - e.quantityUsed - e.currentNum3 - e.scrapQuantity -e.returnQuantity
					console.log(currentRemaining)
					//通过currentRemaining判断是否出现弹窗
					if (currentRemaining >= 0) {
						//如果大于0，直接发送 ，不提示
						uni.showLoading({
							title: '正在确认'
						})
						// let url = BaseApi + '/StockReturn/Edit?Mid=' + _this.materialInfo.materialId +
						// 	'&returnQuantity=' + e.currentNum;
						let url = BaseApi + '/api/app/material/material-return';
						//comments填写退库的备注，后面要加
						let data = {
							mid: _this.materialInfo.materialId,
							returnQuantity: this.returnQuantity,
							comments: this.comments
						}
						console.log(data)
						console.log(url)
						uni.request({
							url: url,
							method: 'POST',
							data: data,
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
					} else if (currentRemaining < 0) {
						//小于0 提示 
						this.title3 = '退库数量提醒'
						this.showFinishConfirmA = true
						console.log(this.sigleReturn)
					}



				} else {
					this.onClose1()
				}


			},
			onClose2(e) {
				this.showAssemblyQty2 = false
			},
			onClick2(e) {
				console.log(e)
				let _this = this

				if (e.index === 1) {
					//现在的待装配数量 = 总-装配数量-填退库的数字-报废数量
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
					this.scrapQuantity = e.currentNum4,
						this.comments2 = e.comments
					let currentRemaining = e.totalQuantity - e.quantityUsed - e.currentNum4 - e.returnQuantity -e.scrapQuantity
					console.log(currentRemaining)
					//通过currentRemaining判断是否出现弹窗
					if (currentRemaining >= 0) {
						//如果大于0，直接发送 ，不提示
						uni.showLoading({
							title: '正在确认'
						})
						// let url = BaseApi + '/StockReturn/Edit?Mid=' + _this.materialInfo.materialId +
						// 	'&returnQuantity=' + e.currentNum;
						let url = BaseApi + '/api/app/material/material-scrap';
						//comments填写退库的备注，后面要加
						let data = {
							mid: _this.materialInfo2.materialId,
							scrapQuantity: this.scrapQuantity,
							comments: this.comments2
						}
						console.log(data)
						console.log(url)
						uni.request({
							url: url,
							method: 'POST',
							data: data,
							header: {
								'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
								'Content-Type': 'application/json;charset=utf-8'
							},
							success: (res) => {
								console.log(res)
								if (res.data.statusCode !== 200) {
									uni.hideLoading()
									_this.message = res.data.message?res.data.message :'出错了，请重试'
									_this.showError = true

									setTimeout(() => {
										_this.showError = false
									}, 3000)
								} else {
									uni.hideLoading()
									this.onClose2()
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
					} else if (currentRemaining < 0) {
						//小于0 提示
						this.title3 = '报废数量提醒'
						this.showFinishConfirmA = true
						console.log(this.sigleReturn)

					}
				} else {
					this.onClose2()
				}



			},
			onClickConfirmA(e) {
				if (e.index === 1 && this.showAssemblyQty) {
					//单个 点击确认,发送请求
					let _this = this
					this.showFinishConfirmA = false,

						uni.showLoading({
							title: '正在确认'
						})
					// let url = BaseApi + '/StockReturn/Edit?Mid=' + _this.materialInfo.materialId +
					// 	'&returnQuantity=' + e.currentNum;
					let url = BaseApi + '/api/app/material/material-return';
					//comments填写退库的备注，后面要加
					let data = {
						mid: _this.materialInfo.materialId,
						returnQuantity: this.returnQuantity,
						comments: this.comments
					}
					console.log(data)
					console.log(url)
					uni.request({
						url: url,
						method: 'POST',
						data: data,
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
							'Content-Type': 'application/json;charset=utf-8'
						},
						success: (res) => {
							console.log(res)
							if (res.data.statusCode !== 200) {
								uni.hideLoading()
								_this.message = res.data.message?res.data.message :'出错了，请重试'
								_this.showError = true

								setTimeout(() => {
									_this.showError = false
								}, 3000)
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

					this.showAssemblyQty = false
				} else if (e.index === 1 && this.showAssemblyQty2) {
					//单个 点击确认,发送请求
					let _this = this
					this.showFinishConfirmA = false,
						uni.showLoading({
							title: '正在确认'
						})
					// let url = BaseApi + '/StockReturn/Edit?Mid=' + _this.materialInfo.materialId +
					// 	'&returnQuantity=' + e.currentNum;
					let url = BaseApi + '/api/app/material/material-scrap';
					//comments填写退库的备注，后面要加
					let data = {
						mid: _this.materialInfo2.materialId,
						scrapQuantity: this.scrapQuantity,
						comments: this.comments2
					}
					console.log(data)
					console.log(url)
					uni.request({
						url: url,
						method: 'POST',
						data: data,
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
							'Content-Type': 'application/json;charset=utf-8'
						},
						success: (res) => {
							console.log(res)
							if (res.data.statusCode !== 200) {
								uni.hideLoading()
								_this.message = res.data.message?res.data.message :'出错了，请重试'
								_this.showError = true

								setTimeout(() => {
									_this.showError = false
								}, 3000)
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


					this.showAssemblyQty2 = false
				} else if (e.index === 1 && !this.showAssemblyQty) {
					//总的
					this.showFinishConfirmA = false,
						this.showFinishConfirm = true
				} else {
					// 点击取消

					this.onCloseConfirmA()
				}

			},

			onClickConfirm(e) {
				let _this = this

				if (e.index === 1) {


					uni.showLoading({
						title: '正在确认'
					})

					let url = BaseApi + '/api/app/material/finishes-assembly/' + _this.Id;
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

								_this.message = res.data.message?res.data.message :'出错了，请重试'
								_this.showError = true
								setTimeout(() => {
									_this.showError = false
								}, 3000)
								return
							} else {
								_this.message = res.data.message

								console.log(res);
								//在这里调用生产审批流的接口
								let url = BaseApi + '/api/app/material/work-flow-process';
								let data = res.data.data;
								console.log(url)
								console.log(res.data)
								uni.request({
									url: url,
									method: 'POST',
									data: res.data.data,
									header: {
										'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
										'Content-Type': 'application/json;charset=utf-8'
									},
									success: (res) => {
										console.log(res)
										uni.hideLoading()
										if (res.data.statusCode !== 200) {
											console.log('审批流生成失败')
											_this.message = res.data.message?res.data.message :'出错了，请重试'
											// _this.showError = true
											// setTimeout(() => {
											// 	_this.showError = false
											// }, 3000)
											return
										} else {
											console.log('审批流生成成功')
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
								})
								//跳转之前关闭扫描
								scanDevice.setOutScanMode(1); // 扫描模式=输入框
								scanDevice.stopScan()
								_this.unregisterScan()
this.show2 = true

								// _this.onCloseConfirm()

								// _this.showMessage = true
								// setTimeout(() => {
								// 	_this.showMessage = false
								// 	uni.reLaunch({
								// 		url: '/pages/function/function'
								// 	})
								// }, 1800)

							}
						},
						fail: (err) => {
							uni.hideLoading()
							this.show3 = true
							console.log(err)
						}
					});
					// this.onCloseConfirm()

				} else {
					this.onCloseConfirm()
				}
				// if (e.index === 1) {
				// 	// this.onCloseConfirm()
				// 	// this.showMessage = true
				// 	// setTimeout(() => {
				// 	// 	this.showMessage = false
				// 	// }, 3000)

				// } else {
				// 	this.onCloseConfirm()
				// }

			},
			onCloseConfirm() {
				this.showFinishConfirm = false
			},
			onCloseConfirmA() {
				this.showFinishConfirmA = false

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

						let url = BaseApi + '/api/app/material/material-find?Mid=' + codeStr;
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
										_this.showScan = false
								_this.message = res.data.message?res.data.message :'出错了，请重试'
									_this.showError = true
									setTimeout(() => {
										_this.showError = false
									}, 3000)
									return
								} else {
									uni.hideLoading()
									console.log(res.data.data)
									_this.showScan = false
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
			finishAssembly() {
				this.countNumber()
				if (this.AllNumberFlag === false) {
					this.title3 = '结束装配提醒'
					this.showFinishConfirmA = true
					this.showFinishConfirm = false
				} else {
					this.showFinishConfirm = true

				}

			},
			scanAssembly() {
				this.showScan = true
				//scanDevice.setOutScanMode(0); // 扫描模式=广播

				// scanDevice.startScan()
				// setTimeout(() => {
				// 	this.showScan = false
				// }, 3000)
			},
			enterMaterialCode(e) {
				this.saveCondition = e.detail.value
				console.log(e)
				let _this = this;
				this.isShowSearch = false
				uni.showLoading({
					title: '正在搜索'
				})
				let url = BaseApi + '/api/app/material/material/' + this.Id + '?Info=' + e.detail.value;
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
						_this.message = res.data.message?res.data.message :'出错了，请重试'
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							_this.materialList = res.data.data.data.filter(item => item.materialType !== 20)
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
			//结束刷新
			getfreshData() {
				let _this = this;
				let url1 = BaseApi + `/api/app/material/designate-station/${_this.Id}`;
				let url2 = BaseApi + '/api/app/material/material-number/' + _this.Id;
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
						_this.message = res1.data.message?res1.data.message :'出错了，请重试'
						_this.showError = true
						setTimeout(() => {
							_this.showError = false
						}, 3000)
						return
					} else if (res2.data.statusCode !== 200) {
					_this.message = res2.data.message?res2.data.message :'出错了，请重试'
						_this.showError = true
						setTimeout(() => {
							_this.showError = false
						}, 3000)
						return
					} else {
						uni.hideLoading()
						console.log(res1.data);
						// uni.redirectTo({
						// 	url: `/pages/startToAssembly/startToAssembly?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}`,
						// })
						this.materialList = res1.data.data.data.filter(item => item.materialType !== 20)
						
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
			closeSearch() {
				this.materialCode = ''
				this.isShowSearch = false
				this.saveCondition =''
				this.getfreshData()
				// this.enterMaterialCode({
				// 	detail: {
				// 		value: ''
				// 	}
				// })
			},
			returnMaterial(e) {
				uni.showLoading({
					title: '正在查询'
				})
				let _this = this;
				console.log(e.id)
				let url = BaseApi + '/api/app/material/material-find?Mid=' + JSON.stringify({
					'Id': e.id
				});
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
							_this.message = res.data.message?res.data.message :'出错了，请重试'
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							uni.hideLoading()
							console.log(res.data.data)
							_this.showAssemblyQty2 = true
							_this.materialInfo2 = res.data.data
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
			displaySearchBar() {
				scanDevice.setOutScanMode(1); // 扫描模式=广播

				// scanDevice.startScan()
				this.isShowSearch = true

			},
			linkToTop() {
				console.log('锚链接')
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
			},
			openMsg(msg) {
				console.log(msg);
				this.show3 = msg
				// console.log(this.historyflag)

			},
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
		z-index: 998;
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
		z-index: 2;
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
		z-index: 2;
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
		z-index: 1;
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
		height: 90rpx;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		font-size: 28rpx;
		outline: none;
		font-weight: bold;
	}

	.action-buttons>button>image {
		margin-right: 6rpx;
	}

	.scan-btn-active {
		border: #00893d 3rpx solid;
		background-color: #fff;
		color: #414546;
		width: 246rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0;
	}

	.scan-btn-disable {
		background: rgba(0, 0, 0, 0.12);
		color: rgba(0, 0, 0, 0.38);
		width: 246rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0;
	}

	.finish-assembly-btn-active {
		background-color: #00893d;
		color: #fff;
		width: 446rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.finish-assembly-btn-disable {
		background: rgba(0, 0, 0, 0.12);
		color: rgba(0, 0, 0, 0.38);
		width: 446rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 390rpx;
		padding-top: 20rpx;
		overflow: auto;
		padding-bottom: 130rpx;
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
		z-index: 2;
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

	.tip {
		z-index: 1;
		display: flex;
		align-items: center;
		height: 57rpx;
		justify-content: center;
		width: 100%;
		background: #FccF46;
		position: fixed;
		top: 276rpx;
		left: 0;
		right: 0;
		color: #000;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>
