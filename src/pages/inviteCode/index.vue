<template>
	<view class="mainBox">
		<view class="wrapper">
			<view class="welcome text-center">
				<view class="title1">晓百合智慧商城</view>
				<view class="title2">要买对的 不买贵的</view>
			</view>
			<view class="position inviteBox">
				<view class="title1 text-center">
					请确认邀请人的邀请码
				</view>
				<view class="code text-center">
					{{inviteCode}}
				</view>
				<button class="phone text-center round" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					<image src="/static/images/wechat.png"></image>
					微信一键登录
				</button>
			</view>
		</view>
		<view class="popUp" v-if="showPop1">
			<view class="position text-center">
				<text class="close cuIcon-close lg text-white" @click="close"></text>
				<image
				src="/static/images/active.png"
				class="popUpBg2"
				mode="widthFix"
				@click="goUser()"
				>
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default{
		data(){
			return {
				showPop1:false,
				inviteCode:''
			}
		},
		onLoad(options){
			if(options.scene){
				this.inviteCode = decodeURIComponent(options.scene);
			}
			this.update({ inviteCode: this.inviteCode });
		},
		methods:{
			...mapMutations(["update"]),
			close(){
				this.showPop1 = false;
				wx.switchTab({
					url: "/pages/personal/main",
				});
			},
			goUser(){
				wx.switchTab({
					url: "/pages/personal/main",
				});
			},
			getPhoneNumber(e){
				var that = this;
				wx.login({
				  success: resp => {
					  wx.login({
						success: function(res) {
							if (res.code) {
								//发起网络请求=
								var params = {
									encryptedData: e.target.encryptedData,
									iv: e.target.iv,
									code: res.code
								}
								that.$fly.post('/users/auth',params).then(res => {
									if(res.data.success){
										var data = JSON.parse(res.data.data)
										var param2 = {
											'phone':data.phoneNumber,
											'code':"1",
											'password':"123456",
											'inviteCode': that.inviteCode
										}
										that.$fly.post('/users/registerApplets',param2).then(resp => {
											if(resp.data.success){
												wx.login({
												success: (res2) => {
													that.$fly.post("/users/jscode2session",{"code": res2.code}).then((res4) => {
														var openIdJson = JSON.parse(res4.data.data); //返回openid
														resp.data.data.openid = openIdJson.openid;
														that.update({ isLogin: true });
														that.update({ userInfo: resp.data.data });
														if(resp.data.data.type==0){
															that.$fly.config.headers = {
																"X-Tag": "flyio",
																Authorization: resp.data.data.token,
																"Content-Type": "form-data"
															};
															that.$fly.get("/coupons/platform?receiveRule=1").then((respt) => {
																if(respt.data.data.length>0){
																	respt.data.data.forEach(item=>{
																		that.$fly.post('/coupons/receive?couponId=' + item.couponId).then(respt1 => {
																			if (respt1.data.success) {
																				that.showPop1 = true
																			}
																		})
																	})
																}else{
																	wx.switchTab({
																		url: "/pages/personal/main",
																	});
																}
															});
														}else {
															wx.switchTab({
																url: "/pages/personal/main",
															});
														}
													});
												}});
												
												
											}
										})
									}else {
										wx.showToast({
										title: '请求失败请重试。', //提示的内容,
										icon: 'none', //图标,
										duration: 2000, //延迟时间,
										mask: true, //显示透明蒙层，防止触摸穿透,
										success: res => {}
										});
									}
								})
							} else {
								console.log('登录失败！' + res.errMsg)
							}
						}
					});
				  }
				});
			}
		}
	}
</script>

<style lang='scss'>
button::after {
	border: 0;
}
page {
background: linear-gradient(180deg, rgba(237, 75, 63, 0.99) 0%, #FD644F 100%);
}
.welcome {
	.title1 {
		font-size: 52rpx;
		font-weight: bold;
		color: #fff;
		margin-top: 80rpx;
		margin-bottom: 30rpx;
	}
	.title2 {
		font-size: 28rpx;
		color: #fff;
		font-weight: bold;
		margin-bottom: 80rpx;
	}
}
.inviteBox {
	width: 660rpx;
	height: 610rpx;
	text-align: center;
	border-radius: 36rpx;
	margin: 0 auto;
	background-color: #fff;
	overflow: hidden;
	.title1 {
		color: #333;
		font-size: 32rpx;
		margin: 100rpx auto 60rpx;
	}
	.code {
		margin: 0 auto;
		margin-bottom: 160rpx;
		background-color: #F7F7F7;
		width: 500rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 90rpx;
		color: #333;
		font-size: 36rpx;
	}
	button.phone {
		background-color: #ED4B3F;
		width: 500rpx;
		height: 68rpx;
		line-height: 68rpx;
		font-size: 28rpx;
		color: #fff;
		image {
			width: 40rpx;
			height: 40rpx;
			background-color: #fff;
			border-radius: 40rpx;
			border: 1px solid #3BB430;
			vertical-align: middle;
			margin-right: 10rpx;
		}
	}
}
	
.popUp {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  .position{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .popUpBg {
    width: 590rpx;
  }
  .popUpBg2 {
    width: 670rpx;
  }
  .activityBtn {
    width: 260rpx;
    animation: scaleBtn 1.2s linear infinite;
  }
  .mainBox {
    width: 590rpx;
    height: 820rpx;
    position: absolute;
    top: 0;
    left: 0;
    .bottomBox {
      padding: 28rpx 0 20rpx 0;
    }
    .title1 {
      text-align: center;
      font-weight: bold;
      font-size: 70rpx;
      margin-top: 20rpx;
    }
    image {
      width: 344rpx;
      height: 344rpx;
      margin-top: 30rpx;
    }
    .title2 {
      font-size: 30rpx;
      margin: 26rpx 0;
    }
    .button {
      width: 418rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      text-align: center;
      margin: 0 auto;
      border: 1px solid var(--red);
      color: var(--red);
      border-radius: 0;
    }
    .button.bg-red {
      color: #fff;
      margin-top: 14rpx;
    }
  }
  
  .gif {
    width: 600rpx;
    height: 668rpx;
  }
  .activity {
    position: absolute;
    width: 100%;
    bottom: 90rpx;
    height: 98rpx;
    text-align: center;
  }
  
  .close {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    font-size: 60rpx;
    z-index: 999;
  }
}
@keyframes scaleBtn {
  50% { transform: scale(0.86) }
  100% { transform: scale(1)  }
}
</style>
 