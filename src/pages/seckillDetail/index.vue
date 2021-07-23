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
        <view class="text-price oldPrice">
          {{goodDetail.originalPrice}}
        </view>
        <view>
          秒杀价<text class="text-price"></text><text class="realPrice">{{goodDetail.priceStr}}</text><text v-if="goodDetail.status=='抢购中'">已抢购{{goodDetail.flashSaleStockSoldNum}}件</text>
        </view>
      </view>
      <view class="fr">
        <text class="round text-red countDown" v-if="goodDetail.status!='已结束'">
          倒计时 {{timeDown.hour}} : {{timeDown.minute}} : {{timeDown.second}}
        </text>
        <view class="text-center remain" v-if="goodDetail.status=='抢购中'">仅剩{{goodDetail.flashSaleStockNum}}件</view>
      </view>
    </view>
    <view class="solid-bottom  padding-sm bg-white">
      <!--<text class="text-gray text-sm">{{goodDetail.desc}}</text>-->
      <view class="flex justify-between">
        <view class="text-bold text-lg text-black">
          {{goodDetail.name}}
        </view>
        <button open-type="share" class="cu-btn cu-avatar bg-red round share">
          <view class="cuIcon-share"></view>
        </button>
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
      <view class="action" @click="goTab('cart')">
        <view class="cuIcon-cart">
        </view>
        购物车
      </view>
      <!-- <view class="bg-red submit" @click="addGoods(goodDetail,type=1)" data-target="ChooseModal">加入购物车</view> -->
      <view class="bg-orange submit" @click="addOrders(goodDetail,type=2,'orderlist')" data-target="ChooseModal">立即购买
      </view>
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
       id:0,
      };
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo'
      ]),
    },
    onLoad(options) {
        this.merchantId=options.merchantId;
        this.flashSaleProductId=options.flashSaleProductId;
        this.productAliasId=options.productAliasId;
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
      addGoods(goods, index) {
        if(this.isLogin){
          if (2 > 1) {
            this.$fly.get('/products/' + goods.aliasId + '?merchantId=' + goods.merchantId).then(res => {
              this.$refs.goodsModal.showModal(res.data.data)
            })
          } else {
            this.submitStock(goods, 0, 1)
          }
        }
      },
      addOrders(goods, index,url) {
        
        if(this.goodDetail.status!="抢购中"){
          wx.showToast({
            title: '秒杀'+this.goodDetail.status, //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {
            }
          });
          return
        }
        if (!this.isLogin) {
          wx.navigateTo({
            url: "/pages/prelogin/main"
          });
        } else {
          console.log(goods);
          this.$refs.goodsModal.showModal(goods,index,url)
        }
      },
      getGoodsDetail() {
        // 
        this.$fly.config.headers = {
          Authorization: this.userInfo.token
        };
        this.$fly.post('/flashsale/detail',{productAliasId:this.productAliasId,flashSaleProductId:this.flashSaleProductId}).then(res => {
          // res.data.data.attrs[0].attrValues = res.data.data.productSkus[0].skuAttrs
          wx.stopPullDownRefresh();
          this.goodDetail = res.data.data
          this.swiperList = res.data.data.bannerUrls
          this.goodDetail_name = "【￥:" + res.data.data.priceStr + "】" + res.data.data.name;
          var start = new Date(this.goodDetail.startTime);
          var end = new Date(this.goodDetail.endTime);
          var now = new Date().getTime();
          if(now<start) {
            this.goodDetail.status = "即将开抢";
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
      // 当前的分享路径来源productAliasId flashSaleProductId
      let url ='/pages/seckillDetail/main?flashSaleProductId='+this.flashSaleProductId+'&merchantId='+this.merchantId+'&productAliasId='+this.productAliasId
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

<style>
  @import url("~mpvue-wxparse/src/wxParse.css");

  .detail {
    padding-bottom: 60px;
  }

  .screen-swiper {
    min-height: 260px;
  }

  .tabbar {
    position: fixed;
    bottom: 0;
    width: 100%;
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
  .titleBox {
    background-color: #E54148;
    color: #fff;
    font-size: 22rpx;
    height: 108rpx;
  }
  .titleBox>.fl {
    width: 508rpx;
    padding: 20rpx;
  }
  .titleBox>.fr {
    width: 242rpx;
    padding: 20rpx;
    background-color: #FCD476;
    height: 100%;
    box-sizing: border-box;
    clip-path: polygon(20rpx 0, 100% 0, 100% 100%, 20rpx 100%, 0 54rpx)
  }
  .oldPrice {
    text-decoration: line-through;
  }
  .realPrice {
    font-size: 38rpx;
    margin-right: 20rpx;
  }
  .countDown {
    display: block;
    line-height: 36rpx;
    height: 36rpx;
    text-align: center;
    width: 200rpx;
    margin: 0 auto;
    background-color: #E54148;
    color: #fff;
    font-size: 20rpx;
  }
  .remain {
    color: #E54148;
    margin-top: 10rpx;
  }
  .share {
    width: 60rpx;
    height: 60rpx;
  }
</style>
