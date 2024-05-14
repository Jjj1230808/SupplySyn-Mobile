<template>
	<view v-if="show2" class="mark">
		<view class="location-choose">
			<image style="width: 220rpx;" src="../../static/img/assemblesuccesstips.svg" mode="widthFix"></image>
			<text v-if="isWithdraw === 'zp'" style="transform: translateY(-30rpx);font-size: 38rpx;font-weight: 1000">已成功完成装配!</text>
			<text  v-if="isWithdraw === 'rkqs'" style="transform: translateY(-30rpx);font-size: 38rpx;font-weight: 1000">签收成功！</text>
		
			<view class="back-home" @click="backHome()" >
				<span >返回主页</span>({{countdown}})
			</view>
			
		</view>
		
	</view>
</template>

<script>
		export default {
			// onShow(){
			// 	console.log('加载倒计时');
			// 	this.startCountDown()
			// },
			watch: {
				show2(newvalue,oldvalue){
					if(newvalue === true){
						console.log('加载倒计时');
						this.startCountDown()
					}
					
				}
			
				
			
			},
			data(){
				return{
					countdown:3,
					timer:''
				}
				
			},
				props: {
					show2:{
						type: Boolean,
						default: false
					},
					isWithdraw:{
						type: String,
						default: 'zp'
					}
					},
					methods:{
						backHome(){
							uni.reLaunch({
								url: '/pages/function/function'
							}),
					clearInterval(this.timer)
						},
						startCountDown(){
						this.timer = setInterval(()=>{
								if(this.countdown === 1){
									uni.reLaunch({
										url: '/pages/function/function'
									})
									clearInterval(this.timer);
								}else{
									this.countdown--
								}
							},1000)
						}
					}
			}
</script>

<style>
	.back-hometop{
		font-size: 32rpx;
		color: #646464;
		
	}
	.location-choose {
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 520rpx 80rpx;
		width: 580rpx;
		min-height: 400rpx;
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
		
	.back-home{
		text-decoration: underline;
		font-size: 32rpx;
		color: #646464;
	
	}
</style>