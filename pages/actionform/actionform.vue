<template>
	<view>
		<navbar :userName="userName"></navbar>
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
		<uni-forms ref="form" :model="formData" :rules="rules">
			<view class="form1 formbgc">
				<fui-input v-model="projectname" :borderBottom="false" label="项目号" disabled>
				</fui-input>
				<fui-input v-model="task" borderTop label="任务" disabled>
				</fui-input>

				<fui-input required v-model="formData.actionclass" name="actionclass" borderTop :borderBottom="false"
					label="Action类别" disabled>
					<view class="uni-list">
						<view class="uni-list-cell">

							<view class="uni-list-cell-db">
								<picker @change="bindPickerChange2" :value="index2" :range="actionType"
									range-key="text">
									<view style="font-size: 16px;" class="uni-input">{{actionType[index2].text}}</view>
								</picker>
							</view>
						</view>
					</view>
					<uni-icons type="forward"></uni-icons>
				</fui-input>
			</view>
			<view class="form2 formbgc">
				<fui-input @click="selNum" v-model="baseNum" :borderBottom="false" label="工位号" placeholder="请选择"
					disabled>
					<uni-icons type="forward"></uni-icons>
				</fui-input>
				<!-- <fui-input v-model="baseInfo" label="工位描述" placeholder="请输入">
				</fui-input> -->
				<fui-textarea flexStart label="工位描述" borderTop v-model="baseInfo" placeholder="请输入工位描述...">
				</fui-textarea>

			</view>
			<view class="form3 formbgc">
				<!-- 标题 -->
				<view class="">
					<fui-input v-model="formData.actionTitle" name="actionTitle" :borderBottom="false" required
						label="Action标题" placeholder="请输入">
						<!-- <uni-icons type="forward"></uni-icons> -->
						<!-- <textarea name="" id="" cols="30" rows="10"></textarea> -->
					</fui-input>
				</view>
				<!-- 优先级 -->
				<fui-input required label="优先级" borderTop :borderBottom="false" v-model="priority" disabled>
					<view class="uni-list">
						<view class="uni-list-cell">

							<view class="uni-list-cell-db">
								<picker @change="bindPickerChange" :value="index1" :range="priorityList"
									range-key="text">
									<view style="font-size: 16px;" class="uni-input">{{priorityList[index1].text}}
									</view>
								</picker>
							</view>
						</view>
					</view>
					<uni-icons type="forward"></uni-icons>
				</fui-input>

				<!-- 完成日期 -->
				<view class="">
					<fui-input style="width:380px ;" v-model="date" borderTop :borderBottom="false" disabled required
						label="完成日期" placeholder="请选择">
						<!-- <uni-icons type="forward"></uni-icons> -->
						<view class="uni-list-cell">
							<picker mode="date" :value="date" @change="bindDateChange">
								<view class="uni-input">
									<evan-icons style="font-size: 20px;margin-right: -20px;" type="calendar">
									</evan-icons>
								</view>
							</picker>
							<!-- </view> -->
						</view>
					</fui-input>

				</view>
				<!-- 执行人 -->
				<view class="">
					<!-- <fui-input @click="selExecu" required v-model="executor" label="执行人" placeholder="请选择" disabled>
						<uni-icons type="forward"></uni-icons>
					</fui-input> -->
					<fui-textarea required height="30px" @click="selExecu" :borderBottom="false" flexStart label="执行人"
						placeholder="请选择" disabled>
						<uni-list style="top: -15px;" :border="false" v-if="executor.length">
							<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon" :border="false"
								:title="item.name" v-for="(item,index) in executor" :key="index">
							</uni-list-item>

						</uni-list>
						<!-- <uni-list style="top: -15px;" :border="false">
							<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon" :border="false"
								title="liushuaishuai">
							</uni-list-item>
						</uni-list> -->
						<uni-icons type="forward"></uni-icons>
					</fui-textarea>
				</view>
				<!-- action内容 -->
				<view class="">
					<!-- <fui-input v-model="actionContent" required label="Action内容" placeholder="请输入">
						
					</fui-input> -->
					<fui-textarea flexStart required label="Action内容" v-model="actionContent"
						placeholder="请输入Action内容...">
					</fui-textarea>
				</view>
			</view>
			<view class="form4 formbgc">
				<fui-input label="图片上传" disabled :borderBottom="false">
					<!-- <uni-icons type="forward"></uni-icons> -->
					<!-- <textarea name="" id="" cols="30" rows="10"></textarea> -->
				</fui-input>
				<!-- 上传插件 -->
				<!-- <uni-file-picker v-model="" title="" limit="" file-mediatype=""></uni-file-picker> -->
				<!-- <mk-upload :imgList="imgList" column="3" @onDelete="onDelete" @onChoose="onChoose" /> -->
				<htz-image-upload style="margin-left: 10px;margin-bottom: 20px;" :dataType="0" @imgDelete="delPhoto"
					:headers="{Authorization}" :max="30" v-model="ceshiData" @uploadSuccess="ceshiUploadSuccess"
					:action="oSSUrl">
				</htz-image-upload>
			</view>
			<view class="tool-btn">
				<button style="width: 40%; z-index: 9;  " type="default" @click="backToScan">返回</button>
				<button style="width: 60%;  z-index: 9; color: #fff; background-color: #00893d; " type="default"
					@click="submitAction">提交</button>
			</view>
		</uni-forms>

	</view>
