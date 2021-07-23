<template>
  <view class="order-page">
    <!-- 地址 -->
    <view
      class="case cu-card no-card addressBox bg-white flex justify-between align-center padding-lr margin-tb"
      style="background-image: url(/static/images/address-bg.png);"
      v-if="address.id==undefined"
      @click="selectAddress"
    >
      <text class="cuIcon-locationfill text-orange"></text>
      <view class="newAddress">
        请选择一个收货地址
      </view>
      <text class="cuIcon-right text-gray"></text>
    </view>

    <view
      class="case cu-card no-card addressBox bg-white flex justify-between align-center padding-lr margin-tb"
      style="background-image: url(/static/images/address-bg.png);"
      @click="selectAddress"
      v-else
    >
      <text class="cuIcon-locationfill text-orange"></text>
      <view class="cu-item flex-sub">
        <view class="padding">
          <view class="flex justify-between text-lg">
            <view class="">收货人：{{ address.name }}</view>
            <view class="">{{ address.phone }}</view>
          </view>
          <view class="text-grey padding-top-sm address">
            收货地址：{{
              address.province +
              " " +
              address.city +
              " " +
              address.area +
              " " +
              address.address
            }}
          </view>
        </view>
      </view>
      <text class="cuIcon-right text-gray"></text>
    </view>

    <!-- 商品 -->
    <view
      class="cu-list menu margin--top"
      v-for="(item, index) in orderGoods.merchantSkuItems"
      :key="index"
    >
      <view class="cu-item">
        <view class="content flex justify-between">
          <view class="text-grey">
            <text class="cuIcon-shop lg text-red"></text>
            {{ item.merchantName }}
          </view>
          <text class="text-grey">{{ item.productSkus.length }}件商品</text>
        </view>
      </view>

      <view
        class="cu-card article no-card solid-bottom"
        v-for="(itemList, indexList) in item.productSkus"
        :key="indexList"
      >
        <view class="cu-item shadow padding-tb">
          <view class="content padding-left-sm">
            <image :src="itemList.productCover?itemList.productCover:'/static/images/default.png'" mode="aspectFill"></image>
            <view class="desc">
              <view class="titles nowrap">
                {{ itemList.productName }}
              </view>
              <view>
                <view class="cu-tag radius sm">{{ itemList.attrsNames }}</view>
              </view>
              <view class="flex align-end justify-between">
                <view class="margin-top-sm">
                  <view class="text-price text-lg margin-right text-red">{{
                    itemList.price
                  }}</view>
                </view>
                <view class="button-box text-gray">
                  <text class="margin-lr-sm">x {{ itemList.quantity }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券和备注 -->
    <!-- <view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange"></text> 菜单列表
			</view>
		</view> -->
    <view class="cu-list menu">
      <view class="cu-item arrow" @click="selectVouchers" v-if="typeCar!=2||typeCar!=1">
        <view class="content flex justify-between">
          <text class="">优惠券</text>
        </view>
      </view>
      <view class="cu-form-group">
        <view class="title">备注</view>
        <input placeholder="口味、偏好等要求" name="input" class="text-right" v-model="buyerMessage" />
      </view>
    </view>

    <!-- 结算列表 -->
    <view class="cu-card padding bg-white margin-top text-lg">
      <view class="content text-content flex justify-between">
        <text class="text-black">商品总价</text>
        <text class="text-price">{{ allPrice }}</text>
      </view>
      <view class="content text-content flex justify-between">
        <text class="text-black">运费</text>
        <text v-if="expressPrice == 0">包邮</text>
        <text class="text-price" v-else>{{ expressPrice }}</text>
      </view>
      <view class="content text-content flex justify-between" v-if="orderGoods.typeValueText">
        <text class="text-black">优惠折扣</text>
        <text class="text-red">{{ orderGoods.typeValueText }}</text>
      </view>
      <view class="content text-content flex justify-between">
        <text class="text-black">优惠金额</text>
        <text v-if="discountAmount == 0">无</text>
        <text class="text-red" v-else>
          -
          <text class="text-price">{{ discountAmount }}</text>
        </text>
      </view>
      <view class="content text-content flex justify-between" v-if="typeCar!=2">
        <text class="text-black">积分抵扣</text>
        <text class="text-price">{{ orderGoods.canUsePoint }}</text>
      </view>
    </view>
    <!-- 支付方式选择 -->
    <view class="cu-card padding bg-white margin-top text-lg">
      <radio-group @change="radioChange" class="cu-card">
        <view class="content text-content flex justify-between">
          <view>
            <image src="/static/images/pay.png" class="payImg" mode="widthFix"></image>
            <text class="text-black text-sm">
              购物卡：<text class="text-price margin-right-xs">{{clubCardMoney}}</text>
              <text class="text-red">推荐</text>
            </text>
          </view>
          <radio value="clubCard" class="round payWay" :checked="checked"/>
        </view>
        <view class="content text-content flex justify-between">
          <view>
            <image src="/static/images/wechat.png" class="payImg" mode="widthFix"></image>
            <text class="text-black text-sm">
              微信支付
            </text>
          </view>
          <radio value="wechat" class="round payWay" :checked="!checked" v-if="!justClubCard"/>
        </view>
      </radio-group>
    </view>

    <!-- 结算按钮 -->
    <view class="cu-bar bg-white tabbar border shop solid-top">
      <view class="action text-xl">
        应付金额：
        <text class="text-price text-xxl text-red">{{ allPrice }}</text>
      </view>
      <view class="bg-red submit" @click="createOrder">支付订单</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      orderParams:{},
      list: [],
      payinfo: {},
      payWay: "clubCard",
      checked:true,
      justClubCard:false,
      clubCardMoney: 0,
      address: {},
      couponId: -1,
      couponPrice: 0,
      typeCar: 0,
      buyerMessage:'',
      // expressPrice: 2000,
      discountAmount: 0,
    };
  },
  // watch:{
  //   allPrice:function(val,oldVal){
      
  //   }
  // },
  computed: {
    ...mapState(["userInfo", "cartList", "orderGoods", "cartPrice","cartIds"]),
    // 配送费
    expressPrice: function () {
      let logisticsPrice = 0;
      this.orderGoods.merchantSkuItems.forEach((item,index)=>{
        logisticsPrice+=item.logisticsPrice
      })
      return logisticsPrice;
    },
    // 商品总数
    allCount: function () {
      let sum = 0;
      this.orderGoods.merchantSkuItems.forEach((item) => {
        sum += item.count;
      });
      return sum;
    },

    // 总付款金额
    allPrice: function () {
      if(this.typeCar==2){
        return (
          Number(this.cartPrice)
        ).toFixed(2);
      }else {
        return (
          Number(this.orderGoods.payPrice - this.discountAmount)
        ).toFixed(2);
      }
    },
  },
  onLoad(options) {
    //console.log("创建订单", options); 
    this.getUserInfo();
    this.groupUserJoinId = Number(options.groupUserJoinId)||0;
    this.bargainUserJoinId = Number(options.bargainUserJoinId)||0;
    this.discountId = options.discountId||0;
    this.couponId = options.couponId||-1;
    this.discountAmount = options.discountAmount||0;
    this.orderParams=  options.orderParams;
    this.payWay = 'clubCard';
    if(options.typeCar){
      this.typeCar = options.typeCar;
    }
    this.flag = options.flag||0;//是否时平台优惠券
    //活动类型 1满N件N折 2第二件半价  3 满减
    if(this.orderGoods.types==1){
      var list = this.orderGoods.typeValue.split(',');
      this.orderGoods.typeValueText = '满'+list[0]+'件'+(list[list.length-1]*10).toFixed(2)+'折'
    }else if(this.orderGoods.types==2){
      this.orderGoods.typeValueText = '第二件半价'
    }else if(this.orderGoods.types==3){
      var list = this.orderGoods.typeValue.split(',');
      this.orderGoods.typeValueText = '满'+list[0]+'减'+list[list.length-1]
    }
    if(options.address){
      this.address = JSON.parse(options.address);
    }else {
      this.address = this.orderGoods.defaultAddress
    }
  },
  methods: {
    getUserInfo() {
      this.$fly.config.headers = {
        "X-Tag": "flyio",
        "Authorization": this.userInfo.token
      }
      this.$fly.get('/users/' + this.userInfo.id).then(res => {
        this.clubCardMoney= res.data.data.money || 0;
        if(this.clubCardMoney>0){
          this.payWay = 'clubCard';
          this.checked = true;
        }else {
          this.payWay = 'wechat';
          this.checked = false;
        }
        if(Number(this.allPrice) == 0){
          this.payWay = 'clubCard';
          this.checked = true;
          this.justClubCard = true;
        }else{
          this.justClubCard = false;
        }
      })
    },
    selectAddress() {
      if(this.orderParams!=undefined){
        wx.navigateTo({
          url: '/pages/addresslist/main?isFrom=order&orderParams=' + this.orderParams + '&couponId=' + this.couponId + '&discountAmount=' + this.discountAmount + '&flag=' + this.flag,
        });
      }else{
        wx.navigateTo({
          url: '/pages/addresslist/main?isFrom=order' + '&couponId=' + this.couponId + '&discountAmount=' + this.discountAmount + '&flag=' + this.flag,
        });
      }
    },
    radioChange(e){//获取支付方式
      this.payWay = e.target.value
    },
    selectVouchers() {
      this.orderGoods.allPrice = this.allPrice
      if(this.typeCar==2){
        wx.showToast({
          icon: 'none',
          title: '秒杀商品无法使用优惠券',
        })
      }else {
        if(this.orderParams!=undefined){
          wx.navigateTo({
            url: '/pages/myCoupons/main?orderParams=' + this.orderParams + '&address=' + JSON.stringify(this.address) + '&merchInfo=' + JSON.stringify(this.orderGoods),
          });
        }else{
          wx.navigateTo({
            url: '/pages/myCoupons/main?merchInfo=' + JSON.stringify(this.orderGoods),
          });
        }
      }
    },
    payOrder(payId,orderId){
      var that = this
      if(this.payWay == 'wechat'){
        this.$fly.post("/pay?payId="+payId+"&type=3&openId="+this.userInfo.openid).then((respay) => {
          if (respay.data.success) {
            let payInfo = JSON.parse(respay.data.data);
            wx.requestPayment({
              timeStamp: payInfo.timeStamp,
              nonceStr: payInfo.nonceStr,
              package: payInfo.packageValue,
              signType: payInfo.signType,
              paySign: payInfo.paySign,
              success: function (res) {
                wx.showModal({
                  title: '提示', 
                  content: '微信支付成功',
                  showCancel: false,
                  success (res) {
                    if (res.confirm) {
                      if(that.typeCar == 3||that.typeCar == 4){
                        wx.navigateTo({ url: '/pages/payment/main?typeCar=' + that.typeCar + '&orderId=' + orderId });
                      }else {
                        wx.switchTab({
                          url: '/pages/personal/main'
                        })
                      }
                    }
                  }
                })
              },
              fail: function (res) {
                wx.showModal({
                  title: '提示', 
                  content: '微信支付失败',
                  showCancel: false,
                  success (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '/pages/personal/main'
                      })
                    }
                  }
                })
              },
              complete: function (res) {
                
              },
            });
          }
        });
      }else {
        wx.showModal({
          title: '提示',
          content: '确认购买？',
          success (res) {
            if (res.confirm) {
              that.$fly.post("/pay?payId="+payId+"&type=0").then((resp) => {
                if (resp.data.success) {
                  wx.showModal({
                    title: '提示', 
                    content: '购物卡支付成功',
                    showCancel: false,
                    success (res) {
                      if (res.confirm) {
                        if(that.typeCar == 3||that.typeCar == 4){
                          wx.navigateTo({ url: '/pages/payment/main?typeCar=' + that.typeCar + '&orderId=' + orderId });
                        }else {
                          wx.switchTab({
                            url: '/pages/personal/main'
                          })
                        }
                      }
                    }
                  })
                }
              });
            }else if(res.cancel){
              wx.switchTab({
                url: '/pages/personal/main'
              })
            }
          }
        })
      }
    },
    createOrder() {
      this.orderGoods.merchantSkuItems.forEach((item,index)=>{
        item.logisticsType = 0
      })
      if(!this.address.id){
        wx.showToast({
          title: '请选择收货地址', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
        });
        return
      }
      let params ="";
      if(this.orderParams!=undefined){        
        params = JSON.parse(this.orderParams);
        if(this.flag==0){//是平台优惠券
          params.platformUserCouponId=this.couponId;
        }else {//店铺优惠券
          params.productItems[0].merchantUserCouponId = this.couponId
        }
        params.buyerMessage = this.buyerMessage;
        params.addressId = this.address.id;
      }else{
        params = {
          productItems: this.orderGoods.merchantSkuItems,
          payType: 0,
          addressId: this.address.id,
          usePoint: true,
          cartIds: this.cartIds,
          type: 0,
          buyerMessage: this.buyerMessage,
        };
        if(this.flag==0){//是平台优惠券
          params.platformUserCouponId=this.couponId;
        }else {//店铺优惠券
          params.productItems.forEach((item,index)=>{
            if(item.merchantId == this.flag){
              item.merchantUserCouponId = this.couponId
            }
          })
          // params.merchantUserCouponId=this.couponId;
        }
      }
      //判断是否是秒杀购买 1为砍单 2为秒杀购买 3为参加团 4自己开团
      if(this.typeCar == 2){
        // 这儿请求服务器，创建order，获取预支付ID  秒杀订单
        params = {
          "addressId": this.address.id,
          "payType": 1,
          "buyerMessage": this.buyerMessage,
          "discountId": this.discountId,
          "merchantId": this.orderGoods.merchantSkuItems[0].merchantId,
          "quantity": 1,
          "logisticsType": this.orderGoods.merchantSkuItems[0].logisticsPrice,
        }
        this.$fly.post("/flashsale/buyNow", params).then((res) => {
          if (res.data.success) {
            var payId = res.data.data.payId;
            //根据预支付ID和openID调用小程序支付接口
            this.payOrder(payId)
          }
        });
      }else if(this.typeCar == 1){
        // 这儿请求服务器，创建order，获取预支付ID 砍单订单
        params = {
          "addressId": this.address.id,
          "payType": 2,
          "marketingType": 2,
          "buyerMessage": this.buyerMessage,
          "discountId": '',
          "merchantId": this.orderGoods.merchantSkuItems[0].merchantId,
          "productSkuId": this.orderGoods.merchantSkuItems[0].productSkus[0].skuId,
          "quantity": 1,
          "logisticsType": this.orderGoods.merchantSkuItems[0].logisticsPrice,
          "bargainUserJoinId": this.bargainUserJoinId
        }
        this.$fly.post("/bargain/order", params).then((res) => {
          if (res.data.success) {
            var payId = res.data.data.payId;
            //根据预支付ID和openID调用小程序支付接口
            this.payOrder(payId)
          }
        });
      }else if(this.typeCar == 3){
        // 这儿请求服务器，创建order，获取预支付ID 加入拼团
        params = {
          "addressId": this.address.id,
          "payType": 3,
          "buyerMessage": this.buyerMessage,
          "discountId": this.orderGoods.merchantSkuItems[0].productSkus[0].discountId,
          "merchantId": this.orderGoods.merchantSkuItems[0].merchantId,
          "quantity": this.orderGoods.merchantSkuItems[0].productSkus[0].quantity,
          "logisticsType": this.orderGoods.merchantSkuItems[0].logisticsPrice,
          "groupUserJoinId": this.groupUserJoinId
        }
        console.log(params,'购买参数')
        this.$fly.post("/group/join", params).then((res) => {
          if (res.data.success) {
            var payId = res.data.data.payId;
            var orderId = res.data.data.orderIds[0];
            //根据预支付ID和openID调用小程序支付接口
            this.payOrder(payId,orderId)
          }
        });
      }else if(this.typeCar == 4){
        // 这儿请求服务器，创建order，获取预支付ID 创建拼团
        params = {
          "addressId": this.address.id,
          "payType": 3,
          "buyerMessage": this.buyerMessage,
          "discountId": this.orderGoods.merchantSkuItems[0].productSkus[0].discountId,
          "merchantId": this.orderGoods.merchantSkuItems[0].merchantId,
          "quantity": this.orderGoods.merchantSkuItems[0].productSkus[0].quantity,
          "logisticsType": this.orderGoods.merchantSkuItems[0].logisticsPrice,
          "groupUserJoinId": this.groupUserJoinId
        }
        this.$fly.post("/group/start", params).then((res) => {
          if (res.data.success) {
            var payId = res.data.data.payId;
            var orderId = res.data.data.orderIds[0];
            //根据预支付ID和openID调用小程序支付接口
            this.payOrder(payId,orderId)
          }
        });
      }else{
        // 这儿请求服务器，创建order，获取预支付ID
        this.$fly.post("/orders/add", params).then((res) => {
          if (res.data.success) {
            var payId = res.data.data.payId;
            //根据预支付ID和openID调用小程序支付接口
            this.payOrder(payId)
          }
        });
      }
    },
  },
};
</script>

<style>
.addressBox {
  padding-bottom: 8rpx;
  background-repeat: repeat-x;
  background-position: bottom;
  background-size: 80rpx;
}

.newAddress {
  padding: 50rpx 0;
}

.order-page {
  padding-bottom: 130rpx;
}

.text-content {
  line-height: 2;
}

.address {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cu-card.article > .cu-item .content > image {
  width: 140rpx;
  height: 120rpx;
}

.tabbar {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 100;
}

.cu-bar.tabbar.shop .action {
  width: 500rpx;
  font-size: 32rpx;
  text-align: left;
  padding-left: 30rpx;
}

.cuIcon-shop {
  margin-right: 8rpx;
}
.payWay {
  scale: 0.7;
}
.payImg {
  width: 50rpx;
  vertical-align: -16rpx;
}
</style>
