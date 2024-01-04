<template>
	<view class="container">
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
		<view class="com-logo">
			<image src="../../static/com-logo.png" mode=""></image>
		</view>
		<view class="action-logo">
			<view class="">
				<image src="../../static/kimi.png" mode=""></image>
			</view>
			<view class="systext">Digital Shopfloor</view>
		</view>
		<button class="login" @click="NFClogin">点击刷卡登录</button>
		<image style="width: 300rpx;height: 36rpx;position: absolute;bottom: 30rpx;right: 0;left: 0;margin: auto;"
			src="../../static/img/Special Machinery LOGO.svg" mode=""></image>
		<!-- <uni-link  :text="href"></uni-link> -->
	</view>
</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'


	const package_NdefRecord = 'android.nfc.NdefRecord';
	const package_NdefMessage = 'android.nfc.NdefMessage';
	const package_TECH_DISCOVERED = 'android.nfc.action.TECH_DISCOVERED';
	const package_Intent = 'android.content.Intent';
	const package_Activity = 'android.app.Activity';
	const package_PendingIntent = 'android.app.PendingIntent';
	const package_IntentFilter = 'android.content.IntentFilter';
	const package_NfcAdapter = 'android.nfc.NfcAdapter';
	const package_Ndef = 'android.nfc.tech.Ndef';
	const package_NdefFormatable = 'android.nfc.tech.NdefFormatable';
	const package_Parcelable = 'android.os.Parcelable';
	const package_String = 'java.lang.String';

	let NfcAdapter;
	let NdefRecord;
	let NdefMessage;
	let readyWriteData = false;
	let readyRead = false;
	let noNFC = false;
	// let MyCardNum = '';
	let techListsArray = [
		['android.nfc.tech.IsoDep'],
		['android.nfc.tech.NfcA'],
		['android.nfc.tech.NfcB'],
		['android.nfc.tech.NfcF'],
		['android.nfc.tech.Ndef'],
		['android.nfc.tech.NfcV'],
		['android.nfc.tech.NdefFormatable'],
		['android.nfc.tech.MifareClassic'],
		['android.nfc.tech.MifareUltralight']
	];
	// 要写入的数据
	let text = '{id:123,name:nfc,stie:cssmini.com}';
	let readResult = '';
	// import nfc from '../../utils/hexiii-nfc.js'
	let tenantId = '';
	let adAccount = '';
	export default {
		data() {
			return {
				// href: 'https://uniapp.dcloud.io/component/README?id=uniui'
				msgType: '',
				messageText: '',
				baseUrl_home: '',
				login_account: '',
				transName: ''
			}
		},
		// onBackPress(options) {
		// 	console.log(options);
		// 	if (options.from === 'backbutton') {
		// 		uni.showModal({
		// 			title: "提示：",
		// 			content: "是否退出登录？",
		// 			confirmText: '取消',
		// 			cancelText: '确定',
		// 			success: function(res) {
		// 				if (res.confirm) {
		// 					console.log('用户点击取消');
		// 				} else if (res.cancel) {
		// 					uni.redirectTo({
		// 						url: '/pages/index/index'
		// 					})
		// 				}
		// 			}
		// 		})
		// 		return true
		// 	}
		// 	return true
		// },
		onLoad() {
			this.listenNFCStatus();
			// console.log(this.$Api);
			this.baseUrl_home = this.$Api.home
			this.login_account = this.$Api.baseUrl
			// console.log(this.baseUrl_home);
		},
		methods: {
			NFClogin() {
				// uni.navigateTo({
				// 	url: '/pages/function/function'
				// })
				uni.showToast({
					title: '请贴近卡片！',
					icon: 'error'
				})
				// 清除token
				uni.clearStorageSync()
				// 测试用的直接跳转


				// 刷卡登陆
				this.readData();

				// uni.showToast({
				// 	title: '刷卡登陆的逻辑',
				// 	duration: 1000,
				// 	success: () => {
				// 		uni.navigateTo({
				// 			url: '/pages/function/function'
				// 		})
				// 	}
				// })
			},
			listenNFCStatus: function() {
				let that = this;
				try {
					let main = plus.android.runtimeMainActivity();
					let Intent = plus.android.importClass('android.content.Intent');
					let Activity = plus.android.importClass('android.app.Activity');
					let PendingIntent = plus.android.importClass('android.app.PendingIntent');
					let IntentFilter = plus.android.importClass('android.content.IntentFilter');
					NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
					let nfcAdapter = NfcAdapter.getDefaultAdapter(main);

					if (nfcAdapter == null) {
						uni.showToast({
							title: '设备不支持NFC！',
							icon: 'none'
						})
						noNFC = true;
						return;
					}

					if (!nfcAdapter.isEnabled()) {
						uni.showToast({
							title: '请在系统设置中先启用NFC功能！',
							icon: 'none'
						});
						noNFC = true;
						return;
					} else {
						noNFC = false;
					}

					let intent = new Intent(main, main.getClass());
					intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
					let pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
					let ndef = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
					ndef.addDataType("*/*");
					let intentFiltersArray = [ndef];

					plus.globalEvent.addEventListener('newintent', function() {
						console.log('newintent running');
						// 监听 NFC
						setTimeout(() => {
							return that.nfcRuning()
						}, 1000);
					});
					plus.globalEvent.addEventListener('pause', function(e) {
						console.log('pause running');
						if (nfcAdapter) {
							//关闭前台调度系统
							//恢复默认状态
							nfcAdapter.disableForegroundDispatch(main);
						}
					});
					plus.globalEvent.addEventListener('resume', function(e) {
						console.log('resume running');
						if (nfcAdapter) {
							//开启前台调度系统
							nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray,
								techListsArray);
						}
					});
					nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
				} catch (e) {
					console.log(e);
				}
			},
			nfcRuning: function() {
				NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
				NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
				let main = plus.android.runtimeMainActivity();
				let intent = main.getIntent();
				let that = this;

				console.log("action type:" + intent.getAction());

				if (package_TECH_DISCOVERED == intent.getAction()) {
					if (readyWriteData) {
						that.write(intent);
						readyWriteData = false;
					} else if (readyRead) {
						that.read(intent);
						readyRead = false;
					}
				}
			},
			write(intent) {
				try {
					// toast('');
					uni.showToast({
						title: '请勿移开标签 正在写入...'
					})
					console.log("text=" + text);

					let textBytes = plus.android.invoke(text, "getBytes");
					// image/jpeg text/plain  
					let textRecord = new NdefRecord(NdefRecord.TNF_MIME_MEDIA,
						plus.android.invoke("text/plain", "getBytes"),
						plus.android.invoke("", "getBytes"), textBytes);
					let message = new NdefMessage([textRecord]);
					let Ndef = plus.android.importClass('android.nfc.tech.Ndef');
					let NdefFormatable = plus.android.importClass('android.nfc.tech.NdefFormatable');
					let tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
					let ndef = Ndef.get(tag);
					if (ndef != null) {
						// 待写入的数据长度
						let size = message.toByteArray().length;
						ndef.connect();
						if (!ndef.isWritable()) {
							uni.showToast({
								title: 'tag不允许写入！'
							})
							// toast('');
							return;
						}
						if (ndef.getMaxSize() < size) {
							uni.showToast({
								title: '文件大小超出容量！'
							})
							// toast('');
							return;
						}
						ndef.writeNdefMessage(message);
						uni.showToast({
							title: '写入数据成功！'
						})
						// toast('');
						return;
					} else {
						let format = NdefFormatable.get(tag);
						if (format != null) {
							try {
								format.connect();
								format.format(message);
								uni.showToast({
									title: '格式化tag并且写入message'
								})
								// toast('');
								return;
							} catch (e) {
								// toast('');
								uni.showToast({
									title: '格式化tag失败.'
								})
								return;
							}
						} else {
							uni.showToast({
								title: 'Tag不支持NDEF'
							})
							// toast('');
							return;
						}
					}
				} catch (e) {
					uni.showToast({
						title: '写入失败'
					})
					// this.toast('');
					console.log("error=" + e);
				}

			},
			read(intent) {
				uni.clearStorageSync()
				uni.showToast({
					title: '正在读取数据',
					icon: 'loading',
					duration: 2000
				});
				// this.toast('请勿移开标签正在读取数据');
				let that = this;
				// NFC id
				let bytesId = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
				let nfc_id = that.byteArrayToHexString(bytesId);
				console.log('nfc_id:', nfc_id);
				// 获得卡号，进行处理
				let reverNum = nfc_id.split('').reverse().join('').toLowerCase();
				// console.log(reverNum);
				let cardNum = []
				let MyCardNum = ''
				for (let i = 0; i < 14; i += 2) {
					// console.log(i);
					cardNum = reverNum.substring(i, i + 2).split('').reverse()
					// console.log(cardNum[j]);
					// cardNum[j].reverse()
					// console.log(cardNum);
					// 正确的卡号
					MyCardNum += cardNum.join('')
					// console.log(MyCardNum);
				}
				MyCardNum = MyCardNum.substring(0, 14)
				console.log(MyCardNum);
				// 发起请求
				//let url = `https://qakimiworkbenchbe.schaefflercn.com/Home/EmployeeCardNoValidation?cardNo=8060505a914304`
				 let url = `https://kimihomebe.schaefflercn.com/Home/EmployeeCardNoValidation?cardNo=${MyCardNum}`
				// let url = this.baseUrl_home + MyCardNum
				console.log(url);
				uni.request({
					url: url,
					method: "GET",
					success: (res) => {
						if (res.data.succeeded) {
							uni.showLoading({
								title: '正在登录...'
							})
							console.log(res.data);
							this.tenantId = res.data.data.tenantId
							this.adAccount = res.data.data.adAccount
							uni.setStorageSync('adAccount', this.adAccount)
							let url1 =
								`https://qakimiworkbenchbe.schaefflercn.com/home/Login4Pda?account=${this.adAccount}&tenantld=${this.tenantId}`
							// let url1 =
							// `https://kimihomebe.schaefflercn.com/Home/Login4Pda?account=${this.adAccount}&tenantId=${this.tenantId}`
							// let url1 = this.login_account + 'account=' + this.adAccount + '&tenantId=' + this
							// 	.tenantId
							console.log(url1);
							uni.request({
								url: url1,
								success: (ress) => {
									uni.hideLoading()
									console.log(ress);
									// console.log(ress.succeeded);
									if (ress.errMsg == 'request:ok') {
										uni.showToast({
											title: '登录成功'
										})
										that.transName = ress.data.user.name
										console.log(that.transName);
										uni.setStorageSync('userName', ress.data.user.name)
										console.log(ress.data.token.scToken);
										uni.setStorageSync('scToken', ress.data.token.scToken)
										uni.navigateTo({
											url: '/pages/function/function?tenants=' +
												encodeURIComponent(JSON.stringify(ress.data
													.tenants))

										})
									} else {
										let errmsg = ress.errMsg
										this.msgType = 'error'
										this.messageText = errmsg
										this.$refs.message.open()
									}


								},
								fail: (ress) => {
									uni.showToast({
										title: '登录失败',
										icon: 'error'
									})
								}
							})

						} else {
							console.log(res)
							// setTimeout(() => {
							// 	uni.showToast({
							// 		title: '卡号未维护！',
							// 		icon: 'error'
							// 	})
							// }, 2000)
							uni.showToast({
								title: '卡号未维护！',
								icon: 'error'
							})

						}




					},
					fail: (res) => {
						console.log(res);
						if (res.errMsg.indexOf('request:fail') !== -1) {
							console.log('neterror');
							uni.showToast({
								title: '请检查网络！',
								icon: 'error'
							})
						}
						// let errmsg = res.message
						// this.msgType = 'error'
						// this.messageText = errmsg
						// this.$refs.message.open()
					}
				})

				let Parcelable = plus.android.importClass("android.os.Parcelable");
				let rawmsgs = intent.getParcelableArrayExtra("android.nfc.extra.NDEF_MESSAGES");
				//let rawmsgs = intent.getParcelableArrayExtra();

				if (rawmsgs != null && rawmsgs.length > 0) {
					let records = rawmsgs[0].getRecords();
					let result = records[0].getPayload();
					let data = plus.android.newObject("java.lang.String", result);
					// uni.showToast({
					// 	title: 'NFC 数据：' + data
					// })
					// this.toast('NFC 数据：' + data);
					console.log('NFC 数据：', data);
					readResult = data;
				} else {
					uni.showToast({
						title: '获取卡号成功'
					})
					// this.toast(nfc_id);
				}
				return MyCardNum
			},
			getToken() {
				let url = BaseApi + '/TokenAuth/Authenticate'
				console.log(url)
				let params = {
					userNameOrEmailAddress: this.user,
					password: '321!SMB!smb!',
					rememberClient: true
				}
				uni.request({
					url: url,
					method: 'POST',
					data: params,
					success: (res) => {
						console.log(res)
						if (res.data.result.accessToken) {
							uni.setStorageSync('token', 'Bearer ' + res.data.result.accessToken)
							// this.refreshToken()
							uni.showToast({
								title: '登录成功'
							})
							uni.navigateTo({
								url: '/pages/function/function'

							})
						}

					},
					fail: (res) => {
						uni.hideLoading()
						console.log(res);
						if (res.errMsg.indexOf('request:fail') !== -1) {
							console.log('neterror');
							uni.showToast({
								title: '请检查网络！',
								icon: 'error'
							})
						}
					}
				})
			},
			refreshToken() {
				setInterval(() => {
					console.log('触发刷新token')
					let url = BaseApi + '/TokenAuth/Authenticate'
					console.log(url)
					let params = {
						userNameOrEmailAddress: uni.getStorageSync('user'),
						password: '321!SMB!smb!',
						rememberClient: true
					}
					uni.request({
						url: url,
						method: 'POST',
						data: params,
						success: (res) => {
							uni.hideLoading()
							console.log(res)
							uni.setStorageSync('token', 'Bearer ' + res.data.result.accessToken)
						},
						fail: (res) => {
							uni.hideLoading()
							console.log(res);
							if (res.errMsg.indexOf('request:fail') !== -1) {
								console.log('neterror');
								uni.showToast({
									title: '请检查网络！',
									icon: 'error'
								})
							}
						}
					})
				}, 3600000)
			},
			byteArrayToHexString: function(inarray) { // converts byte arrays to string  
				let i, j, inn;
				let hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
				let out = "";

				for (j = 0; j < inarray.length; ++j) {
					inn = inarray[j] & 0xff;
					i = (inn >>> 4) & 0x0f;
					out += hex[i];
					i = inn & 0x0f;
					out += hex[i];
				}
				return out;
			},
			writeData: function() {
				if (noNFC) {
					uni.showToast({
						title: '请检查设备是否支持并开启 NFC 功能！'
					})
					// this.toast('');
					return;
				}
				// 监听事件，触发条件
				readyWriteData = true;
				uni.showToast({
					title: '请刷卡！'
				})
				// this.toast('请将NFC标签靠近！');
			},
			readData: function() {
				if (noNFC) {
					uni.showToast({
						title: '请检查设备是否支持并开启 NFC 功能！'
					})
					// this.toast('');
					return;
				}
				// 监听事件，触发条件
				readyRead = true;
				// uni.showToast({
				// 	title: '请刷卡！'
				// })
				// this.toast('请将NFC标签靠近！');
			}
		},

		toast(content) {
			uni.showToast({
				title: content,
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #fff;
		height: 100%;

		.com-logo {
			// background: url(../../static/com-logo.png) norepeat fixed center;
			height: 80px;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;

			image {
				// height: 20px;
				height: 35.42rpx;
				width: 312.5rpx;
				// width: 50%;
				// margin-left: 177px;
				margin-top: 83.33rpx;
				margin-right: 31.25rpx;
			}
		}

		.action-logo {
			width: 100%;
			align-items: center;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;

			// width: 264.58rpx;
			// // width: 100%;
			// height: 52.08px;
			// width: 100%;
			// height: 100%;
			// margin: 0 auto;
			font-size: 36px;
			color: #646464;
			margin-top: 312.5rpx;
			margin-bottom: 104.17rpx;

			image {
				width: 116.67rpx;
				height: 57.29rpx;
				// width: 100rpx;
				// height: 60rpx;

				// margin-left: 85rpx;
				// margin: 0 auto;
				margin-bottom: 20rpx;
			}

			.systext {
				font-size: 33.33rpx;
				// margin-left: 15rpx;
			}
		}

		.login {
			width: 90%;
			height: 93.75rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #00893d;
			color: #fff;
			line-height: 93.75rpx;
			font-size: 33.33rpx;
		}

		.company-name {}
	}
</style>
