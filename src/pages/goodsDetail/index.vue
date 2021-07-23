<template>
  <view class="detail">
    <swiper class="screen-swiper" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
      duration="500">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <image :src="item?item:'/static/images/default.png'" mode="widthFix"></image>
      </swiper-item>
    </swiper>
    <view class="solid-bottom  padding-sm bg-white">
      <view class="flex justify-between padding-tb">
        <view>
          <text class="text-price text-xxl text-red">{{goodDetail.priceStr}}</text>
          <view class="cu-tag text-grey light sm radius margin-left-sm" v-if="goodDetail.showPriceStr" style="text-decoration: line-through;">
            ¥{{goodDetail.showPriceStr}}
          </view>
        </view>
        <text class="text-sm text-gray">已售 {{goodDetail.soldNumber}}件</text>
      </view>
      <view class="cf titleBox padding-tb-sm">
        <view class="text-black text-bold text-df text-cut fl descp">{{goodDetail.name}}</view>
        <button open-type="share" class="cu-btn cu-avatar bg-red round fr">
          <view class="cuIcon-share"></view>
        </button>
      </view>
      <view class="zhekou" v-if="typeValueText">{{typeValueText}}</view>
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
    <!-- 店铺详情 -->
    <view class="shopInfo margin-top bg-white">
      <view class="topBox cf">
        <image :src="shopInfo.logoUrl?shopInfo.logoUrl:'/static/images/default.png'" class="shopCover fl"></image>
        <view class="fr">
          <view class="fl mainTitle">
            {{shopInfo.name}}
          </view>
          <view class="shopBtn fr round bg-red" @click="goShop">进店逛逛</view>
          <view class="shopBtn fr round lines-red solid bg-white text-red" @click="subscribe">{{shopInfo.isSubscribe?'已收藏':'收藏店铺'}}</view>
        </view>
      </view>
      <view class="line"></view>
      <view class="recommend" v-if="goodsList.length>0">
        <view class="mainTitle">店铺推荐</view>
        <scroll-view scroll-x>
          <view class="goodItem" v-for="(item,index) in goodsList" :key="index" @click="goDetail(item.aliasId,item.merchantId)">
            <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
            <view class="text-cut title1">{{item.name}}</view>
            <view class="title2 text-red"><text class="text-price"></text>{{item.priceStr}}</view>
          </view>
        </scroll-view>
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
      <wxParse :content="goodDetail.desc" />
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
      <view class="action text-orange" @click="collection()" v-if="goodDetail.collection">
        <view class="cuIcon-favorfill">
        </view>
        已收藏
      </view>
      <view class="action" @click="collection()" v-else>
        <view class="cuIcon-favor">
        </view>
        收藏
      </view>
      <view class="bg-red submit" v-if="cantBuy!='新人专享'" @click="addGoods(goodDetail,type=1)" data-target="ChooseModal">加入购物车</view>
      <view class="bg-orange submit" @click="addOrders(goodDetail,type=0,'orderlist')" data-target="ChooseModal">立即购买
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
  import GoodsModal from '@/components/goodsModal'
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
        TabCur: 0,
        infoModalName: "",
        shopInfo:'',
        goodsList:[],
        scrollLeft: 0,
        sevInfoList:[],
        cantBuy:'',
        title1:'',
        title2:'',
        inviteCode:'',
        startTime:'',
        endTime:'',
        status:'',
        nav: [{
          id: 1,
          name: '商品详情',
        }, ],
        goodDetail_name: '',
        showPriceStr: '',
        typeValueText:'',
        merchantId: 0,
        id: 0,
      };
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo'
      ]),
    },
    onLoad(options) {
      this.typeValueText = ''
      this.goodDetail = {};
      if(options.inviteCode){
        this.update({ inviteCode: options.inviteCode });
      }else{
        this.update({ inviteCode: "" });
      }
      if (options.id) {
        // 
        this.merchantId = options.merchantId;
        this.id = options.id;
        this.getGoodsDetail(options.id)
      }
      this.cantBuy = '';
      this.startTime = '';
      this.endTime = '';
      this.status = '';
      if(options.cantBuy){
        this.cantBuy = options.cantBuy
      }
      if(options.startTime){
        this.startTime = options.startTime;
        this.endTime = options.endTime;
        if(new Date()<this.startTime) {
          this.status = "爆款预热即将开始"
        }else if(new Date()>this.endTime){
          this.status = "爆款预热已结束"
        }else if(new Date()>this.startTime && new Date()<this.endTime){
          this.status = "抢购中"
        }
      }
      if(options.typeValueText){
        this.typeValueText = options.typeValueText
      }
    },
    onUnload() {
      // this.goodDetail = {};
    },
    methods: {
      ...mapMutations(['update']),
      addGoods(goods, index) {
        if (!this.isLogin) {
          wx.navigateTo({
            url: "/pages/prelogin/main"
          });
        } else {
          if(this.cantBuy == '新人专享'){
            this.$fly.config.headers = {
              "X-Tag": "flyio",
              Authorization: this.userInfo.token,
            };
            this.$fly.get("/orders/numberByUserId?uid=" + this.userInfo.id)
            .then((res) => {
              if(res.data.data==0){
                this.$refs.goodsModal.showModal(this.goodDetail)
              }else{
                wx.showToast({
                  title: '仅限新用户购买', //提示的内容,
                  icon: 'none', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {}
                });
                return;
              }
            });
          }else if(this.cantBuy == '社员专区'){
            this.$fly.config.headers = {
              "X-Tag": "flyio",
              "Authorization": this.userInfo.token
            }
            this.$fly.get('/users/' + this.userInfo.id).then(res => {
              if (res.data.data.level > 0) {
                this.$refs.goodsModal.showModal(this.goodDetail)
              }else{
                wx.showModal({
                  title: '提示',
                  content: '您还不是社员，请在个人中心中充值成为社员再进行购买',
                  cancelText: '再想想',
                  confirmText: '去充值',
                  success (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/memberCenter/main',
                      })
                    }else if(res.cancel){
                      
                    }
                  }
                })
              }
            })
          }else if(this.startTime){
            if(this.status!=""&&this.status!="抢购中"){
              wx.showToast({
                title: this.status, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return
            }else{
              this.$refs.goodsModal.showModal(this.goodDetail)
            }
          }else{
            this.$refs.goodsModal.showModal(this.goodDetail)
          }
        }
        
      },
      goShop(){//进入店铺
        wx.navigateTo({
          url: '/pages/shopInfo/main?merchantId=' + this.merchantId,
        })
      },
      goDetail(id, merchantId) {//进入商品详情
        wx.redirectTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`,
        });
      },
      subscribe(){//收藏，取消收藏
        if(this.isLogin){
          this.$fly.config.headers = {
            "X-Tag": "flyio",
            Authorization: this.userInfo.token,
          };
          var subscribe = this.shopInfo.isSubscribe?0:1
          this.$fly.post("/merchants/"+this.merchantId+"/subscribe?subscribe=" + subscribe)
          .then((res) => {
            if(res.data.success){
              this.shopInfo.isSubscribe = !this.shopInfo.isSubscribe
            }
          });
        }else {
          wx.navigateTo({
            url: '/pages/prelogin/main',
          })
        }
      },
      getShopInfo(){//获取店铺信息
        if(this.isLogin){
          this.$fly.config.headers = {
            "X-Tag": "flyio",
            Authorization: this.userInfo.token,
          };
        }
        this.$fly.get("/merchants/" + this.merchantId)
        .then((res) => {
          if(res.data.success){
            this.shopInfo = res.data.data
          }
        });
      },
      getList(){//获取商品
        var params = {
          name: "",
          merchantId: this.merchantId,
          sort: 0,
          offset: 0,
          limit: 20,
        }
        this.$fly.get("/products/accessList",params)
        .then((res) => {
          if(res.data.success){
            this.goodsList = res.data.data
          }
        });
      },
      addOrders(goods, index, url) {
        if (!this.isLogin) {
          wx.navigateTo({
            url: "/pages/prelogin/main"
          });
        } else {
          if(this.cantBuy == '新人专享'){
            this.$fly.config.headers = {
              "X-Tag": "flyio",
              Authorization: this.userInfo.token,
            };
            this.$fly.get("/orders/numberByUserId?uid=" + this.userInfo.id)
            .then((res) => {
              if(res.data.data==0){
                this.$refs.goodsModal.showModal(goods, index, url)
              }else{
                wx.showToast({
                  title: '仅限新用户购买', //提示的内容,
                  icon: 'none', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {}
                });
                return;
              }
            });
          }else if(this.cantBuy == '社员专区'){
            this.$fly.config.headers = {
              "X-Tag": "flyio",
              "Authorization": this.userInfo.token
            }
            this.$fly.get('/users/' + this.userInfo.id).then(res => {
              if (res.data.data.level > 0) {
                this.$refs.goodsModal.showModal(goods, index, url)
              }else{
                wx.showModal({
                  title: '提示',
                  content: '您还不是社员，请在个人中心中充值成为社员再进行购买',
                  cancelText: '再想想',
                  confirmText: '去充值',
                  success (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/memberCenter/main',
                      })
                    }else if(res.cancel){
                      
                    }
                  }
                })
              }
            })
          }else if(this.startTime){
            if(this.status!=""&&this.status!="抢购中"){
              wx.showToast({
                title: this.status, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return
            }else{
              this.$refs.goodsModal.showModal(goods, index, url)
            }
          }else {
            this.$refs.goodsModal.showModal(goods, index, url)
          }
        }
      },
      getGoodsDetail(id) {
        this.$fly.get('/products/' + id).then(res => {
          this.goodDetail = res.data.data
          if(this.goodDetail.name.indexOf('新人专')!=-1){
            this.cantBuy = '新人专享'
          }
          this.merchantId = this.goodDetail.merchantId
          this.swiperList = res.data.data.bannerUrls
          this.goodDetail_name = "【￥:"+res.data.data.priceStr+"】" + res.data.data.name
          this.getShopInfo();
          this.getList();
        })
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
      // 这是商品详情的图片操作
      Good_preview(src, e) {
        // do something
        //console.log(src, e);
      },
      Good_navigate(href, e) {
        // do something
        //console.log(href, e);

      },
      // 收藏
      collection(){
        if (!this.isLogin) {
          wx.navigateTo({
            url: '/pages/prelogin/main',
          })
          return
        }
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token,
        };
        var that = this;
        if(that.goodDetail.collection){
          // 取消收藏
          this.$fly.post('/product/collection/delete',{"productCollectionId":[that.goodDetail.collectionId]}).then(res => {
            wx.showToast({
              title: '已取消收藏',
              success: function(){
                that.goodDetail.collection = false
              }
            })
          })
        }else {
          this.$fly.post('/product/collection/insert',{"productId":that.goodDetail.productId}).then(res => {
            wx.showToast({
              title: '已收藏',
              success: function(){
                that.goodDetail.collection = true
              }
            })
          })
        }
      },
    },
    // 分享内容
    onShareAppMessage: function (share) {
      // 当前的分享路径来源
      if(this.userInfo){
        var url = '/pages/goodsDetail/main?id=' + this.id + '&merchantId=' + this.merchantId + '&inviteCode=' + this.userInfo.inviteCode
      }else{
        var url = '/pages/goodsDetail/main?id=' + this.id + '&merchantId=' + this.merchantId + '&inviteCode='
      }
      console.log(url);
      return {
        title: this.goodDetail_name,
        path: url,
        success: function (res) {},
        console: function (res) {}
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
    min-height: 750rpx;
  }
.zhekou {
  color: var(--red);
  padding: 0 10rpx;
  font-size: 22rpx;
  display: inline-block;
  border: 1px solid var(--red);
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

  .goodDetail_text {
    /* width:100%;
	height: 500rpx; */
  }

  .view_box {
    width: 100%;
    height: auto;
  }

  .html_d {
    width: 100%;
    height: 100%;
  }
  .screen-swiper image, .screen-swiper ._video, .swiper-item image, .swiper-item ._video {
  width: 100%;
  display: block;
  height: 100%;
  margin: 0;
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  }
  .titleBox {
    position: relative;
  }
  .titleBox .fl {
    width: 610rpx;
    line-height: 48rpx;
  }
  .titleBox .fr {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
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
  .show {
    display: block;
  }
  .cu-bar.tabbar.shop .action {
    width: 110rpx;
  }
  .topBox {
    padding: 30rpx 20rpx;
  }
  .line {
    width: 710rpx;
    margin: 0 auto;
    height: 2rpx;
    background-color: #f8f8f8;
  }
  .shopCover {
    width: 80rpx;
    height: 80rpx;
    border-radius: 10rpx;
  }
  .topBox>.fr {
    width: 610rpx;
    position: relative;
    top: 20rpx;
  }
  .topBox .mainTitle {
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
    line-height: 40rpx;
  }
  .topBox .shopBtn {
    font-size: 20rpx;
    line-height: 40rpx;
    padding: 0 15rpx;
    margin-left: 14rpx;
  }
  .recommend {
    padding: 1px 20rpx;
    overflow:hidden;white-space:nowrap;
  }
  .recommend .mainTitle {
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
    margin: 30rpx 0;
  }
  .recommend scroll-view {
    height: 286rpx;
  }
  .goodItem {
    width: 194rpx;
    margin-right: 20rpx;
    height: 286rpx;
    font-size: 22rpx;
    display: inline-block;
  }
  .goodItem:last-child {
    margin-right: 0;
  }
  .goodItem .imgBox {
    width: 194rpx;
    height: 194rpx;
    border-radius: 10rpx;
    overflow: hidden;
  }
  .goodItem .imgBox image {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .goodItem .title1 {
    line-height: 50rpx;
  }
</style>
