<template>
  <view class="pages">
    <view class="walletCard position">
      <image src="/static/images/wallet.png" class="bgImg"></image>
      <view class="content">
        <view class="myWallet cf position">
          <text class="text-white text-lg text-bold">我的钱包</text>
          <text class="tips round">注册店长</text>
          <text class="tuichu fr">退出店长</text>
        </view>
        <view class="info position text-white">
          <view class="transfer">
            <view class="text-df margin-bottom-sm">待转账</view>
            <view class="text-lg text-bold"><text class="text-price"></text> {{walletInfo.unableMoney||0.00}}</view>
          </view>
          <view class="transfer position">
            <view class="text-df margin-bottom-sm">可提现</view>
            <view class="text-lg text-bold"><text class="text-price"></text> {{walletInfo.enableMoney||0.00}}</view>
            <view class="tixian">提现 ></view>
          </view>
        </view>
      </view>
    </view>
    <view class="li1 cf">
      <text class="fl">我的钱包</text><text class="cuIcon-right fr text-grey text-xs"></text>
    </view>
    <view class="li1 cf" @click="goUrl('myBankCard')">
      <text class="fl">我的银行卡</text><text class="fr text-grey text-xs">添加<text class="cuIcon-right"></text></text>
    </view>
    <view class="lineGrey"></view>
    <view class="li1 cf" @click="goUrl('invited')">
      <text class="fl">我的邀请</text><text class="fr text-grey text-xs">查看全部<text class="cuIcon-right"></text></text>
    </view>
    <view class="li1 cf text-red">
      <text class="cuIcon-creative margin-right-xs"></text> <text class="text-sm">邀请满足120社员是成为店长的必要条件哦~</text>
    </view>
    <view class="li1 cf">
      <text class="fl text-sm">累计已邀请<text class="text-red"> {{userlist.inviteUsers.length||0}} </text>人</text>
      <text class="goInvited text-red">去邀请</text>
    </view>
    <view class="progress-box position">
      <progress :percent="userlist.inviteUsers.length>=120?'100':userlist.percent" color="#EE4C40" backgroundColor="#F29469"  border-radius="6" stroke-width="6" />
      <text class="minNum">0</text>
      <text class="maxNum">120</text>
      <view class="percentBox" :style="{'left':userlist.inviteUsers.length>=120?'100%':userlist.percent+'%'}">{{userlist.inviteUsers.length}}</view>
    </view>
    <view class="lineGrey"></view>
    <view class="li1 cf">
      <text class="fl text-lg">店长权益</text>
    </view>
    <view class="li1 cf">
      <view class="fl">
        <text class="text-red cuIcon-appreciate fl"></text>
        <view class="fl jieshao">
          <view>商家推荐</view>
          <view class="text-grey">向平台推荐商家即可获得积分哦</view>
        </view>
      </view>
      <text class="text-red text-xs fr">去推荐<text class="cuIcon-right"></text></text>
    </view>
  </view>
</template>

<script>
  import { formatDate,formatTime } from '@/utils/index'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
        walletInfo: {},
        userlist: {}
      }
    },
    onLoad() {
      this.getInfo();
      this.getUserInfo();
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '店长钱包',
      });
    },
    computed: {
      ...mapState(["isLogin", "userInfo"]),
    },
    methods: {
      getInfo(){
        this.$fly.config.headers = {
          Authorization: this.userInfo.token,
        };
        this.$fly.get("/users/wallet/" +this.userInfo.id)
        .then((res) => {
          if(res.data.success){
            this.walletInfo = res.data.data
          }
        });
      },
      getUserInfo() {
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          "Authorization": this.userInfo.token
        }
        this.$fly.get('/users/invite-users').then(res => {
					res.data.data.percent = ((res.data.data.inviteUsers.length/120)*100).toFixed(2);
					this.userlist=res.data.data
				})
      },
      goUrl(name){
        wx.navigateTo({
          url: '/pages/'+name+'/main',
        })
      }
    }
  }

</script>

<style>
  page {
    background-color: #fff;
  }
  .pages {
    padding: 20rpx 30rpx;
  }
  .walletCard {
    width: 100%;
    height: 240rpx;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
  }
  .walletCard .bgImg {
    width: 100%;
    height: 100%;
  }
  .walletCard .content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 30rpx;
  }
  .walletCard .content .myWallet {
    line-height: 42rpx;
    margin-bottom: 50rpx;
  }
  .myWallet .tips{
    background-color: #EE4C40;
    font-size: 20rpx;
    padding: 4rpx 6rpx;
    color: #fff;
    vertical-align: 4rpx;
    margin-left: 30rpx;
  }
  .myWallet .tuichu{
    background-color: #FEAFA5;
    font-size: 20rpx;
    padding: 0 6rpx;
    border-radius: 6rpx;
    color: #EE4C40;
    position: absolute;
    top: 5rpx;
    right: 0;
    height: 30rpx;
    line-height: 30rpx;
  }
  .info {
    width: 100%;
    height: 80rpx;
    line-height: 1.1;
  }
  .transfer {
    width: 310rpx;
    display: inline-block;
  }
  .tixian {
    width: 88rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-size: 20rpx;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 6rpx;
    position: absolute;
    right: 0;
    top: 30rpx;
  }
  .lineGrey {
    background-color: #f8f8f8;
    width: 750rpx;
    height: 40rpx;
    margin-left: -30rpx;
  }
  .li1 {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 26rpx;
    position: relative;
  }
  .cuIcon-creative {
    font-size: 34rpx;
  }
  .goInvited {
    width: 90rpx;
    font-size: 20rpx;
    height: 32rpx;
    line-height: 32rpx;
    border: 1px solid var(--red);
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }
  .progress-box {
    margin-top: 26rpx;
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
  .cuIcon-appreciate {
    font-size: 40rpx;
  }
  .jieshao {
    line-height: 1.2;
    padding: 16rpx 0;
    font-size: 22rpx;
    margin-left: 20rpx;
    height: 80rpx;
  }
</style>
