<template>
  <view class="detail">
    <swiper class="screen-swiper" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
      duration="500">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <image :src="item?item:'/static/images/default.png'" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <view class="cf titleBox">
      <view class="fl">
        <view>
          底价<text class="text-price"></text><text class="realPrice">{{goodDetail.priceStr}}</text>
        </view>
        <view class="text-price oldPrice">
          {{goodDetail.showPriceStr}}
          <!-- <text class="limit">限量{{goodDetail.bargainFullStockNum}}件</text> -->
        </view>
      </view>
      <view class="fr">
        <view class="text-center remain" v-if="goodDetail.status=='即将开始'">距离开始仅剩</view>
        <view class="text-center remain" v-else>距离结束仅剩</view>
        <text class="round countDown">
          {{timeDown.hour}} : {{timeDown.minute}} : {{timeDown.second}}
        </text>
      </view>
    </view>
    <view class="solid-bottom padding-sm bg-white">
      <!--<text class="text-gray text-sm">{{goodDetail.desc}}</text>-->
      <view class="flex justify-between">
        <view class="text-bold text-lg text-black descp">
          {{goodDetail.name}}
        </view>
        <!-- <button open-type="share" class="cu-btn cu-avatar bg-red round share">
          <view class="cuIcon-share"></view>
        </button> -->
      </view>
      <view class="tips"><text class="cuIcon-info text-red"></text> 每人限购 <text class="text-red">{{goodDetail.buyLimitNum}}</text> 件 库存有限，砍单成功后尽快支付</view>
    </view>
    <!-- 玩法介绍 -->
    <view class="bg-white margin-top jieshao">
      <view class="mainTitle">玩法介绍</view>
      <view class="steps cf">
        <view class="step fl">
          <view class="circle">1</view>
          报名参加
          <text class="cuIcon-right fr"></text>
        </view>
        <view class="step fl">
          <view class="circle">2</view>
          找人帮砍
          <text class="cuIcon-right fr"></text>
        </view>
        <view class="step fl">
          <view class="circle">3</view>
          付款购买
          <text class="cuIcon-right fr"></text>
        </view>
        <view class="step fl">
          <view class="circle">4</view>
          收货结束
        </view>
      </view>
    </view>
    <!-- 参数 规格 服务等信息 -->
    <view class="bg-white margin-top">
      <view class="sevBox cf" @click="showInfoModal(goodDetail.guarantees,'保障服务','基础服务')">
        <view class="fl text-grey sevName">
          保障
        </view>
        <view class="fl sevInfo text-black" v-for="(item,index) in goodDetail.guarantees" :key="index">
          {{item.title}}
        </view>
        <text class="cuIcon-right lg text-gray fr"></text>
      </view>
      <view class="sevBox cf" @click="showInfoModal(goodDetail.logisticsServices,'配送服务','配送规则')">
        <view class="fl text-grey sevName">
          配送
        </view>
        <view class="fl sevInfo text-black" v-for="(item,index) in goodDetail.logisticsServices" :key="index">
          {{item.title}}
        </view>
        <text class="cuIcon-right lg text-gray fr"></text>
      </view>
    </view>
    <view
      class="sevInfoBox"
      :class="infoModalName == 'infoModal' ? 'show' : ''"
      @click="infohideModal"
    >
      <view class="infoModal bg-white">
        <view class="infoTitle1 text-center">{{title1}}</view>
        <view class="infoTitle2 text-grey">
          {{title2}}
        </view>
        <view class="sevList" v-for="(item,index) in sevInfoList" :key="index">
          <text class="cuIcon-roundcheck lg text-gray sevIcon"></text>
          <view class="text-black">{{item.title}}</view>
          <view class="text-grey">{{item.desc}}</view>
        </view>
      </view>
    </view>
    <!-- 这是处理商品详情和规格参数 -->
    <scroll-view scroll-x class="bg-white nav margin-top solid-bottom">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in nav"
          :key="index" @tap="tabSelect(index)" :data-id="index">
          {{item.name}}
        </view>
      </view>
    </scroll-view>
    <!-- 这是处理商品详情和规格参数 -->
    <view class="cu-card no-card bg-white view_box" v-if="TabCur==0">
      <wxParse :content="goodDetail.desc"></wxParse>
    </view>

    <view class="cu-card no-card padding bg-white" v-else>
      {{goodDetail.parameter}}规格参数
    </view>
    <!-- 这是处理商品详情和规格参数 -->
    <view class="cu-bar bg-white tabbar border shop">
      <!--<view class="action" :class="goodDetail.collect ? 'text-orange' : ''" @click="like(goodDetail.collect)">
				<view class="cuIcon-favorfill"></view> {{goodDetail.collect ? '已收藏' : '收藏'}}
			</view>-->
      <view class="action" @click="goTab('index')">
        <view class="cuIcon-home">
        </view>
        主页
      </view>
      <!-- <view class="action" @click="goTab('cart')">
        <view class="cuIcon-cart">
        </view>
        购物车
      </view> -->
      <!-- <view class="bg-orange submit" @click="directBuy(goodDetail)" data-target="ChooseModal">直接购买</view> -->
      <view class="bg-red submit" @click="goStart()" >我要报名</view>
    </view>
    <!-- 多规格弹窗 -->
    <GoodsModal ref="goodsModal" @submitStock=submitStock></GoodsModal>
  </view>
