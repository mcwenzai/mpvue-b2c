<template>
  <view class="pages">
    <view class="topBg">
      <view class="topTitle text-white text-lg text-center position"><text class="cuIcon-back" @click="goBack"></text>社员中心</view>
    </view>
    <view class="topBox">
      <view class="cardBg">
        <view class="card">
          <view class="userInfo">
            <image :src="balanceList.avatar?balanceList.avatar:'/static/images/person.png'" class="avatar round"></image>
            <text class="text-orange text-lg">{{balanceList.nickname}}</text>
            <view class="userLeveName">{{balanceList.userLeveName}}</view>
            <view class="mingxi" @click="goUrl('walletDetails')">钱包明细</view>
          </view>
          <view class="balance">购物卡：{{balanceList.money}}</view>
          <view class="text-sm text-white">积分满660分即可抵现</view>
          <view class="progress-box position">
            <progress :percent="balanceList.point>=660?'100':balanceList.percent" color="#fff" backgroundColor="#F29469"  border-radius="3" stroke-width="3" />
            <text class="minNum">0</text>
            <text class="maxNum">660</text>
            <view class="percentBox" :style="{'left':balanceList.point>=660?'100%':balanceList.percent+'%'}">{{balanceList.point}}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 社员 -->
    <view class="isMember mainBox" v-if="balanceList.level!=0">
      <view class="cf">
        <view class="fl goBox">
          <text class="cuIcon-vip"></text>
          <view class="inlineBlock">
            <view class="title1">社员中心</view>
            <view class="title2">充值送积分购物享返现</view>
          </view>
        </view>
        <view class="fr goBox">
          <text class="cuIcon-shop"></text>
          <view class="inlineBlock">
            <view class="title1">成为店长</view>
            <view class="title2">送1000积分返现可提现</view>
          </view>
        </view>
      </view>
      <view class="equity margin-bottom-xl">
        <view class="mainTitle">社员权益</view>
        <view class="grid col-4">
          <view class="text-center">
            <view class="cuIcon-moneybag text-red" style="font-size:50rpx"></view>
            <view class="text-sm margin-top-sm margin-bottom-xs">增值消费</view>
            <view class="text-xs text-grey">享有购物卡权益</view>
          </view>
          <view class="text-center">
            <view class="cuIcon-remind text-red" style="font-size:50rpx"></view>
            <view class="text-sm margin-top-sm margin-bottom-xs">秒杀</view>
            <view class="text-xs text-grey">可参与低价秒杀</view>
          </view>
        </view>
      </view>
      <view class="memRecharge">
        <view class="mainTitle">社员权益<text class="tips"><text class="cuIcon-info"></text>种类说明</text></view>
        <view class="trapezoidBox position">
          <view class="memRechargePrice margin-bottom-sm">{{balanceList.memRechargePrice}}元</view>
          <view class="memRechargePoint">充值成功即送平台{{balanceList.givePoint}}积分</view>
          <view class="trapezoid" @click="submit">确认充值</view>
        </view>
      </view>
    </view>
    <!-- 非社员 -->
    <view class="mainBox" v-else>
      <view class="recharge">
        <view class="mainTitle">成为社员<text class="tips"><text class="cuIcon-info"></text>种类说明</text></view>
        <view class="grid col-2">
          <view class="rechargeBox" :class="index==checkIndex?'active':''" v-for="(item,index) in levelList" :key="index" @click="chooseItem(index)">
            <view class="rechargeList position text-center">
              <view class="rechargeLevelName">{{item.userLeveName}}</view>
              <view class="price">{{item.memRechargePrice}}元</view>
              <view class="point">充值送{{item.givePoint}}积分</view>
              <view class="checkBox"><text class="cuIcon-check"></text></view>
            </view>
          </view>
        </view>
        <view class="confirm round text-xm text-center bg-black" @click="submit">确认充值</view>
      </view>
    </view>
  </view>
</template>

