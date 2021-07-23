<template>
  <view class="order-page" v-show="flag">
    <view class="status">
      <block v-if="list.orders[0].status == 0">
        <text>
          待支付
        </text>
        <image mode="heightFix" src="/static/images/obligation.png" class="statusImg"></image>
      </block>
      <block v-if="list.orders[0].status == 1">
        <text>
          待发货
        </text>
        <image mode="heightFix" src="/static/images/send.png" class="statusImg"></image>
      </block>
      <block v-if="list.orders[0].status == 2">
        <text>
          待收货
        </text>
        <image mode="heightFix" src="/static/images/sending.png" class="statusImg"></image>
      </block>
      <block v-if="list.orders[0].status == 10||list.orders[0].status == 11">
        <text>
          交易成功
        </text>
        <image mode="heightFix" src="/static/images/complete.png" class="statusImg"></image>
      </block>
    </view>
    <view class="case cu-card no-card addressBox bg-white flex justify-between align-center padding-lr margin-tb"
      style="background-image: url(/static/images/address-bg.png);">
      <text class="cuIcon-locationfill text-orange"></text>
      <view class="cu-item flex-sub">
        <view class="padding">
          <view class="flex justify-between text-lg">
            <view class="">收货人：{{ list.receiveName||'' }}</view>
            <view class="">{{ list.receivePhone||'' }}</view>
          </view>
          <view class="text-grey padding-top-sm list">
            收货地址：{{ list.receiveProvince + " "+list.receiveCity + " "+list.receiveArea + " " + list.receiveAddress }}
          </view>
        </view>
      </view>
    </view>

    <!-- 商品 -->
    <view class="cu-list menu margin-top" v-for="(item, index) in list.orders" :key="index">
      <view class="cu-item">
        <view class="content flex justify-between">
          <view class="text-grey">
            <text class="cuIcon-shop lg text-red"></text>
            {{item.merchantName}}
          </view>
          <text class="text-grey">{{ item.orderItems.length }}件商品</text>
        </view>
      </view>

      <view class="cu-card article no-card solid-bottom" v-for="(itemList, indexList) in item.orderItems"
        :key="indexList">
        <view class="cu-item shadow padding-tb">
          <view class="content padding-left-sm">
            <image :src="itemList.productCover?itemList.productCover:'/static/images/default.png'" mode="aspectFill"></image>
            <view class="desc">
              <view class="titles nowrap">
                {{ itemList.productName}}
              </view>
              <view>
                <view class="cu-tag radius sm">{{ itemList.skuAttrsName }}</view>
              </view>
              <view class="flex align-end justify-between">
                <view class="margin-top-sm">
                  <view class="text-price text-lg margin-right text-red">{{
                    itemList.perPayPrice
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

    <!-- 结算列表 -->
    <view class="cu-card padding bg-white margin-top text-lg">
      <view class="content text-content flex justify-between">
        <text class="text-black">商品总价</text>
        <text class="text-price">{{ list.totalPrice }}</text>
      </view>
      <view class="content text-content flex justify-between">
        <text class="text-black">运费</text>
        <text v-if="expressPrice == 0">包邮</text>
        <text class="text-price" v-else>{{ expressPrice }}</text>
      </view>
      <view class="content text-content flex justify-between">
        <text class="text-black">优惠金额</text>
        <text v-if="discountAmount == 0">无</text>
        <text v-else>
          -
          <text class="text-price">{{ discountAmount }}</text>
        </text>
      </view>
      <view class="content text-content flex justify-between">
        <text class="text-black">积分抵扣</text>
        <text class="text-price">{{ list.pointPrice }}</text>
      </view>
      <view class="content text-content flex justify-between">
        <text class="text-black">小计</text>
        <text class="text-price text-red">{{ list.payPrice }}</text>
      </view>
    </view>
    <!-- 支付方式选择 -->
    <view class="cu-card padding bg-white margin-top text-lg" v-if="list.orders[0].status==0">
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
          <radio value="wechat" class="round payWay" :checked="!checked"  v-if="!justClubCard"/>
        </view>
      </radio-group>
    </view>
    <!-- 结算按钮 -->
    <view class="cu-bar bg-white tabbar border shop solid-top" v-if="list.orders[0].status==0">
      <view class="action text-xl">
        应付金额：
        <text class="text-price text-xxl text-red">{{ list.payPrice }}</text>
      </view>
      <view class="bg-red submit" @click="createOrder">支付订单</view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from "vuex";

  export default {
    data() {
      return {
        hasAddress: true,
        //   保存列表
        list: [],
        payinfo: [],
        address: {},
        // expressPrice: 2000,
        discountAmount: 0,
        payWay:"clubCard",
        checked:true,
        justClubCard:false,
        flag: false,
        clubCardMoney: 0
      };
    },
    computed: {
      ...mapState(["userInfo", "cartList", "orderGoods", "cartPrice"]),
      // 配送费
      expressPrice: function () {
        
        let logisticsPrice = 0;
        if(this.list.orders){
          this.list.orders.forEach((item,index)=>{
            logisticsPrice+=item.logisticsPrice
          })
        }
        return logisticsPrice;
      },
    },
    onLoad(options) {
      
      this.payWay = 'clubCard';
      this.payinfo = JSON.parse(options.order);
      this.loadInfo();
      this.flag = false;    
    },
    onShow() {
      
    },
    methods: {
      loadInfo() {
        var params = {
          payId:this.payinfo.payId,
          orderId:this.payinfo.orderId
        }
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.$fly.get("/orders/detail",params).then((res) => {
          
          this.list = res.data.data;
          this.discountAmount = this.list.platformDiscountPrice + this.list.merchantDiscountPrice;
          this.flag = true
          this.getUserInfo();
        })
      },
      getUserInfo() {//获取购物卡余额
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
          if(this.list.payPrice == 0){
            this.payWay = 'clubCard';
            this.checked = true;
            this.justClubCard = true;
          }else{
            this.justClubCard = false;
          }
        })
      },
      radioChange(e){//获取支付方式
        this.payWay = e.target.value
      },
      selectAddress() {
        wx.navigateTo({
          url: `/pages/selectAddress/main`
        });
      },
      selectVouchers() {
        wx.navigateTo({
          url: `/pages/vouchers/main`
        });
      },
      randomWord() {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
          'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e',
          'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ];
        var nums = "";
        for (var i = 0; i < 32; i++) {
          var id = parseInt(Math.random() * 61);
          nums += chars[id];
        }
        return nums;
      },
      createOrder() {
        // this.list.orders.forEach((item,index)=>{
        //   item.productSkus = item.orderItems
        // })
        // let params = {
        //   productItems: this.list.orders,
        //   payType: 0,
        //   addressId: this.address.id,
        //   platformUserCouponId: -1,
        //   usePoint: true,
        //   cartIds: '',
        //   type: 0,
        //   buyerMessage: "",
        // };
        //根据预支付ID和openID调用小程序支付接口
        if(this.payWay == 'wechat'){
          this.$fly.post("/pay?payId="+this.payinfo.payId+"&type=3&openId="+this.userInfo.openid).then((respay) => {
            if (respay.data.success) {
              let payInfo = JSON.parse(respay.data.data);
              wx.requestPayment({
                timeStamp: payInfo.timeStamp,
                nonceStr: payInfo.nonceStr,
                package: payInfo.packageValue,
                signType: payInfo.signType,
                paySign: payInfo.paySign,
                success: function (res) {},
                fail: function (res) {},
                complete: function (res) {
                  wx.switchTab({
                    url: '/pages/personal/main'
                  })
                },
              });
            }
          });
        }else {
          var that = this;
          wx.showModal({
            title: '提示',
            content: '确认购买？',
            success (res) {
              if (res.confirm) {
                that.$fly.post("/pay?payId="+that.payinfo.payId+"&type=0").then((resp) => {
                  if (resp.data.success) {
                    wx.showToast({
                      title: '购物卡支付成功',
                      icon: 'success'
                    })
                    wx.switchTab({
                      url: '/pages/personal/main'
                    })
                  }
                });
              }
            }
          })
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

  .cu-card.article>.cu-item .content>image {
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
  .status {
    height: 210rpx;
    line-height: 210rpx;
    background-color: #fff;
    padding: 0 60rpx;
    font-size: 30rpx;
    position: relative;
  }
  .statusImg {
    height: 140rpx;
    position: absolute;
    right: 60rpx;
    top: 50%;
    transform: translateY(-50%);
  }
  .payWay {
  scale: 0.7;
  }
  .payImg {
    width: 50rpx;
    vertical-align: -16rpx;
  }
</style>
