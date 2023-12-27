<template>
	<view class="container">

		<navbar :userName="userName"></navbar>
		<view class="" v-if="isShowBag">
			<view :class="[isShow ? 'showsearchBox' : 'searchBox']">
				<view class="search-container">
					<view v-if="!isShow" class="input-1">
						<input @tap="hideFooter1" @blur="showFooter1" type="number" v-model="PONum1" placeholder="PO号">
					</view>
					<view v-if="!isShow" class="input-1">
						<input @tap="hideFooter1" @blur="showFooter1" type="number" v-model="PackageNo1"
							placeholder="打包号">
					</view>
					<view v-if="!isShow" class="searchBtn1">
						<button type="primary" @click="searchMate">查询</button>
					</view>
					<view v-if="isShow" class="input-2">
						<input @tap="hideFooter1" @blur="showFooter1" type="number" v-model="PONum1" placeholder="PO号">
					</view>
					<view v-if="isShow" class="input-2">
						<input @tap="hideFooter1" @blur="showFooter1" type="number" v-model="PackageNo1"
							placeholder="打包号">
					</view>
					<view v-if="isShow" class="input-2">
						<input @tap="hideFooter1" @blur="showFooter1" type="text" v-model="POItem" placeholder="WBS号">
					</view>
					<view v-if="isShow" class="input-2">
						<input @tap="hideFooter1" @blur="showFooter1" type="text" v-model="MateNum" placeholder="工位号">
					</view>
					<view v-if="isShow" class="searchBtn2">
						<button type="primary" @click="searchMate">查询</button>
					</view>


					<!-- <uni-collapse ref="collapse" @change="change">
						<uni-collapse-item title="展开搜索">
							<view class="content">
				
								<input class="search-area" type="text" value="" />
								<input class="search-area" type="text" value="" />
								<button type="default" class="search-btn">搜索</button>
							</view>
						</uni-collapse-item>
				
					</uni-collapse> -->
				</view>
				<view class="moresearch" @click="showMore">
					<view v-if="!isShow" class="more">
						更多筛选条件
						<uni-icons type="bottom" size="20"></uni-icons>
					</view>
					<view v-if="isShow" class="more">
						收起筛选条件
						<uni-icons type="top" size="20"></uni-icons>
					</view>
				</view>

			</view>



			<view class="select-print">
				<view class="allchecked">
					<checkbox color="#fff" :checked="allchecked" @click="allChecked" />
					全选
				</view>
				<view class="print-box">
					<button @click="print" :disabled="printDisable" class="toolbtn">
						<uni-icons custom-prefix="iconfont" color="#00893d" type="icon-print" size="24"></uni-icons>
						打印
					</button>
				</view>
			</view>
			<view class="list-Box" @touchend="touchEnd" @touchstart="touchStart">

				<view class="uni-list" v-for="item in List" :key="item.PONum">
					<view class="check-container">
						<checkbox @click="checkboxChange($event,item)" :value="item" color="#fff"
							:checked="item.checked" />
					</view>
					<!-- <checkbox-group @change="checkboxChange"> -->
					<view class="uni-list-cell uni-list-cell-pd">

						<view class="label-container">
							<view class="label-header">
								<view class="header-left">
									<view class="PONo">
										<view class="header-title">
											PO号
										</view>
										<view class="header-item">
											{{item.poCode}}
										</view>


									</view>
									<view class="PONo">
										<view class="header-title">
											打包号
										</view>
										<view class="header-item">
											{{item.packageNo}}
										</view>
									</view>

								</view>
								<view class="header-right">
									<view class="PONo">
										<view class="header-title">
											PO项次
										</view>
										<view class="header-item">
											{{item.poItem}}
										</view>


									</view>

									<view class="PONo">
										<view class="header-title">
											打包项次
										</view>
										<view class="header-item">
											{{item.packageItem}}
										</view>

									</view>
								</view>


							</view>

							<view class="label-body">
								<view class="body-items">
									<view class="body-title">
										物料号
									</view>
									<view class="body-item">
										{{item.material}}
									</view>
								</view>
								<view class="body-items">
									<view class="body-title">
										WBS号
									</view>
									<view class="body-item">
										{{item.wbs}}
									</view>
								</view>
								<view class="body-items">
									<view class="body-title">
										工位号
									</view>
									<view class="body-item">
										{{item.station}}
									</view>
								</view>
								<view class="body-items">
									<view class="body-title">
										物料描述
									</view>
									<view class="body-item">
										{{item.description}}
									</view>
								</view>
								<view class="body-items">
									<view class="body-title">
										备注
									</view>
									<view class="body-item">
										{{item.comment}}
									</view>
								</view>
								<view class="order-items">
									<view class="order-num">
										<view class="order-title">
											订购数量
										</view>
										<view class="orderitem">
											{{item.qty}}
										</view>
									</view>
									<view class="arrive-num">
										<view class="arrive-title">
											本次到货数量
										</view>
										<view class="arriveitem">
											<input @input="checkReceiveQty($event,item)"
												@focus="focusNum($event,item.MaxNum)"
												:disabled="item.disabledReceivedQty" @blur="blurCheck(item.receivedQty)"
												type="number" min=1 step=1 v-model="item.receivedQty" />
										</view>
									</view>

								</view>
								<view class="material-size">
									<view class="mate-tilte">
										大中小料
									</view>
									<view class="radio-item">
										<radio-group class="radio-group-box" @change="radioChange($event,item)">
											<label class="radio-label">
												<view>
													<radio value="0" :checked="item.size==0" />
												</view>
												<view class="radio-title">小料</view>
											</label><label class="radio-label">
												<view>
													<radio value="1" :checked="item.size==1" />
												</view>
												<view class="radio-title">中料</view>
											</label><label class="radio-label">
												<view>
													<radio value="2" :checked="item.size==2" />
												</view>
												<view class="radio-title">大料</view>
											</label>
											<!-- <label class="radio-label" v-for="(item1, index) in Radioitems"
												:key="item1.value">
												<view>
													<radio :value="item.size" :checked="index === item.size" />
												</view>
												<view class="radio-title">{{item1.name}}</view>
											</label> -->

										</radio-group>
									</view>
								</view>
							</view>
							<view class="label-footer">
								<view class="LateMatearea" v-if="item.isSupplement">
									<view class="LateMate schaefflerGreen">
										后到料
									</view>

								</view>
								<view class="label-emergency">
									<view class="emergency-title">
										加急
									</view>
									<view class="">
										<switch :checked="item.isUrgent" @change="switchChange($event,item)" />
									</view>
								</view>
							</view>
						</view>

					</view>
					<!-- </checkbox-group> -->
				</view>
			</view>


		</view>

		<view class="box-print" v-if="isShowBox">
			<view class="box-search">
				<view class="search-ipt">
					<view class="ipt-item">
						<input @tap="hideFooter1" @blur="showFooter1" type="text" required v-model="boxWBS"
							placeholder="WBS号" />
					</view>
					<view class="ipt-item">
						<input @tap="hideFooter1" @blur="showFooter1" type="text" required v-model="boxStation"
							placeholder="工位号" />
					</view>
					<view class="ipt-item">
						<input @tap="hideFooter1" @blur="showFooter1" type="number" v-model="boxIndex"
							placeholder="序列号" />
					</view>
					<view class="searchBtn3">
						<button @click="searchBox" type="primary">查询</button>
					</view>
				</view>

			</view>
			<view class="mate-box-list">
				<view class="mate-card" v-for="itemm in mateList" :key="itemm.WBSNo">
					<view class="card-header">
						<view class="cardlist-item">
							<view class="cardlist-title">
								WBS号
							</view>
							<view class="cardlist-content">
								{{itemm.wbs}}
							</view>
						</view>
						<view class="cardlist-item">
							<view class="cardlist-title">
								工位号
							</view>
							<view class="cardlist-content">
								{{itemm.stationCode}}
							</view>
						</view>

					</view>
					<view class="card-footer">
						<view class="lastNum">
							最后一盒序号:

							<span class="last-title">
								{{itemm.serialNo}}
							</span>

						</view>
						<view class="print-btn">
							<button @click="printBOX(itemm)" :disabled="disPrintBox" class="boxPrintbtn">
								<uni-icons custom-prefix="iconfont" color="#fff" type="icon-print" size="24">
								</uni-icons>
								打印
							</button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="footer-nav">
			<view class="mate-bag" v-if="!isShowBag" @click="changeToBagPrint">
				<view class="bag-box">
					<image src="../../static/WMS UI design/icon-liaodaibiaoqian.svg" class="footernavimg"
						mode="widthFix">
					</image>
				</view>
				<view class="default-text">
					料袋重打
				</view>
			</view>
			<view class="mate-bag" v-if="isShowBag" @click="changeToBagPrint">
				<view class="bag-box">
					<image src="../../static/WMS UI design/iconliaodaibiaoqian_ative.svg" class="footernavimg"
						mode="widthFix">
					</image>
				</view>
				<view class="schaefflerGreen">
					料袋重打
				</view>
			</view>
			<view class="mate-bag" v-if="!isShowBox" @click="changeToBoxPrint">
				<view class="bag-box">

					<image src="../../static/WMS UI design/icon-liaohebiaoqian.svg" class="footernavimg"
						mode="widthFix">
					</image>
				</view>
				<view class="default-text">
					料盒重打
				</view>
			</view>
			<view class="mate-bag" v-if="isShowBox" @click="changeToBoxPrint">
				<view class="bag-box">

					<image src="../../static/WMS UI design/icon-liaohebiaoqian_active.svg" class="footernavimg"
						mode="widthFix">
					</image>
				</view>
				<view class="schaefflerGreen">
					料盒重打
				</view>
			</view>

		</view>


		<view style="position: absolute;top: -9999px;left: -9999px;">
			<canvas :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="myCanvas"></canvas>
		</view>
		<fui-dialog :show="show1" :title="error1" :buttons="buttons" maskClosable @click="onClick1" @close="onClose1">
		</fui-dialog>
	</view>
