<template>
  <view class="pages">
    <view class="li1 text-grey">
      请绑定持卡人本人的银行卡
    </view>
    <view class="li2 cf">
      <view class="fl text-df"><text class="text-red">*</text> 银行名称</view>
      <view class="fr">
        <!-- <input class="fl input" type="text" :model="bankName" placeholder="请选择银行名称"> -->
        <picker class="input fl" @change="bindPickerChange" :value="index" :range="array">
          <view class="picker">
            {{array[index]}}
          </view>
        </picker>
        <text class="cuIcon-right fr"></text>
      </view>
    </view>
    <view class="li2 cf">
      <view class="fl text-df"><text class="text-red">*</text> 银行卡</view>
      <view class="fr">
        <input class="fl input" type="text" v-model="cardNumber" placeholder="请填写银行卡号">
      </view>
    </view>
    <view class="li2 cf">
      <view class="fl text-df"><text class="text-red">*</text> 姓名</view>
      <view class="fr">
        <input class="fl input" type="text" v-model="name" placeholder="请填写持卡人姓名">
      </view>
    </view>
    <view class="li2 cf">
      <view class="fl text-df"><text class="text-red">*</text> 手机号</view>
      <view class="fr">
        <input class="fl input" type="text" v-model="phone" placeholder="请填写预留手机号">
      </view>
    </view>
    <view class="tijiao bg-red" @click="submit">提交</view>
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
        cardInfo:[],
        cardNumber: "",
        name: "",
        phone: "",
        index: 0,
        array:["请选择银行名称","中国工商银行","中国建设银行","中国银行","中国农业银行","兴业银行","杭州银行","招商银行"]
      }
    },
    onLoad() {
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '添加银行卡',
      });
    },
    computed: {
      ...mapState(["isLogin", "userInfo"]),
    },
    methods: {
      bindPickerChange(e) {
        this.index = e.target.value
      },
      submit(){
        this.$fly.config.headers = {
          Authorization: this.userInfo.token,
        };
        var params = {
          "userId":this.userInfo.id,
          "bankName":this.array[this.index],
          "branchName":"",
          "holdName":this.name,
          "bankNum":this.cardNumber
        }
        this.$fly.post("/managerBank" ,params)
        .then((res) => {
          if(res.data.success){
            wx.navigateBack({
              complete: (res) => {},
            })
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
    background-color: #f8f8f8;
  }
  .li1 {
    height: 70rpx;
    line-height: 70rpx;
    font-size: 24rpx;
    padding: 0 20rpx;
  }
  .li2 {
    padding: 0 20rpx;
    height: 100rpx;
    line-height: 100rpx;
    background-color: #fff;
  }
  .li2>.fr {
    width: 528rpx;
  }
  .input {
    height: 100rpx;
    line-height: 100rpx;
    width: 500rpx;
  }
  .tijiao {
    line-height: 80rpx;
    height: 80rpx;
    border-radius: 80rpx;
    font-size: 28rpx;
    font-weight: bold;
    text-align: center;
    margin: 0 20rpx;
    margin-top: 80rpx;
  }
</style>
