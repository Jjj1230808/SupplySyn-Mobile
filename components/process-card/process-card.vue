<template>
	<view  style="display: flex; flex-direction: row;" >
		
		<view v-if="processlist" class="process-c" v-for="(item , index) in processlist" :key="index" >
			<view v-if="processlist.length !== 5 "  class="sigle-process">
				<view style="display: flex;" >
					<!-- 后面添一个进行中 -->
					<view  v-if="processlist.length === 4 && item.approvalState===30 " :style=" index === 0  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(-56rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 4 && item.approvalState===20 " :style=" index === 0  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(-56rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 4 && item.approvalState===10 " :style=" index === 0  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #dde3e6 dashed;transform: translate(-56rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 3 && item.approvalState===30" :style=" index === 0  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : 'width: 110rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(-82rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 3 && item.approvalState===20" :style=" index === 0  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : 'width: 110rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(-82rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 3 && item.approvalState===10" :style=" index === 0  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : 'width: 110rpx;height: 4rpx;border-top: 5rpx #dde3e6 dashed;transform: translate(-82rpx,35rpx);'" ></view>
					<image v-if="item.approvalState===30"  class="passed"  src="../../static/img/passed.png" mode="widthFix"></image>
					<image v-if="item.approvalState===20"  class="passed" src="../../static/img/waiting-process.svg" mode="widthFix"></image>
					<image v-if="item.approvalState===10"  class="passed" src="../../static/img/loadingProcess.svg" mode="widthFix"></image>
					
					<!-- <view  v-if="processlist.length === 4 && item.approvalState===30 " :style=" index === processlist.length-1  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(56rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 4 && item.approvalState===10 " :style=" index === processlist.length-1  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #dde3e6 dashed;transform: translate(56rpx,35rpx);'" ></view> -->
					
					
				</view>
				<text  v-if="item.approvalState===30" style="font-size: 28rpx; color: #646464;">{{item.itemName}}</text>
				<text  v-if="item.approvalState===20" style="font-size: 28rpx; color: #646464;">{{item.itemName}}</text>
				<text  v-if="item.approvalState===10" style="font-size: 28rpx; color: #9ca2a5;">{{item.itemName}}</text>
			</view>
			
			<view v-if="processlist.length === 5 "  class="sigle-process-5">
				<view style="display: flex;transform: translateX(10px);" >
					<!-- 后面添一个进行中 -->
					<view  v-if=" item.approvalState===30 " :style=" index === 0  ? 'width: 60rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : ' width: 60rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(-56rpx,35rpx);'" ></view>
					<view  v-if=" item.approvalState===20 " :style=" index === 0  ? 'width: 60rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : ' width: 60rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(-56rpx,35rpx);'" ></view>
					<view  v-if="item.approvalState===10 " :style=" index === 0  ? 'width: 60rpx;height: 2rpx;background-color: white;transform: translate(-52rpx,35rpx);' : ' width: 60rpx;height: 4rpx;border-top: 5rpx #dde3e6 dashed;transform: translate(-56rpx,35rpx);'" ></view>
					<image v-if="item.approvalState===30"  class="passed"  src="../../static/img/passed.png" mode="widthFix"></image>
					<image v-if="item.approvalState===20"  class="passed" src="../../static/img/waiting-process.svg" mode="widthFix"></image>
					<image v-if="item.approvalState===10"  class="passed" src="../../static/img/loadingProcess.svg" mode="widthFix"></image>
					
					<!-- <view  v-if="processlist.length === 4 && item.approvalState===30 " :style=" index === processlist.length-1  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #00893d solid;transform: translate(56rpx,35rpx);'" ></view>
					<view  v-if="processlist.length === 4 && item.approvalState===10 " :style=" index === processlist.length-1  ? 'width: 110rpx;height: 2rpx;background-color: white;transform: translate(52rpx,35rpx);' : ' width: 110rpx;height: 4rpx;border-top: 5rpx #dde3e6 dashed;transform: translate(56rpx,35rpx);'" ></view> -->
					
					
				</view>
				<text  v-if="item.approvalState===30" style="font-size: 28rpx; color: #646464;">{{item.itemName}}</text>
				<text  v-if="item.approvalState===20" style="font-size: 28rpx; color: #646464;">{{item.itemName}}</text>
				<text  v-if="item.approvalState===10" style="font-size: 28rpx; color: #9ca2a5;">{{item.itemName}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			processlist: {
				type: Array,
				default: []
			}
		}
		
	}
</script>

<style>
	.process-c{
		height: 150rpx;
		width: 100%;
		background-color: #fff;
		padding: 0rpx;
		
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: flex-start;
	}
		
	.sigle-process{
		width: 190rpx;
		height: 120rpx;
		display: flex;
		flex-direction: column;
	align-items: center;
	justify-content: space-between;
	}
.sigle-process-5{
	
		width: 150rpx;
		height: 120rpx;
		display: flex;
		flex-direction: column;
	align-items: center;
	justify-content: space-between;
	}
	.passed{
	    width: 70rpx;
		height: 60rpx;
	
	transform: translateX(-50rpx);
	}
	
</style>