<template>
	<view @touchstart="touchStart" @touchend="touchEnd">
		<!-- 遮罩层 -->
		<view class="drawer-mask" :class="{ 'drawer-mask-visible': stateDrawer }" />
		<!-- 内容列表 -->
		<view class="drawer-content" :class="{ 'drawer-content-visible': stateDrawer}">
			<scroll-view style="height: 100%;" scroll-y="true">
				<view class="recordTitle">
					<text style="font-size: 26rpx;">审批记录</text>
				</view>
				<!-- <view v-for="item in 30" :key="item">可滚动内容 {{ item }}</view> -->
				<view v-for="(item,index) in historylist" :key="index" class="recordCard">
					<view class="top-card">
						<!-- 	"data": {
							"statusCode": 200,
							"code": null,
							"succeeded": false,
							"message": "查询完成！",
							"errors": null,
							"data": [{
								"itemName": "提交审批",
								"approverName": "shimnx@schaeffler.com",
								"lastModificationTime": null,
								"approvalState": 30,
								"comments": null,
								"processId": "3a110ac5-9cf3-1814-8b0f-01eb0790ab6b"
							}]
						}, -->
						<image v-if="item.approvalState === 30" class="passed" src="../../static/img/passed.png"
							mode="widthFix"></image>
						<image v-if="item.approvalState === 20" class="passed"
							src="../../static/img/waiting-process.svg" mode="widthFix"></image>
						<text style="font-size: 28rpx;">{{item.itemName}}</text>

					</view>
					<view :class="{'mid-card':item.approvalState === 30,'mid-card-1':item.approvalState === 20}">
						<view class="card-right">
							<image class="name-icon" src="../../static/img/admin-gery.svg" mode="widthFix"></image>
							<text style="font-size: 26rpx; color: #646464;">{{item.approverName}}</text>
						</view>
						<view class="data-card">
							<image style="width: 30rpx;height: 30rpx;margin-left: 12rpx;margin-right: 12rpx;;" src="../../static/img/gery-clock.svg" mode="widthFix"></iformatDatemage>
							<text style="font-size: 26rpx; color: #9ca2a5;margin-left: 50rpx;margin: 0;padding: 0;">{{item.creationTime | formatDate}}</text>


							<view v-if="!historyOpenFlag || currentItem !== index " style="font-size: 26rpx; color: #646464;position: absolute;right: 2rpx;"
								@click="openDoHistory(index,item.processId)">操作历史 </view>

							<image v-if="!historyOpenFlag || currentItem !== index" style="width: 20rpx;position: absolute;right: -24rpx;;"
								src="../../static/img/arrowDown.svg" mode="widthFix"></image>

							<view v-if=" historyOpenFlag && currentItem == index" style="font-size: 26rpx; color: #646464;position: absolute;right: 2rpx;"
								@click="closeDoHistory(index)">操作历史 </view>

							<image v-if=" historyOpenFlag && currentItem == index" style="width: 20rpx;position: absolute;right:-24rpx;;"
								src="../../static/img/arrowUp.svg" mode="widthFix"></image>

						</view>

						<view v-if=" historyOpenFlag && currentItem == index" class="advice-card">
							<view v-if="historyDetail=== [] || historyDetail === null  " class="">
								<text style="margin-left: 180rpx; color: #9ca2a5;font-size: 26rpx;">暂无操作历史</text>
							</view>
							<view v-else class="">
								<view v-for="(item,index) in historyDetail" :key="index" class="his">

									<view class="his-l">

										<image style="width: 50rpx;" src="../../static/circleHistory.svg"
											mode="widthFix"></image>
									</view>
									<view class="his-r">

										<text style="font-size: 26rpx; color: #9ca2a5;margin: 0;padding: 0;">
											{{item.creationTime | formatDate}}</text>
										<view style="margin: 0;padding: 0;" class="card-right-1">
											<view style="margin: 0;padding: 0;word-break: break-all;" class="">
												<image
													style="margin: 0;padding: 0;transform: translateY(10rpx);width: 40rpx;"
													class="name-icon" src="../../static/img/black-admin.svg"
													mode="widthFix"></image>
												<text
													style="font-size: 26rpx; color: #000; margin: 0;padding: 0;">{{item.name}}</text>
											</view>
											<view class="his-info"
												style="font-size: 26rpx; color: #646464;  margin: 0;padding: 0;">
												操作：<text style="color: #e62c27;font-size: 26rpx">
													{{item.operation}}
												</text>
											</view>
											<view style="font-size: 26rpx; color: #646464; margin: 0;padding: 0;"
												class="his-info">
												物料：<text style="color: #000;font-size: 26rpx">
													{{item.materialName}}
												</text>
											</view>
											<view style="font-size: 26rpx; color: #646464; margin: 0;padding: 0;"
												class="his-info">
												数量：<text style="color: #e62c27;font-size: 26rpx">
													{{item.quantity}}
												</text>
											</view>
											<view style="font-size: 26rpx; color: #646464; margin: 0;padding: 0;"
												class="his-info">
												原因：<text style="color: #000;font-size: 26rpx">
													{{item.comment}}
												</text>
											</view>

										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

				</view>
				<view class="recordButton">
					<button class="closeButton" @click="close()"><text style="color: #646464;">关闭</text></button>
				</view>


			</scroll-view>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'
	/**
	 * Drawer 抽屉侧滑菜单
	 * @property {Boolean} mask = [true | false] 是否显示遮罩
	 * @property {Boolean} maskClick = [true | false] 点击遮罩是否关闭
	 */
	export default {
		name: 'drawer',

		data() {
			return {
				stateDrawer: this.switchHistory,
				startTime: null, // 手势滑动时间
				startPosition: 0, // 手势进入时
				endPosition: 0, // 手势离开时

				clickIndex: null,
				openitems: [],
				historyOpenFlag: false,
				currentItem: null,
				historyDetail: []

			}
		},
		props: {
			historylist: {
				type: Array,
				default: []
			},
			switchHistory: {
				type: Boolean,
				default: false
			}
		},
		created() {},
		watch: {
			switchHistory(newvalue, oldvalue) {
				if (newvalue === true) {
					this.open()
				}

			}



		},
		filters: {
		  formatDate(value){
		      if (value) {
		            const date = new Date(value)
		            const year = date.getFullYear()
		            const month = (date.getMonth() + 1).toString().padStart(2, '0')
		            const day = date.getDate().toString().padStart(2, '0')
		            const hours = date.getHours().toString().padStart(2, '0')
		            const minutes = date.getMinutes().toString().padStart(2, '0')
		            const seconds = date.getSeconds().toString().padStart(2, '0')
		            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
		          }
		   
		  }
		  
		},
		methods: {
			// var item.creationTime = new Date().format("yyyy-MM-dd hh:mm:ss");
			
			// Date.prototype.format = function(fmt) {var o ={"M+" : this.getMonth()+1, //月份
			
			// "d+" : this.getDate(), //日
			
			// "h+" : this.getHours(), //小时
			
			// "m+" : this.getMinutes(), //分
			
			// "s+" : this.getSeconds(), //秒
			
			// "q+" : Math.floor((this.getMonth()+3)/3), //季度
			
			// "S" : this.getMilliseconds() //毫秒
			
			// };if(/(y+)/.test(fmt)) {
			
			// fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
			
			// }for(var k ino) {if(new RegExp("("+ k +")").test(fmt)){
			
			// fmt= fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+o[k]).length)));
			
			// }
			
			// }returnfmt;
			
			// },
			
			close() {
				this._changeDrawer('stateDrawer', false),
					this.sendMsg()
			},
			open() {
				this._changeDrawer('stateDrawer', true)
				this.sendMsg()
			},
			_changeDrawer(param, status) {
				this[param] = status
			},
			// 手势进入时
			touchStart(e) {
				this.startTime = Date.now()
				this.startPosition = e.changedTouches[0].clientX
			},
			// 手势离开时
			touchEnd(e) {
				const endTime = Date.now()
				if (endTime - this.startTime > 2000) {
					return;
				}
				this.endPosition = e.changedTouches[0].clientX;
				var slideDistance = this.startPosition - this.endPosition;
				if (slideDistance > 160) {
					this.open()
				}
				if (slideDistance < -160) {
					this.close()
				}
			},

			sendMsg() {
				//子传父
				this.$emit('sonmsg', this.stateDrawer);

			},

			openDoHistory(index, processId) {
				console.log(processId);
				let url = BaseApi + '/api/app/material/web-operation-save?processid=' + processId;
				uni.request({
					url: url,
					method: 'GET',

					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
						'Content-Type': 'application/json;charset=utf-8'
					},
					success: (res) => {
						console.log(res)
						this.historyDetail = res.data.data.operationSaveDtos
						if (res.data.statusCode !== 200) {

							_this.message = res.data.messages
							_this.showError = true
							setTimeout(() => {
								_this.showError = false
							}, 3000)
							return
						} else {
							console.log('获取定位数据成功')



						}

						//console.log(this.projectList)

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

				this.currentItem = index
				this.historyOpenFlag = true;

				// if (!this.openitems.includes(item)) {
				// 	this.openitems.push(item)
				// }
				// console.log(this.openitems);
			},
			closeDoHistory(index) {
				this.historyOpenFlag = false
				// this.historyOpenFlag = true const i = this.openitems.indexOf(item)
				// this.openitems.splice(i, 1)
				// this.historyOpenFlag = false

				// console.log(this.openitems);
			}
		}
	}
</script>

<style scoped>
	.his-info {
		font-size: 32rpx;
		word-break: break-all;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.his {
		width: 100%;
		min-height: 284rpx;
		display: flex;
		border-bottom: 2rpx dashed #ced5da;
	}

	.his-l {
		width: 40rpx;
		min-height: 284rpx;
	}

	.his-r {
		width: 426rpx;
		min-height: 284rpx;
		margin-left: 20rpx;
		transform: translateY(-10rpx);
	}

	.historyButton {
		/* 	transform: translateX(-20rpx); */
	}

	/* 侧滑菜单 因为需要手势滑动，所以左侧留边20rpx*/
	.drawer-content {
		display: block;
		position: fixed;
		top: 0;
		right: 0;
		width: 670rpx;
		bottom: 0;
		z-index: 33;
		background-color: rgba(255, 255, 255, 1);
		padding: 100rpx 40rpx 140rpx 40rpx;
		box-sizing: border-box;
		transform: translateX(100%);
		transition: transform 0.3s ease;

	}

	.drawer-content-visible {
		z-index: 99999;
		transform: translateX(0px);
	}

	/* 侧滑菜单 遮罩层 */
	.drawer-mask {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition: opacity 0.3s;
	}

	.drawer-mask-visible {
		z-index: 99999;
		opacity: 1;
	}

	.drawer-content view {
		font-size: 20px;
		line-height: 1.5;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.recordTitle {

		position: fixed;
		left: 0;
		top: 10rpx;
		margin: 0;
		padding: 0 30rpx;
		width: 100%;
		height: 106rpx;
		font-size: 12rpx;
		color: #646464;
	}

	.recordButton {
		position: fixed;
		left: 30rpx;

		bottom: -10rpx;
		transform: translateY(-20rpx);
		height: 88rpx;
		width: calc(100% - 60rpx);
		border: none;
	}

	.closeButton {
		width: 100%;
		background-color: #fff;
		border: none;
		border: 2rpx #646464 solid;
	}

	.closeButton::after {
		border: none;
	}

	.recordCard {
		width: 100%;
		min-height: 160rpx;
	}

	.top-card {
		width: 100%;
		height: 50rpx;
		display: flex;
		align-items: center;
	}

	.passed {
		width: 50rpx;
		height: 50rpx;
		margin-right: 15rpx;

	}

	.name-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
		margin-top: 5rpx;

	}

	.card-right {

		height: 50rpx;
		display: flex;
		align-items: center;
		position: absolute;
		left: 0;
		transform:  translate(30rpx,-35rpx);

	}

	

	.mid-card {
		transform: translate(23rpx,-10rpx);
		width: calc(100% - 46rpx);
		min-height: 120rpx;
		border-left: 4rpx solid #00893d;
		padding-left: 20rpx;
		
	}

	.mid-card-1 {
	transform: translate(23rpx,-10rpx);
		width: calc(100% - 46rpx);
		min-height: 120rpx;
		border-left: 4rpx dashed #00893d;
		padding-left: 20rpx;
	}

	.data-card {
		width: 100%;
		height: 80rpx;
		display: flex;

		align-items: center;
		transform: translateY(20rpx);

	}

	.advice-card {
		padding-left: 20rpx;
		padding-right: 20rpx;
		width:700rpx;
		min-height: 64rpx;
		border-radius: 10rpx;

		background-color: #f6f7f8;
			

	}
</style>
