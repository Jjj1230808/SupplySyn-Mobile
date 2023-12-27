<script>
	import {
		BaseApi
	} from './kevinrong-http/baseApi.js'
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')

		},
		created() {
			console.log('开始计时刷新token')
			this.refreshToken()
		},
		onLoad: function() {

		},
		methods: {
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
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import './common/uni.css';
	@import "@/static/iconfont.css";

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	uni-page-body,
	page {
		width: 100%;
		height: 100%;
	}


	// /deep/.uni-scroll-view::-webkit-scrollbar {
	// 	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	// 	display: none
	// }

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
