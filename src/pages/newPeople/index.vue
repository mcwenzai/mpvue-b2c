<template>
  <view>
    <image
      src="http://zcyj-prod.oss-cn-hangzhou.aliyuncs.com/1596417711590newPeople.png"
      mode="widthFix"
      style="width:100%">
    </image>
    <view class="ul1 cf">
      <view class="fl" v-for="(item,index) in 6" :key="index">
        <view class="imgBox position"><image src="/static/images/sending.png" mode="widthFix"></image></view>
        <view class="text-cut title1">便携式小风扇便携式小风扇便携式小风扇便携式小风扇便携式小风扇</view>
        <view>
          <text class="text-red text-df"><text class="text-price"></text>1 <text class="oldPrice text-grey"><text class="text-price"></text>9.9</text></text>
        </view>
        <view class="buyBtn bg-red">立即抢购</view>
      </view>
    </view>
    <view class="text-df text-center margin-tb text-white">猜你喜欢</view>
    <view class="ul2 cf">
      <view class="fl" v-for="(item,index) in 4" :key="index">
        <view class="imgBox position"><image src="/static/images/sending.png" mode="widthFix"></image></view>
        <view class="text-cut title1">便携式小风扇便携式小风扇便携式小风扇便携式小风扇便携式小风扇</view>
        <view>
          <text class="text-red text-xl"><text class="text-price"></text>1 <text class="oldPrice text-grey"><text class="text-price"></text>9.9</text></text>
        </view>
        <view class="buyBtn bg-red">立即抢购</view>
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
    data() {
      return {
        goodsList: [],
        name:""
      }
    },
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: "新人专享",
      });
    },
    onUnload(){
      this.goodsList=[];
    },
    mounted() {

    },
    // onReachBottom() {
      
    // },
    computed: {
      ...mapState([
        'cartList',
        'userInfo'
      ]),
    },
    methods: {
      ...mapMutations(["update"]),
      goDetail(id, merchantId) {
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`
        })
      }
    }
  }

</script>
<style>
.descp {
  height: 76rpx;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bg-yellow.light {
  color: #a5673f;
  background-color: #f8e470;
}

.cu-card.article>.cu-item .content>image {
  height: 220rpx;
}

.tower-swiper .tower-item {
  transform: scale(calc(0.5 + var(--index) / 10));
  margin-left: calc(var(--left) * 100rpx - 150rpx);
  z-index: var(--index);
}
page {
  background: #F75000;
}
.flexItem {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  margin: 6rpx 6rpx 6rpx 0;
  display: inline-block;
}
.ul1 {
  padding: 0 20rpx;
}
.ul1>view {
  width: 228rpx;
  height: 350rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  margin-right: 13rpx;
  margin-top: 20rpx;
}
.ul1>view:nth-child(3n) {
  margin-right: 0;
}
.imgBox {
  border-radius: 10rpx;
  overflow: hidden;
}
.imgBox image {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.ul1 .imgBox {
  width: 208rpx;
  height: 208rpx;
}
.ul1 .title1 {
  font-size: 18rpx;
  color: #333;
  margin-top: 14rpx;
  margin-bottom: 14rpx;
}
.ul1 .oldPrice {
  font-size: 18rpx;
  text-decoration: line-through;
}
.buyBtn {
  line-height: 32rpx;
  font-size: 18rpx;
  font-weight: bold;
  border-radius: 6rpx;
  text-align: center;
  margin-top: 10rpx;
}
.ul2 {
  padding: 0 20rpx;
  margin-bottom: 50rpx;
}
.ul2>view {
  width: 344rpx;
  height: 544rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  margin-right: 13rpx;
  margin-top: 20rpx;
}
.ul2>view:nth-child(2n) {
  margin-right: 0;
}
.ul2 .imgBox {
  width: 324rpx;
  height: 324rpx;
}
.ul2 .title1 {
  font-size: 24rpx;
  color: #333;
  margin-top: 20rpx;
  margin-bottom: 32rpx;
}
.ul2 .oldPrice {
  font-size: 20rpx;
  text-decoration: line-through;
}
.ul2 .buyBtn {
  line-height: 38rpx;
  margin-top: 32rpx;
}
</style>
