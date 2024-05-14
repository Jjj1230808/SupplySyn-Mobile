<template>
	<view v-if="show" class="mark">
		<view class="location-choose">
			<image style="height: 200rpx;" src="../../static/img/assemblefailtips.svg" mode="heightFix"></image>
			<text style="transform: translateY(-30rpx);font-size: 38rpx;font-weight: 1000">啊偶，出错了!</text>
			<view class="back-hometop"  >
				<span >请返回重试</span>
			</view>
			<view class="backRetry" @click="backdialog()">返回重试</view>
			<view class="back-home" @click="backHome()" >
				<span >返回列表</span>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import {
		BaseApi
	} from '../../kevinrong-http/baseApi.js'
		export default {
			// onShow(){
			// 	console.log('加载倒计时');
			// 	this.startCountDown()
			// },
			
			data(){
				 return { 
					show:false
				 }
				
			},
			
				props: {
					show3:{
						type: Boolean,
						default: false
					}
					},
					watch:{
						show3(newval,oldval){
							if(newval === true){
										this.show = true
							}
							
							
							
						
						}
					},
					methods:{
						backHome(){
							uni.redirectTo({
								url: '/pages//returnList/returnList'
							})
						},
						backdialog(){
					this.show = false
					this.sendMsg()
						},
						sendMsg() {
							//子传父
							this.$emit('sonmsg',this.show);
						
						}
					}
			}
</script>

<style>
	.location-choose {
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 520rpx 80rpx;
		width: 580rpx;
		min-height: 550rpx;
	    padding: 60rpx 30rpx;
		background-color: white;
		position: fixed;
		z-index: 9998;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}
	
	
	.mark {
		z-index: 9999;
		position: absolute;
		height: 500%;
		background: rgba(0, 0, 0, 0.5);
		left: 0%;
		right: 0%;
		top: 0%;
		font-size: 26rpx;
		text-align: center;
		box-shadow: 2px -3px 100px -5px #FFFFFF;
	
	}
		
	.back-hometop{
		font-size: 32rpx;
		color: #646464;
		
	}
	.back-home{
		text-decoration: underline;
		font-size: 30rpx;
		color: #646464;

	
	}
	.backRetry{
		font-size: 32rpx;
		color: #00983d;
		width: 212rpx;
		height: 70rpx;
		border-radius: 10rpx;
		border: 3rpx solid #00983d ;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30rpx;
		margin-top: 30rpx;
	}
</style>