　　　　　
<template>
  <view class="card-page">
    <view class="goodDetail cf">
      <view class="li" v-if="!isMe">
        <image :src="goodDetail.userAvatar?goodDetail.userAvatar:'/static/images/person.png'" class="head round"></image>
        <text class="title1">{{goodDetail.userNickname}}的订单</text>
        <view class="fr title2 text-red">现价：<text class="price-normal"></text>{{goodDetail.bargainedPrice}}</view>
      </view>
      <image class="fl" :src="goodDetail.cover?goodDetail.cover:'/static/images/default.png'"></image>
      <view class="fr">
        <view class="text-cut">{{goodDetail.productName}}</view>
        <view class="prices">
          <text class="msPrice text-red"><text class="text-price"></text> {{goodDetail.bargainTargetPrice}}</text>
          <text class="sPrice text-orange">砍单省 <text class="price-normal"></text>{{goodDetail.chajia}}</text>
        </view>
        <view class="cf timeDown">
          <view class="fl box">{{timeDown.hour}}</view><text class="fl">:</text>
          <view class="fl box">{{timeDown.minute}}</view><text class="fl">:</text>
          <view class="fl box">{{timeDown.second}}</view>
          <view class="fl color34">后{{statusName}}</view>
        </view>
      </view>
    </view>
    <view>
      <view class="words1 text-center" v-if="goodDetail.status==0">
        当前价格：<text class="text-red"><text class="price-normal"></text> {{goodDetail.bargainedPrice}}</text>
      </view>
      <view class="words1 text-center" v-if="goodDetail.status==0">
      加油！还差 <text class="text-red"><text class="price-normal"></text> {{goodDetail.spread}}</text> 就可以get到最低价了
      </view>
      <view class="words1 text-center" v-if="goodDetail.status==1&&isMe">
        <text class="text-red">砍价成功！请在活动结束前完成付款</text>
      </view>
      <view class="progress round">
        <view class="percent round" :style="{'width':goodDetail.percent + '%'}"></view>
      </view>
      <view class="buyBtn cf" v-if="isMe">
        <!-- <view class="fl round" v-if="goodDetail.status==0" @click="directBuy(0)">
          直接购买
        </view> -->
        <button
          open-type="share"
          class="fr round single"
          v-if="goodDetail.status==0"
          >
          邀朋友帮砍
        </button>
        <view class="fr round single" style="width:80%;margin:0 10%" v-if="goodDetail.status==1" @click="directBuy(1)">
          立即付款
        </view>
      </view>
      <view class="buyBtn cf" v-if="!isMe">
        <view class="fl round" @click="goUrl('bargainList')">
          我也参加
        </view>
        <view class="fr round" @click="help()">
          帮忙砍价
        </view>
      </view>
    </view>
    <view class="list">
      <view class="title">
        - 帮砍名单 -
      </view>
      <view class="bangkan">
        <view class="li" v-for="(item,index) in goodDetail.recordList" :key="index">
          <image :src="item.bargainUserAvatar?item.bargainUserAvatar:'/static/images/person.png'" class="head round"></image>
          <text class="title1 text-cut">{{item.bargainUserNickname}}</text>
          <!-- <view class="fr title2 text-red"><image src="/static/images/kanIcon.png"></image> 砍价<text class="price-normal"></text>{{item.bargainedPrice}}</view> -->
        </view>
      </view>
    </view>
    <view class="list">
      <view class="title">
        - 活动规则 -
      </view>
      <view class="rules">1、发起砍单后，邀请好友帮忙砍价，同一商品，一位好友只能帮忙砍价一次。</view>
      <view class="rules">2、砍单自发起到结束，时间为24小时，超过24小时视为无效。</view>
      <view class="rules">3、商品砍至系统设置价格时，即视为砍单成功，先付款先得（支付0.01元并确认邮寄地址）；</view>
      <view class="rules">4、 砍单商品订单发生退款行为，砍单金额作废，重新下单不享受该优惠。</view>
      <view class="rules">5、砍单结束前，如中途下单，已砍金额失效，按直接购买进行支付。</view>
      <view class="rules">6、砍单商品不能同时享有其他活动优惠，例如：代金券、积分抵扣等。</view>
      <view class="rules">7、本活动最终解释权归活动主办方所有。</view>
    </view>
    <view class="popUp" v-if="showMask">
      <view class="position text-center">
        <text class="close cuIcon-close lg text-white" @click="close"></text>
        <image
          src="/static/images/success.png"
          class="popUpBg2"
          >
        </image>
        <view class="mainBox" v-if="isMe">
          <view class="title1">报名成功！</view>
          <view class="title2">你已砍掉<text>{{goodDetail.recordList[0].bargainedPrice}}元</text></view>
          <view class="progress round">
            <view class="percent round" :style="{'width':goodDetail.percent + '%'}"></view>
          </view>
        </view>
        <view class="mainBox" v-else>
          <view class="title1">帮砍成功</view>
          <view class="title2">你已帮TA砍掉<text>{{goodDetail.recordList[0].bargainedPrice}}元</text></view>
          <view class="confirm round" @click="close">确 定</view>
        </view>
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
    data(){
      return{
        cutDown:"",
        timeDown:{
          hour: '00',
          minute: '00',
          second: '00'
        },
        id:"",
        uid:"",
        address:"",
        showMask: false,
        statusName:"结束",
        isMe: true,
        goodDetail:{}
      }
    },
    onUnload(){
      clearInterval(this.cutDown);
      this.goodDetail = {};
    },
    onLoad(options){
      this.id = options.id || 203;
      this.uid = options.uid || 4074;
      this.getDetail();
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '砍单详情',
      });
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.getDetail();
    },
    onShareAppMessage() {
      var that = this;
      return {
        title: that.goodDetail.productName,
        path: '/pages/bargainDetail/main?id='+that.goodDetail.id + '&uid=' + that.goodDetail.userId,
        imageUrl: that.goodDetail.cover,
        success: res => {},
        fail: () => {},
        complete: () => {}
      };
    },
    computed:{
			...mapState(["isLogin", "cartCount", "userInfo"]),
		},
    methods:{
      ...mapMutations(["update"]),
      goUrl(name){
        wx.navigateTo({ url: '/pages/'+name+'/main' });
      },
      directBuy(type){//直接购买
        var buyType = type;//0 为普通购买 1为砍单购买 
        this.$fly.config.headers = {
          Authorization: this.userInfo.token,
        },
        this.$fly.post('bargain/detail',{productAliasId:this.goodDetail.productAliasId,bargainProductId:this.goodDetail.bargainProductId}).then(res => {
          var goodDetail = res.data.data
          this.skuAttrsNames = "";
          goodDetail.productSkus[0].skuAttrs.forEach((item,index)=>{
            if(index == goodDetail.productSkus[0].skuAttrs.length-1) {
              this.skuAttrsNames+=item;
            }else{
              this.skuAttrsNames+=item + '-';
            }
          })
          this.$fly.get("/users/addresses/default").then((res) => {
            this.address = res.data.data;
          }),
          this.$fly.get("/merchants/" + goodDetail.merchantId).then((res) => {
            let merchantName = "";
            merchantName = res.data.data.name;
            var price = goodDetail.productSkus[0].showPrice;
            var skuId = goodDetail.productSkus[0].id;
            var params = {
              merchantId:goodDetail.merchantId,
              type:0,
              usePoint: true,
              skuItems: [{
                "skuId": skuId,
                "quantity": 1,
                "productAliasId":goodDetail.aliasId,
                "productId":goodDetail.productId,
                skuAttrsNames: this.skuAttrsNames,
              }]
            }
            let orderParams = {
              buyerMessage: "",
              productAliasId: goodDetail.aliasId,
              productName: goodDetail.name,
              productCover: goodDetail.cover,
              productItems: [{
                merchantUserCouponId: "-1",
              }, ],
              merchantId: goodDetail.merchantId,
              merchantName: merchantName,
              skuId: skuId,
              skuAttrsNames: this.skuAttrsNames,
              price: price,
              quantity: 1,
              usePoint: true,
              addressId: this.address.id,
              payType: 0,
              type: 0,
              logisticsType: 0
            };
            if(buyType==1){
              params = {
                merchantId:goodDetail.merchantId,
                uid: this.uid,
                type:2,
                usePoint: true,
                skuItems: [{
                  "skuId": skuId,
                  "quantity": 1,
                  "bargainUserJoinId": this.id
                }]
              }
            }
            this.$fly.post("/orders/prepare", params).then((res) => {
              if (res.data.success) {
                this.update({
                  orderGoods: res.data.data,
                });
                this.update({
                  cartIds: [],
                });
                this.update({
                  cartPrice: price * 1
                });
                wx.navigateTo({
                  url: "/pages/createOrder/main?orderParams=" + JSON.stringify(orderParams) + "&typeCar=" + buyType + "&bargainUserJoinId=" + this.id
                });
              }
            });
          });
      
        })
      },
      goDetail(item){
        wx.navigateTo({
          url: '/pages/seckillDetail/main?productAliasId=' + item.productAliasId + '&flashSaleProductId=' + item.id + '&merchantId=' + item.merchantId,
        })
      },
      getDetail(){
        this.$fly.get('/bargain/userJoin/' + this.id +'/' + this.uid).then(res => {
          wx.stopPullDownRefresh();
          if(res.data.success){
            res.data.data.countdownTime = Math.ceil((new Date(res.data.data.endTime)-new Date()) / 1000);
            res.data.data.cover = res.data.data.productImgUrl.split(',')[0];
            res.data.data.spread = ((res.data.data.bargainedOriginPrice-res.data.data.bargainTargetPrice)-(res.data.data.bargainedOriginPrice-res.data.data.bargainedPrice)).toFixed(2)
            res.data.data.percent = ((res.data.data.bargainedOriginPrice-res.data.data.bargainedPrice) / (res.data.data.bargainedOriginPrice-res.data.data.bargainTargetPrice)).toFixed(2) * 100;
            this.goodDetail = res.data.data;
            this.goodDetail.chajia = (this.goodDetail.bargainedOriginPrice-this.goodDetail.bargainTargetPrice).toFixed(1)
            this.isMe = this.goodDetail.userId == this.userInfo.id;
            clearTimeout(this.cutDown)
            this.countDown()
          }
        })
      },
      help(){//帮助砍价
        if(this.isLogin){
          if(this.goodDetail.status==1){
            wx.showToast({
              title: '来晚了~砍单已完成。', //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
            });
            return
          }
          this.$fly.config.headers = {
            Authorization: this.userInfo.token
          };
          this.$fly.post('/bargain/help',{'bargainUserJoinId':this.id}).then(res => {
            if(res.data.success){
              res.data.data.countdownTime = Math.ceil((new Date(res.data.data.endTime)-new Date()) / 1000);
              res.data.data.cover = res.data.data.productImgUrl.split(',')[0];
              res.data.data.spread = ((res.data.data.bargainedOriginPrice-res.data.data.bargainTargetPrice)-(res.data.data.bargainedOriginPrice-res.data.data.bargainedPrice)).toFixed(2)
                res.data.data.percent = ((res.data.data.bargainedOriginPrice-res.data.data.bargainedPrice) / (res.data.data.bargainedOriginPrice-res.data.data.bargainTargetPrice)).toFixed(2) * 100;
                // if(res.data.data.bargainedPrice == res.data.data.bargainTargetPrice) {
                //   res.data.data.status = "已成功"
                // }else {
                //   res.data.data.status = "已结束"
                // }
                this.showMask = true;
              this.goodDetail = res.data.data;
              this.goodDetail.chajia = (this.goodDetail.bargainedOriginPrice-this.goodDetail.bargainTargetPrice).toFixed(1)
              this.isMe = this.goodDetail.userId == this.userInfo.id;
              clearTimeout(this.cutDown)
              this.countDown()
            }
          })
        }else {
          wx.navigateTo({ url: '/pages/prelogin/main' });
        }
      },
      close(){
        this.showMask = false
      },
			getDate(now) { 
				var year=now.getFullYear(); 
				var month=this.addZero(now.getMonth()+1);
				var date=this.addZero(now.getDate());
				var hour=this.addZero(now.getHours()); 
        var minute=this.addZero(now.getMinutes());
				// var second=now.getSeconds();
        return year+"/;"+month+"/;"+date+" "+hour+":"+minute; 
      },
      addZero(i){
        return i < 10 ? "0" + i: i + "";
      },
      //倒计时函数
      countDown() {
        // 对结束时间进行处理渲染到页面
        if (this.goodDetail.countdownTime> 0) {
          let time = this.goodDetail.countdownTime;
          this.timeDown.hour = this.addZero(parseInt(time / (60 * 60)));
          this.timeDown.minute = this.addZero(parseInt(time / 60 % 60));
          this.timeDown.second = this.addZero(parseInt(time % 60));
          this.goodDetail.countdownTime = this.goodDetail.countdownTime-1;
          this.cutDown = setTimeout(this.countDown, 1000);
        } else { //倒计时已结束，全部设置为'00'
          this.timeDown={
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
      },
    } 　
  }
</script>

<style lang="scss">
page, .card-page{
  height: 100%;
  background: #fff;
}
.bangkan {
  height: 214rpx;
  overflow: scroll;
}
.popUp {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  .position{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .mainBox {
    width: 480rpx;
    height: 288rpx;
    text-align: center;
    position: absolute;
    top: 314rpx;
    left: 50%;
    transform: translateX(-50%);
    .progress {
      margin: 0 20rpx;
      height: 28rpx;
      .percent {
        height: 28rpx;
      }
    }
    .title1 {
      font-size: 40rpx;
      padding: 30rpx 0;
      color: #A0550C;
      font-weight: bold;
    }
    .title2 {
      font-size: 32rpx;
      color: #999;
      font-weight: bold;
      margin-bottom: 30rpx;
      text {
        font-size: 48rpx;
        color: #EE4C40;
      }
    }
    .confirm {
      width: 360rpx;
      height: 64rpx;
      line-height: 64rpx;
      color: #fff;
      font-size: 32rpx;
      background: linear-gradient(0deg, #F7A132, #F7C91B);
      margin: 0 auto;
    }
  }
  .popUpBg {
    width: 590rpx;
  }
  .popUpBg2 {
    width: 560rpx;
    height: 656rpx;
  }
  .close {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    font-size: 60rpx;
    z-index: 999;
  }
}
.goodDetail {
  padding: 30rpx;
  background-color: #f8f8f8;
  margin: 20rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  >.fl {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
  }
  >.fr {
    width: 430rpx;
    padding: 4rpx 0;
    .text-cut {
      color: #343434;
      margin-bottom: 30rpx;
    }
    .prices {
      margin-bottom: 30rpx;
      .msPrice {
        font-size: 38rpx;
        font-weight: bold;
      }
      .sPrice {
        font-weight: bold;
        margin-left: 18rpx;
        font-size: 26rpx;
      }
    }
    .timeDown {
      font-size: 22rpx;
      color: #fff;
      line-height: 36rpx;
      font-weight: bold;
      .box {
        padding: 0 8rpx;
        text-align: center;
        background-color: #343434;
        border-radius: 4rpx;
      }
      text.fl {
        margin: 0 10rpx;
        color: #343434;
      }
      .color34 {
        margin-left: 10rpx;
      }
    }
  }
}
.words1 {
  font-size: 24rpx;
  color: #666666;
  margin-top: 30rpx;
}
.progress {
  margin: 0 50rpx;
  margin-top: 40rpx;
  border: 2rpx solid #F7CA1C;
  height: 32rpx;
  position: relative;
  .percent {
    position: absolute;
    top: -2rpx;
    left: 0;
    height: 32rpx;
    background:linear-gradient(90deg,rgba(247,202,28,1),rgba(255,174,68,1));
    width: 50%;
  }
}
.buyBtn {
  margin: 60rpx 50rpx 80rpx;
  letter-spacing: 2rpx;
  >view,>button{
    width: 310rpx;
    height: 84rpx;
    line-height: 84rpx;
    color: #fff;
    font-weight: bold;
    font-size: 30rpx;
    text-align: center;
  }
  view.fl {
    background:rgba(255,174,68,1);
    box-shadow:2rpx 6rpx 0px 0px rgba(217,137,34,1);
  }
  button.single,view.single {
    margin: 0 auto;
    float: inherit;
  }
  button.fr,view.fr {
    background:rgba(238,76,64,1);
    box-shadow:2rpx 6rpx 0px 0px rgba(198,56,46,1);
  }
}
.list {
  margin: 0 20rpx;
  padding: 40rpx 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 40rpx;
  .title {
    color: #343434;
    font-weight: bold;
    text-align: center;
    font-size: 30rpx;
    margin-bottom: 60rpx;
  }
  .rules {
    font-size: 24rpx;
    line-height: 1.6;
  }
}
.li {
  margin-bottom: 30rpx;
  line-height: 64rpx;
  height: 64rpx;
  font-size: 28rpx;
  position: relative;
  padding-left: 64rpx;
  .head {
    width: 64rpx;
    height: 64rpx;
    position: absolute;
    top: 0;
    left: 0;
    // vertical-align: -26rpx;
  }
  .title1 {
    color: #666666;
    margin-left: 20rpx;
    width: 320rpx;
    display: inline-block;
  }
  .title2 {
    width: 200rpx;
    image {
      width: 34rpx;
      height: 30rpx;
      vertical-align: -6rpx;
      margin-right: 6rpx;
    }
  }
}
.li:last-of-type {
  margin-bottom: 0;
}
.price-normal::before  {
  content: "¥";
  font-size: 100%;
  margin-right: 4rpx;
}
.color34 {
  color: #343434;
}
</style>