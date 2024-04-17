<template>
	<view>
		<navbar :userName="userName" :isCanBack="false" title='主页'></navbar>
		<view class="menu-container">
			<view class="menu-items" v-for="(item,index) in menuList">
				<view class="menu-title">{{item.title}}</view>
				<view class="menu-item-container">
					<!-- <view class="menu-item" v-for="(childItem,index) in item.menuItems" @click="linkRequest(childItem)"> -->
					<view class="menu-item" v-for="(childItem,index) in item.menuItems"
						@click="showLocationc(childItem)">
						<image :src="'../../static/img/'+childItem.image+'.svg'" mode="widthFix"></image>
						<view class="menu-text">{{childItem.text}}</view>
					</view>
				</view>
			</view>

		</view>

		<!-- <view class="actioncommit" @click="entryAction">
			<view class="action-text">
				标签
				<span>打印</span>
			</view>
			<view class="action-edit">
				<image src="../../static/WMS UI design/icon-label_print.svg" mode="widthFix"></image>
			</view>
		</view>
		<view class="actioncommit" @click="entryMyTask">
			<view class="action-text">
				标签
				<span>重打</span>

			</view>
			<view class="action-edit">
				<image src="../../static/WMS UI design/icon-reprint.svg" mode="widthFix"></image>
			</view>
		</view>
		<view class="actioncommit" @click="entryUpShelf">
			<view class="action-text">
				物料
				<span>上架</span>

			</view>
			<view class="action-edit">
				<image src="../../static/WMS UI design/icon-shelf.svg" mode="widthFix"></image>
			</view>
		</view> -->
		<scan-dialog :show="show1" v-on:close="closeMask" :outWidth="420" :outHeight="280" :padding="50"
			:iconWidth="120" :iconHeight="120" >
		</scan-dialog>
		<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
		<view v-show="show2" class="mark">
			<view class="location-choose">
				<view class="choose-title">


					<button style="color:black;font-size: 38rpx;">选择定位方式</button>
				</view>
				<view style="height: 100rpx;">
					<button @click="linkRequest()" style="color: green;">扫描二维码</button>
				</view>
				<view style="height: 100rpx;" class="">
					<button @click="handlerChoose()" style="color: green;">手动选择</button>
				</view>
				<view style="height: 100rpx;" class="">
					<button @click="closec()" style="color: #646464;">取消</button>
				</view>
			</view>
		</view>
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
	var globalEvent = uni.requireNativePlugin('globalEvent');
	export default {
		data() {
			return {
				// showLeft: false,
				// currid: '',
				// show: false,
				// currentTen: '',
				// range: [],
				show1: false,
				show2: false,
				userName: '',
				// placeHolder: '点击此处切换Tenant',
				// adAccount: '',
				modalVisible: false,
				message: '',
				showError: false,
				buttons: [{
					text: '取消',
					color: '#ccc'
				}, {
					text: '确定',
					color: '#00893d'
				}],
				menuList: [{
					title: '装配车间',
					menuItems: [{
							text: '开始装配',
							image: 'start-assembly',
							router: '/pages/startToAssembly/startToAssembly'
						},
						{
							text: '物料退回',
							image: 'material-back',
							router: '/pages/materialReturn/materialReturn'
						}
					]
				}, {
					title: '剩余物料处理',
					menuItems: [{
							text: '补打标签',
							image: 'label',
							router: '/pages/reprintLabel/reprintLabel'
						},
						{
							//需要换页面
							text: '物料报废',
							image: 'material-scrap',
							router: '/pages/materialScrap/materialScrap'
						}
					]
				}, {
					title: '单据管理',
					menuItems: [{
						text: '退库单',
						image: 'returnwms-doc',
						router: '/pages/returnList/returnList'
					}, {
						text: '报废单',
						image: 'scrap-doc',
						router: '/pages/scrapList/scrapList'
					}]
				}, {
					title: '物料签收',
					menuItems: [{
						text: '入库签收',
						image: 'towms-sign',
						router: '/pages/entrySign/entrySign'
					}, {
						text: '报废签收',
						image: 'scrap-sign',
						router: '/pages/scrapSign/scrapSign'
					}]
				}],
				currentRoute: null,
				currentRoute1: null,
				currentUrl: null,
				DocumentId: null,
				numberUrl:null

			}
		},
		// onUnload() {
		// 	uni.showModal({
		// 		title: "提示：",
		// 		content: "是否退出登录？",
		// 		confirmText: '取消',
		// 		cancelText: '确定',
		// 		success: function(res) {
		// 			if (res.confirm) {
		// 				console.log('用户点击取消');
		// 			} else if (res.cancel) {
		// 				uni.redirectTo({
		// 					url: '/pages/index/index'
		// 				})
		// 			}
		// 		}
		// 	})
		// },





		onLoad(options) {
			// let pages = getCurrentPages()
			// console.log(pages.length);
			// const tenants = JSON.parse(decodeURIComponent(options.tenants))
			// console.log(tenants);
			// console.log(tenants.user.tenantId);
			
			this.userName = uni.getStorageSync('userName')
			console.log(this.userName)
			// scanDevice = new ScanDeviceClass();
			// scanDevice.openScan(); // 打开扫描
			// scanDevice.setOutScanMode(0); // 扫描模式
			// this.registerScan()
			// scanDevice.openScan()
			console.log(scanDevice.getOutScanMode());

			
			

		},
		


		onHide() {
			console.log('onhide')
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
			scanDevice.stopScan()
			this.unregisterScan()
		},
		
		onUnload() {
			console.log('onUnload')
			// scanDevice.setOutScanMode(1); // 扫描模式=输入框
			// scanDevice.stopScan()
			// this.unregisterScan()
		},
		onShow() {
			console.log('function show');
			// let _this=this
			// setTimeout(function() {
			// 	scanDevice.setOutScanMode(0); // 扫描模式=广播
			// 	_this.initScan()
			// 	_this.registerScan()
			// 	console.log(scanDevice.getOutScanMode());
			// 	console.log(scanDevice.isScanOpened());
			// }, 200);
		
		
		},
		onBackPress(e) {
			console.log('123')
		},

		methods: {
			closeMask() {
				this.show1 = false
				this.currentRoute = ''
			},
			registerScan() {
				main.registerReceiver(receiver, filter);
			},
			unregisterScan() {
				main.unregisterReceiver(receiver);
			},
			initScan() {
				console.log('---------------进入了扫描------------')
				console.log(scanDevice.getOutScanMode());
				let _this = this;
				main = plus.android.runtimeMainActivity(); //获取activity  
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				filter = new IntentFilter();
				filter.addAction("scan.rcv.message"); // 换你的广播动作  
				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {

					onReceive: function(context, intent) {
						console.log('进入进入进入');
						plus.android.importClass(intent);
						let code = intent.getByteArrayExtra('barocode');
						//	let codeStr = String.fromCharCode(...code);

						let codeStr = utf8ByteToUnicodeStr(code);


						console.log('codeStr:', codeStr);




						// console.log(taskInfo);
						// let taskId = taskInfo.RelatedId
						// _this.getDocumentId(codeStr)
						_this.show1 = false
					
						console.log(_this.currentRoute)



						
						//主页下面四个扫码的进入
						//退库单
						if (_this.currentRoute === '/pages/returnList/returnList') {
							uni.request({
								url: BaseApi +'/api/app/material/return-documents/' + codeStr,
								method: 'GET',
								header: {
									'Authorization': 'Bearer ' + uni
										.getStorageSync(
											"scToken"),
									'Content-Type': 'application/json;charset=utf-8'
								},
								success: (res) => {
									uni.hideLoading()
									console.log(res)
									//jump
									console.log("jump");
									//注销扫描
									scanDevice.setOutScanMode(1); // 扫描模式=输入框
									scanDevice.stopScan()
									_this.unregisterScan()
									uni.navigateTo({
										url: `/pages/locationDoc/locationDoc?ListData=${JSON.stringify(res.data.data)}&currentRoute=${_this.currentRoute}&codeStr=${codeStr}`,
									})
									return
								
							
								},
								fail: (err) => {
									console.log(err);
									uni.hideLoading()
								}
							});
						
						//报废单
						} else if(_this.currentRoute === '/pages/scrapList/scrapList'){
							uni.request({
								url: BaseApi +'/api/app/material/scrap-documents/' + codeStr,
								method: 'GET',
								header: {
									'Authorization': 'Bearer ' + uni
										.getStorageSync(
											"scToken"),
									'Content-Type': 'application/json;charset=utf-8'
								},
								success: (res) => {
									uni.hideLoading()
									console.log(res)
									//注销扫描
									scanDevice.setOutScanMode(1); // 扫描模式=输入框
									scanDevice.stopScan()
									_this.unregisterScan()
									//jump
									uni.navigateTo({
										url: `/pages/locationDoc/locationDoc?ListData=${JSON.stringify(res.data.data)}&currentRoute=${_this.currentRoute}&codeStr=${codeStr}`,
									})
									return
									
							
								},
								fail: (err) => {
									console.log(err);
									uni.hideLoading()
								}
							});
							
						}
						//报废签收
						else if(_this.currentRoute === '/pages/scrapSign/scrapSign'){
							uni.request({
								
								url:  BaseApi +'/api/app/material/scrap-receipt-documents/' + codeStr,
								method: 'GET',
								header: {
									'Authorization': 'Bearer ' + uni
										.getStorageSync(
											"scToken"),
									'Content-Type': 'application/json;charset=utf-8'
								},
								success: (res) => {
									
							
							console.log(res)
							if(res.data.statusCode === 200){
								uni.hideLoading()
								//注销扫描
								scanDevice.setOutScanMode(1); // 扫描模式=输入框
								scanDevice.stopScan()
								_this.unregisterScan()
								//jump
								uni.navigateTo({
									url: `/pages/locationDoc/locationDoc?ListData=${JSON.stringify(res.data.data)}&currentRoute=${_this.currentRoute}&codeStr=${codeStr}`,
								})
							}else{
								console.log('转跳2');
								uni.hideLoading()
								_this.message = res.data.message
								_this.showError = true
																	
								setTimeout(() => {
									//注销扫描
									scanDevice.setOutScanMode(1); // 扫描模式=输入框
									scanDevice.stopScan()
									_this.unregisterScan()
								uni.reLaunch({
																    url: '/pages/function/function'
								
								})
								}, 3000)
								
								
		
								return
							}
							return
							
								},
								fail: (err) => {
									console.log(err);
									uni.hideLoading()
								}
							});
							
						}
						//入库签收
						else if(_this.currentRoute === '/pages/entrySign/entrySign'){
							uni.request({
								url:BaseApi +'/api/app/material/inbound-signing-documents/' + codeStr,
								method: 'GET',
								header: {
									'Authorization': 'Bearer ' + uni
										.getStorageSync(
											"scToken"),
									'Content-Type': 'application/json;charset=utf-8'
								},
								success: (res) => {
									
									console.log(res)
									if(res.data.statusCode === 200){
										uni.hideLoading()
										//注销扫描
										scanDevice.setOutScanMode(1); // 扫描模式=输入框
										scanDevice.stopScan()
										_this.unregisterScan()
										//jump
										uni.navigateTo({
											url: `/pages/locationDoc/locationDoc?ListData=${JSON.stringify(res.data.data)}&currentRoute=${_this.currentRoute}&codeStr=${codeStr}`,
										})
									}else{
										console.log('转跳2');
										uni.hideLoading()
										_this.message = res.data.message
										_this.showError = true
																			
										setTimeout(() => {
											//注销扫描
												scanDevice.setOutScanMode(1); // 扫描模式=输入框
												scanDevice.stopScan()
												_this.unregisterScan()
											uni.reLaunch({
																			    url: '/pages/function/function'
											
											})
										}, 3000)
										return
									}
									return
									
							
								},
								fail: (err) => {
									console.log(err);
									uni.hideLoading()
								}
							});
							
						}
							//物料退回
							else if (_this.currentRoute === '/pages/materialReturn/materialReturn') {
								_this.currentUrl = BaseApi +'/api/app/material/material-fallback-data-sources/' + codeStr
								
								let request1 = new Promise((resolve, reject) => {
								setTimeout(()=>{
									uni.request({
										url: _this.currentUrl,
										method: 'GET',
										header: {
											'Authorization': 'Bearer ' + uni.getStorageSync(
												"scToken"),
											'Content-Type': 'application/json;charset=utf-8'
										},
										success: (res) => {
											console.log(_this.currentUrl)
											console.log(res)
											resolve(res);
											console.log('request1，成功');
										},
										fail: (err) => {
											// reject(err);
											uni.hideLoading()
											console.log('request1,失败');
										}
									});
								},500);
								
								});
								
								let request2 = new Promise((resolve, reject) => {
									uni.request({
										url: BaseApi + '/api/app/material/material-number/' + codeStr,
										method: 'GET',
										header: {
											'Authorization': 'Bearer ' + uni.getStorageSync(
												"scToken"),
											'Content-Type': 'application/json;charset=utf-8'
										},
										success: (res) => {
								
											resolve(res);
											console.log(
												res,"request2，成功")
										},
										fail: (err) => {
											reject(err);
										}
									});
								});
								
								Promise.all([request1, request2]).then(([res1, res2]) => {
								
									if (res1.data.statusCode !== 200) {
										console.log('转跳1');
										uni.hideLoading()
										_this.message = res1.data.message
										_this.showError = true
								
										setTimeout(() => {
											_this.showError = false
										}, 3000)
										return
									} else if (res2.data.statusCode !== 200) {
										console.log('转跳2');
										uni.hideLoading()
										_this.message = res2.data.message
										_this.showError = true
								
										setTimeout(() => {
											_this.showError = false
										}, 3000)
										return
									} else {
										console.log('转跳');
										uni.hideLoading()
								//注销扫描
								scanDevice.setOutScanMode(1); // 扫描模式=输入框
								scanDevice.stopScan()
								_this.unregisterScan()
								
								
										uni.navigateTo({
											url: `${_this.currentRoute}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.DocumentId)}`,
										})
										_this.currentRoute = null
									}
									// 在这里写你的逻辑
								}).catch(err => {
									_this.showError = true
									_this.message = '请求失败'
									setTimeout(() => {
										
										
										
										_this.showError = false
									}, 3000)
									console.log(err)
									// 处理请求失败的情况
								});
								
								
								
								
								
							} else
								//物料报废
								if (_this.currentRoute === '/pages/materialScrap/materialScrap') {
									_this.currentUrl = BaseApi +'/api/app/material/material-scrap-data-sources/' + codeStr
									let request1 = new Promise((resolve, reject) => {
									setTimeout(()=>{
										uni.request({
											url: _this.currentUrl,
											method: 'GET',
											header: {
												'Authorization': 'Bearer ' + uni.getStorageSync(
													"scToken"),
												'Content-Type': 'application/json;charset=utf-8'
											},
											success: (res) => {
												console.log(_this.currentUrl)
												console.log(res)
												resolve(res);
												console.log('request1，成功');
											},
											fail: (err) => {
												// reject(err);
												uni.hideLoading()
												console.log('request1,失败');
											}
										});
									},500);
									
									});
									
									let request2 = new Promise((resolve, reject) => {
										uni.request({
											url: BaseApi + '/api/app/material/material-number/' + codeStr,
											method: 'GET',
											header: {
												'Authorization': 'Bearer ' + uni.getStorageSync(
													"scToken"),
												'Content-Type': 'application/json;charset=utf-8'
											},
											success: (res) => {
									
												resolve(res);
												console.log(
													res,"request2，成功")
											},
											fail: (err) => {
												reject(err);
											}
										});
									});
									
									Promise.all([request1, request2]).then(([res1, res2]) => {
									
										if (res1.data.statusCode !== 200) {
											console.log('转跳1');
											uni.hideLoading()
											_this.message = res1.data.message
											_this.showError = true
									
											setTimeout(() => {
												_this.showError = false
											}, 3000)
											return
										} else if (res2.data.statusCode !== 200) {
											console.log('转跳2');
											uni.hideLoading()
											_this.message = res2.data.message
											_this.showError = true
									
											setTimeout(() => {
												_this.showError = false
											}, 3000)
											return
										} else {
											console.log('转跳');
											uni.hideLoading()
									//注销扫描
									scanDevice.setOutScanMode(1); // 扫描模式=输入框
									scanDevice.stopScan()
									_this.unregisterScan()
									
									
											uni.navigateTo({
												url: `${_this.currentRoute}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.DocumentId)}`,
											})
											_this.currentRoute = null
										}
										// 在这里写你的逻辑
									}).catch(err => {
										_this.showError = true
										_this.message = '请求失败'
										setTimeout(() => {
											_this.showError = false
										}, 3000)
										console.log(err)
										// 处理请求失败的情况
									});
									
									
									
									
									
								} else {
									_this.currentUrl =   BaseApi + `/api/app/material/designate-station/${codeStr}` ;
									
									let request1 = new Promise((resolve, reject) => {
									setTimeout(()=>{
										uni.request({
											url: _this.currentUrl,
											method: 'GET',
											header: {
												'Authorization': 'Bearer ' + uni.getStorageSync(
													"scToken"),
												'Content-Type': 'application/json;charset=utf-8'
											},
											success: (res) => {
												console.log(_this.currentUrl)
												console.log(res)
												resolve(res);
												console.log('request1，成功');
											},
											fail: (err) => {
												// reject(err);
												uni.hideLoading()
												console.log('request1,失败');
											}
										});
									},500);
									
									});
									
									let request2 = new Promise((resolve, reject) => {
										uni.request({
											url: BaseApi + '/api/app/material/material-number/' + codeStr,
											method: 'GET',
											header: {
												'Authorization': 'Bearer ' + uni.getStorageSync(
													"scToken"),
												'Content-Type': 'application/json;charset=utf-8'
											},
											success: (res) => {
									
												resolve(res);
												console.log(
													res,"request2，成功")
											},
											fail: (err) => {
												reject(err);
											}
										});
									});
									
									Promise.all([request1, request2]).then(([res1, res2]) => {
									
										if (res1.data.statusCode !== 200) {
											console.log('转跳1');
											uni.hideLoading()
											_this.message = res1.data.message
											_this.showError = true
									
											setTimeout(() => {
												_this.showError = false
											}, 3000)
											return
										} else if (res2.data.statusCode !== 200) {
											console.log('转跳2');
											uni.hideLoading()
											_this.message = res2.data.message
											_this.showError = true
									
											setTimeout(() => {
												_this.showError = false
											}, 3000)
											return
										} else {
											//跳转之前关闭扫描
											scanDevice.setOutScanMode(1); // 扫描模式=输入框
											scanDevice.stopScan()
											_this.unregisterScan()
											console.log('转跳');
											uni.hideLoading()
									
									
									
											uni.navigateTo({
												url: `${_this.currentRoute}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.DocumentId)}`,
											})
											_this.currentRoute = null
										}
										// 在这里写你的逻辑
									}).catch(err => {
										_this.showError = true
										_this.message = '请求失败'
										setTimeout(() => {
											_this.showError = false
										}, 3000)
										console.log(err)
										// 处理请求失败的情况
									});
									
									
									
									
								}

	

						// scanDevice.stopScan(); // 停止扫描

					}
				});
			},
			showCustomToast() {
				this.modalVisible = true;
				setTimeout(() => {
					this.modalVisible = false;
				}, 2000); // 2秒后关闭
			},
			handlerChoose() {
				console.log(this.currentRoute1)
				uni.navigateTo({
						url: '/pages/locationProject/locationProject?currentRoute1=' + this.currentRoute1
					}),
					this.show2 = false
			},
			linkRequest() {
				console.log("扫描转跳");
		
		
				this.currentRoute = this.currentRoute1
				this.show1 = true;
				this.show2 = false;
				let _this=this
				// setTimeout(function() {
					scanDevice.setOutScanMode(0); // 扫描模式=广播
					_this.initScan()
					_this.registerScan()
					console.log(scanDevice.getOutScanMode());
					console.log(scanDevice.isScanOpened());
				// }, 200);
				
			},
			//拿到documentId

			// back() {
			// 	uni.navigateBack()
			// },
			onClick(e) {
				console.log(e)
				if (e.index == 1) {
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
				this.onClose()
			},
			//设置maskClosable为true时（点击遮罩可关闭），需要配合@close事件一起使用，通过控制show来达到关闭效果
			onClose(e) {
				this.show = false
			},
			isLogOut() {
				this.show = true
				console.log('退出登录吗？')
			},
			changeTen(e) {
				console.log('e:', e);
				if (e != '') {
					this.currid = e
					this.changeToken()
				}
				// this.currid = e
				let currItem = []
				currItem = this.range.filter((item) => {
					return item.value == e
				})
				console.log(currItem);

				this.currentTen = currItem[0].text
				console.log(this.currentTen);
				console.log(this.range);
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
			showLocationc(item) {
				this.show2 = true,
					this.currentRoute1 = item.router
			},
			// 抽屉状态发生变化触发
			change(e, type) {
				console.log((type === 'showLeft' ? '左窗口' : '右窗口') + (e ? '打开' : '关闭'));

				this[type] = e
				console.log(e, type);
				if (e == false) {
					console.log('当前租户id为' + this.currid);

				}
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
			},
			entryAction() {
				uni.navigateTo({
					url: '/pages/scanQR/scanQR'
				})
			},
			logOut() {
				uni.clearStorageSync()
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
			entryMyTask() {
				console.log('重打');
				uni.navigateTo({
					url: '/pages/personalTask/myProject'
				})
			},
			entryUpShelf() {
				console.log('上架');
				uni.navigateTo({
					url: '/pages/personalTask/myTask'
				})
			},
			closec() {
				this.show2 = false
			},
			changeToken() {
				let url1 = this.$Api.account + 'account=' + this.adAccount + '&tenantId=' + this.currid
				console.log(url1);
				uni.showLoading({
					title: '正在切换租户'
				})
				uni.request({
					url: url1,
					success: (ress) => {
						uni.hideLoading()
						console.log(ress);
						console.log(this.currentTen + '生成新scToken', ress.data.token.scToken);
						if (ress.errMsg == 'request:ok') {
							uni.removeStorageSync('scToken')
							uni.setStorageSync('scToken', ress.data.token.scToken)
							// console.log('userName', uni.getStorageSync('userName'));
						}

					},
					fail: (fail) => {
						console.log(fail);
						uni.hideLoading()
						uni.showToast({
							title: '请检查网络',
							icon: 'error'
						})
					}
				})
			}



		}
	}
</script>

<style lang="scss" scoped>
	.logout {
		// width: 100%;
	}

	.toolbtn {
		display: flex;
		flex-direction: row;
		background-color: #fff;
		align-items: center;
		justify-content: flex-start;
		height: 40px;
		border: none;
		border-radius: unset;

	}

	/deep/.uni-select__input-placeholder {
		font-size: 15px;
	}

	/deep/.uni-select {
		height: 46px;
		padding-left: 13px;
	}

	.toolbtn2 {
		display: flex;
		flex-direction: row;
		// background-color: #fff;
		align-items: center;
		justify-content: flex-start;
		height: 40px;
		border: none;
		border-radius: unset;
	}

	.toolbtn::after {
		border: none;
	}

	.toolbtn2::after {
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
		padding: 0 5px;


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

	.actioncommit {
		// margin-top: 41.67rpx;
		width: 92%;
		height: 166.67rpx;
		border-radius: 10px;
		margin: 41.67rpx auto;
		padding: 0 40rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;


		.action-text {
			font-size: 35.42rpx;

			span {
				color: #00893d
			}


		}

		.action-edit {

			// width: 52.08rpx;
			image {
				width: 69rpx;
			}
		}
	}

	.menu-items {
		height: 300rpx;
		width: 100%;
		background-color: #fff;
		margin-top: 16rpx;
		padding: 10rpx 0 10rpx 20rpx;
		// margin: 16rpx 0;
		// padding: 10rpx 30rpx;

		// .menu-item-container {
		// 	display: flex;
		// 	align-items: center;
		// }


		.menu-title {
			height: 70rpx;
			line-height: 70rpx;
			color: #414546;
			font-weight: 700;
			font-size: 30rpx;
			transform: translateX(15rpx);
		}
	}


	.menu-item {
		width: 315rpx;
		height: 180rpx;
		border-radius: 10px;
		background: rgba(0, 137, 61, 0.06);
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		display: inline-block;
		margin-right: 10px;
		margin-left: 10px;

		image {
			width: 60rpx;
			height: 60rpx;
			display: block;
			margin: auto;
		}

		.menu-text {
			text-align: center;
			font-size: 28rpx;
			color: #646464;
			margin-top: 10rpx;
			font-size: 30rpx;
		}
	}

	.choose-title {
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 35rpx;
		border-bottom: #ced5da 1px solid;
	}

	.location-choose {
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		margin: 520rpx 80rpx;
		width: 580rpx;
		height: 400rpx;

		background-color: white;
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}

	button {
		margin: unset;
		padding: unset;
		background-color: white;
	}

	button:after {
		border: unset;

	}

	.mark {

		position: absolute;
		height: 100%;
		color: #fff;
		background: rgba(0, 0, 0, 0.5);
		left: 0%;
		right: 0%;
		top: 0%;
		font-size: 26rpx;
		text-align: center;
		box-shadow: 2px -3px 100px -5px #FFFFFF;

	}
</style>
