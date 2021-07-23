<template>
  <view class="card-page">
    <!-- <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="index==TabCur?'text-red cur':''" v-for="(item,index) in nav"
          :key="index" @click="tabSelect(index)" :data-id="index">
          {{item.name}}
        </view>
      </view>
    </scroll-view> -->

    <view class="text-center" v-if="voucherlist.length==0">
      <img src="/static/images/cart.png" alt="" class="noList">
      <view class="padding">{{desc}}</view>
    </view>
    <!-- 商品 -->
    <!-- <view class="cu-card article no-card solid-bottom" v-for="(item, index) in voucherlist" :key="index">
      <div class="coupon">
        <ul>
          <li>
            <div :class="[item.status==0?'cone':'cone2']">
              <div class="d2">{{item.cname}}</div>
              <div class="d1">
                <div>
                  <span>¥{{item.reduceMoney}}</span>

                </div>
                <div>
                  <p>{{item.title}}</p>
                  <p>满{{item.fullMoney}}使用</p>
                </div>
              </div>
              <div class="d3">
                <p>{{item.effectiveStartTime}}-{{item.effectiveEndTime}}</p>
                <button v-if="TabCur==0" @click="useCoupons(item)">立即使用</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </view> -->

    <view class="cu-card coupon no-card position cf" v-for="(item, index) in voucherlist" :key="index">
      <view class="tagName text-red text-center">{{item.cname}}</view>
      <view class="leftBox text-red text-center fl">
        <text class="text-price"></text>{{item.reduceMoney}}
      </view>
      <view class="midBox fl position text-red">
        <view class="absolute">
          <view class="title1">满{{item.fullMoney}}使用</view>
          <view class="title2">{{item.effectiveStartTime}}-{{item.effectiveEndTime}}</view>
          <view class="title2 text-cut">{{item.merchantName}}</view>
        </view>
      </view>
      <view class="rightBox fl text-center position">
        <view class="absolute text-red" @click="useCoupons(item)">立即使用</view>
        <!-- <view class="absolute bg-red" v-else @click="receive(item.couponId,index)">立即领取</view> -->
      </view>
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
    data() {
      return {
        TabCur: 0,
        scrollLeft: 0,
        desc: '暂无可用优惠券~',
        voucherlist: [],
        merchInfo:"",
        nav: [{
          id: 1,
          name: '未使用',
          desc: '暂无可用优惠券~'
        }],
      };
    },
    computed: {
      ...mapState(["isLogin", "cartCount", "userInfo"]),
    },
    onLoad(options) {
      this.tabSelect(0)
      this.orderParams = options.orderParams;
      this.address = options.address;
      this.merchInfo = JSON.parse(options.merchInfo);
    },
    methods: {
      tabSelect(index) {
        this.TabCur = index;
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.voucherlist = [];
        let url = "/users/coupons?status=" + index;
        this.$fly.get(url).then(res => {
          res.data.data.platformCouponVo.forEach((item, index) => {
            item.effectiveStartTime = this.formatDate(new Date(item.effectiveStartTime));
            item.effectiveEndTime = this.formatDate(new Date(item.effectiveEndTime));
            item.cname = "平台优惠券";
            this.voucherlist.push(item);
          })
          res.data.data.merchantCouponVo.forEach((item, index) => {
            item.effectiveStartTime = this.formatDate(new Date(item.effectiveStartTime));
            item.effectiveEndTime = this.formatDate(new Date(item.effectiveEndTime));
            item.cname = "店铺优惠券";
            this.voucherlist.push(item);
          })
        });
      },
      formatDate(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        return year + "/" + month + "/" + date;
      },
      useCoupons(item) {
        if(item.merchantId == 0){
          if(item.fullMoney<=this.merchInfo.allPrice){
            this.goUrl(item)
          }else {
            wx.showToast({
              title: '不符合使用条件',
              icon: "none"
            })
          }
        }else {
          var canUse = false;
          for(var i=0;i<this.merchInfo.merchantSkuItems.length;i++){
            var list = this.merchInfo.merchantSkuItems[i]
            if(list.merchantId==item.merchantId){
              if(list.payPrice>=item.fullMoney){
                canUse = true;
                this.goUrl(item);
                break;
              }
            }
          }
          if(canUse == false){
            wx.showToast({
              title: '不符合使用条件',
              icon: "none"
            })
          }
        }
      },
      goUrl(item){
        if(this.orderParams!=undefined){
            wx.redirectTo({
              url: '/pages/createOrder/main?couponId=' + item.userCouponId + '&discountAmount=' + item.reduceMoney + '&address=' +this.address + '&orderParams=' + this.orderParams + '&flag=' + item.merchantId
            });
        }else {
            wx.redirectTo({
              url: '/pages/createOrder/main?couponId=' + item.userCouponId + '&discountAmount=' + item.reduceMoney + '&address=' +this.address + '&flag=' + item.merchantId
            });
        }
      }
    }
  }
</script>
<style lang='scss'>
  /* 空购物车 */
  page,
  .card-page {
    height: 100%;
    background: #fff;
  }

  .contain {
    height: 100%;
    text-align: center;
  }

  .noList {
    width: 596rpx;
    height: 328rpx;
    margin-top: 200rpx;
  }

  .cu-btn {
    border-radius: 0;
    padding: 0 80rpx;
  }


  .coupon {
    width: 680rpx;
    height: 180rpx;
    border-radius: 12rpx;
    background-color: #FFF6F1;
    margin: 0 auto;
    margin-top: 20rpx;
    padding: 36rpx 0;
    .tagName {
      width: 180rpx;
      height: 36rpx;
      line-height: 36rpx;
      font-size: 22rpx;
      font-weight: bold;
      border-top-left-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
      background-color: #FFEBED;
      position: absolute;
      top: 0;
      left: 0;
    }
    .leftBox {
      width: 180rpx;
      height: 108rpx;
      line-height: 108rpx;
      font-size: 60rpx;
      font-weight: bold;
    }
    .midBox {
      width: 318rpx;
      height: 108rpx;
      padding: 0 35rpx;
      padding-right: 15rpx;
      border-right: 1px dashed var(--red);
      .absolute {
        position: absolute;
        width: 268rpx;
        top: 50%;
        line-height: 1;
        transform: translateY(-50%);
        .title1 {
          font-size: 30rpx;
        }
        .title2 {
          font-size: 20rpx;
          margin-top: 20rpx;
        }
      }
    }
    .rightBox {
      width: 180rpx;
      height: 108rpx;
      .absolute{
        width: 110rpx;
        height: 36rpx;
        line-height: 36rpx;
        font-size: 22rpx;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 6rpx;
      }
    }
  }


</style>
