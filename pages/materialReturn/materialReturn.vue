<template>

	<view>
		<navbar style="position: fixed;left: 0;right: 0;top: 0;" title="物料退回" :isCanBack="true"
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
				<view>剩余数量 <span style="color: #f2b704;">{{topData.remainingQuantitys < 0 ? 0 : topData.remainingQuantitys }}</span></view>
			</view>
		</view>
		<scroll-view class="material-list">
			<material-list :materialList="materialList" cardtitle="物料退回" @returnMaterial="returnMaterial">
			</material-list>


		</scroll-view>

		<view class="link-top" @click="linkToTop" v-if="!isShowSearch">

		</view>
		<scan-dialog :show="showScan" v-on:close="closeMask" :outWidth="420" :outHeight="280" :padding="50"
			:iconWidth="120" :iconHeight="120" maskClosable>
		</scan-dialog>

		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>

		<scan-dialog   :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" :text="message" maskClosable>
		</scan-dialog>
		<assembly-qty-dialog  v-if="showAssemblyQty" :show="showAssemblyQty" :title="title" :buttons="buttons" maskClosable @click="onClick1"
			numText="本次退回数量" @close="onClose1" :materialInfo="materialInfo"></assembly-qty-dialog>
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
				title: '物料退回',
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
				materialInfo: {},
				saveCondition:''
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
					//let url = BaseApi + '/Materialreturn/SendreturnNumber?Mid=' + _this.materialInfo.materialId +
						//'&quantityUsed=' + e.currentNum;
					let url = BaseApi + '/api/app/material/material-fallback';
					//需要在dialog上面多加两个数字输入框 退库数量，报废数量和已用数量
					let data = {
						mid:_this.materialInfo.materialId,
						quantityUsed:e.currentNum0,
						returnQuantity:e.currentNum1,
						scrapQuantity:e.currentNum2
					};
					console.log(data)
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
								_this.message = res.data.message?res.data.message :'出错了，请重试'
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

								// uni.reLaunch({
								// 	url: '/pages/function/function'
								// })

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
			
			getfreshData() {
				let _this = this;
				let url1 = BaseApi + '/api/app/material/material-fallback-data-sources/' + _this.Id;
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
			enterMaterialCode(e) {
							this.saveCondition = e.detail.value
				console.log(e)
				let _this = this;
				this.isShowSearch = false
				uni.showLoading({
					title: '正在搜索'
				})
				let url = BaseApi + '/api/app/material/material-fallback/' + this.Id + '?Info=' + e.detail.value;
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
		z-index: 990;
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


	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 276rpx;
		padding-top: 20rpx;
		overflow: auto;
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
</style>
