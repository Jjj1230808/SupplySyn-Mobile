<template>
	
	<view>
		
	
		<image style="width: 200rpx;display: block;margin:200rpx auto;" v-if="projectList.length===0"
			src="../../static/img/Not Found illustration.svg" mode=""></image>
		<view class="material-item" v-for="(item,index) in projectList" v-else>
<view v-if=" locationTitle ==='请选择退库单' || locationTitle ==='请选择入库签收' " class="right-number" style="position: absolute;right: 0;">
						{{item.returnTotal}} 
					</view>
<view v-if="locationTitle === '请选择报废单' || locationTitle ==='请选择报废签收'  " class="right-number" style="position: absolute;right: 0;">
											{{item.scrapTotal}}
										</view>
			<view class="material-info">
				<view v-if="locationTitle === '请选择项目'" style="display: flex;flex-direction: column; justify-content: space-between;">
					<view style="display: flex; color: #414546;">
						<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color: #414546;"
							src="../../static/img/project-logo.svg">
						</image>
						 {{"项目号 &nbsp;&nbsp;"}}
						<view style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);">
							{{item.projectCode}}
						</view>
						</view>
					</view>
					<view v-if="locationTitle === '请选择WBS'" style="display: flex;flex-direction: column; justify-content: space-between;">
						<view style="display: flex; color: #414546;">
							<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color: #414546;"
								src="../../static/img/wbs-bag.svg">
							</image>
							{{"WBS编号 &nbsp;&nbsp;"}}
							<view style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);">
								{{item.wbs}}
							</view>
							</view>
						</view>
				<view v-if="locationTitle === '请选择工位'" style="display: flex;flex-direction: column; justify-content: space-between;">
					<view style="display: flex; color: #414546;">
						<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color: #414546;"
							src="../../static/img/precision_manufacturing.svg">
						</image>
						 {{"工位号&nbsp;&nbsp;"}}
						<view style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);">
							{{item.stationNo}}
						</view>
						</view>
					</view>
					<view v-if="locationTitle === '请选择退库单' || locationTitle === '请选择入库签收'   " style="display: flex;flex-direction: column; justify-content: space-between;">
						<view style="display: flex; color: #414546;">
							<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color: #414546;"
								src="../../static/document-icon.svg">
							</image>
							 {{"退库单号 &nbsp;&nbsp;"}}
							 <view style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);">
							 	{{item.documentNo}}
							 </view>
							<!-- <view  v-if=" index.toString().length === 1" style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);"  decode>
								&emsp;&emsp;0{{index + 1}}
							</view>
							<view v-if="index.toString().length !== 1" style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);">
								{{index + 1}}
							</view> -->
							</view>
						</view>
					<view v-if="locationTitle === '请选择报废签收' || locationTitle ===  '请选择报废单'" style="display: flex;flex-direction: column; justify-content: space-between;">
						<view style="display: flex; color: #414546;">
							<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color: #414546;"
								src="../../static/document-icon.svg">
							</image>
							 {{"报废单号 &nbsp;&nbsp;"}}
							 <view style="font-size: 32rpx;font-weight: 700;color: #000; ">
							 	{{item.documentNo}}
							 </view>
							<!-- <view  v-if=" index.toString().length === 1" style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);"  decode>
								&emsp;&emsp;0{{index + 1}}
							</view>
							<view v-if="index.toString().length !== 1" style="font-size: 35rpx;font-weight: 700;color: #000; transform: translateY(-5rpx);">
								{{index + 1}}
							</view> -->
							</view>
						</view>
					<view v-if="item.lastAssembleTime !== null && locationTitle !== '请选择报废单'  && locationTitle !== '请选择退库单' && locationTitle !== '请选择入库签收' && locationTitle !== '请选择报废签收'" style="display: flex;color: #9ca2a5;margin-top: 50rpx;">
						<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color:#9ca2a5;"
							src="../../static/img/watch-disable.svg">
						</image>
						{{"上次装配 &nbsp;&nbsp;"}} {{item.lastAssembleTime | formatDate }}
					</view>

					<view v-if="item.lastAssembleTime === null" style="display: flex;color: #9ca2a5;margin-top: 50rpx;">
						<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color:#9ca2a5;"
							src="../../static/img/watch-disable.svg">
						</image>
						上次装配 -
					</view>
					<view v-if="item.documentState" style="display: flex;color: #9ca2a5;margin-top: 50rpx;">
						<image style="width: 32rpx;height: 32rpx; margin-top: 10rpx;color:#9ca2a5;transform: translateY(-3rpx);"
							src="../../static/img/watch-disable.svg">
						</image>
					{{"单据状态 &nbsp;&nbsp;"}}
						    <view  v-if="item.documentState !=='已完成' "  decode  style="font-size: 32rpx;font-weight: 700;color: #ff9800;"> {{item.documentState}} </view>
							 <view  v-if="item.documentState ==='已完成' "  decode  style="font-size: 32rpx;font-weight: 700;color: #00893d;"> {{item.documentState}} </view>
					</view>
					
					
				</view>
				<!-- <view @click="startLocation()"   class="back">
					<view style="color: #fff;font-size: 30rpx;">退回</view>
				</view> -->

				<view v-if="item.lastAssembleTime === null && currentRoute1 === '/pages/startToAssembly/startToAssembly' " >
					<button 
						style="font-size: 26rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;" @click="$noMultipleClicks(startLocation, item)">开始装配</button>
				</view>
				<view v-if="item.lastAssembleTime !== null && currentRoute1 === '/pages/startToAssembly/startToAssembly'">
					<button style="font-size: 30rpx;background-color:white;color: #00893d;font-weight: 700; position:absolute;top: 115rpx;right: 30rpx;"  @click="$noMultipleClicks(startLocation, item)">继续装配
						></button>
				</view>
				
				<view v-if="item.lastAssembleTime === null && currentRoute1 === '/pages/materialReturn/materialReturn' " >
					<button 
						style="font-size: 26rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;" @click="$noMultipleClicks(startLocation, item)">开始退回</button>
				</view>
				<view v-if="item.lastAssembleTime !== null && currentRoute1 === '/pages/materialReturn/materialReturn'">
					<button style="font-size: 30rpx;background-color:white;color: #00893d;font-weight: 700; position:absolute;top: 115rpx;right: 30rpx;"  @click="$noMultipleClicks(startLocation, item)">继续退回
						></button>
				</view>
				
				<view v-if="item.lastAssembleTime === null && currentRoute1 === '/pages/reprintLabel/reprintLabel' " >
					<button 
						style="font-size: 26rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;" @click="$noMultipleClicks(startLocation, item)">开始补打</button>
				</view>
				<view v-if="item.lastAssembleTime !== null && currentRoute1 === '/pages/reprintLabel/reprintLabel'">
					<button style="font-size: 30rpx;background-color:white;color: #00893d;font-weight: 700; position:absolute;top: 115rpx;right: 30rpx;"  @click="$noMultipleClicks(startLocation, item)">继续补打
						></button>
				</view>
				
				
				
				<view v-if="item.lastAssembleTime === null && currentRoute1 === '/pages/materialScrap/materialScrap' " >
					<button 
						style="font-size: 26rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;" @click="$noMultipleClicks(startLocation, item)">开始报废</button>
				</view>
				<view v-if="item.lastAssembleTime !== null && currentRoute1 === '/pages/materialScrap/materialScrap'">
					<button style="font-size: 30rpx;background-color:white;color: #00893d;font-weight: 700; position:absolute;top: 115rpx;right: 30rpx;"  @click="$noMultipleClicks(startLocation, item)">继续报废
						></button>
				</view>
				
				
				
				<view  v-if="locationTitle === '请选择报废单'   && item.documentState !=='已完成' || locationTitle === '请选择退库单'  && item.documentState !=='已完成'  ">
					<button style="font-size: 32rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;display: flex;align-items: center;justify-content: center;" @click="$noMultipleClicks(startLocation, item)"> <text >查看</text> </button>
				</view>
			
			
			<view v-if="currentRoute1 === '/pages/returnList/returnList'  && item.documentState !=='已完成' || currentRoute1 === '/pages/scrapList/scrapList'  && item.documentState !=='已完成'  " >
				<button 
					style="font-size: 30rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;display: flex;align-items: center;justify-content: center;" @click="$noMultipleClicks(startLocation, item)">查看</button>
			</view>
			
			
			<view v-if="item.lastAssembleTime === null &&currentRoute1 === '/pages/scrapSign/scrapSign' " >
				<button 
					style="font-size: 26rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;" @click="$noMultipleClicks(startLocation, item)">开始签收</button>
			</view>
			<view v-if="item.lastAssembleTime !== null  &&  currentRoute1 === '/pages/scrapSign/scrapSign' && item.documentState !=='已完成' ">
				<button style="font-size: 30rpx;background-color:white;color: #00893d;font-weight: 700; position:absolute;top: 115rpx;right: 30rpx;"  @click="$noMultipleClicks(startLocation, item)">继续签收
					></button>
			</view>
			<view v-if="item.lastAssembleTime === null &&currentRoute1 === '/pages/entrySign/entrySign' " >
				<button 
					style="font-size: 26rpx;background-color: #00893d;color: white; position:absolute;top: 110rpx;right: 30rpx;" @click="$noMultipleClicks(startLocation, item)">开始签收</button>
			</view>
			<view v-if="item.lastAssembleTime !== null  &&  currentRoute1 === '/pages/entrySign/entrySign' && item.documentState !=='已完成' ">
				<button style="font-size: 30rpx;background-color:white;color: #00893d;font-weight: 700; position:absolute;top: 115rpx;right: 30rpx;"  @click="$noMultipleClicks(startLocation, item)">继续签收
					></button>
			</view>
			
				
			</view>
			
			<scan-dialog :show="showError" imgUrl="Error.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
				:padding="76" :iconWidth="92" :text="message" maskClosable>
			</scan-dialog>
		</view>
		