</template>

<script>
	const printer = uni.requireNativePlugin('LcPrinter');
	const modal = uni.requireNativePlugin('modal');
	var globalEvent = uni.requireNativePlugin('globalEvent');
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'
	import {
		v4 as uuidv4
	} from 'uuid';
	import dateFormat, {
		masks
	} from "dateformat";
	import uqrcode from '@/common/uqrcode.js' //引入uqrcode.js
	import qrcode from '@/common/weapp-qrcode.js' //引入uqrcode.js
	import {
		pathToBase64,
		base64ToPath
	} from '@/js_sdk/mmmm-image-tools/index.js'
	var _self;
	export default {
		created: function(option) {

		},
		onHide: function() {},
		destroyed: function() {},
		data() {
			return {
				canvasW: 200, // 画布宽
				canvasH: 400, // 画布高
				pic: '',
				value: ['0'],

				List: [],
				mateList: [],
				isShow: false,
				isShowText: false,
				allchecked: false,
				isShowBox: false,
				isShowBag: true,
				buttons: [{
					text: '取消',
					color: '#ccc'
				}, {
					text: '确定',
					color: '#00893d'
				}],



				Radioitems: [{
					name: '小料',
					value: 0
				}, {
					name: '中料',
					value: 1
				}, {
					name: '大料',
					value: 2
				}, ],
				current: 0,
				PONum1: '',
				// PONum1: '30545264',
				PackageNo1: '',
				POItem: '',
				MateNum: '',
				boxWBS: '',
				// boxWBS: 'S-028709-01-02-02',
				boxStation: '',
				boxIndex: '',
				windowHeight: '',
				showFooter: true,
				MaxNum: 0,
				materialInfoList: [],
				recurrentPrintItem: {},
				show1: false,
				error1: '',
				disPrintBox: false,
				printDisable: false,
				isCanRequest: false


			};
		},


		onLoad() {
			this.userName = uni.getStorageSync('userName')
			this.user = uni.getStorageSync('user')
			console.log(this.$MyHttp)
			let _self = this;
			uni.getSystemInfo({
				success: (res) => {
					_self.windowHeight = res.windowHeight;
					// console.log(res.windowHeight)
				}
			});
			uni.onWindowResize((res) => {
				// console.log(res.size.windowHeight)
				// console.log(_self.windowHeight)

				if (res.size.windowHeight + 100 < _self.windowHeight) {
					_self.showFooter = false
				} else {
					_self.showFooter = true
				}
			})

			// this.initPrinter()

			globalEvent.addEventListener('onPrintCallback', function(e) {
				console.log(e)
				if (e.key == 0) {
					if (_self.recurrentPrintItem.sizeName != null && _self.isCanRequest) {
						console.log('重打打印接口')
						_self.isCanRequest = false
						_self.printedMateOrBox('/services/app/PrintQRCode/PrintedMaterialQRCodeByMobileAgain',
							_self.recurrentPrintItem)
					}
				} else if (e.key == 3) {
					uni.hideLoading()
					_self.isCanPrint = true
					_self.searchMate()
					uni.showToast({
						title: '缺纸',
						icon: 'error'
					})
				}
			})


		},
		methods: {
			onClose1(e) {
				this.show1 = false
			},
			onClick1(e) {
				this.onClose1()
			},
			initPrinter() {
				printer.initPrinter({});
				printer.printEnableMark({
					enable: true
				});
				// printer.setConcentration({ //设置打印浓度。font_level 取值范围：1~39。
				// 	level: 39
				// });
				printer.setLineSpacing({
					spacing: 0.9
				});
				// 走纸距离设置为20
				printer.setUnwindPaperLen(20)
			},
			touchStart(e) {
				// console.log(e)
				this.myoffsettop = e.changedTouches[0].clientY
			},
			touchEnd(e) {

				if (this.myoffsettop - e.changedTouches[0].clientY > 30 && this.List.length > 1) {
					this.isShow = false
				}
			},
			showFooter1: function() {
				this.showFooter = true;
			},
			hideFooter1: function() {
				this.showFooter = false;
			},
			searchMate() {
				this.printDisable = false
				this.isCanPrint = true
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				console.log(this.PONum1)
				console.log(this.PackageNo1)
				console.log(this.$MyHttp)
				this.List = []

				let params = {
					pageIndex: 1,
					pageSize: 9999999
				}
				if (this.POItem) {
					params.wbs = this.POItem
				}
				if (this.PONum1) {
					params.po = this.PONum1
				}
				if (this.PackageNo1) {
					params.package = this.PackageNo1
				}
				if (this.MateNum) {
					params.station = this.MateNum
				}
				console.log(params)
				// 改成post接口
				let url = BaseApi + '/services/app/PrintQRCode/PrintedBagList'
				console.log(url)
				uni.request({
					url: url,
					method: 'POST',
					data: params,
					header: {
						'Authorization': uni.getStorageSync("token"),
						'Content-Type': 'application/json;charset=utf-8'
					},
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						this.List = res.data.result
						this.List.forEach((item) => {
							item.checked = false
							item.MaxNum = item.qty - item.storedQty
							item.disabledReceivedQty = (item.qty.toString()).indexOf(".") > -1
							if (item.size == 0) {
								item.sizeName = '小料'
							} else if (item.size == 1) {
								item.sizeName = '中料'
							} else if (item.size == 2) {
								item.sizeName = '大料'
							}
							// item.receivedQty = item.qty - item.storedQty
						})

						console.log(this.List)
					},
					fail: (res) => {
						uni.hideLoading()
						console.log(res)
					}
				})
				this.materialInfoList = []


			},
			searchBox() {
				if (this.boxWBS == '' || this.boxStation == '') {
					uni.showToast({
						title: 'wbs和工位必填',
						icon: 'error'
					})
				} else {

					let api =
						`/services/app/PrintQRCode/GetPrintedBoxList?wbs=${this.boxWBS}&station=${this.boxStation}&serialNo=${this.boxIndex}`
					this.$MyHttp.get(api).then((res) => {
						console.log(res)
						this.mateList = res.data.result
						// this.List.forEach((item) => {
						// 	item.checked = false
						// 	item.qty = item.qty - item.storedQty
						// })
						console.log(this.mateList)
					})

				}

			},

			checkReceiveQty(e, item) {
				console.log(e.target.value)
				console.log(item)
				if (!e.target.value) {

				}

				if (this.MaxNum < e.target.value) {
					// item.receivedQty = this.MaxNum
					uni.showToast({
						icon: 'none',
						title: '本次到货数量不能超过订购总数!'
					})
				}
				if (e.target.value && e.target.value <= 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入正整数!'
					})
				}
			},
			focusNum(e, Maxnum) {
				console.log(e)
				this.MaxNum = Maxnum
				console.log(Maxnum)
			},
			blurCheck(qty) {
				if (!qty) {
					uni.showToast({
						icon: 'none',
						title: '本次到货数量必填!'
					})
				}
			},


			printBagItem(item) {
				if (item.size == 0) {
					item.sizeName = '小料'
				} else if (item.size == 1) {
					item.sizeName = '中料'
				} else if (item.size == 2) {
					item.sizeName = '大料'
				}
				let _this = this
				var date = new Date();
				var newdate = dateFormat(date, "yyyy-mm-dd HH:MM:ss");
				var user = this.user


				console.log(item.sizeName)

				var ret = printer.initPrinter({});



				// printer.printEnableMark({
				// 	enable: true
				// })
				// printer.setLineSpacing({
				// 	spacing: 0.9
				// })
				printer.setFontSize({
					fontSize: 3
				});

				// let iteminfo = JSON.stringify(item)
				if (item.isUrgent == true && item.isSupplement) {
					printer.printText2({
						offset: 5,
						fontSize: 4,
						isBold: true,
						isUnderLine: false,
						content: `  后到料       *加急    ${item.sizeName}`
					});
				} else if (item.isUrgent == true && item.pickNum == 0) {
					printer.printText2({
						offset: 5,
						fontSize: 4,
						isBold: true,
						isUnderLine: false,
						content: `       *加急    ${item.sizeName}`
					});
				} else if (item.isUrgent == false && item.isSupplement) {
					printer.printText2({
						offset: 5,
						fontSize: 4,
						isBold: true,
						isUnderLine: false,
						content: `      后到料    ${item.sizeName}`
					});
				} else {
					printer.printText2({
						offset: 5,
						fontSize: 4,
						isBold: true,
						isUnderLine: false,
						content: `         ${item.sizeName}`
					});
				}
				// printer.printDashLine()
				printer.printQR2({
					offset: 100,
					height: 150,
					text: `{"Id":"${item.packageId}"}`
				})
				// 走纸
				// printer.printText({
				// 	content: 'PO/Item       '
				// });
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'PO/Item       '
				});

				// printer.setFontSize({
				// 	fontSize: 17
				// });
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.poCode}` + '/' + `${item.poItem}` + '\n'
				});
				// printer.printText({
				// 	content: 'Qty                '
				// });
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Qty                '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.receivedQty}` + '\n'
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Material        '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.material}` + '\n'
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Description  '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.description}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'WBS              '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.wbs}` + '\n'
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Station          '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.station}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Location      '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: true,
					content: `${item.frameNo}\n`
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'BOM NO.     '

				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.drawingCode}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Bom Item     '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.bomItem}/${item.packageNo}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Comment     '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.comment}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Packed By    '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${user}` + '  ' + `${newdate}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Assembler   '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.assembler}` + '\n'
				});

				_this.isCanRequest = true
				printer.printGoToNextMark()



			},

			print() {
				console.log('点击了打印按钮')
				if (!this.isCanPrint) {
					return
				}

				this.isCanPrint = false
				this.printDisable = true
				this.materialInfoList = []
				uni.showLoading({
					title: '打印中',
					mask: true
				})
				console.log(this.List)
				let newarr = []

				this.List.forEach((item) => {
					if (item.checked == true) {
						// newarr.push(item)
						this.materialInfoList.push(item)
						// 勾选了，打印
						// if (this.materialInfoList.length == 0) {
						// 	this.materialInfoList.push(item)
						// } else {
						// 	this.materialInfoList.forEach((ele, index1) => {
						// 		console.log(index1)
						// 		console.log(ele.bomItemId != item.bomItemId)
						// 		if (ele.bomItemId != item.bomItemId) {
						// 			this.materialInfoList.push(item)
						// 			console.log(item)
						// 		}
						// 	})
						// }
					}
				})
				console.log(this.materialInfoList)
				// this.materialInfoList = this.uniqueFunc(this.materialInfoList, 'bomItemId')

				if (this.materialInfoList.length == 0) {
					uni.hideLoading()
					this.printDisable = false
					this.isCanPrint = true
				}
				this.isAllchecked = false
				if (this.List.length == this.materialInfoList.length) {
					this.isAllchecked = true
				}
				this.recurrentPrintItem = this.materialInfoList[0]

				this.getPrintItemFrameNo()
				// uni.hideLoading()
				console.log(this.materialInfoList)



				// 获取打印物料信息
			},
			uniqueFunc(arr, uniId) {
				const res = new Map();
				console.log('111', arr)
				return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
			},



			getPrintItemFrameNo() {
				let url = BaseApi +
					`/services/app/PrintQRCode/GetFrameNo?materialId=${this.recurrentPrintItem.bomItemId}`
				console.log(url)

				let _this = this

				if (this.recurrentPrintItem.size == 0) {
					uni.request({
						url: url,
						method: "GET",
						header: {
							'Authorization': "Bearer " + uni.getStorageSync("token")
						},
						success: (res) => {
							console.log(res);
							if (res.statusCode == 200) {
								// _this.isCanRequest=true
								_this.recurrentPrintItem.frameNo = res.data.result
								_this.printBagItem(_this.recurrentPrintItem)
							}
						},
						fail: (res) => {
							console.log(res);
							uni.hideLoading()
							if (res.errMsg.indexOf('request:fail') !== -1) {
								console.log('neterror');
								this.error1 = '网络错误'
								this.show1 = true
								this.materialInfoList = []
								this.recurrentPrintItem = {}
							}
						}
					})

				} else {
					_this.recurrentPrintItem.frameNo = ''
					_this.printBagItem(_this.recurrentPrintItem)
				}


			},

			printBOX(item) {
				this.disPrintBox = true
				this.item = {}
				console.log(item)
				this.item = item
				this.currentPrintItem = {}
				this.pic = ''
				this.paint()
				setTimeout(() => {
					this.disPrintBox = false
				}, 5000)
			},
			printBoxItem1() {

				let _this = this
				var ret = printer.initPrinter({});
				console.log(ret);


				printer.printEnableMark({
					enable: true
				})

				printer.setLineSpacing({
					spacing: 0.9
				})
				// let iteminfo = JSON.stringify(item)
				printer.printQR2({
					offset: 75,
					height: 200,
					text: `{"Id":"${_this.item.id}"}`
				})
				printer.setFontSize({
					fontSize: 0
				});
				printer.printBitmap2({

					// base64: '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'
					base64: _this.pic
				});

				printer.printGoToNextMark()
			},
			paint() {
				_self = this;
				setTimeout(() => {
					var ctx = uni.createCanvasContext('myCanvas')
					ctx.setFillStyle('#fff'); // 默认白色
					ctx.clearRect(0, 0, 200, 400)

					//  1mm=8dot   纸张的规格是 40mmX53mm    320px*420px
					// 还原绘制上下文的缩放 图片不再缩放，更加清晰
					ctx.setTransform(1, 0, 0, 1, 0, 0)
					// 旋转之后画布超出区域，所以往右移动到视角中心
					ctx.translate(200, 0);
					// 画布旋转90°
					ctx.rotate(90 * Math.PI / 180);
					// 画布和前一元素保持一点距离
					// ctx.moveTo(10, 10)

					ctx.setFontSize(14); // setFontSize() 设置字体字号
					ctx.setFillStyle('#000'); // setFillStyle() 设置字体颜色
					//每一行/列的文字
					ctx.fillText(`WBS         ${_self.item.wbs}`, 0, 70);
					ctx.fillText(`Station    ${_self.item.stationCode}`, 0, 100);
					_self.toFormateStr(ctx, `Drawing  ${_self.item.drawingCode}`, 220, -1, 0, 130, 16)
					// ctx.fillText(`Drawing  ${_self.item.drawing}`, 0, 130);
					ctx.fillText(`Box No    ${_self.item.serialNo}`, 0, 160);
					// ctx.fillText(`Creation ${_self.serialNo}`, 0, 180);

					ctx.draw(true, (ret) => { // draw方法 把以上内容画到 canvas 中。 canvasId:'myCanvas',
						console.log(ret)
						uni.canvasToTempFilePath({ // 保存canvas为图片 canvasId: 'myCanvas',
							canvasId: 'myCanvas',
							quality: 1,
							complete: function(res) {
								// 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
								console.log('base64:', res.tempFilePath)
								var path = res.tempFilePath

								var p = plus.io.convertLocalFileSystemURL(path);
								var url = 'file://' + p
								console.log(url)
								pathToBase64(url)
									.then(base64 => {
										var b = base64.split('data:image/png;base64,')
										// 得到路径，开始打印
										_self.pic = b[1]
										_self.printBoxItem1()
									})
									.catch(error => {
										console.error(error)
									})
							},
						})
					});
				}, 0)

			},
			// csdn canvas 换行方法
			toFormateStr(ctx, str, draw_width, lineNum, startX, startY, steps) {
				// 	// *  参数解析：
				// * 
				// * 	ctx:  canvas绘图上下文
				// * 	str:  需要绘制的文本内容
				// * 	draw_width:  绘制后的文字显示宽度
				// * 	lineNum:  最大行数，多出部分用'...'表示， 如果传-1可以达到自动换行效果
				// * 	startX:  绘制文字的起点 X 轴坐标
				// * 	startY:  绘制文字的起点 Y 轴坐标
				// *	steps:  文字行间距


				var strWidth = ctx.measureText(str).width; // 测量文本源尺寸信息（宽度）
				var startpoint = startY,
					keyStr = '',
					sreLN = strWidth / draw_width;
				var liner = Math.ceil(sreLN); // 计算文本源一共能生成多少行
				let strlen = parseInt(str.length / sreLN); // 等比缩放测量一行文本显示多少个字符

				// 若文本不足一行，则直接绘制，反之大于传入的最多行数（lineNum）以省略号（...）代替
				if (strWidth < draw_width) {

					ctx.fillText(str, startX, startpoint);

				} else {

					for (var i = 1; i < liner + 1; i++) {
						let startPoint = strlen * (i - 1);
						if (i < lineNum || lineNum == -1) {
							if (i >= 2) {
								keyStr = str.substr(startPoint, strlen);
								ctx.fillText('                   ' + keyStr, startX, startpoint); //第二行前面留出空格
							} else {
								keyStr = str.substr(startPoint, strlen);
								ctx.fillText(keyStr, startX, startpoint);
							}

						} else {
							keyStr = str.substr(startPoint, strlen - 5) + '...';
							ctx.fillText(keyStr, startX, startpoint);
							break;
						}
						startpoint = startpoint + steps;
					}

				}
			},



			printBoxItem(item) {
				let _this = this
				var ret = printer.initPrinter({});
				console.log(ret);

				item.serialNo = item.serialNo

				// printer.printText({
				// 	content: '      \r\n'
				// });
				// printer.printText({
				// 	content: '      \r\n'
				// });


				printer.printEnableMark({
					enable: true
				})

				printer.setLineSpacing({
					spacing: 0.9
				})

				// let iteminfo = JSON.stringify(item)

				printer.printQR2({
					offset: 100,
					height: 150,
					text: `{"Id":"${item.packageId}"}`
				})
				// 走纸

				printer.setFontSize({
					fontSize: 3
				});
				printer.printText({
					content: 'WBS:'
				});

				printer.printText({
					content: `${item.wbs}` + '\n'
				});
				printer.printText({
					content: 'Station:'
				});

				printer.printText({
					content: `${item.stationCode}` + '\n'
				});
				printer.printText({
					content: 'Drawing:'
				});

				printer.printText({
					content: `${item.drawingCode}` + '\n'
				});
				printer.printText({
					content: 'Box No:'
				});

				printer.printText({
					content: `${item.serialNo}` + '\n'
				});



				printer.printGoToNextMark()


			},

			printedMateOrBox(url, data) {
				let api = BaseApi + url
				console.log(api)
				console.log(data)
				let _this = this

				uni.request({
					url: api,
					method: 'POST',
					data: data,
					header: {
						'Authorization': uni.getStorageSync("token")
					},
					success: (res) => {
						console.log(res)
						console.log('返回的id:', res.data.result)
						console.log('打印的id:', _this.recurrentPrintItem)
						console.log('-----------------重打之后接口返回------------------')
						if (res.data.result.id == _this.recurrentPrintItem.packageId) {
							uni.setStorageSync('bomItemId', res.data.result.bomItemId)
							_this.recurrentPrintItem = {}
							console.log(res)

							console.log(_this.materialInfoList)
							_this.materialInfoList.shift()

							// console.log(_this.materialInfoList.findIndex(item => {
							// 	item.packageId == _this.recurrentPrintItem.packageId
							// }))
							// _this.materialInfoList.splice(_this.materialInfoList.findIndex(item => {
							// 	item.packageId == _this.recurrentPrintItem.packageId
							// }), 1)
							console.log(_this.materialInfoList)
							if (_this.materialInfoList.length > 0) {
								_this.recurrentPrintItem = _this.materialInfoList[0]

								console.log('下一个要打印的', _this.recurrentPrintItem)



								_this.getPrintItemFrameNo()

								// _this.printBagItem(_this.recurrentPrintItem)
							} else {


								// 刷新
								if (_this.isAllchecked) {
									this.PONum1 = ''
									this.PackageNo1 = ''
									this.POItem = ''
									this.MateNum = ''
									this.allchecked = false
									this.List = []
									this.materialInfoList = []
								} else {
									this.materialInfoList = []
									this.searchMate()
								}
								this.recurrentPrintItem = {}

								setTimeout(() => {
									uni.hideLoading()
								}, 3000)


							}

						} else {
							uni.hideLoading()
							// 弹窗让用户自己确认什么情况
							this.error1 = '未知错误,您打印的标签未录入系统,请重新打印'
							this.show1 = true
							this.materialInfoList = []
							this.recurrentPrintItem = {}
						}

						_this.isCanRequest = true

					},
					fail: (res) => {
						console.log(res)
						uni.hideLoading()
						if (res.errMsg.indexOf('request:fail') !== -1) {
							console.log('neterror');
							this.error1 = '网络错误,您打印的标签未录入系统,请重新打印'
							this.show1 = true
							this.materialInfoList = []
							this.recurrentPrintItem = {}
						}
						// _this.isCanRequest = true
					}
				})



			},
			allChecked(e) {
				console.log(e)
				console.log(this.allchecked)
				if (this.allchecked == false) {
					this.allchecked = true
					this.List.forEach((item) => {
						item.checked = true
					})
				} else {
					this.allchecked = false
					this.List.forEach((item) => {
						item.checked = false
					})
				}
			},

			switchChange(e, item) {
				console.log(e)
				console.log(item)
				item.isUrgent = e.detail.value
			},
			changeToBoxPrint() {
				this.isShowBag = false
				this.isShowBox = true

			},
			startScanMateBox() {
				console.log('扫描了')
			},
			changeToBagPrint() {
				this.isShowBox = false
				this.isShowBag = true
			},
			radioChange(evt, item) {
				console.log(evt)
				console.log(item)
				console.log(Number(evt.detail.value))
				item.size = Number(evt.detail.value)

				for (let i = 0; i < this.Radioitems.length; i++) {
					if (this.Radioitems[i].value === evt.detail.value) {
						this.current = i;
						break;
					}
				}
			},
			switch1Change: function(e) {
				console.log('switch1 发生 change 事件，携带值为', e.detail.value)
			},
			showMore() {
				this.isShow = !this.isShow
				// this.isClick = !this.isClick

				// 先展开500毫秒后再显示文字,收缩200毫秒后再隐藏文字
				if (this.isShowText) {
					setTimeout(() => {
						this.isShowText = !this.isShowText
					}, 200)
				} else {
					setTimeout(() => {
						this.isShowText = !this.isShowText
					}, 500)
				}

			},
			onClick(e) {
				uni.showToast({
					title: '列表被点击'
				})
			},
			change(e) {
				console.log(e);


			},
			open() {

			},
			backTo() {
				uni.navigateBack()
			},
			checkboxChange(e, item) {
				console.log(e)
				console.log(item)
				item.checked = !item.checked
				console.log(this.List)
				let flag = this.List.length
				this.List.forEach((item) => {
					if (item.checked == false) {
						flag--
					}

				})
				if (flag < this.List.length) {
					this.allchecked = false
				} else {
					this.allchecked = true
				}
				console.log(this.allchecked)

			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		font-size: 25rpx;

		.footer-nav {
			position: fixed;
			bottom: 0;
			// position: sticky;
			// position: -webkit-sticky;

			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			height: 102.08rpx;
			background-color: #fff;
			flex-direction: row;
			flex-wrap: nowrap;

			.mate-bag {
				width: 50%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.bag-box {
					width: 32.29rpx;
					height: 37.5rpx;
					margin-bottom: 5.21rpx;

					.footernavimg {

						width: 32.29rpx;
						height: 37.5rpx;
					}
				}

			}

		}
	}

	.uni-list {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		margin-bottom: 20px;
		border-radius: 10px;
		font-size: 27.08rpx;
		// box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.14);

		.check-container {
			background-color: #EbEef0;
		}
	}

	.uni-list-cell {
		border-radius: 10px;
		box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.14);
		width: 100%;
	}

	.searchBox {
		position: -webkit-sticky;
		position: sticky;
		display: flex;
		width: 100%;
		flex-wrap: nowrap;
		height: 189.58rpx;
		flex-direction: column;
		background-color: #fff;
		padding: 0 31.25rpx;
		transition: height 0.5s;
		transition-timing-function: ease;
		box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.14);
		// margin-bottom: 20px;

		.search-container {
			height: 72.92rpx;
			// padding: 0 20.83rpx;
			width: 100%;
			background-color: #fff;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-items: center;


			.input-1 {
				width: 252.08rpx;
				background-color: #EbEef0;
				height: 72.92rpx;
				border-radius: 10px;
				box-sizing: border-box;
				padding: 0 31.25rpx;
			}

			.searchBtn1 {
				width: 141.67rpx;
				height: 72.92rpx;
				border-radius: 10px;
			}


			.search-area {
				height: 41.67rpx;

			}

			.search-btn {
				color: #fff;
				font-size: 33.33rpx;
				line-height: 62.5rpx;
				height: 62.5rpx;
				background-color: #00893d;
				width: 50%;
			}
		}



		.moresearch {
			height: 83.33rpx;
			font-size: 29.17rpx;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			color: #646464;

			.more {
				display: flex;
				align-items: center;
			}
		}


	}

	.showsearchBox {
		position: -webkit-sticky;
		position: sticky;

		display: flex;
		width: 100%;
		flex-wrap: nowrap;
		height: 554.17rpx;
		flex-direction: column;
		background-color: #fff;
		padding: 0 31.25rpx;
		transition: height 0.5s;
		// margin-bottom: 20px;

		.search-container {
			height: 470.83rpx;
			// padding: 0 20.83rpx;
			width: 100%;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-items: center;


			.input-2 {
				width: 687.5rpx;
				background-color: #EbEef0;
				height: 72.92rpx;
				border-radius: 10px;
				box-sizing: border-box;
				padding: 0 31.25rpx;
			}

			.searchBtn2 {
				width: 687.5rpx;
				height: 72.92rpx;
				border-radius: 10px;
			}


			.search-area {
				height: 41.67rpx;

			}

			.search-btn {
				color: #fff;
				font-size: 33.33rpx;
				line-height: 62.5rpx;
				height: 62.5rpx;
				background-color: #00893d;
				width: 50%;
			}
		}



		.moresearch {
			height: 83.33rpx;
			font-size: 29.17rpx;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			color: #646464;

			.more {
				display: flex;
				align-items: center;
			}
		}

	}

	.list-Box {
		height: 989.58rpx;
		background-color: #ebeef0;
		// font-size: 24px;
		padding-left: 20.83rpx;
		padding-right: 20.83rpx;
		overflow: scroll;
		padding-bottom: 102.08rpx;
	}


	.label-container {
		width: 100%;
		height: 100%;
		// height: 729.17rpx;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.14);

		.label-header {
			padding: 20px 20px 0 20px;
			border-radius: 10px 10px 0 0;
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			// background-color: #f6f7f8;
			background-color: #fff;
			border-bottom: 1px solid #dde3e6;

			.header-left {
				width: 65%;
				height: 100%;
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: flex-start;
			}

			.header-right {
				width: 35%;
				height: 100%;
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
			}

			.PONo {
				// width: 50%;
				// width: 270.83rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;

				.header-title {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 125rpx;
					height: 41.67rpx;
					color: #9ca2a5;
					background-color: #ebeef0;
					border-radius: 20px;
					margin-right: 15.63rpx;
				}

				.header-item {
					width: 125rpx;
				}
			}
		}

		.label-body {
			padding: 5px 20px;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			// height: 100%;
			// justify-content: center;
			justify-content: flex-start;
			align-items: center;

			.body-items {
				display: flex;
				width: 100%;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				padding: 5px;

				.body-title {
					display: flex;
					justify-content: flex-end;
					margin-right: 10.42rpx;
					width: 114.58rpx;
					color: #9ca2a5;
				}

				.body-item {
					width: 425rpx;

				}


			}

			.order-items {
				display: flex;
				width: 100%;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 5px;
				padding-left: 31.25rpx;

				.order-num {
					width: 30%;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;

					.order-title {
						// width: 130.21rpx;
						color: #9ca2a5;
					}
				}

				.arrive-num {
					// width: 208.33rpx;
					width: 60%;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;

					.arrive-title {
						color: #9ca2a5;
						// width: 208.33rpx;
					}

					.arriveitem {
						width: 125rpx;
						height: 62.5rpx;

						background-color: #EbEef0;
						border-radius: 10px;
						box-sizing: border-box;
						// padding: 0 10px;
						padding-left: 10.42rpx;
					}
				}
			}

			.material-size {
				display: flex;
				width: 100%;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 5px;
				padding-left: 31.25rpx;

				.radio-item {

					// width: 30%;
					// display: flex;
					// flex-direction: row;
					// flex-wrap: nowrap;
					// justify-content: space-between;
					.radio-group-box {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: center;

						.radio-label {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							justify-content: center;
							align-items: center;
						}
					}




				}

				.mate-tilte {
					// width: 130.21rpx;
					color: #9ca2a5;
				}


			}
		}

		.label-footer {
			padding: 5px 20px;
			background-color: #f6f7f8;
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			align-items: center;
			height: 87.5rpx;
			border-radius: 0 0 10px 10px;


			.label-emergency {
				display: flex;
				flex-direction: row;
				align-items: center;

				.emergency-title {
					color: #9ca2a5;
					margin-right: 15.63rpx;
				}
			}

			.LateMatearea {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;


				.LateMate {
					font-weight: 700;
				}
			}
		}
	}


	.select-print {
		height: 70px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		background-color: #ebeef0;
		padding-left: 20.83rpx;

		.print-box {
			width: 208.33rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.toolbtn {
				height: 72.92rpx;
				background-color: #ebeef0;
				display: flex;
				color: #00893d;
				align-items: center;
				justify-content: flex-end;
				font-size: 29.17rpx;
				width: 156.25rpx;
			}

		}

		.allchecked {
			font-size: 29.17rpx;
		}
	}

	.box-print {
		padding-bottom: 102.08rpx;
		font-size: 29.17rpx;

		.box-search {
			width: 100%;
			height: 385.42rpx;
			display: flex;
			background-color: #fff;
			flex-direction: row;
			// padding-left: 30px;
			// padding-right: 30px;
			justify-content: space-around;
			align-items: center;

			.search-ipt {
				display: flex;
				width: 100%;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;

				.ipt-item {
					// width: 447.92rpx;
					width: 92%;
					background-color: #EbEef0;
					height: 72.92rpx;
					border-radius: 10px;
					box-sizing: border-box;
					padding: 0 31.25rpx;
					margin-bottom: 20.83rpx;
				}

				.searchBtn3 {
					// width: 447.92rpx;
					width: 92%;
				}
			}

			.scan-area {
				width: 206.25rpx;
				height: 258.33rpx;
				// overflow: hidden;



				.scan-area-img {
					width: 206.25rpx;
					height: 258.33rpx;
				}
			}

		}

		.mate-box-list {
			height: 1000rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			overflow: scroll;
			background-color: #ebeef0;

			.mate-card {
				background-color: #fff;
				width: 687.5rpx;
				padding: 20.83rpx;
				margin-top: 20.83rpx;

				.card-header {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					border-bottom: 1px solid #f6f7f8;

					.cardlist-item {
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-bottom: 10.42rpx;

						.cardlist-title {
							height: 41.67rpx;
							width: 119.79rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							color: #9ca2a5;
							border-radius: 20.83rpx;
							margin-right: 20.83rpx;
							background-color: #f6f7f8;
						}
					}
				}

				.card-footer {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					height: 62.5rpx;
					align-items: center;
					color: #9ca2a5;
					font-size: 29.17rpx;

					.lastNum {
						height: 52.08rpx;
						margin-top: 20rpx;

						.last-title {
							color: #00893d;
							margin-left: 10.42rpx;
						}
					}





					.boxPrintbtn {
						height: 52.08rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						background-color: #00893d;
						display: flex;
						color: #fff;
						font-size: 29.17rpx;
						border-radius: 52.08rpx;
						width: 156.25rpx;
						margin-top: 20rpx;
					}
				}

			}
		}
	}


	.back {
		// height: 20px;
		// width: 100rpx;
		background-color: #fff;

		// height: 20px;
		color: #646464;
		display: flex;
		font-size: 31.25rpx;
		justify-content: space-between;
		// margin-top: 20px;
		margin-bottom: 10px;
		padding-top: 20px;
		height: 46px;
		padding-left: 10px;
		position: -webkit-sticky;
		position: sticky;
		top: 60px;
		z-index: 2;
	}

	#input {
		// display: none;

		border: 1px solid #000;
		margin-left: 50rpx;
		width: 50%;
		opacity: 0;
		// display: hidden;
	}

	.img {
		// width: 300rpx;
		margin: 150rpx 0 200rpx 75rpx;

		image {
			// width: 318.75rpx;
		}
	}

	.login {
		width: 90%;
		height: 50px;
		background-color: #00893d;
		color: #fff;
		line-height: 50px;
		font-size: 32rpx;
	}

	/deep/.uni-ellipsis {
		white-space: normal
	}

	uni-button:after {
		border: none;
		border-radius: unset;
	}

	.uni-body {
		color: #9ca2a5;
	}

	/deep/.uni-card .uni-card__header {
		padding: 10px 10px 0 10px;
	}

	/deep/.uni-card .uni-card__content {
		padding: 0 10px 10px 10px;
	}

	.uni-mt-10 {
		margin-top: -16px;
		margin-left: 10px;
		width: 260px;
	}

	/deep/.uni-searchbar__box {
		padding: 7px 25px 5px 0px;
		margin-left: 70px;
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		background-color: #fff;
	}

	/deep/ uni-checkbox .uni-checkbox-input-checked {
		background-color: #00893d;
	}



	/deep/ uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #00893d;
	}

	/deep/.uni-card .uni-card__header .uni-card__header-avatar {
		width: 24px;
	}

	/deep/.uni-card .uni-card__header .uni-card__header-content .uni-card__header-content-title {
		font-size: 16px;
		font-weight: 500;
	}

	/deep/.uni-card .uni-card__header .uni-card__header-avatar .uni-card__header-avatar-image {
		width: 22px;
	}

	// .uni-list-cell {
	// 	justify-content: flex-start;
	// }

	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.box {
		@include flex;
	}

	.button {
		@include flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 35px;
		margin: 0 5px;
		border-radius: 5px;
	}

	.example-body {
		background-color: #fff;
		padding: 10px 0;
	}

	.button-text {
		color: #fff;
		font-size: 12px;
	}

	.popup-content {
		@include flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 50px;
		background-color: #fff;
	}

	.popup-height {
		@include height;
		width: 200px;
	}

	.text {
		font-size: 12px;
		color: #333;
	}

	.popup-success {
		color: #fff;
		background-color: #e1f3d8;
	}

	.popup-warn {
		color: #fff;
		background-color: #faecd8;
	}

	.popup-error {
		color: #fff;
		background-color: #fde2e2;
	}

	.popup-info {
		color: #fff;
		background-color: #f2f6fc;
	}

	.success-text {
		color: #09bb07;
	}

	.warn-text {
		color: #e6a23c;
	}

	.error-text {
		color: #f56c6c;
	}

	.info-text {
		color: #909399;
	}

	.dialog,
	.share {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.dialog-box {
		padding: 10px;
	}

	.dialog .button,
	.share .button {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		margin: 0;
		margin-top: 10px;
		padding: 3px 0;
		flex: 1;
	}

	.dialog-text {
		font-size: 14px;
		color: #333;
	}
</style>
