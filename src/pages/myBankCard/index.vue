<template>
  <view class="pages">
    <scroll-view scroll-y="true" style="height: 80%;">
      <view class="li">1</view>
      <view class="li">1</view>
    </scroll-view>
    <view class="bg-red addCard" @click="goUrl('addBankCard')">添加银行卡</view>
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
        cardInfo:[]
      }
    },
    onLoad() {
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '我的银行卡',
      });
      this.getCardInfo();
    },
    computed: {
      ...mapState(["isLogin", "userInfo"]),
    },
    methods: {
      getCardInfo(){
        this.$fly.config.headers = {
          Authorization: this.userInfo.token,
        };
        this.$fly.post("/managerBank/query" ,{"userId":this.userInfo.id})
        .then((res) => {
          if(res.data.success){
            this.cardInfo = res.data.data
          }
        });
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
    position: fixed;
    height: 100%;
    width: 100%;
    display:flex;
    flex-direction:column; /*纵向显示*/
    align-items:center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    background: #f8f8f8;
  }
  scroll-view {
    padding: 20rpx 30rpx;
    position: absolute;
    top: 0;
  }
  .li {
    height: 226rpx;
    border-radius: 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  .addCard {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    position: absolute;
    width: 690rpx;
    border-radius: 80rpx;
    left: 30rpx;
    text-align: center;
    bottom: 20rpx;
    font-weight: bold;
    letter-spacing: 4rpx;
  }
</style>