</template>

<script>
	import mkUpload from "@/components/mk-upload/mk-upload.vue"
	import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue'
	// import dateFormat
	// let dateFormat = require("format-datetime")
	export default {
		components: {
			mkUpload,
			htzImageUpload
		},

		data() {
			return {
				formData: {
					actionclass: '10',
					actionTitle: ''
				},
				oSSUrl: this.$Api.gateway + '/app/ali-cloud-oSS/up-load-attachment2OSS',

				userName: '',

				ceshiData: [],
				Authorization: '',
				projectname: '',
				assigns: [],
				task: '',
				taskId: '',
				projectId: '',
				baseNum: '',
				baseInfo: '',
				priority: '100',
				finishDate: '',
				executor: [],
				executorId: '',
				actionContent: '',
				projectId: '',
				date: '',
				actionType: [],

				index1: 1,
				index2: 0,
				priorityList: [],

				imgList: [],
				rules: {
					actionclass: {
						rules: [{
							required: true,
							errorMessage: '请选择Action类别',
						}]
					},
					actionTitle: {
						rules: [{
							required: true,
							errorMessage: '请输入Action标题',
						}]
					}
				},
				imgLists: [],
				msgType: '',
				messageText: '',
				extraIcon: {
					color: '#00893d',
					size: '20',
					type: 'person-filled'
				}

			}
		},
		onLoad(options) {
			const res = JSON.parse(decodeURIComponent(options.res))

			console.log(res);
			this.userName = uni.getStorageSync('userName')
			this.projectname = res.data.data.projectCode
			this.task = res.data.data.taskName
			this.projectId = res.data.data.projectId
			this.actionType = res.data.data.actionTypes
			this.priorityList = res.data.data.priorities,
				this.taskId = res.data.data.taskId,
				this.projectId = res.data.data.projectId,
				this.Authorization = "Bearer " + uni.getStorageSync("scToken")
		},
		computed: {

		},
		methods: {
			ceshiUploadSuccess(res) { //上传成功
				/****************
				因为上传接口返回的结构不一致，所以以下代码需要根据实际的接口返回结构开发，在此只是展示如果给数组里添加的过程，仅供参考
				***************/
				console.log(res);
				// console.log(res.data[0]);
				// console.log(typeof res.data[0]);
				var _res = JSON.parse(res);
				console.log(_res);
				for (let i in _res) {
					_res[i].name = _res[i].name.slice(-19)
				}
				console.log(_res);
				this.imgLists.push(_res[0])
				console.log(this.imgLists);
				console.log(_res[0].fileUrl);
				this.ceshiData.push(_res[0].fileUrl);

				console.log(this.ceshiData);
				/*******************************/
			},
			delPhoto(res) {
				console.log(res);
				// let newimgList=this.imgLists
				this.imgLists.forEach((item, index) => {
					console.log(item.id);
					console.log(res);
					if (item.id == res) {
						this.imgLists.splice(index, 1)
					}
					// return item ? item.id != res : null
				})
				// this.imgLists.filter((item) => {
				// 	console.log(item.id);
				// 	console.log(res);

				// 	return item.id != res

				// })
				console.log(this.imgLists);
			},
			backToScan() {
				uni.redirectTo({
					url: '/pages/scanQR/scanQR'
				})
			},
			submitAction() {

				// let url = 'https://kimigateway.schaefflercn.com/sc/gateway/api/app/kimi-project-task-action'
				let url = this.$Api.gateway + '/app/kimi-project-task-action'
				console.log(url);
				let actionForm = {

					"taskId": this.taskId,

					"projectId": this.projectId,

					"title": this.formData.actionTitle,

					"priority": this.priority,

					"targetDate": this.date,

					"actionType": this.formData.actionclass,

					"stationNo": this.baseNum || "",

					"stationDescription": this.baseInfo,

					// "parentId": this.originalData.parentId,

					"remark": this.actionContent,

					"status": 'To Do',

					"assigns": this.assigns,
					"attachments": this.imgLists
				}
				let that = this
				console.log(actionForm);
				console.log(this.date);
				// 表单校验
				if (this.formData.actionclass == '' || this.formData.actionTitle == '' || this.date == '' || this
					.executor.length == 0 || this.actionContent == '') {
					uni.showToast({
						title: '请检查必填项！',
						icon: "error"
					})
				} else {
					uni.showModal({
						title: '确认提交吗？',
						//交换确认取消位置，满足用户习惯
						confirmText: '取消',
						cancelText: '确定',
						success(res) {
							console.log(actionForm);
							if (res.cancel) {
								uni.showLoading({
									title: '正在提交'
								})
								uni.request({
									url: url,
									method: "POST",
									data: actionForm,
									header: {
										"Authorization": "Bearer " + uni.getStorageSync("scToken")
									},
									success(ress) {
										console.log(ress);
										if (ress.data.succeeded) {
											uni.hideLoading()
											uni.redirectTo({
												url: '/pages/successpage/successpage',
											})
										} else {
											uni.hideLoading()
											let errmsg = ress.data.Message
											that.msgType = 'error'
											that.messageText = errmsg
											that.$refs.message.open()
											setTimeout(() => {

												uni.navigateTo({
													url: '/pages/failpage/failpage'
												})
											}, 3000)

										}
										console.log(ress);
										// uni.showToast({
										// 	title: '成功'
										// })
									},
									fail: (ress) => {
										uni.hideLoading()
										console.log(ress);
									}
								})
							}
						}
					})
				}




			},
			async selNum() {
				uni.$on('handleBasenumClick', res => {
					this.baseNum = res
					uni.$off('handleBasenumClick')
				})
				uni.navigateTo({
					url: `/pages/selectpages/basenum/basenum?projectId=${this.projectId}`
				})
			},
			async selAction() {
				uni.$on('handleActionClick', res => {
					this.actionclass = res
					uni.$off('handleActionClick')
				})
				uni.navigateTo({
					url: '/pages/selectpages/actionsel/actionsel'
				})
			},
			async selExecu() {
				uni.$on('handleExeClick', res => {
					this.assigns = []
					// this.executor = res.name
					res.forEach((item) => {
						let exec = {
							userId: item
						}
						this.assigns.push(exec)
					})
					// this.assigns.push(exec)
					// console.log(this.assigns);
					// this.executorId = res.id
					// this.assigns = res
					console.log(res);
					console.log(this.assigns);
					uni.$off('handleExeClick')
				})
				uni.$on('handleFullInfo', ress => {
					this.executor = []
					ress.forEach(item => {
						this.executor.push(item)
					})
					console.log(this.executor);
					uni.$off('handleFullInfo')
				})
				// if (this.executor) {
				// 	uni.$emit('alreadyExe', this.executor)
				// }
				uni.navigateTo({
					url: `/pages/selectpages/selexecutor/selexecutor?projectId=${this.projectId}&alreadyList=${encodeURIComponent(JSON.stringify(this.executor))}`
				})
			},
			selectitem(index, item) {
				console.log(item)
				if (index >= 0) {
					this.priority = item.value;
					uni.showToast({
						title: this.priority
					})
				} else {
					this.priority = ""
				}
			},

			submit(e) {
				uni.showToast({
					title: JSON.stringify(e.detail.value)
				})
				this.$refs.form.validate().then(res => {
					console.log('表单数据信息：', res);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为' + this.priorityList[e.detail.value].value, e.detail.value)
				this.index1 = e.detail.value
				this.priority = this.priorityList[e.detail.value].value
				console.log(this.priority);
			},
			bindPickerChange2: function(e) {
				console.log(e.detail);
				console.log('picker发送选择改变，携带值为' + this.actionType[e.detail.value].value, e.detail.value)
				this.index2 = e.detail.value
				this.formData.actionclass = this.actionType[e.detail.value].value
				console.log(this.formData.actionclass);
			},
			bindDateChange: function(e) {
				this.date = e.detail.value
				console.log(this.date);
				// console.log(dateFormat(this.date, 'YYYY-MM-DD'));
			},
			// 上传的逻辑
			onDelete(index) {
				console.log(index)
				//删除成功回调后执行 只做演示
				uni.showLoading({
					title: '删除中'
				});
				setTimeout(() => {
					this.imgList.splice(index, 1);
					wx.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 1000
					});
				}, 1000);
			},
			onChoose(e) {
				console.log(e)
				//上传成功后回调执行push  只做演示
				uni.showLoading({
					title: '上传中'
				});
				setTimeout(() => {
					const tempFilePaths = e.tempFilePaths;
					this.imgList.push(tempFilePaths[0]);
					uni.hideLoading();
				}, 1000);
			},
			onPreviewTake(index) {
				console.log(index)
				wx.showActionSheet({
					itemList: ['预览图片', '删除图片'],
					success(res) {
						console.log(res.tapIndex)
					},
					fail(res) {
						console.log(res.errMsg)
					}
				})
			},
			// onDeleteTake(index){
			//  console.log(index)
			//  wx.showToast({
			//      title: '删除事件被接管,请根据自己的需求自定义吧',
			//      icon: 'none',
			//      duration: 1000
			//  });
			// }
		}

	}
