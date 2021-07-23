<template>
  <view class="mainBox">
    <view class="mainTitle">
      欢迎回来
    </view>
    <view class="inputItem">
      <view class="title1">
        手机号
      </view>
      <input type="number" class="input" v-model="phone" placeholder="请输入手机号" adjust-position="false" placeholder-class="placeholder"/>
    </view>
    <view class="inputItem">
      <view class="title1">
        密码
      </view>
      <input type="text" class="input" v-model="password" placeholder="请输入密码" adjust-position="false" placeholder-class="placeholder" password="true"/>
    </view>
    <button class='bg-red round' @click="toLogin">
      <view>登录</view>
    </button>
    <text class="forget fr" @click="toForgetPassword">忘记密码？</text>
    <view class="toRegist text-center">
      还没有账号？
      <text class="text-red" @click="toRegist">去注册</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      userInfo: "",
      logining: false,
      phone: "",
      password: "",
    };
  },
  computed: {
    ...mapState(["cartList", "isLogin", "userInfo",'backUrl']),
  },
  methods: {
    ...mapMutations(["update"]),
    toLogin() {
      //console.log(this.phone);
      //console.log(this.password);
      if(this.phone==''){
        wx.showToast({
          title: '手机号不能为空',
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
        phone: this.phone,
        password: this.password,
      };
      var that = this;
      this.$fly.post("/users/login-bypassword", params).then((res3) => {
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
                  if(that.backUrl){
                    wx.navigateTo({ url: that.backUrl });
                    that.update({ backUrl: '' });
                  }else {
                    wx.switchTab({
                      url: "/pages/personal/main",
                    });
                  }
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
    },
    toRegist() {
      wx.navigateTo({
        url: "/pages/regist/main",
      });
    },
    toForgetPassword(){
     wx.navigateTo({
      url:"/pages/forgetPassword/main"
     })
    }
  },
};
</script>

<style lang='scss'>
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
</style>
