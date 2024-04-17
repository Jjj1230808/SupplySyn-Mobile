<template>
	<view class="">
		<image style="width: 200rpx;display: block;margin:200rpx auto;" v-if="materialList.length===0"
			src="../../static/img/Not Found illustration.svg" mode=""></image>
		<view v-for="(item,index) in materialList">
	
	
	<view class="material-item-red" v-if=" item.approvalopinion !== undefined && item.approvalopinion !== null && cardtitle == '开始装配' ">
		<view class="material-info">
			<view class="material-type-regular" v-if="item.materialType===10">
				<image style="width: 64rpx;height: 64rpx;" src="../../static/img/Frame.svg" mode=""></image>
				<view>常规件</view>
			</view>
			<view class="material-type-kanban" v-if="item.materialType===20">
				<image style="width: 64rpx;height: 64rpx;" src="../../static/img/kanban.svg" mode=""></image>
				<view>看板件</view>
			</view>
			<view class="material-label">
				<view>
					<view class="material-name-label">物料名称：</view>
					<view class="material-name-text">{{item.materialName}}</view>
	
				</view>
				<view>
					<view class="material-name-label">物料编号：</view>
	
					<view class="material-no">{{item.materialNo}}</view>
				</view>
				<view>
					<view class="material-name-label">物料位置：</view>
	
					<view class="material-no">
						{{item.workshopAreaName}}{{item.materialCarNo? '-'+item.materialCarNo :''}}{{ item.materialBoxNo?'-'+item.materialBoxNo : ''}}
					</view>
				</view>
			</view>
		</view>
		<view class="material-qty">
			<view>
				<view>领料数量 </view>
				<view v-if="item.totalQuantity === 0" style="color: #9ca2a5">{{item.totalQuantity}}</view>
				<view v-if="item.totalQuantity > 0" style="color: #414546">{{item.totalQuantity}}</view>
	
				<span></span>
			</view>
			<view>
				<view>装配数量 </view>
				<view v-if="item.quantityUsed === 0" style="color: #9ca2a5">{{item.quantityUsed}}</view>
				<view v-if="item.quantityUsed > 0" style="color: #00893d;">{{item.quantityUsed}}</view>
				<span></span>
			</view>
			<view>
				<view>退库数量 </view>
				<view v-if="item.returnQuantity === 0" style="color: #9ca2a5">{{item.returnQuantity}}</view>
				<view v-if="item.returnQuantity > 0" style="color: #FF9800;">{{item.returnQuantity}}</view>
				<span></span>
			</view>
			<view>
				<view>报废数量 </view>
				<view v-if="item.scrapQuantity === 0" style="color: #9ca2a5">{{item.scrapQuantity}}</view>
				<view v-else style="color: #e62c27;">{{item.scrapQuantity}}</view>
			</view>
		</view>
		<view class="material-action">
	
	
	
	
		<!-- 	<view
				v-if=" cardtitle ==='入库签收' && item.signState == 30 || cardtitle ==='报废签收' && item.signState == 30"
				class="to-do-disable">
				<image src="../../static/img/check_circle.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">已拒签</view>
	
			</view>
	
			<view
				v-if=" cardtitle ==='入库签收' && item.signState == 20 || cardtitle ==='报废签收' && item.signState == 20"
				class="to-do-disable">
				<image src="../../static/img/check_circle.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">已签收</view>
	
			</view> -->
	
	
			<view v-if="['开始装配'].includes(cardtitle) && item.remainingQuantity <= 0" class="to-do-disable">
				<image src="../../static/img/check_circle.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待装配</view>
				<view style="color: #646464;font-size: 30rpx;">
					{{item.remainingQuantity<0? 0:item.remainingQuantity}}
				</view>
			</view>
			<view v-if="['开始装配'].includes(cardtitle) && item.remainingQuantity > 0 " class="to-do">
				<image src="../../static/img/watch_later.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待装配</view>
				<view style="color: #F2B704;font-size: 30rpx;">{{item.remainingQuantity}}</view>
			</view>
			<view v-if="cardtitle === '物料退回' " class="done">
				<image src="../../static/img/check_circle_active.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">已装配</view>
				<view style="color: #129B49;font-size: 30rpx;">{{item.quantityUsed}}</view>
			</view>
			<view v-if="cardtitle === '退库' && item.remainingQuantity > 0  " class="to-do">
				<image src="../../static/img/watch_later.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待处理</view>
				<view style="color: #f2b704;font-size: 30rpx;">{{item.remainingQuantity}}</view>
			</view>
			<view v-if="cardtitle === '退库' && item.remainingQuantity <= 0  " class="to-do-disable">
				<image src="../../static/img/check_circle.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待处理</view>
				<view style="color: #646464;font-size: 30rpx;">
					{{item.remainingQuantity<0? 0:item.remainingQuantity}}
				</view>
			</view>
			<view
				v-if="cardtitle === '入库签收' && item.signState == 10 || cardtitle === '报废签收' && item.signState == 10 "
				class="to-do">
				<image src="../../static/img/watch_later.svg"
					style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待签收</view>
				<view style="color: #f2b704;font-size: 30rpx;">{{item.returnQuantity}}</view>
			</view>
	
			<view v-if="cardtitle === '退库单' " class="returned">
				<image src="../../static/img/assignment_returned.svg"
					style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">退库</view>
				<view style="color: #FF9800;font-size: 30rpx;">{{item.returnQuantity}}</view>
			</view>
			<view v-if="cardtitle === '报废单' " class="scraped">
				<image src="../../static/img/scraped.svg" style="width: 30rpx;height: 30rpx;margin-right: 8rpx;"
					mode="">
				</image>
				<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">报废</view>
				<view style="color: red;font-size: 30rpx;">{{item.scrapQuantity}}</view>
	
			</view>
			<view @click="$noMultipleClicks(reprintLabel, item)"
				v-if="cardtitle === '物料报废' || cardtitle ==='退库' || cardtitle === '补打标签' ||cardtitle === '物料退回'|| cardtitle ==='退库单'|| cardtitle ==='报废单'|| cardtitle ==='入库签收' "
				class="print-label">
				<image src="../../static/img/print.svg" style="width: 32rpx;height: 28rpx;margin-right: 8rpx;"
					mode="">
				</image>
				<view style="margin-right: 8rpx;color: #00893d;font-size: 30rpx;">补打标签</view>
			</view>
			<view @click=" $noMultipleClicks(returnMaterial, item.materialId)"
				v-if="cardtitle ==='退库'  || cardtitle ==='物料报废'  " class="scrap-label">
	
				<view style="color: #fff;font-size: 30rpx;">物料报废</view>
			</view>
			<view @click="$noMultipleClicks(returnMaterial, item.materialId)"
				v-if="['物料退回'].includes(cardtitle)" class="back">
				<view style="color: #fff;font-size: 30rpx;">物料退回</view>
			</view>
			<!-- <view @click="$noMultipleClicks(returnMaterial, item.materialId)"
				v-if="['退库单','报废单'].includes(cardtitle)" class="back">
				<view style="color: #fff;font-size: 30rpx;">撤回物料</view>
			</view> -->
	
			<view @click="$noMultipleClicks(returnMaterial, item.materialId)"
				v-if="cardtitle ==='入库签收'  && item.signState == 10 || cardtitle ==='报废签收'  && item.signState == 10 "
				class="back">
				<view style="color: #fff;font-size: 30rpx;">拒绝签收</view>
	
			</view>
	
			<view @click="$noMultipleClicks(signMaterial, item.materialId)"
				v-if="cardtitle ==='报废签收'  && item.signState == 10 " class="back2">
				<view style="color: #fff;font-size: 30rpx;">确认签收</view>
			</view>
		</view>
		<view
			style="width:100%; min-height: 100rpx;padding: 0px 10px 8px 10px;  word-wrap:break-word; word-break:normal;"
			v-if="item.approvalopinion !== undefined && item.approvalopinion !== null && cardtitle == '开始装配' "
			>
	
			<view style="width:100%; min-height: 100rpx;background-color: #f6f7f8;padding: 10px;">
				<view style="display: flex;flex-direction:row;justify-content: space-between;" class="">
					<view  style="font-size: 32rpx;color: #e62c27;">拒签/撤回原因</view>
	
	
					<!-- <view  @click="showReason"  class="downarrow">
						<image v-if="!showReasonF"
							style="width: 25rpx;margin: 15rpx 10rpx 0 0 ;z-index: 999;"
							src="../../static/img/arrowDown.svg" mode="widthFix"></image>
					</view>
	
	
	
	
					<view  @click="showReason"  class="uparrow">
						<image v-if="showReasonF" style="width: 25rpx;margin: 15rpx 10rpx 0 0 ;z-index: 999;"
							src="../../static/img/arrowUp.svg" mode="widthFix"></image>
					</view> -->
	
				</view>
				<view  style="font-size: 32rpx;">
					{{item.approvalopinion}}
				</view>
			</view>
		</view>
	</view>
		
		
		
		<view class="material-item" v-if="item.approvalopinion === undefined ||  item.approvalopinion === null || cardtitle != '开始装配' ">
			<view class="material-info">
				<view class="material-type-regular" v-if="item.materialType===10">
					<image style="width: 64rpx;height: 64rpx;" src="../../static/img/Frame.svg" mode=""></image>
					<view>常规件</view>
				</view>
				<view class="material-type-kanban" v-if="item.materialType===20">
					<image style="width: 64rpx;height: 64rpx;" src="../../static/img/kanban.svg" mode=""></image>
					<view>看板件</view>
				</view>
				<view class="material-label">
					<view>
						<view class="material-name-label">物料名称：</view>
						<view class="material-name-text">{{item.materialName}}</view>
		
					</view>
					<view>
						<view class="material-name-label">物料编号：</view>
		
						<view class="material-no">{{item.materialNo}}</view>
					</view>
					<view>
						<view class="material-name-label">物料位置：</view>
		
						<view class="material-no">
							{{item.workshopAreaName}}{{item.materialCarNo? '-'+item.materialCarNo :''}}{{ item.materialBoxNo?'-'+item.materialBoxNo : ''}}
						</view>
					</view>
				</view>
			</view>
			<view class="material-qty">
				<view>
					<view>领料数量 </view>
					<view v-if="item.totalQuantity === 0" style="color: #9ca2a5">{{item.totalQuantity}}</view>
					<view v-if="item.totalQuantity > 0" style="color: #414546">{{item.totalQuantity}}</view>
		
					<span></span>
				</view>
				<view>
					<view>装配数量 </view>
					<view v-if="item.quantityUsed === 0" style="color: #9ca2a5">{{item.quantityUsed}}</view>
					<view v-if="item.quantityUsed > 0" style="color: #00893d;">{{item.quantityUsed}}</view>
					<span></span>
				</view>
				<view>
					<view>退库数量 </view>
					<view v-if="item.returnQuantity === 0" style="color: #9ca2a5">{{item.returnQuantity}}</view>
					<view v-if="item.returnQuantity > 0" style="color: #FF9800;">{{item.returnQuantity}}</view>
					<span></span>
				</view>
				<view>
					<view>报废数量 </view>
					<view v-if="item.scrapQuantity === 0" style="color: #9ca2a5">{{item.scrapQuantity}}</view>
					<view v-else style="color: #e62c27;">{{item.scrapQuantity}}</view>
				</view>
			</view>
			<view class="material-action">
		
		
		
		
				<view 
					v-if=" cardtitle ==='入库签收' && item.signState == 30 || cardtitle ==='报废签收' && item.signState == 30"
					class="to-do-red"   >
					<image src="../../static/img/redSign.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">已拒签</view>
		
				</view>
		
				<view
					v-if=" cardtitle ==='入库签收' && item.signState == 20 || cardtitle ==='报废签收' && item.signState == 20"
					class="to-do-disable" style="background-color: #e5f4e9;">
					<image src="../../static/img/greenSign.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">已签收</view>
		
				</view>
		
		
				<view v-if="['开始装配'].includes(cardtitle) && item.remainingQuantity <= 0" class="to-do-disable">
					<image src="../../static/img/check_circle.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待装配</view>
					<view style="color: #646464;font-size: 30rpx;">
						{{item.remainingQuantity<0? 0:item.remainingQuantity}}
					</view>
				</view>
				<view v-if="['开始装配'].includes(cardtitle) && item.remainingQuantity > 0 " class="to-do">
					<image src="../../static/img/watch_later.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待装配</view>
					<view style="color: #F2B704;font-size: 30rpx;">{{item.remainingQuantity}}</view>
				</view>
				<view v-if="cardtitle === '物料退回' " class="done">
					<image src="../../static/img/check_circle_active.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">已装配</view>
					<view style="color: #129B49;font-size: 30rpx;">{{item.quantityUsed}}</view>
				</view>
				<view v-if="cardtitle === '退库' && item.remainingQuantity > 0  " class="to-do">
					<image src="../../static/img/watch_later.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待处理</view>
					<view style="color: #f2b704;font-size: 30rpx;">{{item.remainingQuantity}}</view>
				</view>
				<view v-if="cardtitle === '退库' && item.remainingQuantity <= 0  " class="to-do-disable">
					<image src="../../static/img/check_circle.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待处理</view>
					<view style="color: #646464;font-size: 30rpx;">
						{{item.remainingQuantity<0? 0:item.remainingQuantity}}
					</view>
				</view>
				<view
					v-if="cardtitle === '入库签收' && item.signState == 10 || cardtitle === '报废签收' && item.signState == 10 "
					class="to-do">
					<image src="../../static/img/watch_later.svg"
						style="width: 28rpx;height: 28rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">待签收</view>
					<view v-if="cardtitle === '入库签收' && item.signState == 10" style="color: #f2b704;font-size: 30rpx;">{{item.returnQuantity}}</view>
					<view v-if="cardtitle === '报废签收' && item.signState == 10" style="color: #f2b704;font-size: 30rpx;">{{item.scrapQuantity}}</view>
				</view>
		
				<view v-if="cardtitle === '退库单' " class="returned">
					<image src="../../static/img/assignment_returned.svg"
						style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">退库</view>
					<view style="color: #FF9800;font-size: 30rpx;">{{item.returnQuantity}}</view>
				</view>
				<view v-if="cardtitle === '报废单' " class="scraped">
					<image src="../../static/img/scraped.svg" style="width: 30rpx;height: 30rpx;margin-right: 8rpx;"
						mode="">
					</image>
					<view style="margin-right: 8rpx;color: #646464;font-size: 30rpx;">报废</view>
					<view style="color: red;font-size: 30rpx;">{{item.scrapQuantity}}</view>
		
				</view>
				<view @click="$noMultipleClicks(reprintLabel, item)"
					v-if="cardtitle === '物料报废' || cardtitle ==='退库' || cardtitle === '补打标签' ||cardtitle === '物料退回'|| cardtitle ==='退库单'|| cardtitle ==='报废单'|| cardtitle ==='入库签收' "
					class="print-label">
					<image src="../../static/img/print.svg" style="width: 32rpx;height: 28rpx;margin-right: 8rpx;"
						mode="">
					</image>
					<view style="margin-right: 8rpx;color: #00893d;font-size: 30rpx;">补打标签</view>
				</view>
				<view @click=" $noMultipleClicks(returnMaterial, item.materialId)"
					v-if="cardtitle ==='退库'  || cardtitle ==='物料报废'  " class="scrap-label">
		
					<view style="color: #fff;font-size: 30rpx;">物料报废</view>
				</view>
				<view @click="$noMultipleClicks(returnMaterial, item.materialId)"
					v-if="['物料退回'].includes(cardtitle)" class="back">
					<view style="color: #fff;font-size: 30rpx;">物料退回</view>
				</view>
				<view @click="$noMultipleClicks(returnMaterial, item.materialId)"
					v-if="['退库单','报废单'].includes(cardtitle) && item.signState == 10" class="back">
					<view style="color: #fff;font-size: 30rpx;">撤回物料</view>
				</view>
		
				<view @click="$noMultipleClicks(returnMaterial, item.materialId)"
					v-if="cardtitle ==='入库签收'  && item.signState == 10 || cardtitle ==='报废签收'  && item.signState == 10 "
					class="back">
					<view style="color: #fff;font-size: 30rpx;">拒绝签收</view>
		
				</view>
		
				<view @click="$noMultipleClicks(signMaterial, item.materialId)"
					v-if="cardtitle ==='报废签收'  && item.signState == 10 " class="back2">
					<view style="color: #fff;font-size: 30rpx;">确认签收</view>
				</view>
			</view>
			
		</view>

		</view>

		<scan-dialog :show="showMessage" imgUrl="success.svg" :iconHeight="92" :outWidth="300" :outHeight="300"
			:padding="76" :iconWidth="92" text="提交成功" maskClosable>
		</scan-dialog>

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
				noClick: true,
				showMessage: false,
				showError: false,
				message: '',
				packageNo: '',
				showReasonF: true
			};
		},
		emits: ['click', 'close'],
		props: {
			materialList: {
				type: Array,
				default: []
			},
			cardtitle: {
				type: String,
				default: ''
			}
		},
		onLoad() {
			this.userName = uni.getStorageSync('userName')
			this.user = uni.getStorageSync('user')
			globalEvent.addEventListener('onPrintCallback', function(e) {
				console.log(e)
				uni.hideLoading()
				if (e.key == 0) {

				} else if (e.key == 3) {
					uni.showToast({
						title: '缺纸',
						icon: 'error'
					})
				}
			})

		},
		mounted() {
			const materialList = this.materialList

		},



		methods: {
			showReason() {
				this.showReasonF = !this.showReasonF,
					console.log(123);
			},
			printBagItem(item) {
				console.log(item)
				// if (item.size == 0) {
				// 	item.sizeName = '小料'
				// } else if (item.size == 1) {
				// 	item.sizeName = '中料'
				// } else if (item.size == 2) {
				// 	item.sizeName = '大料'
				// }
				let _this = this
				var date = new Date();
				var newdate = dateFormat(date, "yyyy-mm-dd HH:MM:ss");
				var user = this.user

				var ret = printer.initPrinter({});
				console.log(ret)





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
				// if (item.isUrgent == true && item.isSupplement) {
				// 	printer.printText2({
				// 		offset: 5,
				// 		fontSize: 4,
				// 		isBold: true,
				// 		isUnderLine: false,
				// 		content: `  后到料       *加急    ${item.sizeName}`
				// 	});
				// } else if (item.isUrgent == true && item.pickNum == 0) {
				// 	printer.printText2({
				// 		offset: 5,
				// 		fontSize: 4,
				// 		isBold: true,
				// 		isUnderLine: false,
				// 		content: `       *加急    ${item.sizeName}`
				// 	});
				// } else if (item.isUrgent == false && item.isSupplement) {
				// 	printer.printText2({
				// 		offset: 5,
				// 		fontSize: 4,
				// 		isBold: true,
				// 		isUnderLine: false,
				// 		content: `      后到料    ${item.sizeName}`
				// 	});
				// } else {
				// 	printer.printText2({
				// 		offset: 5,
				// 		fontSize: 4,
				// 		isBold: true,
				// 		isUnderLine: false,
				// 		content: `         ${item.sizeName}`
				// 	});
				// }
				// printer.printDashLine()
				printer.printQR2({
					offset: 100,
					height: 150,
					text: `{"Id":"${item.materialId}"}`
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
					content: 'PO/Item          '
				});

				// printer.setFontSize({
				// 	fontSize: 17
				// });
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.poItem}` + '\n'
				});
				// printer.printText({
				// 	content: 'Qty                '
				// });
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Qty                   '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.totalQuantity}` + '\n'
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Material           '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.materialNo}` + '\n'
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'MaterialName '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.materialName}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'WBS                 '
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
					content: 'Station             '
				});
				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.stationNo}` + '\n'
				});

				// printer.printText2({
				// 	offset: 0,
				// 	fontSize: 3,
				// 	isBold: false,
				// 	isUnderLine: false,
				// 	content: 'Location      '
				// });
				// printer.printText2({
				// 	offset: 0,
				// 	fontSize: 3,
				// 	isBold: true,
				// 	isUnderLine: true,
				// 	content: `${item.frameNo}\n`
				// });

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'BOM NO.        '

				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: ` ${item.bomno}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Bom Item        '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.bomItem}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Comment       '
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
					content: 'Packed By       '
				});


				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: true,
					isUnderLine: false,
					content: `${item.packedBy}` + '\n'
				});

				printer.printText2({
					offset: 0,
					fontSize: 3,
					isBold: false,
					isUnderLine: false,
					content: 'Assembler     '
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
			reprintLabel(item) {
				console.log('print');
				let _this = this;

				uni.showLoading({
					title: '正在打印'
				})
				let url = BaseApi + '/api/app/material/print-material-label?Mid=' + item.materialId
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

							setTimeout(() => {
								uni.hideLoading()
							}, 3000)
							_this.printBagItem(res.data.data)

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
				console.log('打印')
				this.$emit('click', {
					id: item.materialId
				})
			},
			returnMaterial(id) {
				console.log(id)
				this.$emit('returnMaterial', {
					id: id
				})
			},
			signMaterial(id) {
				console.log(id)
				this.$emit('signMaterial', {
					id: id
				})
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
		max-width: 350rpx;
		word-wrap: break-word;
		font-size: 30rpx
	}

	.material-item {

		background-color: #fff;
		border-radius: 10rpx;
		margin: 0 10rpx 10rpx 10rpx;
		border: 2px solid white;
	
	}
	.material-item-red {
	
		background-color: #fff;
		border-radius: 10rpx;
		margin: 0 10rpx 10rpx 10rpx;
		border: 2px solid red;
	
	}

	.material-info {
		padding: 24rpx;
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
		position: relative;
		height: 86rpx;
	}

	.back {
		display: flex;
		align-items: center;
		width: 148rpx;
		height: 50rpx;
		background: #E62C27;
		padding: 0 12rpx;
		border-radius: 4rpx;
		justify-content: center;
	}

	.back2 {
		display: flex;
		align-items: center;
		width: 148rpx;
		height: 50rpx;
		background: #00893d;
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
		position: absolute;
		left: 20rpx;

	}

	.returned {
		display: flex;
		align-items: center;
		min-width: 150rpx;
		height: 50rpx;
		background: rgba(255, 152, 0, 0.15);
		padding: 0 12rpx;
		position: absolute;
		left: 20rpx;
	}

	.scraped {
		display: flex;
		align-items: center;
		min-width: 150rpx;
		height: 50rpx;
		background: rgba(230, 44, 39, 0.15);
		padding: 0 10rpx;
		position: absolute;
		left: 20rpx;
	}

	.to-do-disable {
		display: flex;
		align-items: center;
		min-width: 185rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		background: rgba(156, 162, 165, 0.10);
		position: absolute;
		left: 20rpx;
	}
	.to-do-red{
		display: flex;
		align-items: center;
		min-width: 185rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		background:rgba(230, 4, 39, 0.10);
		position: absolute;
		left: 20rpx;
	}

	.print-label {
		display: flex;
		align-items: center;
		width: 190rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		color: #00893d;
		border: 1rpx solid #00893d;
		box-sizing: border-box;
		background-color: white;
	}

	.material-action>view:not(:last-child) {
		margin-right: 20rpx;
	}

	.scrap-label {

		display: flex;
		align-items: center;
		width: 148rpx;
		height: 50rpx;
		padding: 0 12rpx;
		border-radius: 4rpx;
		border: 1rpx solid #E62C27;
		box-sizing: border-box;
		background-color: #E62C27;
	}
	.downarrow{

		width: 30rpx;
		height: 30rpx;
	}
	.uparrow{

		width: 30rpx;
		height: 30rpx;
	}
</style>
