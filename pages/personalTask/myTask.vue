<template>
	<view class="container">
		<navbar :userName="userName"></navbar>
		<view class="changeSmOrLg">
			<view class="changeBox">
				<view class="smallMate " v-if="!showSmall" @click="scanSmallMate">
					小料
				</view>
				<view class="smallMateactive" v-if="showSmall" @click="scanSmallMate">
					小料
				</view>
				<view class="largeMate" v-if="showSmall" @click="scanLargeMate">
					中料/大料
				</view>
				<view class="largeMateactive" v-if="!showSmall" @click="scanLargeMate">
					中料/大料
				</view>
			</view>
		</view>
		<view class="" v-if="!showList">
			<view class="scantipImg" v-if="showShelf">
				<view class="scan-area">
					<view class="scanimg">
						<image src="../../static/WMS UI design/scan-shelf (1).svg" mode="heightFix"></image>
					</view>
					<view class="scantext1">
						请扫描<span class="schaefflerGreen">料架</span>
					</view>
					<view class="scantext2">
						请扫描料架上的二维码
					</view>
					<view class="">
						<input id="scanShelf" type="text" @keyup.enter="getShelfCode">
					</view>
				</view>
			</view>
			<view class="scantipImg" v-if="showBox">
				<view class="scan-area">
					<view class="scanimg">
						<image src="../../static/WMS UI design/scan-box (1).svg" mode="heightFix"></image>
					</view>
					<view class="scantext1">
						请扫描<span class="schaefflerGreen">料盒</span>
					</view>
					<view class="scantext2">
						请扫描料盒上的二维码
					</view>
					<view class="">
						<input id="scanBoxCode" type="text" @keyup.enter="getBoxCode">
					</view>
				</view>
			</view>
			<view class="scantipImg" v-if="showMate">
				<view class="scan-area">
					<view class="scanimg">
						<image src="../../static/WMS UI design/scan-material (1).svg" mode="heightFix"></image>
					</view>
					<view class="scantext1">
						请扫描<span class="schaefflerGreen">物料</span>
					</view>
					<view class="scantext2">
						请扫描物料上的二维码
					</view>
					<view class="">
						<input ref="scanMateCode" type="text" @keyup.enter="getMateCode">
					</view>
				</view>
			</view>

		</view>
		<view class="upList" v-if="showList">
			<view class="continueBox">

				<view class="continueScan">
					<view class="">
						<uni-icons type="scan" size="26" color="#00893d"></uni-icons>
					</view>
					<view class="">
						请继续扫描物料
					</view>
				</view>
				<view class="totalCount">
					<view class="">
						已扫描物料<span class="schaefflerGreen">({{alreadyBindingList.length}})</span>
					</view>
					<view class="">
						当前料架:<span class="schaefflerGreen">{{shelfCode}}</span>
					</view>
				</view>

			</view>

			<view class="list-container">
				<view class="list-item" v-for="item in alreadyBindingList" :key="item.WBSCode">
					<view class="item-header">
						<view class="item-row">
							<view class="header-title">
								物料号
							</view>
							<view class="header-content">
								{{item.materialNo}}
							</view>
						</view>
						<view class="item-row">
							<view class="header-title">
								物料名称
							</view>
							<view class="header-content">
								{{item.materialName}}
							</view>
						</view>
						<view class="item-row">
							<view class="header-title">
								WBS号
							</view>
							<view class="header-content">
								{{item.wbs}}
							</view>
						</view>
						<view class="item-row">
							<view class="header-title">
								工位号
							</view>
							<view class="header-content">
								{{item.station}}
							</view>
						</view>
					</view>
					<view class="item-footer">
						<view class="num-count">
							数量:<span class="schaefflerGreen">{{item.qty}}</span>

						</view>
					</view>

				</view>
			</view>
		</view>
		<view v-if="showList" class="upBtn-Box">
			<view>
				<button type="primary" @click="sureToShelf" class="upBtn">确认上架</button>
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
	const printer = uni.requireNativePlugin('LcPrinter');
	const modal = uni.requireNativePlugin('modal');
	var globalEvent = uni.requireNativePlugin('globalEvent');
	export default {
		data() {
			return {
				keyWord: '',
				userName: '',
				showShelf: true,
				showBox: false,
				showMate: false,
				showList: false,
				showSmall: true,
				iscontinueScan: false,
				isOnShowCurrentPage: false,
				// 为了修复网络慢的时候扫描可能抖动，多次调用接口 设置锁让扫描结果不进入接口请求
				isCanScan: true,


				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'gear-filled'
				},
				taskData: [],
				projectid: '',
				upList: [{
					mateCode: '322424',
					mateName: '4refde',
					WBSCode: 'fdf3232324242',
					stationNo: '3243453fdfdfr',
					Num: 23
				}, {
					mateCode: '322424',
					mateName: '4refde',
					WBSCode: 'fdf3232332324242',
					stationNo: '3243453fdfdfr',
					Num: 65
				}, {
					mateCode: '322424',
					mateName: '4refde',
					WBSCode: 'fdf3232234324242',
					stationNo: '3243453fdfdfr',
					Num: 43
				}, {
					mateCode: '322424',
					mateName: '4refde',
					WBSCode: 'fdf3236562324242',
					stationNo: '3243453fdfdfr',
					Num: 4
				}, {
					mateCode: '322424',
					mateName: '4refde',
					WBSCode: 'fdf32343656562324242',
					stationNo: '3243453fdfdfr',
					Num: 4
				}, {
					mateCode: '322424',
					mateName: '4refde',
					WBSCode: 'fdf32343656562324242',
					stationNo: '3243453fdfdfr',
					Num: 4
				}],
				shelfCode: '',
				boxCode: '',
				mateCode: '',
				isScanSmall: true,
				isScanBig: false,
				scanFlag: 0,
				scanBigFlag: 0,
				alreadyBindingList: [{
					id: "762dd2e1-6bda-4617-8502-312cafe093a1",
					wbs: "S-028709-01-02-02",
					station: "MACHINE",
					materialName: "OPTSCHA GV-H130L-KEYENCE",
					materialNo: "2070250100000",
					qty: 1
				}, ]
			};
		},
		created: function(option) {

			this.scanFlag = 0
			this.scanBigFlag = 0
			this.isScanSmall = true
			this.isScanBig = false
			this.showShelf = true
			this.showBox = false
			this.showMate = false
			this.shelfCode = ''
			this.mateCode = ''
			this.boxCode = ''
			this.alreadyBindingList = []
		},
		onHide: function() {
			console.log('上架隐藏')
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
			scanDevice.stopScan()
			// scanDevice1.closeScan()
			this.unregisterScan()

		},
		onShow: function() {
			console.log('上架显示')
			this.scanFlag = 0
			this.scanBigFlag = 0
			this.showShelf = true
			this.isScanSmall = true
			this.isScanBig = false
			this.showBox = false
			this.showMate = false
			this.shelfCode = ''
			this.mateCode = ''
			this.boxCode = ''
			// 只要去了其他程序再回来，就让他重新扫描小料
			this.showSmall = true
			this.isOnShowCurrentPage = true
			scanDevice.setOutScanMode(0); // 扫描模式
			console.log(scanDevice.isScanOpened())

			// if(this.showList){
			// 	// uni.showToast({
			// 	// 	icon:'error',
			// 	// 	title:''
			// 	// })
			// 	this.showList=false
			// }

			this.initScan()
			this.registerScan()
			console.log('onshow生命周期')
			console.log(this.scanFlag)
			console.log(this.shelfCode)
			console.log(this.boxCode)
			console.log(this.mateCode)
		},
		destroyed: function() {

			scanDevice.setOutScanMode(1); // 扫描模式=输入框



		},
		onBackPress(e) {
			console.log(e)
			console.log('上架返回')
			console.log(scanDevice.getOutScanMode())
			// scanDevice.openScan(); // 打开扫描
			scanDevice.setOutScanMode(1); // 扫描模式
			scanDevice.stopScan()
			// scanDevice1.closeScan()
			this.unregisterScan()

		},
		onLoad(options) {
			scanDevice = new ScanDeviceClass();
			// scanDevice.openScan(); // 打开扫描
			scanDevice.setOutScanMode(0); // 扫描模式
			// this.registerScan()
			scanDevice.openScan()
			this.showList = false
			this.iscontinueScan = false

			// console.log(this.$refs.scanShelfCode)
			this.userName = uni.getStorageSync('userName')
			this.scanFlag = 0
			this.showShelf = true
			this.showBox = false
			this.showMate = false
			this.alreadyBindingList = []


			// console.log('onLoad生命周期')
			// console.log(this.scanFlag)
			// console.log(this.shelfCode)
			// console.log(this.boxCode)
			// console.log(this.mateCode)
		},
		mounted() {
			// console.log('mounted生命周期')
			// console.log(this.scanFlag)
			// console.log(this.shelfCode)
			// console.log(this.boxCode)
			// console.log(this.mateCode)

		},
		updated() {
			// var doc = document.getElementsByTagName('input')
			// console.log(doc)
			// doc[0].focus()
			// console.log('updated生命周期')
			// console.log(this.scanFlag)
			// console.log(this.shelfCode)
			// console.log(this.boxCode)
			// console.log(this.mateCode)
		},
		computed: {
			List() {
				// 返回过滤后的数组

				return this.taskData.filter((item) => {
					return item.nodeName.toLowerCase().indexOf(this.keyWord.toLowerCase()) !== -1
				})
			}

		},
		methods: {
			ShelfFocus(e) {
				e.target.setAttribute("readonly", true)
				setTimeout(() => {
					e.target.removeAttribute("readonly")
				}, 100)
			},
			scanSmallMate() {
				console.log('当前上架小料')
				this.showSmall = true
				this.isScanSmall = true
				this.isScanBig = false
				this.scanFlag = 0
				this.scanBigFlag = 0
				this.showShelf = true
				this.showBox = false
				this.showMate = false
				this.showList = false
				this.alreadyBindingList = []
				this.shelfCode = ''
				this.mateCode = ''
				this.boxCode = ''
				console.log(this.scanFlag)
				console.log(this.shelfCode)
				console.log(this.mateCode)
				console.log(this.boxCode)
				scanDevice.setOutScanMode(1); // 扫描模式

				scanDevice.setOutScanMode(0)
				console.log(this.scanFlag)
				console.log(this.shelfCode)
				console.log(this.mateCode)
				console.log(this.boxCode)
			},
			scanLargeMate() {
				console.log('当前上架大料')
				this.showSmall = false
				this.isScanSmall = false
				this.isScanBig = true
				this.scanFlag = 0
				this.scanBigFlag = 0
				this.showShelf = true
				this.showBox = false
				this.showMate = false
				this.showList = false
				this.alreadyBindingList = []
				this.shelfCode = ''
				this.mateCode = ''
				this.boxCode = ''
				console.log(this.scanFlag)
				console.log(this.shelfCode)
				console.log(this.mateCode)
				console.log(this.boxCode)
				scanDevice.setOutScanMode(1); // 扫描模式
				scanDevice.setOutScanMode(0)
				console.log(this.scanFlag)
				console.log(this.shelfCode)
				console.log(this.mateCode)
				console.log(this.boxCode)
			},
			getShelfCode(e) {
				console.log(e)
			},
			getBoxCode(e) {
				console.log(e)
			},
			getMateCode(e) {
				console.log(e)
			},
			sureToShelf() {

				this.scanFlag = 0
				this.isScanSmall = true
				this.isScanBig = false
				this.showShelf = true
				this.showBox = false
				this.showMate = false
				this.scanBigFlag = 0
				if (this.scanFlag >= 2) {

					this.scanFlag = 0
					this.showShelf = true
					this.showBox = false
					this.showMate = false
				}
				if (this.scanBigFlag >= 1) {

					this.scanBigFlag = 0
					this.showShelf = true
					this.showBox = false
					this.showMate = false
				}
				scanDevice.setOutScanMode(1); // 扫描模式
				this.unregisterScan()
				uni.navigateTo({
					url: '/pages/successpage/successpage'
				})


			},
			initScan() {

				console.log('---------------进入了扫描------------')
				let _this = this;
				main = plus.android.runtimeMainActivity(); //获取activity  
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				filter = new IntentFilter();
				filter.addAction("scan.rcv.message"); // 换你的广播动作  
				console.log(_this.scanFlag)
				console.log(_this.shelfCode)
				console.log(_this.boxCode)
				console.log(_this.mateCode)
				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {

					onReceive: function(context, intent) {
						plus.android.importClass(intent);
						let code = intent.getByteArrayExtra('barocode');
						//	let codeStr = String.fromCharCode(...code);

						let codeStr = utf8ByteToUnicodeStr(code);

						// console.log('codeStr:', codeStr);
						// console.log(taskInfo);
						// let taskId = taskInfo.RelatedId
						console.log('--------------扫描前-------------')
						if (_this.isCanScan) {

							console.log(_this.isOnShowCurrentPage)
							// if (_this.isOnShowCurrentPage) {
							// 	_this.isScanSmall = true
							// 	_this.scanFlag = 0
							// 	_this.shelfCode = ''
							// 	_this.mateCode = ''
							// 	_this.boxCode = ''
							// }
							console.log(_this.scanFlag)
							console.log(_this.shelfCode)
							console.log(_this.boxCode)
							console.log(_this.mateCode)
							if (_this.boxCode != '' && _this.boxCode == _this.mateCode) {
								_this.mateCode = ''
								_this.scanFlag = 2
								_this.showShelf = false
								_this.showBox = false
								_this.showMate = true
							}
							if (_this.scanFlag == 2 && _this.boxCode == '') {
								_this.scanFlag = 1
							}
							// 当盒子码和物料码相等时，硬件时序出问题，删掉一个

							// if(_this.scanFlag==3){

							// }
							if (_this.isScanSmall) {
								console.log('--------小料上架----------')
								if (_this.scanFlag == 0) {
									console.log('--------小料扫料架----------')
									_this.shelfCode = ''
									_this.mateCode = ''
									_this.boxCode = ''
									_this.shelfCode = codeStr
									let url = BaseApi +
										`/services/app/MaterialFrame/GetByCode?code=${_this.shelfCode}`

									console.log(url)

									// 要开始调接口了，锁住不让其继续扫描新的
									_this.isCanScan = false
									uni.request({
										url: url,
										method: 'GET',

										header: {
											'Authorization': uni.getStorageSync("token")
										},
										success: (res) => {

											console.log(res)
											if (res.data.result.materialFrameNo) {
												console.log('料架扫上了')
												_this.isOnShowCurrentPage = false
												_this.showShelf = false
												_this.showBox = true
												_this.boxCode = ''
												_this.mateCode = ''
												_this.scanFlag = 1
												console.log('扫描完料架：', _this.scanFlag)

											} else {
												_this.showShelf = true
												_this.showBox = false
												_this.showMate = false
												_this.scanFlag = 0
												_this.shelfCode = ''
												_this.boxCode = ''
												_this.mateCode = ''
												console.log('扫描完料架：', _this.scanFlag)
												uni.showToast({
													icon: 'none',
													title: '料架不存在!'
												})
											}
											// 接口有返回值了，放开锁
											_this.isCanScan = true

										},
										fail: (res) => {
											// 接口有返回值了，放开锁
											_this.isCanScan = true
											console.log(res)
											uni.showToast({
												title: '检查网络!',
												icon: 'error'
											})

										}
									})

								} else if (_this.scanFlag == 1 && _this.shelfCode != '') {
									console.log('--------小料扫料盒----------')
									_this.mateCode = ''
									_this.boxCode = ''
									_this.boxCode = JSON.parse(codeStr).Id
									console.log(_this.boxCode)
									let url = BaseApi +
										`/services/app/OnShelves/BindingBoxToShelf?shelfCode=${_this.shelfCode}&boxId=${_this.boxCode}`
									let data = {
										shelfCode: _this.shelfCode,
										boxId: _this.boxCode
									}
									console.log(url)
									// 要开始调接口了，锁住不让其继续扫描新的
									_this.isCanScan = false
									uni.request({
										url: url,
										method: 'POST',
										data: {},
										header: {
											'Authorization': uni.getStorageSync("token")
										},
										success: (res) => {

											console.log(res)
											if (res.statusCode == 200 && res.data.result != null) {
												// success
												console.log('料盒扫上了')
												_this.mateCode = ''
												_this.isOnShowCurrentPage = false
												_this.showShelf = false
												_this.showBox = false
												_this.showMate = true
												_this.scanFlag = 2
												console.log('扫描完料盒：', _this.scanFlag)

											} else {
												_this.showShelf = false
												_this.showBox = true
												_this.showMate = false
												_this.scanFlag = 1
												_this.boxCode = ''
												console.log('扫描完料盒：', _this.scanFlag)

												uni.showToast({
													icon: 'none',
													title: '料盒不存在!'
												})
											}
											// 接口有返回值了，放开锁
											_this.isCanScan = true


										},
										fail: (res) => {
											// 接口有返回值了，放开锁
											_this.isCanScan = true
											console.log(res)
											uni.showToast({
												icon: 'error',
												title: '检查网络!'
											})
										}
									})
								} else if (_this.scanFlag == 2 && _this.shelfCode != '' && _this.boxCode !=
									'') {
									console.log('--------小料扫物料----------')
									_this.mateCode = ''

									_this.mateCode = JSON.parse(codeStr).Id
									console.log(_this.shelfCode)
									console.log(_this.boxCode)
									console.log(_this.mateCode)
									if (_this.mateCode != _this.boxCode) {
										let url = BaseApi +
											`/services/app/OnShelves/BindingMaterialToBox?materialId=${_this.mateCode}&boxId=${_this.boxCode}`

										console.log(url)
										// 要开始调接口了，锁住不让其继续扫描新的
										_this.isCanScan = false
										uni.request({
											url: url,
											method: 'POST',
											data: {},
											header: {
												'Authorization': uni.getStorageSync("token")
											},
											success: (res) => {

												console.log(res)
												if (res.data.result == null) {
													uni.showToast({
														title: res.data.error.message,
														icon: 'none'
													})
													_this.mateCode = ''
													console.log('扫描完小料：', _this.scanFlag)
												} else if (res.data.result.id == _this.mateCode) {
													console.log('小物料扫上了')
													_this.isOnShowCurrentPage = false
													uni.showToast({
														title: '上架成功!',
														icon: 'success'
													})
													_this.judgeFlag = 0
													_this.alreadyBindingList.forEach((item) => {
														if (item.id == res.data
															.result.id) {
															_this.judgeFlag++
														}
													})
													if (_this.judgeFlag == 0) {
														_this.alreadyBindingList.push(res.data
															.result)
													}
													// if (_this.alreadyBindingList.indexOf(res.data
													// 		.result) == -1) {
													// 	_this.alreadyBindingList.push(res.data.result)
													// } else {}
													_this.showList = true
													_this.scanFlag = 2
													_this.mateCode = ''
													console.log('扫描完小料：', _this.scanFlag)
												}
												// 接口有返回值了，放开锁
												_this.isCanScan = true

											},
											fail: (res) => {
												// 接口有返回值了，放开锁
												_this.isCanScan = true
												console.log(res)
												uni.showToast({
													title: '检查网络!',
													icon: 'error'
												})

											}
										})
									}

								}

							} else {
								console.log('--------大料上架----------')
								if (_this.scanBigFlag == 0) {
									console.log('--------大料扫料架----------')
									_this.shelfCode = ''
									_this.mateCode = ''
									_this.boxCode = ''
									_this.shelfCode = codeStr
									let url = BaseApi +
										`/services/app/MaterialFrame/GetByCode?code=${_this.shelfCode}`

									console.log(url)
									// 要开始调接口了，锁住不让其继续扫描新的
									_this.isCanScan = false
									uni.request({
										url: url,
										method: 'GET',

										header: {
											'Authorization': uni.getStorageSync("token")
										},
										success: (res) => {

											console.log(res)
											if (res.data.result.materialFrameNo) {
												console.log('料架扫上了')
												_this.mateCode = ''
												_this.isOnShowCurrentPage = false
												_this.showShelf = false
												_this.showMate = true
												_this.scanBigFlag = 1
											} else {
												_this.showShelf = true
												_this.showBox = false
												_this.showMate = false
												_this.scanBigFlag = 0
												uni.showToast({
													icon: 'none',
													title: '料架不存在!'
												})
											}
											// 接口有返回值了，放开锁
											_this.isCanScan = true

										},
										fail: (res) => {
											// 接口有返回值了，放开锁
											_this.isCanScan = true
											console.log(res)
											uni.showToast({
												title: '检查网络!',
												icon: 'error'
											})

										}
									})

								} else if (_this.scanBigFlag == 1 && _this.shelfCode != '') {
									console.log('--------大料扫物料----------')
									_this.mateCode = ''
									_this.boxCode = ''

									_this.mateCode = JSON.parse(codeStr).Id
									console.log(_this.boxCode)
									let url = BaseApi +
										`/services/app/OnShelves/BindingMaterialToShelf?materialId=${_this.mateCode}&shelfCode=${_this.shelfCode}`
									console.log(url)
									// 要开始调接口了，锁住不让其继续扫描新的
									_this.isCanScan = false
									uni.request({
										url: url,
										method: 'POST',

										header: {
											'Authorization': uni.getStorageSync("token")
										},
										success: (res) => {

											console.log(res)
											if (res.data.result == null) {
												uni.showToast({
													title: res.data.error.message,
													icon: 'none'
												})
											} else if (res.data.result.id == _this.mateCode) {
												console.log('大料物料扫上了')
												_this.isOnShowCurrentPage = false
												uni.showToast({
													title: '上架成功!',
													icon: 'success'
												})
												_this.judgeFlag = 0
												_this.alreadyBindingList.forEach((item) => {
													if (item.id == res.data
														.result.id) {
														_this.judgeFlag++
													}
												})
												if (_this.judgeFlag == 0) {
													_this.alreadyBindingList.push(res.data.result)
												}
												_this.showList = true
												_this.scanBigFlag = 1
												// uni.navigateTo({
												// 	url: '/pages/successpage/successpage'
												// })
											}
											// 接口有返回值了，放开锁
											_this.isCanScan = true



										},
										fail: (res) => {
											// 接口有返回值了，放开锁
											_this.isCanScan = true
											console.log(res)
											uni.navigateTo({
												url: '/pages/failpage/failpage'
											})
										}
									})
								} else {
									// 其他情况，放开锁
									_this.isCanScan = true
								}





								console.log('--------------扫描后-------------')
								console.log(_this.scanFlag)
								console.log(_this.shelfCode)
								console.log(_this.boxCode)
								console.log(_this.mateCode)
							}






							// scanDevice.stopScan(); // 停止扫描
						}

					}
				});
			},

			// justInit() {
			// 	main = plus.android.runtimeMainActivity(); //获取activity
			// 	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
			// 	filter = new IntentFilter();
			// 	filter.addAction("scan.rcv.message"); // 换你的广播动作  
			// 	receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
			// 		onReceive: function(context, intent) {
			// 			plus.android.importClass(intent);
			// 			let code = intent.getByteArrayExtra('barocode');
			// 			//	let codeStr = String.fromCharCode(...code);

			// 			let codeStr = utf8ByteToUnicodeStr(code);
			// 			console.log('codeStr:', codeStr);

			// 			// getActionInfo(codeStr)
			// 		}
			// 	});
			// },
			registerScan() {
				main.registerReceiver(receiver, filter);
			},
			unregisterScan() {
				main.unregisterReceiver(receiver);
			},
			startScan() {

				this.initScan()
				scanDevice.startScan()

			},
			printTask(item) {
				var ret = printer.initPrinter({});
				console.log(ret);
				if (ret.code == "success") {
					uni.showLoading({
						title: '正在打印...'
					})
				}
				// modal.toast({
				// 	message: ret,
				// 	duration: 1.5
				// });
				let projectName = item.projectName
				let taskName = item.taskFullName
				let projectNo = item.projectCode
				let proExecutor = item.displayFullName
				let taskDate = item.planStartTime + '-' + item.planEndTime

				printer.printEnableMark({
					enable: true
				})
				printer.setLineSpacing({
					spacing: 0.9
				})
				// printer.setFeedPaperSpace({
				// 	space: 500
				// })
				// printer.setUnwindPaperLen({
				// 	length: 100,
				// })
				// console.log('走纸距离', printer.getFeedPaperSpace());
				// console.log('回纸距离', printer.getUnwindPaperLen());
				// 生成二维码
				printer.printQR2({
					offset: 100,
					height: 150,
					text: `{"QRCodeType":0,"RelatedId":"${item.id}"}`
				})
				// 走纸

				printer.setFontSize({
					fontSize: 0
				});
				printer.setTextBold({
					bold: true
				});

				printer.printText({
					content: '项  目  号:'
				});
				printer.setTextBold({
					bold: false
				});
				printer.setFontSize({
					fontSize: 17
				});
				printer.printText({
					content: projectNo + '\n'
				});
				// printer.printLine({
				// 	line_length: 1
				// })
				// printer.printGoToNextMark()
				printer.setTextBold({
					bold: true
				});

				printer.printText({
					content: '项目名称:'
				});
				printer.setTextBold({
					bold: false
				});
				printer.printText({
					content: projectName + '\n'
				});
				printer.setTextBold({
					bold: true
				});

				printer.printText({
					content: '负  责  人:'
				});
				printer.setTextBold({
					bold: false
				});
				printer.printText({
					content: proExecutor + '\n'
				});
				// printer.printLine({
				// 	line_length: 1
				// })
				// printer.printGoToNextMark()
				printer.setTextBold({
					bold: true
				});

				printer.printText({
					content: '工        期:'
				});
				printer.setTextBold({
					bold: false
				});
				printer.printText({
					content: taskDate + '\n'
				});
				// printer.printLine({
				// 	line_length: 1
				// })
				// printer.printGoToNextMark()

				printer.setTextBold({
					bold: true
				});

				printer.printText({
					content: '任务名称:'
				});
				printer.setTextBold({
					bold: false
				});
				printer.printText({
					content: taskName
				});


				printer.printGoToNextMark()
				let _this = this

				globalEvent.addEventListener('onPrintCallback', function(e) {
					// uni.showToast({
					// 	title: 'state: ' + JSON.stringify(e),
					// 	duration: 2000
					// });
					uni.hideLoading()
					// 打印成功，调接口
					if (e.key == 0) {
						let url1 = _this.$Api.gateway +
							`/app/kimi-print-record`
						console.log(url1);
						let data = {
							relatedId: item.id,
							description: item.taskFullName
						}
						uni.hideLoading()
						uni.request({
							url: url1,
							method: "POST",
							data: data,
							header: {
								'Authorization': "Bearer " + uni.getStorageSync("scToken")
							},
							success: (res) => {
								if (res.data.succeeded) {
									console.log(res);
									uni.showToast({
										title: '打印成功',
										duration: 2000
									});
									// 实际调用接口成功了，但因为没有重新请求接口，
									//所以在页面上演一下，下次刷新调用接口也会出现相同的打印标识
									item.printCount = 1
								} else {
									uni.hideLoading()
									uni.showToast({
										title: '未知错误',
										duration: 2000,
										icon: 'error'
									});
								}
							},
							fail: (res) => {
								uni.hideLoading()
								console.log(res);
								uni.showToast({
									title: '打印记录未同步',
									icon: 'error'
								})
							}


						})


					} else if (e.key == 3) {
						uni.hideLoading()
						uni.showToast({
							title: '缺纸',
							icon: 'error',
							duration: 2000
						});
					}
				});



			},

			onClick(e) {
				console.log(e)
			},
			subeExe(e) {
				console.log(e);
			},
			query(e) {
				console.log(e);
			},
			async revExe() {

			},


			backTo() {
				uni.navigateBack()
			},
			getTaskList() {
				let url = this.$Api.gateway +
					'/app/kimi-personal-scrum-board/project-tasks-of-assign2Me-by-project-id/' + this.projectid
				console.log(url);

				let _this = this
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url: url,
					method: "GET",
					header: {
						'Authorization': "Bearer " + uni.getStorageSync("scToken")
					},
					success: (res) => {

						console.log(res);
						uni.hideLoading()
						if (res.data.succeeded) {
							let taskdata = res.data.data
							_this.taskData = taskdata.map((item) => {
								return {
									nodeName: item.nodeName,
									projectId: item.projectId,
									planStartTime: item.planStartTime.split('T')[0],
									planEndTime: item.planEndTime.split('T')[0],
									taskFullName: item.taskFullName,
									projectName: item.projectName,
									printCount: item.printCount,
									projectCode: item.projectCode,
									displayFullName: item.displayFullName.split('(')[0],
									id: item.id
								}
							})
							console.log(_this.taskData);
						}

					},
					fail: (res) => {
						uni.hideLoading()
						console.log(res);
						uni.showToast({
							title: '请检查网络',
							icon: 'error'
						})
					}


				})
			},

			printCount() {
				let url1 = this.$Api.gateway +
					`/app/kimi-print-record`
				console.log(url);
				let data = {
					relatedId: item.id,
					description: item.taskFullName
				}
				let _this = this
				uni.request({
					url: url,
					method: "GET",
					header: {
						'Authorization': "Bearer " + uni.getStorageSync("scToken")
					},
					success: (res) => {

						console.log(res);
						uni.hideLoading()
						// if (res.data.succeeded) {
						// 	let taskdata = res.data.data
						// 	_this.taskData = taskdata.map((item) => {
						// 		return {
						// 			nodeName: item.nodeName,
						// 			projectId: item.projectId,
						// 			planStartTime: item.planStartTime.split('T')[0],
						// 			planEndTime: item.planEndTime.split('T')[0],
						// 			taskFullName: item.taskFullName,
						// 			projectName: item.projectName,
						// 			printCount: item.printCount,
						// 			projectCode: item.projectCode,
						// 			displayFullName: item.displayFullName.split('(')[0]
						// 		}
						// 	})
						// 	console.log(_this.taskData);
						// }

					},
					fail: (res) => {
						uni.hideLoading()
						console.log(res);
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
	.container {
		background-color: #fff;
		font-size: 29.17rpx;
		box-sizing: border-box;

		// height: 100%;
		.changeSmOrLg {
			position: fixed;
			top: 104.17rpx;
			height: 83.33rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			margin-bottom: 10.42rpx;
			align-items: center;
			background-color: #fff;

			.changeBox {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;

				.smallMate,
				.largeMate,
				.smallMateactive,
				.largeMateactive {
					width: 354.17rpx;
					height: 72.92rpx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;

				}

				.smallMate {
					border-radius: 35px 0 0 35px;
					border-color: #ced5da;
					border-style: solid;
					border-width: 1px 1px 1px 0;
				}

				.largeMate {
					border-radius: 0 35px 35px 0;
					border-color: #ced5da;
					border-style: solid;
					border-width: 1px 1px 1px 0;
				}

				.smallMateactive {
					border-radius: 35px 0 0 35px;
					border-color: #c0e4c9;
					border-style: solid;
					color: #00893d;
					background-color: #e5f4e9;
					border-width: 1px 1px 1px 0;
				}

				.largeMateactive {
					border-radius: 0 35px 35px 0;
					border-color: #c0e4c9;
					border-style: solid;
					color: #00893d;
					background-color: #e5f4e9;
					border-width: 1px 1px 1px 0;
				}

			}


		}

		.scantipImg {
			height: 1350rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.scan-area {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.scanimg {
					image {
						width: 260.42rpx;
						height: 250rpx;
						margin-bottom: 40px;
					}

				}

				.scantext1 {
					font-size: 34px;
					margin-bottom: 20.83rpx;
					font-weight: 700;
				}

				.scantext2 {
					color: #9ca2a5;
				}
			}

		}

		.upList {
			background-color: #ebeef0;
			// padding-top: 260px;
			// padding-bottom: 100px;
			padding-top: 281.25rpx;
			padding-bottom: 104.17rpx;
			// height: 100%;
			// height: 1125rpx;
			min-height: 1308.33rpx;

			.continueBox {
				width: 100%;
				position: fixed;
				top: 182.29rpx;
				background-color: #fff;

				.totalCount {
					width: 100%;
					height: 104.17rpx;
					padding-left: 31.25rpx;
					padding-right: 31.25rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					background-color: #ebeef0;

				}

				.continueScan {
					width: 100%;
					background-color: #fff;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					height: 104.17rpx;
				}
			}




			.list-container {
				padding-left: 31.25rpx;
				padding-right: 31.25rpx;
				// padding-top: 268.75rpx;
				// padding-bottom: 104.17rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				overflow-y: scroll;

				.list-item {
					width: 100%;
					border-radius: 10.42rpx;
					background-color: #fff;
					min-height: 343.75rpx;
					margin-bottom: 31.25rpx;

					.item-header {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: center;
						padding: 20.83rpx;
						border-bottom: 1px solid #dde3e6;

						.item-row {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							margin-bottom: 20.83rpx;


							.header-title {
								width: 125rpx;
								color: #9ca2a5;
							}

							.header-content {
								width: 468.75rpx;
							}
						}


					}

					.item-footer {
						color: #9ca2a5;
						height: 62.5rpx;
						width: 100%;
						display: flex;
						flex-direction: row;
						justify-content: flex-end;
						align-items: center;
						padding: 20.83rpx;

					}

				}


			}
		}

		.upBtn-Box {
			position: fixed;
			bottom: 0;
			height: 135.42rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: #fff;

			.upBtn {
				width: 708.33rpx;
				height: 93.75rpx;

			}
		}
	}

	input {
		visibility: hidden;
	}
</style>