</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'
	const printer = uni.requireNativePlugin('LcPrinter');
	const modal = uni.requireNativePlugin('modal');
	var globalEvent = uni.requireNativePlugin('globalEvent');
	import dateFormat, {
		masks
	} from "dateformat";
	export default {
		data() {
			return {
				noClick:true,
				showMessage: false,
				showError: false,
				message: '',
				packageNo: '',
				currentUrl:'',
				documentId:null
			};
		},
		emits: ['click', 'close'],
		props: {
			projectList: {
				type: Array,
				default: []
			},
			locationTitle: {
				type: String,
				default: ''
			},
			//传点击哪个页面的路由
			currentRoute1:{
				type: String,
				default: ''
			}
		},
		onLoad() {


		},
		mounted() {
			//console.log(this.projectList,this.locationTitle);
			// const projectList = this.projectList;
			// const locationTitle = this.locationTitle;
			//  const currentRoute1 = this.currentRoute1
			// console.log(this.currentRoute1);

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
			startLocation(item) {
	
				console.log(this.locationTitle)
				console.log(item)
				if (this.locationTitle === "请选择项目") {
					uni.navigateTo({
						url: `/pages/locationWBS/LocationWBS?item=${JSON.stringify(item)}&currentRoute1=${this.currentRoute1}`
					})
				} else if (this.locationTitle === "请选择WBS") {
					uni.navigateTo({
						url: `/pages/locationStation/locationStation?item=${JSON.stringify(item)}&currentRoute1=${this.currentRoute1}`
					})
				} 
				else if (this.locationTitle === "请选择工位" && ['/pages/returnList/returnList','/pages/scrapList/scrapList','/pages/entrySign/entrySign','/pages/scrapSign/scrapSign'].includes(this.currentRoute1)) {
								//四级页面的转跳
								//明天写 首先用那个拿到json的id的接口拿到参数，再用参数拿到四级页面的list 
								//扫码进入的页面也需要改
								console.log('单');
								uni.navigateTo({
									url: `/pages/locationDoc/locationDoc?item=${JSON.stringify(item)}&currentRoute1=${this.currentRoute1}`
								})
				}  else if (this.locationTitle === "请选择工位" && ['/pages/startToAssembly/startToAssembly','/pages/materialReturn/materialReturn','/pages/reprintLabel/reprintLabel','/pages/materialScrap/materialScrap'].includes(this.currentRoute1)) {
					let _this= this;
					uni.showLoading({
						title: '正在查询'
					})
 //调用接口，返回获取最终列表需要进入的字符串
										 let url1 = BaseApi + '/api/app/material/begin-assemble';
										
										 let data1 = {
											 projectCode:item.projectCode,
											 wbs:item.wbs,
											 stationNo:item.stationNo
										 }
										
										console.log(data1);
										 					
										 uni.request({
										 							url: url1,
										 							method: 'POST',
										 							data:data1,
										 							header: {
										 								'Authorization': 'Bearer ' + uni.getStorageSync("scToken"),
										 								'Content-Type': 'application/json;charset=utf-8'
										 							},
										 							success: (res) => {
										 								console.log(res)										 						
										 								if (res.data.statusCode !== 200) {
										 									_this.message = res.data.message
										 									// _this.showError = true
										 									// setTimeout(() => {
										 									// 	_this.showError = false
										 									// }, 3000)
										 									return
										 								} else {
										 						       console.log('拿到了ID get',res.data.data)
																	   console.log('拿到了route',this.currentRoute1)
																	   let codeStr = res.data.data
 																	   //有了id和currentroute 可以发送请求转跳了
																	   let request1 = new Promise((resolve, reject) => {
																	   	//退库
																	   	if(_this.currentRoute1=== '/pages/returnList/returnList'){
																	   			_this.currentUrl = BaseApi +'/api/app/material/return-material-data-sources/' + codeStr
																	   		}else 
																	   		//物料退回
																	   		if(_this.currentRoute1=== '/pages/materialReturn/materialReturn'){
																	   			_this.currentUrl = BaseApi + '/api/app/material/material-fallback-data-sources/' + codeStr
																	   	    }else
																			//物料报废
																			if(_this.currentRoute1=== '/pages/materialScrap/materialScrap'){
																	   			_this.currentUrl = BaseApi + '/api/app/material/material-scrap-data-sources/' + codeStr
																	   	    }else{
																	   		_this.currentUrl= BaseApi + `/api/app/material/designate-station/${codeStr}` 
																	   	}
																	   	console.log(_this.currentUrl)
																	   	uni.request({
																	   		url:_this.currentUrl,
																	   		method: 'GET',
																	   		header: {
																	   			'Authorization': 'Bearer ' + uni.getStorageSync(
																	   				"scToken"),
																	   			'Content-Type': 'application/json;charset=utf-8'
																	   		},
																	   		success: (res) => {
																	   			console.log(
																	   			res)
																	   			resolve(res);
																	   		},
																	   		fail: (err) => {
																	   			reject(err);
																	   		}
																	   	});
																	   });
																	   
																	   let request2 = new Promise((resolve, reject) => {
																	   	uni.request({
																	   		url: _this.currentRoute1 !== '/pages/returnList/returnList' ?
																	   			BaseApi + '/api/app/material/material-number/' + codeStr : BaseApi +
																	   			'/api/app/material/station-no/' + codeStr,
																	   		method: 'GET',
																	   		header: {
																	   			'Authorization': 'Bearer ' + uni.getStorageSync(
																	   				"scToken"),
																	   			'Content-Type': 'application/json;charset=utf-8'
																	   		},
																	   		success: (res) => {
																	   			resolve(res);
																	   			console.log(
																	   			res)
																	   		},
																	   		fail: (err) => {
																	   			reject(err);
																	   		}
																	   	});
																	   });
																	   
																	   Promise.all([request1, request2]).then(([res1, res2]) => {
																	   
																	   	if (res1.data.statusCode !== 200) {
																	   		uni.hideLoading()
																	   		_this.message = res1.data.message
																	   		_this.showError = true
																	   		
																	   		setTimeout(() => {
																	   			_this.showError = false
																	   		}, 3000)
																	   		return
																	   	} else if (res2.data.statusCode !== 200) {
																	   		uni.hideLoading()
																	   		_this.message = res2.data.message
																			console.log(_this.message );
																	   		_this.showError = true
																	   		
																	   		setTimeout(() => {
																	   			_this.showError = false
																	   		}, 3000)
																	   		return
																	   	} else {

																	   		console.log(res2)
																	   		
																	   		uni.navigateTo({
																	   			url: `${_this.currentRoute1}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}`,
																	   		})
																	   		uni.hideLoading()
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
											}
											//第四级页面 退库单
											else if (this.locationTitle === "请选择退库单"){
												console.log(item);
												let _this= this;
												
												_this.documentId = item.documentId;
														let request1 = new Promise((resolve, reject) => {
														setTimeout(()=>{
															uni.request({
																url: BaseApi +
															'/api/app/material/return-material-data-sources/' +
															item.documentId,
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
																	reject(err);
																	console.log('request1,失败');
																}
															});
														},500);
														
														});
														
														let request2 = new Promise((resolve, reject) => {
															uni.request({
																url:  BaseApi +
																	'/api/app/material/return-material-number/' + item.documentId,
																method: 'GET',
																header: {
																	'Authorization': 'Bearer ' + uni.getStorageSync(
																		"scToken"),
																	'Content-Type': 'application/json;charset=utf-8'
																},
																success: (res) => {
													
																	resolve(res);
																	console.log(res,"request2")
																},
																fail: (err) => {
																	console.log('request2,失败');
																	reject(err);
																}
															});
														});
														
														Promise.all([request1, request2]).then(([res1, res2]) => {
														
															if (res1.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res1.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else if (res2.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res2.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else {
																uni.hideLoading()
														console.log(_this.documentId);
														
														
																uni.navigateTo({
																	url: `${_this.currentRoute1}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.documentId)}`,
																})
																console.log(this.currentRoute1);
														
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
														
													
											}//第四级页面 报废单
											else if (this.locationTitle === "请选择报废单"){
												console.log(item);
												let _this= this;
												
												_this.documentId = item.documentId;
														let request1 = new Promise((resolve, reject) => {
														setTimeout(()=>{
															uni.request({
																url: BaseApi +
															'/api/app/material/scrap-material-data-sources/' +
															item.documentId,
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
																	reject(err);
																	console.log('request1,失败');
																}
															});
														},500);
														
														});
														
														let request2 = new Promise((resolve, reject) => {
															uni.request({
																url:  BaseApi +
																	'/api/app/material/scrap-material-number/' + item.documentId,
																method: 'GET',
																header: {
																	'Authorization': 'Bearer ' + uni.getStorageSync(
																		"scToken"),
																	'Content-Type': 'application/json;charset=utf-8'
																},
																success: (res) => {
											
																	resolve(res);
																	console.log(res,"request2")
																},
																fail: (err) => {
																	console.log('request2,失败');
																	reject(err);
																}
															});
														});
														
														Promise.all([request1, request2]).then(([res1, res2]) => {
														
															if (res1.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res1.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else if (res2.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res2.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else {
																uni.hideLoading()
														console.log(_this.documentId);
														
														
																uni.navigateTo({
																	url: `${_this.currentRoute1}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.documentId)}`,
																})
																console.log(this.currentRoute1);
														
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
														
													
											}//第四级页面 入库签收
											else if (this.locationTitle === "请选择入库签收"){
												console.log(item);
												let _this= this;
												
												_this.documentId = item.documentId;
														let request1 = new Promise((resolve, reject) => {
														setTimeout(()=>{
															uni.request({
																url: BaseApi +
															'/api/app/material/inbound-signing-data-sources/' +
															item.documentId,
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
																	reject(err);
																	console.log('request1,失败');
																}
															});
														},500);
														
														});
														
														let request2 = new Promise((resolve, reject) => {
															uni.request({
																url:  BaseApi +
																	'/api/app/material/inbound-signing-number/' + item.documentId,
																method: 'GET',
																header: {
																	'Authorization': 'Bearer ' + uni.getStorageSync(
																		"scToken"),
																	'Content-Type': 'application/json;charset=utf-8'
																},
																success: (res) => {
											
																	resolve(res);
																	console.log(res,"request2")
																},
																fail: (err) => {
																	console.log('request2,失败');
																	reject(err);
																}
															});
														});
														
														Promise.all([request1, request2]).then(([res1, res2]) => {
														
															if (res1.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res1.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else if (res2.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res2.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else {
																uni.hideLoading()
														console.log(_this.documentId);
														
														
																uni.navigateTo({
																	url: `${_this.currentRoute1}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.documentId)}`,
																})
																console.log(this.currentRoute1);
														
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
											}//第四级页面 报废签收
											else if (this.locationTitle === "请选择报废签收"){
												console.log("123");
												console.log(item);
												let _this= this;
												
												_this.documentId = item.documentId;
														let request1 = new Promise((resolve, reject) => {
														setTimeout(()=>{
															uni.request({
																url: BaseApi +
															'/api/app/material/scrap-receipt-data-sources/' +
															item.documentId,
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
																	reject(err);
																	console.log('request1,失败');
																}
															});
														},500);
														
														});
														
														let request2 = new Promise((resolve, reject) => {
															uni.request({
																url:  BaseApi +
																	'/api/app/material/scrap-signing-number/' + item.documentId,
																method: 'GET',
																header: {
																	'Authorization': 'Bearer ' + uni.getStorageSync(
																		"scToken"),
																	'Content-Type': 'application/json;charset=utf-8'
																},
																success: (res) => {
											
																	resolve(res);
																	console.log(res,"request2")
																},
																fail: (err) => {
																	console.log('request2,失败');
																	reject(err);
																}
															});
														});
														
														Promise.all([request1, request2]).then(([res1, res2]) => {
														
															if (res1.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res1.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else if (res2.data.statusCode !== 200) {
																uni.hideLoading()
																_this.message = res2.data.message
																_this.showError = true
														
																setTimeout(() => {
																	_this.showError = false
																}, 3000)
																return
															} else {
																uni.hideLoading()
														console.log(_this.documentId);
														
														
																uni.navigateTo({
																	url: `${_this.currentRoute1}?ListData=${JSON.stringify(res1.data.data)}&topData=${JSON.stringify(res2.data.data)}&DocumentId=${JSON.stringify(_this.documentId)}`,
																})
																console.log(this.currentRoute1);
														
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
											
						
				}
			}
		}
	
</script>

<style>
	/* 	.material-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 276rpx;
		padding-top: 20rpx;
		overflow: auto;
		padding-bottom: 130rpx;
		/* z-index: 9999 !important; */
	/* } */
		
	.right-number{
		color: #646464;
		width: 40rpx;
		height: 40rpx;
		background-color: #dde3e6;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0 25% 0 25%;
	}
	.material-label>view:nth-child(1)::after {
		display: block;
		clear: both;
		content: "";
	}

	.material-label>view:nth-child(1) {
		display: block;
	}

	.material-name-label {
		font-size: 30rpx;
		float: left;
		color: #9CA2A5;
	}

	.material-name-text {
		float: left;
		max-width: 400rpx;
		word-wrap: break-word;
		font-size: 30rpx
	}

	.material-item {
		width: calc( 100% - 20rpx );
		background-color: #fff;
		border-radius: 10rpx;
		margin: 0 10rpx 10rpx 10rpx;
		display: flex;
		position: relative;
	}

	.material-info {
		
		min-width: 380rpx;
		min-height: 200rpx;
		padding: 24rpx 0 24rpx 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	
	


	}

	.material-no {
	
		white-space: pre-line;
		float: left;
		max-width: 434rpx;
		word-wrap: break-word;
		font-size: 30rpx
	}

	.material-info::after {
		display: block;
		clear: both;
		content: "";
	}

	.material-type-regular {
		width: 110rpx;
		height: 110rpx;
		background: rgba(29, 155, 178, 0.10);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		float: left;
		margin-top: 5rpx;
	}

	.material-type-regular>view {
		position: absolute;
		bottom: 0;
		height: 38rpx;
		background-color: #1d9bb2;
		color: #fff;
		font-size: 30rpx;
		line-height: 38rpx;
		left: 0;
		right: 0;
		text-align: center;
	}

	.material-type-kanban {
		width: 110rpx;
		height: 110rpx;
		background: rgba(86, 180, 150, 0.10);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		float: left;
	}

	.material-type-kanban>view {
		position: absolute;
		bottom: 0;
		height: 38rpx;
		background: var(--Light-charts-chart-6, #56B496);
		color: #fff;
		font-size: 30rpx;
		line-height: 38rpx;
		left: 0;
		right: 0;
		text-align: center;
	}

	.material-label {
		float: left;
		font-size: 26rpx;
	}

	.material-label>view {
		display: flex;
		align-items: center;
		margin-left: 30rpx;
	}

	.material-qty {
		display: flex;
		align-items: center;
		height: 74rpx;
	}

	.material-qty>view {
		flex: 1;
		position: relative;
	}

	.material-qty>view>view:nth-child(1) {
		text-align: center;
		color: #9CA2A5;
		font-size: 30rpx;
	}

	.material-qty>view>view:nth-child(2) {
		text-align: center;
		color: #414546;
		font-size: 30rpx;
	}

	.material-qty>view>span {
		position: absolute;
		right: 0;
		top: 12rpx;
		height: 34rpx;
		width: 1rpx;
		background-color: #DDE3E6;
	}

	.material-action {
		border-top: 1px solid #CED5DA;
		display: flex;
		align-items: center;
		justify-content: right;
		padding: 24rpx;
		margin-top: 12rpx;
	}

	.back {
		display: flex;
		align-items: center;
		width: 108rpx;
		height: 50rpx;
		background: #E62C27;
		padding: 0 12rpx;
		border-radius: 4rpx;
		justify-content: center;
	}

	.done {
		display: flex;
		align-items: center;
		min-width: 185rpx;
		height: 50rpx;
		background: rgba(18, 155, 73, 0.10);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.to-do {
		display: flex;
		align-items: center;
		height: 50rpx;
		min-width: 185rpx;
		background-color: rgba(252, 207, 70, 0.2);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.returned {
		display: flex;
		align-items: center;
		width: 200rpx;
		height: 50rpx;
		background: rgba(255, 152, 0, 0.15);
		padding: 0 12rpx;
		border-radius: 4rpx;
	}

	.to-do-disable {
		display: flex;
		align-items: center;
		min-width: 185rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		background: rgba(156, 162, 165, 0.10);
	}

	button {
		margin: unset;
		padding: unset;
		width: 144rpx; 
		height: 64rpx;

	}

	button:after {
		border: unset;

	}
</style>
