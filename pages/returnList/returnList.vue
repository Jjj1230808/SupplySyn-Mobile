<template>

	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="退库单" :isCanBack="true" :text="stationNo">
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
				<view>领料总数 <span style="color: #414546;">1</span></view>
				<view>已用数量 <span style="color: #00893d;">1</span></view>
				<view>剩余数量 <span style="color: #f2b704;">1</span></view>
			</view> -->

		</view>

		<scroll-view class="material-list">
			<view style="color: #646464;transform: translate(570rpx,-10rpx);"> {{"退库总数 &nbsp;&nbsp;"}} <span
					style="color: #ff9800;">{{topData}}</span></view>
			<material-list :materialList="materialList" @returnMaterial="returnMaterial" cardtitle="退库单">
			</material-list>


		</scroll-view>
		<view @click="openHistory()" class="process">
			<process-card :processlist="processlist"></process-card>
		</view>

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
		<scan-dialog :show="noReason" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300" :padding="76"
			:iconWidth="92" text="请填写撤回原因" maskClosable>
		</scan-dialog>
		<view style="z-index: 9999;">
			<assembly-qty-dialog v-if="showAssemblyQty" :show="showAssemblyQty" :title="title" :buttons="buttons"
				maskClosable @click="onClick" numText="无输入框" @close="onClose" :materialInfo="materialInfo">
			</assembly-qty-dialog>
		</view>

		<history-list :switchHistory='switchHistory' :historylist='historylist' @sonmsg="openMsg"></history-list>
		<!-- 一同退库提示 -->
		<view v-show="showSure" class="mark">
			<view class="sureChoose">
				<view class="sureTop">
					<view style="height: 100rpx; font-size: 36rpx;margin-top: 32rpx; color: #414546; " class="">撤回物料
					</view>
					<view style="height: 100rpx;font-size: 32rpx;color: #646464;" class="">在 <text
							style="font-weight: 700;color: black; ">报废单</text> 中检测到 <text
							style="font-weight: 700;color: black; ">{{this.witdrawNumber}}</text>条单据包含该物料，是否一并撤回?</view>

				</view>
				<view style="height: 100rpx;">
					<button @click="withdrawYes()" style="color: green;">是</button>
				</view>
				<view style="height: 100rpx;" class="">
					<button @click="withdrawNo()" style="color: red;">否</button>
				</view>
				<view style="height: 100rpx;" class="">
					<button @click="closeS()" style="color: #646464;">取消</button>
				</view>
			</view>
		</view>
		<tips-withdraw :show2="show2" ></tips-withdraw>
		<tips-withdraw-fail :show3="show3" @sonmsg="openMsg" ></tips-withdraw-fail>
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
				title: '撤回退库物料',
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
				topData: "",
				Id: '',
				showError: false,
				message: '',
				materialInfo: {},
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
				stationNo:null
			
			};
		},
		onLoad(options) {
			console.log(options);
			console.log(JSON.parse(options.topData))
			this.Id = JSON.parse((options.ListData)).id;
			this.DocumentId = JSON.parse((options.DocumentId))
			console.log(this.Id);
			this.materialList = JSON.parse((options.ListData)).data
			console.log(this.materialList)
			this.topData = JSON.parse(options.topData).num
			this.stationNo = JSON.parse(options.topData).stationNo

		},
		created() {
			this.getProcess();



		},
		onHide() {
			console.log('onhide')
		},
		onShow() {

		},
		watch: {

		},
		methods: {
			openMsg(msg) {
				console.log(msg);
				this.show3 = msg
				// console.log(this.historyflag)

			},
			withdrawYes() {
				this.sendFlag = 'all'
				this.sendWithDraw(this.sendFlag)
			},
			withdrawNo() {
				this.sendFlag = 'sigle'
				this.sendWithDraw(this.sendFlag)
			},
			//发送撤回请求
			sendWithDraw(flag) {
				this.showSure = false

				let _this = this


				uni.showLoading({
					title: '正在确认'
				})
				// let url = BaseApi + '/StockReturn/Edit?Mid=' + _this.materialInfo.materialId +
				// 	'&returnQuantity=' + e.currentNum;
				let url = BaseApi + '/api/app/material/material-withdraw';

				if (flag === 'all') {
					//chehui all
					this.witdrawData = {
						documentId: this.DocumentId,
						materialId: this.materialInfo.materialId,
						type: '全部',
						approvalopinion: this.opinion
					}
				} else {
					//dange
					this.witdrawData = {
						documentId: this.DocumentId,
						materialId: this.materialInfo.materialId,
						type: '退库',
						approvalopinion: this.opinion
					}
				}
				console.log(this.witdrawData)
				console.log(url)
				uni.request({
					url: url,
					method: 'POST',
					data: this.witdrawData,
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
						'Content-Type': 'application/json;charset=utf-8'
					},
					success: (res) => {

						if (res.data.statusCode !== 200) {
							uni.hideLoading()
							_this.message = res.data.message
							_this.showError = true

							setTimeout(() => {
								_this.showError = false
							}, 3000)
							this.show3 = true
						} else {
							uni.hideLoading()
							this.show2 = true
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
			},
			//退库或是 报废单检测是否有
			getisSame() {
				let _this = this;
				let url = BaseApi + '/api/app/material/get-identical-data'
				let data = {
					documentId: this.materialInfo.documentId ,
					materialId: this.materialInfo.materialId
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

							_this.message = res.data.message
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							// "data": {
							// 	"statusCode": 200,
							// 	"code": null,
							// 	"succeeded": false,
							// 	"message": "查询成功！",
							// 	"errors": null,
							// 	"data": {
							// 		"isContain": false,
							// 		"number": 0
							// 	}
							// },
							this.witdrawNumber = res.data.data.number
							if (res.data.data.isContain === false) {
								//直接发送
								this.sendWithDraw(this.sendFlag)

							} else {
								//跳出确认框
								this.showSure = true
							}

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
				let _this = this
				if (e.index === 1) {
					//写逻辑
					if (e.comments) {
						this.opinion = e.comments
						//发送请求 
						this.getisSame()
					} else {
						this.noReason = true
						setTimeout(() => {
							this.noReason = false
						}, 1500)
						console.log('没有写原因');
					}
				} else {
					this.onClose()
				}
			},
			
			enterMaterialCode(e) {
				console.log(e)
				let _this = this;
				this.isShowSearch = false
				uni.showLoading({
					title: '正在搜索'
				})
					let url = BaseApi + '/api/app/material/return-material/' +  this.DocumentId+ '?Info=' + e.detail.value;
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
				let _this = this;
				
				uni.showLoading({
					title: '正在搜索'
				})
					let url = BaseApi + '/api/app/material/return-material/' +  this.DocumentId+ '?Info=' ;
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
				uni.showLoading({
					title: '正在查询'
				})
				let _this = this;
				console.log(e.id);
				let url = BaseApi + '/api/app/material/get-document-material-find' ;
			
				let  data = {
					mid:e.id,
					did: this.DocumentId,
					id:''
				}
					console.log(data)				//修改接口
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
		top: 426rpx;
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