</script>

<style lang="scss" scoped>
	// page {
	// 	padding-bottom: 64px;
	// }

	.uni-list-cell::after {
		position: unset;
	}

	.sele-pick {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;

		.label {
			width: 150rpx;
		}
	}

	/deep/.uni-picker-container .uni-picker-action .uni-picker-action-confirm {
		color: #00893d;
	}

	/deep/.fui-textarea-placeholder {
		overflow: hidden;
	}

	.uni-list:after {
		content: none;
		border: none;
	}

	// .uni-input {
	// 	font-size: 18px;
	// }

	.nopadding {
		padding: 0 6px;
	}

	// .uni-list-cell-left {
	// 	height: 40px;
	// 	font-size: 16px;
	// 	line-height: 40px;
	// }

	/deep/.uni-input {
		height: 8px;
		line-height: 8px;
	}

	.formbgc {
		background-color: #fff;
		margin-top: 10rpx;

	}

	.form4 {
		margin-bottom: 20px;
	}

	/deep/ .uni-list-item__content-title {
		font-size: 16px;
	}

	uni-button:after {
		border-radius: 0;
	}

	uni-button {
		border-radius: 0;
	}

	.tool-btn {
		position: -webkit-sticky;
		position: sticky;
		bottom: var(--window-bottom);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// bottom: 0;
		// left: 0;
		height: 46px;
		width: 100%;
		z-index: 999;
		background-color: #fff;
		// border: 1px #646464 solid;
	}

	// .form1 {
	// 	margin-top: 0rpx;
	// }
</style>
