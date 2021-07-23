<template>
  <view class="card-page">
   <view class="normalUser" v-if="name=='会员介绍'">
      <image src="/static/images/normalUserBg.png" mode="widthFix" class="bg"></image>
      <image src="https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/normalUser.png" mode="widthFix" class="content"></image>
      <text class="whiteBtn round normalUserBtn1" @click="changeName('社员中心')">了解社员</text>
      <text class="whiteBtn round normalUserBtn2" @click="changeName('店长注册')">了解店长</text>
       <text class="whiteBtn round normalUserBtn2" @click="erWeiMa('店长注册')">了解店长</text>
   </view>
   <view class="member" v-if="name=='社员中心'">
      <image src="/static/images/normalUserBg.png" mode="widthFix" class="bg"></image>
      <image src="https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/member.png" mode="widthFix" class="content"></image>
      <text class="whiteBtn round memberBtn1">成为社员</text>
   </view>
   <view class="manager" v-if="name=='店长注册'">
      <image src="/static/images/normalUserBg.png" mode="widthFix" class="bg"></image>
      <image src="https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/manager.png" mode="widthFix" class="content"></image>
      <text class="whiteBtn round managerBtn1">注册店长</text>
   </view>
   <view class="invite" v-if="name=='邀请有礼'">
      <image src="https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/inviteBg.png" mode="widthFix" class="bg"></image>
      <image src="https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/invite.png" mode="widthFix" class="content"></image>
      <input
          value=""
          type="text"
          placeholder="邀请码"
          placeholder-class="placeholder"
          maxlength="140"
          v-model="inviteCode"
          class="myInvite text-center round"
          style="left:0;top:0;width:240rpx">
          
        </input>
      <view class="myInvite text-center round" @click="goInvite">我邀请的人</view>
      <view class="myInvite text-center round" @click="erWeiMa">我邀请的人222</view>
   </view>
  </view>
</template>

<script>
  import {
    moneyFormat
  } from "@/utils/index";
  import {
    mapState,
    mapMutations
  } from "vuex";

  export default {
    computed: {
      ...mapState([
        'userInfo','isLogin'
      ])
    },
    data() {
      return {
        name: '',
        inviteCode: ''
      };
    },
    onShow(){
      // 查看是否授权
      if (!this.isLogin) {
        wx.navigateTo({
          url: "/pages/prelogin/main"
        });
      }
    },
    // 分享内容
    onShareAppMessage: function (share) {
      // 当前的分享路径来源
      let url = '/pages/regist/main?inviteCode=' + this.userInfo.inviteCode;
      return {
        title: "注册享大礼",
        path: url,
        success: function (res) {},
        console: function (res) {}
      }
    },

    


    methods: {
      changeName(name){
        this.name = name
      },

      erWeiMa(){
        
        var appId = "wx3fe71aea5a30b03c";
        var secret = "59233288a5cff790065d3b431e3097ec";
        //let url = '/pages/regist/main?inviteCode=' + this.userInfo.inviteCode;
        //let url = '/pages/regist/main?inviteCode=2aagOM';
        let url = '/pages/regist/main?inviteCode=' + this.inviteCode;
          let params ={  
            "path":url,
            "width":120,
            "auto_color":true
          }       
        this.$fly.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+secret).then((res) => {
           let access_token  =res.data.access_token;
           this.$fly.post('https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + access_token, params, {
                responseType: "text", 
            }).then((res3) => { 
              //debugger                               
                return 'data:image/pn;gbase64,' + window.btoa(
                new Uint8Array(res3.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
              );
           })
           
        }) ;
             
      },
       

      goInvite(){
        wx.navigateTo({
          url: '/pages/invited/main',
        })
      }
    },
    onLoad(options){
      //判断是会员介绍还是社员中心等；
      this.name = options.name;
    },
  };

</script>

<style>
  /* 空购物车 */
  page,
  .card-page {
    height: 100%;
    background: #F8F8F8;
  }
  
  .contain {
    height: 100%;
    text-align: center;
  }
  .bg,.content {
    width: 100%;
  }
  .content {
    position: relative;
    top: 90rpx;
    right: 0;
  }
  .invite .content {
    top: 100rpx;
    width: 698rpx;
    display: block;
    margin: 0 auto;
  }
  .normalUser {
    background-color: #ebd0b7;
    height: 3680rpx;
  }
  .member {
    background-color: #ebd0b7;
    height: 2900rpx;
  }
  .manager {
    background-color: #ebd0b7;
    height: 2270rpx;
  }
  .invite {
    background-color: #ebd0b7;
    height: 2270rpx;
  }
  .whiteBtn {
    display: inline-block;
    width: 430rpx;
    height: 72rpx;
    line-height: 72rpx;
    color: red;
    font-size: 34rpx;
    text-align: center;
    background-color: #fff;
    letter-spacing: 10rpx;
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
  }
  .normalUserBtn1{
    position: absolute;
    top: 2690rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .normalUserBtn2{
    position: absolute;
    top: 3550rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .memberBtn1 {
    color: #ffad22;
    position: absolute;
    top: 2776rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .managerBtn1 {
    position: absolute;
    top: 2146rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .share {
    background: none;
    padding: 0;
    border: 0;
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 140rpx;
    border-radius: 0;;
    background-color: rgba(255, 255, 255,.20);
  }
  .share::after {
    border: 0;
  }
  .inviteBtn1 {
    width: 630rpx;
    height: 88rpx;
    line-height: 88rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    background-image: linear-gradient(#FFAA53, #FF3D1F);
  }
  .myInvite {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 200rpx;
    height: 54rpx;
    line-height: 54rpx;
    font-size: 28rpx;
    color: #e2260b;
    background-color: #fff;
    letter-spacing: 2rpx;
    box-shadow: 0 0 20rpx #a61a03;
  }
</style>