<script>
  import card from '@/components/card'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'userInfo',
        'isLogin',
      ]),
    },
    data() {
      return {
        balanceList:'',
        'levelList':[
          {'userLeveName': '社员卡社员', 'memRechargePrice': '1000.00', 'givePoint': 8},
          {'userLeveName': '金卡社员', 'memRechargePrice': '5000.00', 'givePoint': 50},
          {'userLeveName': '宝石卡社员', 'memRechargePrice': '10000.00', 'givePoint': 120},
          {'userLeveName': '钻石卡社员', 'memRechargePrice': '20000.00', 'givePoint': 260},
        ],
        checkIndex: 0,
        level:0,
      }
    },
    onLoad() {
      if (this.isLogin) {
        this.getUserInfo()
      }
    },
    methods: {
      ...mapMutations(["update"]),
      chooseItem(index){
        this.checkIndex = index;
        this.cooperativeConfigId = index+1;
      },
      goUrl(name){
        wx.navigateTo({ url: '/pages/'+name+'/main' });
      },
      goBack(){
        wx.navigateBack({
          complete: (res) => {},
        })
      },
      getUserInfo() {
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          "Authorization": this.userInfo.token
        }
        this.$fly.get('/users/' + this.userInfo.id).then(res => {
          if (res.data.data.level == 1) {
            res.data.data.userLeveName = '社员卡社员';
            res.data.data.givePoint = 8;
            res.data.data.memRechargePrice = "1000.00";
          } else if (res.data.data.level == 2) {
            res.data.data.userLeveName = '金卡社员';
            res.data.data.givePoint = 50;
            res.data.data.memRechargePrice = "5000.00";
          } else if (res.data.data.level == 3) {
            res.data.data.userLeveName = '宝石卡社员';
            res.data.data.givePoint = 120;
            res.data.data.memRechargePrice = "10000.00";
          } else if (res.data.data.level == 4) {
            res.data.data.userLeveName = '钻石卡社员';
            res.data.data.memRechargePrice = "20000.00";
            res.data.data.givePoint = 260;
          } else {
            res.data.data.userLeveName = '普通会员';
            res.data.data.givePoint = 0;
            res.data.data.memRechargePrice = "0.00";
          }
          res.data.data.percent = ((res.data.data.point/660)*100).toFixed(2);
          this.cooperativeConfigId = res.data.data.level>0?res.data.data.level:1;
          this.balanceList = res.data.data;
        })
      },
      submit(){
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          "Authorization": this.userInfo.token
        }
        var param = {
          "cooperativeConfigId":this.cooperativeConfigId,
          "payType":1
        }
        this.$fly.post('/orders/recharge',param).then(res => {
          if(res.data.success){
            this.$fly.post("/pay?payId="+res.data.data.payId+"&type=3&openId="+this.userInfo.openid).then((respay) => {
              if (respay.data.success) {
                let payInfo = JSON.parse(respay.data.data);
                wx.requestPayment({
                  timeStamp: payInfo.timeStamp,
                  nonceStr: payInfo.nonceStr,
                  package: payInfo.packageValue,
                  signType: payInfo.signType,
                  paySign: payInfo.paySign,
                  success: function (res) {
                    wx.showToast({
                      title: '充值成功',
                      duration: 1000,
                      success: function(){
                        wx.navigateBack({
                          complete: (res) => {},
                        })
                      }
                    })
                  },
                  fail: function (res) {},
                  complete: function (res) {
                  },
                });
              }
            });
          }
        })
      }
    }
  }

</script>