</template>

<script>
  import {
    moneyFormat
  } from '@/utils/index'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import GoodsModal from '@/components/secGoodsModal'
  import wxParse from 'mpvue-wxparse'
  export default {
    components: {
      GoodsModal,
      wxParse
    },
    data() {
      return {
        // goodDetail这是请求到的当前商品详细信息
        goodDetail: {},
        swiperList: [],
        avatar: [],
        cutDown:"",
        TabCur: 0,
        scrollLeft: 0,
        infoModalName: "",
        sevInfoList:[],
        title1:'',
        title2:'',
        nav: [{
          id: 1,
          name: '商品详情',
        }, ],
        timeDown:{
          hour: '00',
          minute: '00',
          second: '00'
        },
        goodDetail_name: '',
        showPriceStr: '',
       merchantId:0,
       productAliasId:'',
       bargainProductId:'',
      };
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo'
      ]),
    },
    onLoad(options) {
        this.productAliasId=options.productAliasId;
        this.bargainProductId=options.bargainProductId;
        this.goodDetail = {};
        this.swiperList = [];
        this.getGoodsDetail()
    },
    onUnload(){
      clearTimeout(this.cutDown)
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.getGoodsDetail();
    },
    onShow(){
      // 查看是否授权
      if (!this.isLogin) {
        wx.redirectTo({
          url: "/pages/prelogin/main"
        });
      }
    },
    methods: {
      ...mapMutations(["update"]),
      addZero(i){
        return i < 10 ? "0" + i: i + "";
      },
      //隐藏服务规则
      infohideModal(){
        this.infoModalName = "";
      },
      //显示服务模态框
      showInfoModal(item,title1,title2){
        this.infoModalName = "infoModal";
        this.sevInfoList = item;
        this.title1 = title1;
        this.title2 = title2;
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
        } else { //倒计时已结束，全部设置为'00'
          this.getGoodsDetail();
          this.timeDown={
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        this.cutDown = setTimeout(this.countDown, 1000);
      },
      directBuy(goodDetail){//直接购买 
        this.$fly.config.headers = {
          Authorization: this.userInfo.token,
        },
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
                  url: "/pages/createOrder/main?orderParams=" + JSON.stringify(orderParams) + "&typeCar=" + this.typeCar
                });
              }
            });
          });
      },
      getGoodsDetail() {
        // 
        this.$fly.config.headers = {
          Authorization: this.userInfo.token
        };
        this.$fly.post('bargain/detail',{productAliasId:this.productAliasId,bargainProductId:this.bargainProductId}).then(res => {
          // res.data.data.attrs[0].attrValues = res.data.data.productSkus[0].skuAttrs
          wx.stopPullDownRefresh();
          this.goodDetail = res.data.data
          this.swiperList = res.data.data.bannerUrls
          this.goodDetail_name = "【￥:" + res.data.data.priceStr + "】" + res.data.data.name;
          var start = new Date(this.goodDetail.startTime);
          var end = new Date(this.goodDetail.endTime);
          var now = new Date().getTime();
          if(now<start) {
            this.goodDetail.status = "即将开始";
            this.goodDetail.countdownTime = start-now;
            this.goodDetail.countdownTime = parseInt(this.goodDetail.countdownTime / 1000);
            clearTimeout(this.cutDown)
            this.countDown()
          }else if(now>end){
            this.goodDetail.status = "已结束";
            this.goodDetail.countdownTime = 0;
          }else if(now>start && now<end){
            this.goodDetail.status = "抢购中";
            this.goodDetail.countdownTime = end-now;
            this.goodDetail.countdownTime = parseInt(this.goodDetail.countdownTime / 1000);
            console.log(this.goodDetail.countdownTime)
            clearTimeout(this.cutDown)
            this.countDown()
          }
        })
      },
      goRouter(url) {
        wx.navigateTo({
          url: `/pages/${url}/main`
        })
      },
      goTab(url) {
        wx.switchTab({
          url: `/pages/${url}/main`
        })
      },
      // 用户参与砍单
      goStart(){
        if(this.goodDetail.status=='即将开始'){
          wx.showToast({
            title: '即将开始，请耐心等候~', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          return;
        }
        this.$fly.config.headers = {
          Authorization: this.userInfo.token
        };
        this.$fly.post('/bargain/start',{discountId:this.goodDetail.bargainProductSkuId,quantity:1}).then(res => {
          if(res.data.success){
            wx.navigateTo({ url: '/pages/bargainDetail/main?id=' + res.data.data.id + '&uid=' + res.data.data.userId });
          }
        })
      },
      tabSelect(index) {
        this.TabCur = index;
        this.desc = this.nav[index].desc
      },
      like(active) {
        if (!this.isLogin) {
          return false
        }

        // acitve falss 没收藏
        let params = {
          goods_id: this.goodDetail.id,
          user_id: this.userInfo.openid,
          active: active
        }
        this.$fly.post('/goods/likeGoods', params).then(res => {
          this.goodDetail.collect = !this.goodDetail.collect
          let text = ''
          this.goodDetail.collect ? text = '商品收藏成功！' : text = '已取消收藏'
          wx.showToast({
            title: text,
            icon: 'none',
            duration: 2000
          });
        })

      },
      // 这是商品详情的图片操作
      Good_preview(src, e) {
        // do something
        //console.log(src, e);
      },
      Good_navigate(href, e) {
        // do something
        //console.log(href, e);

      }
    },
    // 分享内容
    onShareAppMessage: function (share) {
      // 当前的分享路径来源
      return {
        title: this.goodDetail_name,
        path: url,
        success: function (res) {
          //console.log(res)
        },
        console: function (res) {
          //console.log(res);
        }
      }
    },
  }
