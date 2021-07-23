<template>
	<view class="mainBox">
    <view class="mainTitle">
      新用户注册
    </view>
    <view class="inputItem">
      <view class="title1">
        手机号
      </view>
      <input type="number" class="input" v-model="phone" placeholder="请输入手机号" adjust-position="false" placeholder-class="placeholder"/>
    </view>
    <view class="inputItem">
      <view class="title1">
        短信验证码
      </view>
      <input type="number" class="input" v-model="code" placeholder="请输入短信验证码" maxlength="6" adjust-position="false" placeholder-class="placeholder"/>
			<view class="yanz text-red text-center round" @click="send">
				{{daojishi}}
			</view>
    </view>
    <view class="inputItem">
      <view class="title1">
        设置密码
      </view>
      <input type="text" class="input" v-model="password" placeholder="请设置6-18位不含特殊字符的新密码" adjust-position="false" placeholder-class="placeholder" password="true"/>
    </view>
    <view class="inputItem">
      <view class="title1">
        邀请码（选填）
      </view>
      <input type="text" class="input" v-model="inviteCode" placeholder="请输入邀请码" adjust-position="false" placeholder-class="placeholder"/>
    </view>
    <button class='bg-red round' @click="submit">
      <view>注册</view>
    </button>
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

  export default {
    data() {
      return {
        userInfo: '',
        phone: '',
        code: '',
        showPop1:false,
        daojishi: "获取验证码",
        isdaojishi: true,
        inviteCode:'',
				password:""
      }

    },
    computed: {
      ...mapState([
        'isLogin', 'userInfo','inviteCode','backUrl'
      ]),
		},
    onUnload(){
      this.isdaojishi = true;
      this.daojishi = "获取验证码";
      clearInterval(a);
    },
	 onLoad(options) {
      if(options.inviteCode){
        this.inviteCode = options.inviteCode;
      }
      if(options.scene){
        this.inviteCode = decodeURIComponent(options.scene);
      }
	 },
    methods: {
      ...mapMutations(['update']),
      send() {
        if (this.isdaojishi) {
          let langtime = 60;
          let than = this
          let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/; //手机号正则验证
          if (!reg.test(this.phone)) {
            
            wx.showToast({
              title: "请输入正确的手机号码",
              icon: "none",
              size:93,
              duration: 20000
            })

          } else {
            this.isdaojishi = false;
            let a = setInterval(function () {
              if (langtime == 0) {
                than.isdaojishi = true;
                than.daojishi = "获取验证码";
                clearInterval(a);
              } else {
                langtime--;
                //console.log(langtime);
                than.daojishi = `${langtime}秒`;
              }
            }, 1000);
            //---------------------------------------------------------
        //console.log(this.phone);
        let params = {
          phone: this.phone,
          type: 0
        }
        this.$fly.post('/sms/send/code', params).then(res => {
          if (res.data.success) {
            //console.log("验证码发送成功")
          } else {
            //console.log("验证码发送失败")
          }
        })
          }
        } else {
          //console.log("不能点了")
        }

        

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
      submit(e) {
		  	if(this.phone==''){
					wx.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return;
				}else if(this.code==''){
					wx.showToast({
						title: '验证码不能为空',
						icon: 'none'
					})
					return;
				}else if(this.password==''){
					wx.showToast({
						title: '密码不能为空',
						icon: 'none'
					})
					return;
				}
        let params = {
          "phone": this.phone,
					"code": this.code,
					"inviteCode": this.inviteCode,
					"password":this.password
        }
        var that = this
        this.$fly.post('/users/register', params).then(res => {
          //console.log(res.data)
          if (res.data.success) {
            var pages = getCurrentPages();
             if(pages.length>=2){
            var prevPage = pages[pages.length - 2].route;
                }else{
              var prevPage = "";
            }
            this.$fly.post("/users/login-bypassword", {"phone": this.phone,"password": this.password,}).then((res3) => {
              if (res3.data.success) {
                wx.login({
                success: (res2) => {
                    // var appId = "wx3fe71aea5a30b03c";
                    // var secret = "59233288a5cff790065d3b431e3097ec";
                    this.$fly.post("/users/jscode2session",{"code": res2.code}).then((res4) => {
                        var openIdJson = JSON.parse(res4.data.data); //返回openid
                        res3.data.data.openid = openIdJson.openid;
                        this.update({ isLogin: true });
                        this.update({ userInfo: res3.data.data });
                        that.$fly.config.headers = {
                          "X-Tag": "flyio",
                          Authorization: res3.data.data.token,
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
                      });
                }});         
                //console.log("手动登录成功");
              } else {
                this.update({
                  isLogin: false,
                });
                this.update({
                  userInfo: null,
                });
              }
            });
          } else {
            //console.log("注册失败")
          }

        })
      },


    }
  }

</script>

<style lang='scss'>
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
    width: 606rpx;
    height: 626rpx;
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
  .mainBox{
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		padding: 0 80rpx;
		background: #fff;
	}
  .mainTitle {
    font-size: 44rpx;
    color: #666;
    font-weight: bold;
    padding: 80rpx 0;
  }
  .inputItem {
    margin-bottom: 80rpx;
		position: relative;
  }
  .title1 {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 20rpx;
  }
  .input {
    line-height: 66rpx;
    border-bottom: 1px solid #DDDDDD;
    padding: 10rpx 6rpx;
    height: 66rpx;
    font-size: 32rpx;
    color: #333;
  }
  .placeholder {
    color: #ccc;
    font-size: 24rpx;
  }
  .forget {
    font-size: 28rpx;
    color: #999;
    margin-top: 40rpx;
  }
  .toRegist {
    font-size: 28rpx;
    color: #999;
    position: absolute;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
  }
	.yanz {
		position: absolute;
		display: inline-block;
		right: 0;
		bottom: 6rpx;
		width: 160rpx;
		height: 54rpx;
		line-height: 54rpx;
		font-size: 24rpx;
		font-weight: bold;
		border: 1px solid var(--red);
		z-index: 9;
	}
</style>