<style>
  page {
    background: #fff!important;
    height: 100%;
  }
  .pages {
    width: 100%;
    overflow: hidden;
  }
  .topBg {
    height: 180rpx;
    background-color: #333;
    padding-top: 110rpx;
  }
  .topBox {
    width: 140%;
    margin: 0 auto;
    height: 330rpx;
    background-color: #333;
    position: relative;
    padding-top: 20rpx;
    border-radius: 0 0 50% 50%; 
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
  }
  .cardBg {
    width: 670rpx;
    padding: 15rpx;
    margin: 0 auto;
    background-color: #574D47;
    border-radius: 10rpx;
  }
  .card {
    width: 640rpx;
    height: 300rpx;
    border-radius: 10rpx;
    background: url("http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1593593223075vipCard.png");
    background-position: center center;
    background-size: 100% 100%;
    padding: 30rpx;
  }
  .avatar {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
    vertical-align: middle;
  }
  .userInfo {
    line-height: 60rpx;
    height: 60rpx;
    color: #5D2102;
    position: relative;
  }
  .userLeveName {
    display: inline-block;
    height: 30rpx;
    line-height: 30rpx;
    border-radius: 30rpx;
    padding: 0 11rpx;
    font-size: 20rpx;
    color: #FFDAC2;
    background-color: #BF7553;
    margin-left: 20rpx;
  }
  .mingxi {
    display: inline-block;
    height: 40rpx;
    line-height: 40rpx;
    border-radius: 8rpx;
    padding: 0 10rpx;
    font-size: 20rpx;
    color: #BF7553;
    background-color: #FBD3BD;
    position: absolute;
    right: 0;
    top: 10rpx;
  }
  .balance {
    color: #EE4C40;
    padding-left: 80rpx;
    font-size: 26rpx;
    margin-bottom: 20rpx;
  }
  .progress-box {
    margin-top: 50rpx;
  }
  .minNum,.maxNum {
    color: #fff;
    font-size: 20rpx;
    position: absolute;
  }
  .minNum {
    left: 0;
    top: 10rpx;
  }
  .maxNum {
    right: 0;
    top: 10rpx;
  }
  .percentBox {
    position: absolute;
    display: inline-block;
    font-size: 20rpx;
    color: #F29469;
    background-color: #fff;
    padding: 4rpx;
    border-radius: 4rpx 8rpx;
    transform: translateX(-50%);
    top: -46rpx;
  }
  .percentBox::after {
    content: "";
    width: 18rpx;
    height: 18rpx;
    border-radius: 18rpx;
    background-color: #fff;
    position: absolute;
    top: 40rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .mainBox {
    padding: 0 30rpx;
  }
  .goBox {
    padding: 20rpx 20rpx;
    background-color: #fff;
    border-radius: 20rpx;
    width: 320rpx;
    box-shadow: 0 0 4rpx 4rpx rgba(34, 34, 34, 8%);
    margin-top: 24rpx;
    margin-bottom: 60rpx;
  }
  .inlineBlock {
    display: inline-block;
  }
  .goBox .cuIcon-vip {
    font-size: 52rpx;
    color: #F29469;
    vertical-align: middle;
  }
  .goBox .cuIcon-shop {
    font-size: 52rpx;
    color: #F29469;
    vertical-align: middle;
  }
  .goBox .title1 {
    font-size: 26rpx;
    font-weight: bold;
  }
  .goBox .title2 {
    font-size: 20rpx;
    color: #666;
  }
  .goBox .inlineBlock {
    vertical-align: middle;
    margin-left: 20rpx;
  }
  .mainTitle {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
  }
  .trapezoidBox {
    width: 640rpx;
    height: 140rpx;
    margin: 0 auto;
    background-image: linear-gradient(to right,#FFC8A1,#FAAF83);
    border-radius: 10rpx;
    padding: 30rpx 70rpx;
  }
  .trapezoid{
    width:150rpx;
    height:120rpx;
    text-align:center;
    color:#FFCCAB;
    background-color:#333;
    font-size: 28rpx;
    position: absolute;
    top: 50%;
    right: -20rpx;
    transform: translateY(-50%);
    border-radius: 10rpx;
    margin-left: 50rpx;
    border-top-left-radius: 40rpx;
    padding: 20rpx 40rpx;
  }
  .trapezoid:before{
    content:'';
    display:block;
    width:50rpx;
    height:120rpx;
    position:absolute;
    transform:skewX(-20deg);
    background:#333;
    border-top-left-radius:10rpx;
    border-bottom-left-radius:10rpx;
    left:-14rpx;
    top:0;
  }
  .memRechargePrice {
    font-size: 40rpx;
    color: #EE4C40;
    font-weight: bold;
    line-height: 1;
  }
  .memRechargePoint {
    font-size: 22rpx;
    color: #7A2212;
    font-weight: bold;
  }
  .tips {
    display: inline-block;
    font-size: 20rpx;
    color: #7A2212;
    height: 32rpx;
    line-height: 32rpx;
    border-radius: 32rpx;
    padding: 0 14rpx;
    background-color: #FFCCAB;
    vertical-align: middle;
    font-weight: normal;
    margin-left: 20rpx;
  }
  .rechargeList {
    width: 280rpx;
    height: 190rpx;
    border-radius: 12rpx;
    background-color: #fff;
    /* border: 1px solid #F29469; */
    margin: 0 auto;
    margin-bottom: 40rpx;
    position: relative;
  }
  .rechargeList::after {
    width: 280rpx;
    border-radius: 12rpx;
    height: 190rpx;
    border: 1px solid #F29469;
    content: "";
    position: absolute;
    top: -2rpx;
    left: -2rpx;
  }
  .recharge {
    margin-top: 30rpx;
  }
  .rechargeLevelName {
    background-color: #F29469;
    color: #fff;
    width: 170rpx;
    height: 42rpx;
    font-size: 24rpx;
    text-align: center;
    line-height: 42rpx;
    border-top-left-radius: 12rpx;
    border-bottom-right-radius: 12rpx;
  }
  .rechargeList .price {
    font-size: 34rpx;
    color: #F29469;
    margin-top: 38rpx;
    line-height: 1;
    margin-bottom: 19rpx;
    font-weight: bold;
  }
  .rechargeList .point {
    font-size: 22rpx;
  }
  .rechargeList .checkBox {
    width: 60rpx;
    height: 42rpx;
    line-height: 42rpx;
    border-top-left-radius: 12rpx;
    border-bottom-right-radius: 12rpx;
    background-color: #333;
    color: #fff;
    position: absolute;
    bottom: -1px;
    right: -1px;
    display: none;
  }
  .rechargeBox.active .rechargeList {
    background-image: linear-gradient(to right,#FFC8A1,#FAAF83);
    border: 0;
  }
  .rechargeBox.active .rechargeList::after {
    content: none;
  }
  .rechargeBox.active .rechargeLevelName {
    background-color: #333;
    color: #fff;
  }
  .rechargeBox.active .rechargeList .price {
    color: #EE4C40;
  }
  .rechargeBox.active .rechargeList .point {
    color: #7A2212;
  }
  .rechargeBox.active .rechargeList .checkBox {
    display: block;
    bottom: 0;
    right: 0;
  }
  .confirm {
    height: 80rpx;
    line-height: 80rpx;
    font-weight: bold;
    margin-top: 40rpx;
  }
  .topTitle .cuIcon-back {
    position: absolute;
    left: 30rpx;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
