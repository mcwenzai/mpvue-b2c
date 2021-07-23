<template>
  <view class="card-page">
   <view class="normalUser" v-if="name=='会员介绍'">
      <image src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1597460184845BannerImg59.141914557094964normalUser.png" mode="widthFix" class="content"></image>
      <text class="whiteBtn round normalUserBtn1" @click="changeName('社员介绍')">了解社员</text>
      <text class="whiteBtn round normalUserBtn2" @click="changeName('店长注册')">了解店长</text>
   </view>
   <view class="member" v-if="name=='社员介绍'">
      <image src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1597459999320BannerImg95.43015810363829sheyuan.png" mode="widthFix" class="content"></image>
      <text class="whiteBtn round memberBtn1" @click="goUrl('memberCenter')">成为社员</text>
   </view>
   <view class="manager" v-if="name=='店长注册'">
      <image src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1597460127791BannerImg95.9374485573061manager.png" mode="widthFix" class="content"></image>
      <text class="whiteBtn round managerBtn1">注册店长</text>
   </view>
   <view class="invite" v-if="name=='邀请有礼'">
      <image src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1597460154008BannerImg1.0812283988484994invite.png" mode="widthFix" class="content"></image>
      <button open-type="share" class="share">
        <view class="round inviteBtn1">立即邀请</view>
      </button>
      <view class="myInvite text-center round" @click="goInvite">我邀请的人</view>
   </view>
   <view v-if="name=='活动'" class="position">
      <image src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1606455894139BannerImg86.44636871832543huodong.png" mode="widthFix" class="content"></image>
      <!-- <button class="join round" open-type="share"><image src="/static/images/activeBtn.png"></image> </button> -->
      <image src="/static/images/manjian.png" mode="widthFix" class="active1" @click="goNewList()"></image>
      <image src="/static/images/miaosha.png" mode="widthFix" class="active2" @click="goUrl('seckill')"></image>
      <image src="/static/images/pintuan.png" mode="widthFix" class="active3" @click="goUrl('groupList')"></image>
      <!-- <view class="erweiInfo">
        <image src="/static/images/erweima.png" :show-menu-by-longpress="true" mode="widthFix" class="erweima" @click="showInfo()"></image>
        <view class="title1">扫码添加客服微信参与活动</view>
        <view class="title1">也可以微信搜索“<text class="title2" @click="copyText" data-num='17788935566'>17788935566</text>”添加客服微信</view>
      </view> -->
   </view>
   <view v-if="name=='红包'">
      <image src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/articleContent-%E7%BA%A2%E5%8C%85%E8%A7%84%E5%88%99.png" mode="widthFix" style="width:100%;"></image>
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
      };
    },
    onShow(options){
      // 查看是否授权
      if (this.name=='邀请有礼'&&!this.isLogin) {
        wx.navigateTo({
          url: "/pages/prelogin/main"
        });
      }
    },
    // 分享内容
    onShareAppMessage: function (share) {
      // 当前的分享路径来源
      var that = this
      if(this.name == '活动'){
        var url = '/pages/introduce/main?name=活动';
        setTimeout(function(){
          that.$fly.config.headers = {
            "X-Tag": "flyio",
            Authorization: that.userInfo.token,
            "Content-Type": "form-data"
          };
          that.$fly.get("/coupons/platform?receiveRule=1")
          .then((res) => {
            if(res.data.data.length>0){
              res.data.data.forEach(item=>{
                that.$fly.post('/coupons/receive?couponId=' + item.couponId).then(res => {
                  if (res.data.success) {
                    wx.showModal({
                      title: "温馨提示",
                      content: "优惠券领取成功。",
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                        }
                      },
                    });
                  }
                })
              })
            }else{
              wx.showToast({
                title: '暂无优惠券', //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            }
            
          });
        },5000)
        return {
          title: "中秋遇国庆",
          path: url
        }
      }else{
        var url = '/pages/regist/main?inviteCode=' + that.userInfo.inviteCode;
        console.log(url);
        return {
          title: "注册享大礼",
          path: url
        }
      }
    },
    methods: {
      changeName(name){
        this.name = name
        wx.setNavigationBarTitle({
          title: this.name,
        });
      },
      copyText(e){
        var that = this;
        wx.setClipboardData({
          data: e.target.dataset.num,
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
          },
          fail: function (res) {
            console.log(res);
          },
        });
      },
      showInfo(){
        var imgUrl = ['http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1603186741959BannerImg89.56041737649333erweima.png']
        wx.previewImage({
          current: "", // 当前显示图片的http链接
          urls: imgUrl // 需要预览的图片http链接列表
        })
      },
      goNewList(){//活动
        this.$fly.get("/products/topgoods/queryTopGoods")//每日尖货
        .then((res) => {
          wx.navigateTo({ url: '/pages/dayGoods/main?imgUrl='+ res.data.data[0].imgUrl +'&&name=' + res.data.data[0].title + '&virtualId=' + res.data.data[0].id });
        });
      },
      goInvite(){
        wx.navigateTo({
          url: '/pages/invited/main',
        })
      },
      goUrl(url){
        wx.navigateTo({
          url: '/pages/'+url+'/main',
        })
      }
    },
    onLoad(options){
      //判断是会员介绍还是社员中心等；
      this.name = options.name||"活动";
      wx.setNavigationBarTitle({
        title: this.name,
      });
    },
  };

</script>

<style lang="scss">
  /* 空购物车 */
  page,
  .card-page {
    height: 100%;
    background: #F8F8F8;
  }
  .join {
    width: 308rpx;
    height: 85rpx;
    line-height: 85rpx;
    text-align: center;
    font-size: 32rpx;
    position: absolute;
    /* background-color: #FE2F61; */
    background-color: rgba(0,0,0,0);
    color: #fff;
    top: 1330rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .join::before {
    border: 0;
  }
  .join image {
    width: 308rpx;
    height: 85rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .contain {
    height: 100%;
    text-align: center;
  }
  .bg,.content {
    width: 100%;
  }
  /* .content {
    position: relative;
    top: 90rpx;
    right: 0;
  } */
  .invite .content {
    display: block;
    margin: 0 auto;
  }
  .normalUser {
    /* background-color: #ebd0b7; */
    /* height: 3680rpx; */
  }
  .member {
    /* background-color: #ebd0b7; */
    /* height: 2900rpx; */
  }
  .manager {
    /* background-color: #ebd0b7; */
    /* height: 2270rpx; */
  }
  .invite {
    /* background-color: #ebd0b7; */
    /* height: 2270rpx; */
  }
  .whiteBtn {
    display: inline-block;
    width: 430rpx;
    height: 72rpx;
    line-height: 72rpx;
    color: #fff;
    font-size: 34rpx;
    text-align: center;
    background-color: var(--red);
    letter-spacing: 10rpx;
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
  }
  .normalUserBtn1{
    position: absolute;
    top: 2350rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .normalUserBtn2{
    position: absolute;
    top: 3090rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .memberBtn1 {
    color: #fff;
    position: absolute;
    top: 2840rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .managerBtn1 {
    position: absolute;
    top: 1790rpx;
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
  .active1 {
    width: 556rpx;
    position: absolute;
    top: 1339rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .active2 {
    width: 556rpx;
    position: absolute;
    top: 1996rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .active3 {
    width: 556rpx;
    position: absolute;
    top: 2815rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .erweiInfo {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 3929rpx;
    .erweima {
      width: 329rpx;
      margin-bottom: 20rpx;
    }
    .title1 {
      font-size: 24rpx;
      line-height: 38rpx;
      color: #333;
    }
    .title2 {
      color: #1472FF;
    }
  }
</style>