</script>

<style lang='scss'>
  @import url("~mpvue-wxparse/src/wxParse.css");

  .detail {
    padding-bottom: 60px;
  }

  .screen-swiper {
    min-height: 260px;
  }
  .tips {
    line-height: 48rpx;
    font-size: 22rpx;
    color: #333;
    padding: 0 8rpx;
    height: 48rpx;
    background: #FFEEED;
    margin-top: 15rpx;
    .cuIcon-info {
      font-size: 26rpx;
      margin: 0 6rpx;
    }
  }
  .tabbar {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .show {
    display: block!important;
  }
  .bg-yellow.light {
    color: #a5673f;
    background-color: #f8e470;
  }

  /* .goodDetail_text {
    width:100%;
	height: 500rpx;
  } */

  .view_box {
    width: 100%;
    height: auto;
  }

  .html_d {
    width: 100%;
    height: 100%;
  }
  .mainTitle {
    line-height: 34rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
    padding-left: 17rpx;
    position: relative;
    margin-bottom: 30rpx;
  }
  .mainTitle::before {
    content: "";
    width: 6rpx;
    height: 34rpx;
    background: #EE4C40;
    border-radius: 6rpx;
    position: absolute;
    left: 0;
    top: 0;
  }
  .jieshao {
    padding: 30rpx 20rpx;
    .steps {
      .step {
        width: 176rpx;
        padding-left: 14rpx;
        font-size: 24rpx;
        font-weight: bold;
        color: #333;
        line-height: 24rpx;
        .circle {
          color: #fff;
          font-size: 18rpx;
          width: 24rpx;
          height: 24rpx;
          border-radius: 24rpx;
          background-color: #CBCBCB;
          text-align: center;
          display: inline-block;
          margin-right: 6rpx;
          vertical-align: 2rpx;
        }
        .cuIcon-right {
          color: #CBCBCB;
        }
      }
    }
  }
  .titleBox {
    background-color: #E54148;
    color: #fff;
    font-size: 22rpx;
    height: 108rpx;
    .limit {
      width: 120rpx;
      height: 30rpx;
      border: 1px solid #FFFFFF;
      border-radius: 8rpx;
      font-size: 20rpx;
      display: inline-block;
      text-align: center;
      margin-left: 8rpx;
    }
    >.fl {
      width: 508rpx;
      padding: 14rpx;
    }
    >.fr {
      width: 242rpx;
      padding: 20rpx;
      background-color: #FFAD43;
      height: 100%;
      box-sizing: border-box;
      /* clip-path: polygon(20rpx 0, 100% 0, 100% 100%, 20rpx 100%, 0 54rpx) */
    }
  }
  .oldPrice {
    text-decoration: line-through;
    margin-top: 6rpx;
  }
  .realPrice {
    font-size: 38rpx;
    margin-right: 20rpx;
  }
  .countDown {
    display: block;
    line-height: 16rpx;
    height: 36rpx;
    text-align: center;
    width: 200rpx;
    margin: 0 auto;
    color: #fff;
    font-size: 28rpx;
  }
  .remain {
    color: #fff;
    font-size: 20rpx;
  }
  .share {
    width: 60rpx;
    height: 60rpx;
  }
  .sevBox {
    line-height: 82rpx;
    font-size: 26rpx;
    padding: 0 22rpx;
  }
  .sevName {
    display: inline-block;
    padding-right: 22rpx;
  }
  .sevInfo {
    display: inline-block;
    margin-right: 16rpx;
  }
  .sevInfoBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.2);
    z-index: 999;
    display: none;
  }
  .infoModal {
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 22rpx;
    height: 700rpx;
    z-index: 9;
  }
  .infoTitle1 {
    font-size: 32rpx;
    padding: 48rpx 0;
  }
  .infoTitle2 {
    font-size: 32rpx;
    margin-bottom: 48rpx;
  }
  .sevList {
    padding-left: 68rpx;
    position: relative;
  }
  .sevList view {
    margin-bottom: 30rpx;
    font-size: 26rpx;
  }
  .sevIcon {
    position: absolute;
    left: 20rpx;
    top: 4rpx;
    color: var(--red);
  }
</style>
