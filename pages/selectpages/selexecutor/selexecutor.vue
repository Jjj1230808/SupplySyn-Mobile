<template>
	<view>
		<navbar :userName="userName"></navbar>
		<view class="back">
			<view class="" @click="backTo">
				<uni-icons type="back" style="font-size: 31.25rpx;"></uni-icons>&nbsp;&nbsp;返回
			</view>
			<!-- <uni-search-bar @confirm="subeExe" @input="query" /> -->
			<view class="">
				<uni-search-bar class="uni-mt-10" radius="100" placeholder="搜索人员" clearButton="none" cancelButton="none"
					@confirm="subeExe" @input="query" v-model="keyWord" />
			</view>
			<view class="">
				<button class="submitbtn" @click="sendExe" type="default">确认</button>
			</view>
		</view>

		<!-- <uni-list style="font-size: 83.33rpx;">
			<uni-list-item clickable v-for="(item,index) in executorList" :key="index" :title="item.name" note=""
				@click="selAction(item)">
			</uni-list-item>

		</uni-list> -->
		<view class="uni-list">
			<checkbox-group @change="checkboxChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="item in List" :key="item.fullName">
					<view>
						<checkbox :value="item" color="#fff" :checked="item.checked" />
					</view>
					<view>
						<uni-icons type="person-filled" color="#646464" size="20"></uni-icons>
						{{item.fullName}}
					</view>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				executorList: [],
				keyWord: '',
				alreadyExeList: [],
				userName: ''
			};
		},
		onLoad(options) {
			// uni.$on('alreadyExe', ress => {
			// 	console.log(ress);
			// 	this.alreadyExeList = ress
			// 	console.log(this.alreadyExeList);
			// 	uni.$off('alreadyExe')
			// })
			this.userName = uni.getStorageSync('userName')
			console.log(options);



			let projectId = options.projectId
			this.alreadyExeList = JSON.parse(decodeURIComponent(options.alreadyList))


			console.log(this.alreadyExeList);
			console.log(projectId);
			// 测试环境要加be
			// let url =
			// 	`https://kimigateway.schaefflercn.com/sc/gateway/api/app/kimi-project-task-action/assign-list/${projectId}`
			let url = this.$Api.gateway +
				`/app/kimi-project-task-action/assign-list/${projectId}`
			console.log(url);

			console.log(this.executorList);
			let _this = this
			uni.request({
				url: url,
				method: "GET",
				header: {
					'Authorization': "Bearer " + uni.getStorageSync("scToken")
				},
				success: (res) => {
					console.log(res);
					let handleList = []
					handleList = res.data.data
					_this.executorList = res.data.data
					_this.executorList.forEach((item) => {
						_this.$set(item, 'checked', false)
					})
					console.log(_this.executorList);

				}


			})
		},
		computed: {
			List() {
				// 返回过滤后的数组

				return this.executorList.filter((item) => {
					return item.fullName.toLowerCase().indexOf(this.keyWord.toLowerCase()) !== -1
				})
			}

		},
		methods: {
			subeExe(e) {
				console.log(e);
			},
			query(e) {
				console.log(e);
			},
			async revExe() {

			},
			sendExe() {
				// let transExe = []
				// transExe.push(this.executorList.forEach((item) => {
				// 	item.checked
				// }))
				let arrlist = []
				let fullInfoList = []
				this.executorList.forEach((item, index) => {
					if (item.checked == true) {
						arrlist.push(item.id)
						fullInfoList.push(item)
					}
				})
				uni.$emit('handleExeClick', arrlist)
				uni.$emit('handleFullInfo', fullInfoList)
				console.log(arrlist);
				console.log(fullInfoList);
				uni.navigateBack()
			},
			checkboxChange: function(e) {
				let values = e.detail.value

				console.log(e.detail.value);
				console.log(this.List.length);
				if (this.List.length < this.executorList.length) {
					this.executorList.forEach((element) => {
						// element.checked = false
						// if (values.length < 1) {
						// 	this.$set(element, 'checked', false)
						// } else {
						values.forEach((itemm) => {
							if (itemm.id == element.id && element.checked == false) {
								element.checked = true
								// this.$set(element, 'checked', true)
							} else if (itemm.id == element.id && element.checked == true) {
								// this.$set(element, 'checked', false)
								element.checked = true
							} else {}
						})
						// }
					})
				} else {
					this.executorList.forEach((element) => {
						// element.checked = false
						if (values.length < 1) {
							this.$set(element, 'checked', false)
						} else {
							values.forEach((itemm) => {
								if (itemm.id == element.id && element.checked == false) {
									element.checked = true
									// this.$set(element, 'checked', true)
								} else if (itemm.id == element.id && element.checked == true) {
									// this.$set(element, 'checked', false)
									element.checked = true
								} else {}
							})
						}
					})
					console.log(this.executorList);

				}

				this.executorList.forEach((element) => {
					// element.checked = false
					if (values.length < 1) {
						this.$set(element, 'checked', false)
					} else {
						values.forEach((itemm) => {
							if (itemm.id == element.id && element.checked == false) {
								element.checked = true
								// this.$set(element, 'checked', true)
							} else if (itemm.id == element.id && element.checked == true) {
								// this.$set(element, 'checked', false)
								element.checked = true
							}
						})
					}
				})


				console.log(values);
				console.log(this.executorList);
			},

			backTo() {
				uni.navigateBack()
			},
			selAction(executor) {
				uni.$emit('handleExeClick', executor)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-list-item__content-title {
		font-size: 31.25rpx;
	}

	.back {
		// height: 20px;
		// width: 100rpx;
		background-color: #fff;

		// height: 20px;
		color: #646464;
		display: flex;
		font-size: 31.25rpx;
		justify-content: flex-start;
		// margin-top: 20px;
		margin-bottom: 10px;
		padding-top: 20px;
		height: 46px;
		padding-left: 10px;
	}

	.submitbtn {
		background-color: #fff;
		color: #00893d;
		font-size: 16px;
		border: none;
	}

	.submitbtn {
		border: none;
		border-radius: unset;
		top: -10px;

	}

	uni-button:after {
		border: none;
		border-radius: unset;
	}

	.uni-mt-10 {
		margin-top: -16px;
		margin-left: 10px;
		width: 225px;
	}

	/deep/.uni-searchbar__box {
		padding: 7px 25px 5px 0px;
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

	.uni-list-cell {
		justify-content: flex-start;
	}
</style>
