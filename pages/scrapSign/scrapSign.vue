<template>

	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="报废签收" :isCanBack="true" :text="stationNo">
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
			<!-- <view class="number-summarize">
				
				
				<view>领料总数 <span style="color: #414546;">{{topData.total}}</span></view>
				<view>已入数量 <span style="color: #00893d;">{{topData.quantityUsed}}</span></view>
				<view>剩余数量 <span style="color: #f2b704;">{{topData.unusedQuantity < 0 ? 0 : topData.unusedQuantity }}</span></view>
			</view> -->

		</view>

		<scroll-view class="material-list">
			
			<material-list :materialList="materialList" @returnMaterial="returnMaterial"  @signMaterial = "signMaterial" cardtitle="报废签收">
			</material-list>


		</scroll-view>
	
		<view @click="openHistory()" class="process">
			<process-card :processlist="processlist"></process-card>
		</view>

		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">

		</view>
		<view class="action-buttons" v-if="!isShowSearch">
			
		<button v-if="ableFlag" class="finishiSign" @click="finishSign()"  >
			
			
		完成签收
		</button>
		<button v-if="!ableFlag" class="finishiSign-disable"   >
			
			
		 <text style="color:rgba(0, 0, 0, 0.38) ;">完成签收</text>
		</button>
			
		</view>
		<scan-dialog :show="showScan"  v-on:close="closeMask"     :outWidth="420" :outHeight="280" :padding="50" :iconWidth="120" :iconHeight="120"
			maskClosable>
		</scan-dialog>

		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>

		<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
		<scan-dialog :show="noReason" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300" :padding="76"
			:iconWidth="92" text="请填写拒签原因" maskClosable>
		</scan-dialog>
		<view style="z-index: 9999;">
			<assembly-qty-dialog v-if="showAssemblyQty" :show="showAssemblyQty" :title="title" :buttons="buttons"
				maskClosable @click="onClick" numText="无输入框" @close="onClose" :materialInfo="materialInfo">
			</assembly-qty-dialog>
		</view>
		<view >
			<assembly-qty-dialog v-if="showAssemblyQty2" :show="showAssemblyQty2" :title="title2" :buttons="buttons" maskClosable @click="onClick2"
				numText="本次报废数量" @close="onClose2" :materialInfo="materialInfo2"></assembly-qty-dialog>
		</view>
		<fui-dialog :show="showFinishConfirm" title="完成签收" content="确认签收该工位的退库单？" :buttons="buttons" maskClosable
			@click="onClickConfirm" @close="onCloseConfirm">
		</fui-dialog>
		<fui-dialog :show="showFinishConfirmB" title="返回主页" content="当前表单尚未处理完成,确认返回主页？" :buttons="buttons" maskClosable
			@click="onClickConfirmB" @close="onCloseConfirmB">
		</fui-dialog>
		

		<history-list :switchHistory='switchHistory' :historylist='historylist' @sonmsg="openMsg"></history-list>
	
		<tipsdialog :isWithdraw="tdf" :show2="showT" ></tipsdialog>
		<tipsdialog-fail :show3="showF" @sonmsg="openMsg1"></tipsdialog-fail>
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
				tdf:'rkqs',
				isShowSearch: false,
				materialCode: '',
				showScan: false,
				showAssemblyQty2:false,
				showAssemblyQty: false,
				title: '确认报废签收数量',
				title2:'拒签报废物料', 
				buttons: [{
					text: '取消',
					color: '#646464'
				}, {
					text: '确认签收',
					color: '#00893d'
				}],
				showMessage: false,
				showFinishConfirm: false,
				showFinishConfirmB:false,
				materialList: [],
				topData: {},
				Id: '',
				showError: false,
				message: '',
				materialInfo: {},
				materialInfo2: {},
				switchHistory: false,
				historyflag: false,
				noReason: false,
				showSure: false,
				DocumentId: '',
				processlist: [],
				historylist: [],
				witdrawNumber: '',
				sendFlag: '',
				witdrawData: {},
				opinion: '',
				show2: false,
				show3: false,
				stationNo:null,
				showT:false,
				showF:false,
				saveCondition:'',
					ableFlag:true
			
			};
		},
		onLoad(options) {
			scanDevice.setOutScanMode(0); // 扫描模式=广播
			this.initScan()
			this.registerScan()
			
			console.log(options);
			console.log(JSON.parse(options.topData))
			this.Id = JSON.parse((options.ListData)).id;
			this.DocumentId = JSON.parse((options.DocumentId))
			console.log(this.Id);
			this.materialList = JSON.parse((options.ListData)).data
			console.log(this.materialList)
			//"topData": "{\"total\":20,\"quantityUsed\":0,\"unusedQuantity\":20,\"stationNo\":\"FA010-E99000\"}",
			this.topData = JSON.parse(options.topData)
			console.log(this.topData);
			this.stationNo = JSON.parse(options.topData).stationNo

		},
		onUnload() {
			scanDevice.setOutScanMode(1); // 扫描模式=输入框
			 scanDevice.stopScan(); // 停止扫描
			 this.unregisterScan()
		},
		created() {
			this.getProcess();



		},
		onHide() {
			console.log('onhide')
			
		},
		onShow() {
		
this.canFinish(this.materialList)
		},
		watch: {

		},
		methods: {
			canFinish(materialList){
				this.ableFlag = true;
				for (const item of materialList ){
					if(item.signState === 10){
						this.ableFlag = false;
						break;
					}
				}
				console.log(this.ableFlag);
			},
			
			getfreshData() {
				if(this.saveCondition === ''){
					let _this = this;
					let url1 = BaseApi +'/api/app/material/scrap-receipt-data-sources/' +_this.DocumentId;
					let url2 = BaseApi +'/api/app/material/scrap-signing-number/' + _this.DocumentId;
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
						this.materialList = res1.data.data.data
						
						this.topData = res2.data.data
						console.log(this.materialList);
						_this.canFinish(this.materialList)
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
				}else{
				
					let _this = this;
					let url1 = BaseApi + '/api/app/material/scrap-receipt/' + _this.DocumentId + '?Info=' + _this.saveCondition;
				let url2 = BaseApi +'/api/app/material/scrap-signing-number/' + _this.DocumentId;
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
							
							this.materialList = res1.data.data.data
							this.topData = res2.data.data
							_this.canFinish(this.materialList)
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
				}
			
			},
			openMsg1(msg) {
						console.log(msg);
						this.showF=msg
						// console.log(this.historyflag)
						
				},
		
			finishSign(){
				this.showFinishConfirm = true,
				this.buttons = [{
					text: '取消',
					color: '#646464'
				}, {
					text: '确认签收',
					color: '#00893d'
				}]
			},
			onClickConfirm(e){
					console.log(e);
					if(e.index === 1){
						
						// uni.showLoading({
						// 	title: '正在搜索'
						// })
						//错误报错
						// this.onCloseConfirm()
						// this.showF = true
						// console.log(this.showF);
						//正确
						this.onCloseConfirm()
						//this.showT = true
						
						//遍历 看里面是否有未完成的
						
											
						
						let url = BaseApi + '/api/app/material/finishes-sign/' + this.DocumentId;
						//修改接口
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
									// _this.message = res.data.message
									// _this.showError = true
									// setTimeout(() => {
									// 	_this.showError = false
									// }, 3000)
									this.showF = true
									
									
									return
								} else {
									//关闭广播模式
									this.onCloseConfirm()
									scanDevice.setOutScanMode(1); // 扫描模式=输入框
									 scanDevice.stopScan(); // 停止扫描
									 this.unregisterScan()
									this.showT = true
						
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
								this.showF = true
							}
						});
						
						
						
				
					}else{
								this.onCloseConfirm()
						
						
					}
			},
			onClickConfirmB(e){
				console.log(e);
			},
			onCloseConfirm() {
				this.showFinishConfirm = false
			},
			onCloseConfirmB(){
			 this.showFinishConfirmB = false
			
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
			
					
				
						let url = BaseApi + '/api/app/material/get-document-material-find';
						let  data = {
							mid:'',
							did: _this.DocumentId,
							id:codeStr
						}
							console.log(data)
						//修改接口
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
									console.log(res.data.data)
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
			
						 scanDevice.stopScan(); // 停止扫描
					}
				});
			},
			closeMask() {
				this.showScan = false
			
			},
			scanAssembly() {
				console.log('123');
				this.showScan = true
				scanDevice.setOutScanMode(0); // 扫描模式=广播
			
				// scanDevice.startScan()
				// setTimeout(() => {
				// 	this.showScan = false
				// }, 3000)
			},
		
		
		
			getProcess() {
				let _this = this;
				let url = BaseApi + '/api/app/material/document-work-flow-process/' + this.DocumentId;
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

							_this.message = res.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							_this.processlist = res.data.data
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
			getworkHistory() {
				let _this = this;
				let url = BaseApi + '/api/app/material/approval-records/' + this.DocumentId;
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

							_this.message = res.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							//_this.processlist = res.data.data
							_this.historylist = res.data.data

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
			closeS() {
				this.showSure = false

			},
			onClose(e) {
				this.showAssemblyQty = false
			},
			onClick(e) {
			
				console.log(e)
				if(e.index === 1){
					let _this = this;
					//发送请求
					
					let url = BaseApi + '/api/app/material/signature-actions';
					let  data = {
						documentId: this.DocumentId,
						materialId: this.materialInfo.materialId,
					}
						console.log(data)
					//修改接口
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
							
									console.log(res.data)
									_this.showAssemblyQty = false
								_this.showMessage = true
														
								setTimeout(() => {
									_this.showMessage = false
								}, 3000)
									_this.getfreshData()
					
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
					
					
					
					
					
				}else{
					this.showAssemblyQty = false
				}
			
			},
			onClose2(e) {
				
			},
			//juqianshou
			onClick2(e) {
					let _this = this;
				console.log(e)
			if(e.index === 1){
				//写逻辑
				if (e.comments) {
					this.opinion = e.comments
					//发送请求 
					let url = BaseApi + '/api/app/material/material-refuse-sign';
					let  data = {
						documentId: this.DocumentId,
						materialId: this.materialInfo2.materialId,
						approvalopinion:this.opinion
					}
						console.log(data)
					//修改接口
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
								console.log(res.data)
								_this.showAssemblyQty2 = false
							_this.showMessage = true
						
							setTimeout(() => {
								_this.showMessage = false
							}, 3000)
								_this.getfreshData()
					
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
					this.noReason = true
					setTimeout(() => {
						this.noReason = false
					}, 1500)
					console.log('没有写原因');
				}
				
				
		
			}else{
						this.showAssemblyQty2 = false
			}
			},
		enterMaterialCode(e) {
			console.log(e)
			let _this = this;
			this.isShowSearch = false
			uni.showLoading({
				title: '正在搜索'
			})
			console.log(this.Id)
			this.saveCondition = e.detail.value
			let url = BaseApi + '/api/app/material/scrap-receipt/' + this.Id + '?Info=' + e.detail.value;
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
			this.saveCondition =''
			this.getfreshData()
			// this.enterMaterialCode({
			// 	detail: {
			// 		value: ''
			// 	}
			// })
			},
			displaySearchBar() {
				scanDevice.setOutScanMode(1); // 扫描模式=广播
				//scanDevice.startScan()
				this.isShowSearch = true

			},

			openHistory() {

				this.switchHistory = true;
				this.getworkHistory();

				// if(this.historyflag === false){
				// 	this.switchHistory = true;
				// }

			},
			linkToTop() {
				console.log('锚链接')
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
			},
			openMsg(msg) {

				this.historyflag = msg
				// console.log(this.historyflag)
				if (this.historyflag === false) {
					this.switchHistory = false;
				}
			},
			returnMaterial(e) {
				console.log(e);
				this.buttons = [{
					text: '取消',
					color: '#646464'
				}, {
					text: '确认拒收',
					color: '#e62c27'
				}],
				uni.showLoading({
					title: '正在查询'
				})
				let _this = this;
				console.log(e.id);
				let url = BaseApi + '/api/app/material/get-document-material-find';
				let  data = {
					mid:e.id,
					did: this.DocumentId,
					id:''
				}
					console.log(data)
				//修改接口
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
		signMaterial(e) {
			this.buttons = [{
				text: '取消',
				color: '#646464'
			}, {
				text: '确认签收',
				color: '#00893d'
			}],
			uni.showLoading({
				title: '正在查询'
			})
			let _this = this;
			console.log(e.id);
			let url = BaseApi + '/api/app/material/get-document-material-find';
			let  data = {
				mid:e.id,
				did: this.DocumentId,
				id:''
			}
				console.log(data)
			//修改接口
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
						console.log(res.data.data)
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
		},
			
		}
	}
</script>

<style lang="scss">
	.scanSign{
		font-size: 32rpx;
		width: 220rpx;
		height: 90rpx;
		border: 3rpx solid #00893d;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0;
			font-weight: bold;
	}
	.finishiSign{
		font-size: 32rpx;
		width: 680rpx;
		height: 90rpx;
		border: 3rpx solid #00893d;
		background-color: #00893d;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0;
			font-weight: bold;
	}
	.finishiSign-disable{
		font-size: 32rpx;
		width: 680rpx;
		height: 90rpx;
		
		
		background-color: rgba(0, 0, 0, 0.12);
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0;
			font-weight: bold;
	}
	.action-buttons {
		z-index: 2;
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
	.search-bar {
		height: 170rpx;
		position: fixed;
		top: 108rpx;
		left: 0;
		right: 0;
		background-color: #fff;
		border-top: 1rpx solid #ced5da;
		z-index: 2;
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
		z-index: 999;
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


	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 460rpx;
		padding-top: 20rpx;
			padding-bottom: 70px;
		overflow: auto;
		z-index: 1;
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
		z-index: 1;
	}

	.search-input-container {
		position: fixed;
		top: 108rpx;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.70);
		z-index: 2;
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

	.process {
	border-bottom: 1px solid #CED5DA;
	z-index: 1;
	position: fixed;
	left: 0;
	right: 0;
	top: 277rpx;
	
	overflow: auto;

	}

	.mark {
		z-index: 99999;
		position: absolute;
		height: 100%;
		color: #000;
		background: rgba(0, 0, 0, 0.5);
		left: 0%;
		right: 0%;
		top: 0%;
		font-size: 26rpx;
		text-align: center;
		box-shadow: 2px -3px 100px -5px #FFFFFF;

	}

	.sureChoose {
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		margin: 520rpx 80rpx;
		width: 580rpx;
		height: 600rpx;

		background-color: white;
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}

	.sureTop {
		padding: 32rpx 58rpx 0 58rpx;
		height: 300rpx;
	}

	button {
		margin: unset;
		padding: unset;
		background-color: white;
		border: #FFFFFF;
	}

	button:after {

		border: #FFFFFF;

	}
</style>























