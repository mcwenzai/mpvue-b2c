<template>
	<view class="container">
		<view class="wrapper">
			<view class="welcome text-center">
				<image src="/static/images/logo.png" class="logo"></image>
				<view class="title1">晓百合智慧商城</view>
				<view class="title2">要买对的 不买贵的</view>
			</view>
			<view class="input-content text-center">
				<button class='bg-red round' @click="goRouter('userLogin')">
					<view>账号密码登录</view>
				</button>
				<button class='round phoneBtn text-red' @click="goRouter('send')">
					<view>手机号快速登录</view>
				</button>
				<button class='bg-grey round' @click="gohome()">
					<view>回到首页</view>
				</button>
			</view>
			<button class="phone text-center" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<image src="/static/images/wechat.png"></image>
			</button>
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
	} from 'vuex'
	
  export default {
		data(){
			return {
				showPop1:false
			}
		},
		onLoad(){
			var pages = getCurrentPages();//页面指针数组
			var prepage = pages[pages.length - 2];
			if(prepage.length<2){
				this.update({ backUrl: '' });
				return;
			}
			console.log(prepage)
			if(prepage.route.indexOf('login')!=-1||prepage.route.indexOf('send')!=-1||prepage.route.indexOf('regist')!=-1||prepage.route.indexOf('personal')!=-1){
				this.update({ backUrl: '' });
			}else {
				var str = '';
				var list = prepage.options
				for(let key in list ){
					str+= key + '=' +  list[key] + '&'
				}
				this.update({ backUrl: '/' + prepage.route + '?' + str});
			}
		},
		computed: {
			...mapState([
				'isLogin', 'userInfo', 'inviteCode','backUrl'
			]),
		},
		methods:{
			...mapMutations(["update"]),
			goRouter(url) {			
				wx.navigateTo({url: `/pages/${url}/main`})
			},
			gohome(){
				wx.switchTab({
					url:"/pages/index/main"
				})
            },
			close(){
				this.showPop1 = false;
				if(this.backUrl){
					wx.navigateTo({ url: this.backUrl });
					this.update({ backUrl: '' });
				}else {
					wx.switchTab({
						url: "/pages/personal/main",
					});
				}
			},
			goUser(){
				if(this.backUrl){
					wx.navigateTo({ url: this.backUrl });
					this.update({ backUrl: '' });
				}else {
					wx.switchTab({
						url: "/pages/personal/main",
					});
				}
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
																	if(that.backUrl){
																		wx.navigateTo({ url: that.backUrl });
																		that.update({ backUrl: '' });
																	}else {
																		wx.switchTab({
																			url: "/pages/personal/main",
																		});
																	}
																}
															});
														}else {
															console.log(that.backUrl)
															if(that.backUrl){
																wx.navigateTo({ url: that.backUrl });
																that.update({ backUrl: '' });
															}else {
																wx.switchTab({
																	url: "/pages/personal/main",
																});
															}
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
/* 页面左右间距 */
$page-row-spacing: 30rpx;
$page-color-base: #f8f8f8;
$page-color-light: #f8f6fc;
$base-color: #fa436a;

/* 文字尺寸 */
$font-sm: 24rpx;
$font-base: 28rpx;
$font-lg: 32rpx;
/*文字颜色*/
$font-color-dark: #303133;
$font-color-base: #606266;
$font-color-light: #909399;
$font-color-disabled: #C0C4CC;
$font-color-spec: #4399fc;
/* 边框颜色 */
$border-color-dark: #DCDFE6;
$border-color-base: #E4E7ED;
$border-color-light: #EBEEF5;
/* 图片加载中颜色 */
$image-bg-color: #eee;
/* 行为相关颜色 */
$uni-color-primary:#fa436a;
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;


	.phone {
		background-color: #fff;
		image{
			width: 90rpx;
			height: 90rpx;
		}
	}
	
	.container{
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		padding: 0;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40rpx;
		width: 100%;
		margin: 0 auto;
	}
	.back-btn{
		position:absolute;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 40rpx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120rpx;
		color: $page-color-base;
		position:relative;
		left: -16rpx;
	}
	.right-top-sign{
		position:absolute;
		top: 80rpx;
		right: -30rpx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400rpx;
			height: 80rpx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198rpx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270rpx;
		bottom: -320rpx;
		border: 100rpx solid #d0d1fd;
		border-radius: 50%;
		padding: 180rpx;
	}
	.input-content{
		padding: 0 40rpx;
		margin:0 auto;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30rpx;
		background:$page-color-light;
		height: 120rpx;
		width: 100%;
		border-radius: 4px;
		margin-bottom: 50rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50rpx;
			line-height: 56rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-base;
		}
		input{
			height: 60rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.forget-section{
		font-size: $font-sm+2rpx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40rpx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: $font-sm+2rpx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10rpx;
		}
	}
	.btn1 {
		width: 100%;
		margin-top: 50rpx;
		background-color: burlywood;
		color: white;
		border-radius: 98rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.btnImg {
		margin-right: 8rpx;
		width: 60rpx;
		height: 60rpx;
		margin-right: 30rpx;
	}

	.btn1::after {
		border-radius: 98rpx;
		border: 0; 
	}
	.logo {
		width: 152rpx;
		height: 152rpx;
		margin-bottom: 30rpx;
	}
	.welcome {
		padding: 100rpx 0 140rpx 0;
	}
	.title1 {
		font-size: 32rpx;
		color: #9797A5;
		font-weight: weight;
		margin-bottom: 8rpx;
	}
	.title2 {
		font-size: 22rpx;
		color: #DDDDDD;
		font-weight: weight;
	}
	.input-content button {
		margin-bottom: 50rpx;
	}
	.phoneBtn {
		background-color: #fff;
		border: 1px solid var(--red)
	}
</style>
 