<template>
	<view>
		<navbar :userName="userName" :isCanBack="false" title='主页'></navbar>
		<view class="menu-container">
			<view class="menu-items" v-for="(item,index) in menuList">
				<view class="menu-title">{{item.title}}</view>
				<view class="menu-item-container">
					<view class="menu-item" v-for="(childItem,index) in item.menuItems" @click="linkRequest(childItem)">
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
		<scan-dialog :show="show1" :outWidth="420" :outHeight="280" :padding="50" :iconWidth="120" :iconHeight="120"
			maskClosable>
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
				// showLeft: false,
				// currid: '',
				// show: false,
				// currentTen: '',
				// range: [],
				show1: false,
				userName: '',
				// placeHolder: '点击此处切换Tenant',
				// adAccount: '',
				modalVisible: false,
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
							router: ''
						}
					]
				}, {
					title: '剩余物料处理',
					menuItems: [{
							text: '补打标签',
							image: 'label',
							router: ''
						},
						{
							text: '物料退库',
							image: 'back-list',
							router: '/pages/returnToWMS/returnToWMS'
						}
					]
				}, {
					title: '单据管理',
					menuItems: [{
						text: '退库单',
						image: 'back-list',
						router: ''
					}, ]
				}]
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




		onBackPress(options) {
			console.log(options);

			if (options.from === 'backbutton') {
				uni.showModal({
					title: "提示：",
					content: "是否退出登录？",
					confirmText: '取消',
					cancelText: '确定',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击取消');
						} else if (res.cancel) {
							uni.redirectTo({
								url: '/pages/index/index'
							})
						}
					}
				})
				return true
			}
		},
		onLoad(options) {
			// let pages = getCurrentPages()
			// console.log(pages.length);
			// const tenants = JSON.parse(decodeURIComponent(options.tenants))
			// console.log(tenants);
			// console.log(tenants.user.tenantId);
			this.userName = uni.getStorageSync('userName')
			console.log(this.userName)
			scanDevice = new ScanDeviceClass();
			// scanDevice.openScan(); // 打开扫描
			scanDevice.setOutScanMode(0); // 扫描模式
			// this.registerScan()
			scanDevice.openScan()
			// let tenantslist = tenants.tenants
			// this.range = tenants.tenants.map((item) => {
			// 	return {
			// 		value: item.id,
			// 		text: item.name
			// 	}
			// })

			// tenantslist.forEach((item) => {
			// 	if (item.id == tenants.user.tenantId) {
			// 		this.currentTen = item.name
			// 	}
			// })
			// // this.currid = this.range[0].value

			// console.log(this.currentTen);
			// console.log(this.currid);
			// // this.range = tenants
			// console.log(this.range);
			// this.adAccount = uni.getStorageSync('adAccount')
			// console.log(this.adAccount);
		},

		onHide() {
			this.unregisterScan()
		},
		onShow() {

		},
		methods: {
			registerScan() {
				main.registerReceiver(receiver, filter);
			},
			unregisterScan() {
				main.unregisterReceiver(receiver);
			},
			initScan(router) {
				console.log('---------------进入了扫描------------', router)
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
						// console.log(taskInfo);
						// let taskId = taskInfo.RelatedId


						let url = BaseApi + '/basedata/Listdata?id=' + JSON.parse(codeStr).Id
						console.log(url)
						uni.request({
							url: url,
							method: 'GET',
							header: {
								'Authorization': uni.getStorageSync("token"),
								'Content-Type': 'application/json;charset=utf-8'
							},
							success: (res) => {
								console.log(res)
								if (res.statusCode === 200) {
									uni.navigateTo({
										url: router,
										data: res
									})
								}
							},
							fail: (res) => {
								uni.hideLoading()
								console.log(res)
							}
						})




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
			linkRequest(item) {
				this.show1 = true
				this.initScan(item.router)
				this.registerScan()
				scanDevice.startScan()
				setTimeout(() => {
					this.show1 = false
				}, 3000)
			},
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
		height: 282rpx;
		width: 100%;
		background-color: #fff;
		margin: 16rpx 0;
		padding: 10rpx 30rpx;
		box-sizing: border-box;

		// .menu-item-container {
		// 	display: flex;
		// 	align-items: center;
		// }


		.menu-title {
			height: 70rpx;
			line-height: 70rpx;
			color: #414546;
			font-weight: 700;
			font-size: 28rpx;
		}
	}

	.menu-item {
		width: 204rpx;
		height: 174rpx;
		border-radius: 10px;
		background: rgba(0, 137, 61, 0.06);
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		display: inline-block;
		margin-right: 24rpx;

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
		}
	}


	.menu-title {}
</style>
