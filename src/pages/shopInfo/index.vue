<template>
  <view class="pages">
    <view class="info">
      <image src="/static/images/shopInfo.png" class="bgImg"></image>
      <view class="cover"></view>
      <view class="position">
        <view class="searchBox cf">
          <input confirm-type="search" class="search fl round" placeholder="搜索店内商品" v-model="name" placeholder-style="color:#fff" @confirm="submit">
          <image src='/static/images/shareBtn.png' class="shareBtn fr" @click="shareCode"></image>
          <view class="text-center text-white subscribe fr round" @click="subscribe">
            <text :class="shopInfo.isSubscribe?'cuIcon-favorfill':'cuIcon-favor'"></text>
            {{shopInfo.isSubscribe?'已收藏':'收藏'}}
          </view>
        </view>
        <view class="cf shopInfo">
          <image :src="shopInfo.logoUrl?shopInfo.logoUrl:'/static/images/default.png'" class="logo fl"></image>
          <view class="fr text-white">
            <view class="shopTitle">{{shopInfo.name}}<text class="shiti" v-if="shopInfo.bricksAndMortar">实体店</text></view>
            <view class="shopDescp">店铺地址：{{shopInfo.addressStr}}</view>
          </view>
        </view>
        <view class="nav text-white">
          <view class="cu-item" v-for="(item,index) in list" :key="index" :class="index==changeIndex?'active':''" @click="changeItem(index)">
            {{item}}
          </view>
        </view>
      </view>
    </view>
    <swiper :indicator-dots="false" :autoplay="false" class="swiperBox" :style="{height:height+'px'}" @change="swiperChange" :current="changeIndex">
      <swiper-item>
        <scroll-view scroll-y="true">
          <swiper class="bannerSwiper square-dot" :indicator-dots="true" :circular="true"
            :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
            indicator-active-color="var(--red)">
            <swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''" >
              <view class="swiper-item" @click="goDetail(item.aliasId,merchantId)">
                <image :src="item.imgUrl?item.imgUrl:'/static/images/default.png'" mode="aspectFill"></image>
              </view>
            </swiper-item>
          </swiper>
          <view class="dptj text-center">
            <text class="tuijian">店长推荐</text>
          </view>
          <view class="ul1 cf">
            <view v-for="(item,index) in recommendList" :key="index" class="li1 text-right position" :class="index%2==0?'fl':'fr'" @click="goDetail(item.aliasId,merchantId)">
              <view class="imgBox">
                <image :src="item.imgUrl?item.imgUrl:'/static/images/default.png'" mode="aspectFill"></image>
              </view>
              <text class="ljgm bg-red">立即购买 <text class="cuIcon-roundright"></text></text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <view class="ul2 cf text-center position">
          <view class="posCenter">
            <view class="li2 round fl" v-for="(item,index) in list1" :key="index" @click="changeSort(index)" :class="index==sort?'bg-red light':''">
              {{item}}
            </view>
          </view>
        </view>
        <scroll-view scroll-y="true" @scrolltolower="getList">
          <view class="goodList cf">
            <view class="goodItem" v-for="(item,index) in goodsList" :key="index" :class="index%2==0?'fl':'fr'" @click="goDetail(item.aliasId,merchantId)">
              <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
              <view class="padding-lr-xs">
                <view class="text-cut margin-bottom-xs margin-top-xs">{{item.name}}</view>
                <view class="tagList">
                  <text v-for="(itemList,indexList) in item.tags" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
                </view>
                <view class="price cf margin-tb-sm">
                  <view class="fl text-red text-bold text-xl">
                    <text class="text-price"></text> {{item.priceStr}}
                  </view>
                  <view class="text-grey fr text-xs">销量：{{item.payersNumber}}</view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
      <swiper-item class="position">
        <view class="qidai">敬请期待~</view>
      </swiper-item>
    </swiper>
    <!-- 邀请弹窗 -->
    <view class="popUp" v-if="showPop">
      <view class="position">
        <text class="close cuIcon-close lg text-white" @click="close"></text>
        <image
          src="/static/images/activety.png"
          mode="widthFix"
          class="popUpBg"
          >
        </image>
        <view class="mainBox text-center">
          <view class="text-white title1">商铺推荐</view>
          <image
            :src="shareImgUrl"
            mode="widthFix"
            lazy-load="false">
          </image>
          <view class="text-white title2"></view>
          <view class="bg-white bottomBox">
            <view class="button margin-bottom-xs" @click="saveImg" v-if="openSettingBtnHidden">保存图片</view>
            <button class='button margin-bottom-xs bg-white' open-type="openSetting" @click="handleSetting" v-else>授权</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { formatDate,formatTime } from '@/utils/index'
  import { base64src } from '@/utils/base64src'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
        shopInfo: {},
        list:["首页","商品","活动"],
        list1:["综合","销量","新品"],
        merchantId: "",
        swiperList: [],
        recommendList: [],
        goodsList: [],
        changeIndex: 0,
        openSettingBtnHidden:true,
        showPop: false,
        shareImgUrl:"",
        height: 0,
        name: "",
        sort: 0,
        downIndex: 0,
        limit: 10,
      }
    },
    onLoad(options) {
      this.merchantId = options.merchantId;
      if(options.scene){
        this.merchantId = decodeURIComponent(options.scene);
      }
      this.downIndex = 0;
      this.goodsList = [];
      this.getShopInfo();
      this.getSwiperList();
      this.getRecommendList();
      this.getList();
    },
    // 分享内容
    onShareAppMessage: function (share) {
      return {
        title: this.shopInfo.name,
        path: '/pages/shopInfo/main?merchantId=' + this.merchantId,
        success: function (res) {},
        console: function (res) {}
      }
    },
    onShow(){
      let query = wx.createSelectorQuery();
      query.select('.info').boundingClientRect(rect=>{
        let height = rect.height;
        this.height = wx.getSystemInfoSync().windowHeight - height
      }).exec();
    },
    computed: {
      ...mapState(["isLogin", "userInfo"]),
    },
    methods: {
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
            wx.setNavigationBarTitle({
              title: this.shopInfo.name,
            });
          }
        });
      },
      getSwiperList(){//获取轮播
        this.$fly.get("/merchant/banners?merchantId=" + this.merchantId)
        .then((res) => {
          if(res.data.success){
            res.data.data.forEach((item)=>{
              item.aliasId =  item.paths.substring(item.paths.lastIndexOf("\=")+1,item.paths.length)
            })
            this.swiperList = res.data.data;
          }
        });
      },
      close() {
        this.showPop = false;
      },
      shareCode(){//生成二维码
        if(!this.userInfo){
          wx.navigateTo({ url: '/pages/prelogin/main' });
          return
        }
        // if(this.shareImgUrl){
        //   this.showPop = true;
        //   return;
        // }
        this.$fly.get("/liveStreaming/createPicture?scene="+this.merchantId+"&path=pages/shopInfo/main")
        .then((res) => {
          /// 获取到base64Data
          var base64Data = res.data.data;
          /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
          base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
          var base64ImgUrl = "data:image/png;base64," + base64Data;
          base64src(base64ImgUrl, res => {
            console.log(res) // 返回图片地址，直接赋值到image标签即可
            this.shareImgUrl = res;
            this.showPop = true;
          });
        });
      },
      saveImg:function(e){
        let that = this;
        //获取相册授权
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  //这里是用户同意授权后的回调
                  that.saveImgToLocal();
                },
                fail() {//这里是用户拒绝授权后的回调
                  that.openSettingBtnHidden = false
                }
              })
            } else {//用户已经授权过了
              that.saveImgToLocal();
            }
          }
        })

      },
      saveImgToLocal: function (e) {
        let that = this;
        let imgSrc = that.shareImgUrl;
        console.log(imgSrc);
        wx.saveImageToPhotosAlbum({
          filePath: imgSrc,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
        })
      },
      // 授权
      handleSetting: function (e) {
        let that = this;
        that.openSettingBtnHidden = true
      },
      changeSort(index){
        this.downIndex = 0;
        this.sort = index;
        this.goodsList = [];
        this.getList()
      },
      submit(){
        this.downIndex = 0;
        this.goodsList = [];
        this.getList()
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
      getList(){//获取商品
        var params = {
          name: this.name,
          merchantId: this.merchantId,
          sort: this.sort,
          offset: this.downIndex,
          limit: this.limit,
        }
        this.$fly.get("/products/accessList",params)
        .then((res) => {
          if(res.data.success){
            if(res.data.data.length==0){
              wx.showToast({
                title: '没有更多啦~',
                icon: 'none'
              })
              return;
            }else{
              this.downIndex++;
            }
            this.goodsList.push.apply(this.goodsList,res.data.data);
          }
        });
      },
      getRecommendList(){//获取推荐商品
        this.$fly.get("/merchant/middleBanners?merchantId=" + this.merchantId)
        .then((res) => {
          if(res.data.success){
            res.data.data.forEach((item)=>{
              item.aliasId =  item.paths.substring(item.paths.lastIndexOf("\=")+1,item.paths.length)
            })
            this.recommendList = res.data.data;
          }
        });
      },
      goDetail(id, merchantId) {
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`,
        });
      },
      changeItem(index){
        this.changeIndex = index
      },
      swiperChange(e){
        this.changeIndex = e.target.current
      },
      goUrl(name){
        wx.navigateTo({
          url: '/pages/'+name+'/main',
        })
      }
    }
  }

</script>

<style lang="scss">
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
  .popUpBg {
    width: 590rpx;
  }
  .popUpBg2 {
    width: 606rpx;
    height: 626rpx;
  }
  .activityBtn {
    width: 260rpx;
    animation: scaleBtn 1.2s linear infinite;
  }
  .mainBox {
    width: 590rpx;
    height: 820rpx;
    position: absolute;
    top: 0;
    left: 0;
    .bottomBox {
      padding: 28rpx 0 20rpx 0;
    }
    .title1 {
      text-align: center;
      font-weight: bold;
      font-size: 70rpx;
      margin-top: 20rpx;
    }
    image {
      width: 344rpx;
      height: 344rpx;
      margin-top: 30rpx;
    }
    .title2 {
      font-size: 30rpx;
      margin: 26rpx 0;
    }
    .button {
      width: 418rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      text-align: center;
      margin: 0 auto;
      border: 1px solid var(--red);
      color: var(--red);
      border-radius: 0;
    }
    .button.bg-red {
      color: #fff;
      margin-top: 14rpx;
    }
  }
  
  .gif {
    width: 600rpx;
    height: 668rpx;
  }
  .activity {
    position: absolute;
    width: 100%;
    bottom: 90rpx;
    height: 98rpx;
    text-align: center;
  }
  
  .close {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    font-size: 60rpx;
    z-index: 999;
  }
}
.info {
  height: 340rpx;
  overflow: hidden;
}
.shareBtn {
  width: 44rpx;
  height: 44rpx;
  margin-top: 8rpx;
  margin-left: 17rpx;
}
.qidai {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.searchBox {
  padding: 20rpx 20rpx;
}
.swiperBox scroll-view {
  height: 100%;
}
.search {
  height: 60rpx;
  line-height: 60rpx;
  background-color: #B3B8C2;
  font-size: 24rpx;
  color: #fff;
  width: 500rpx;
  padding-left: 80rpx;
  padding-right: 30rpx;
  position: relative;
}
.search::before {
  font-family: "cuIcon";
  content: "\e65c";
  position: absolute;
  left: 40rpx;
  top: 2rpx;
}
.subscribe {
  width: 130rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #EE4C40;
  font-size: 24rpx;
}
.shopInfo {
  padding: 30rpx;
}
.shopInfo>.fr {
  width: 560rpx;
}
.logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
}
.shopTitle {
  font-size: 28rpx;
  font-weight: bold;
  line-height: 32rpx;
  margin-bottom: 8rpx;
}
.shopDescp {
  font-size: 22rpx;
}
.info .nav {
  padding: 10rpx 30rpx;
  font-size: 30rpx;
}
.info .nav .cu-item {
  height: 60rpx;
  line-height: 60rpx;
}
.info .nav .active {
  font-weight: bold;
  position: relative;
}
.info .nav .active::after {
  content: "";
  width: 40rpx;
  height: 6rpx;
  background-color: #fff;
  border-radius: 999rpx;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 2rpx;
}
.bgImg {
  width: 100%;
  height: 340rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.info .cover {
  width: 100%;
  height: 340rpx;
  background-color: rgba(0,0,0,.4);
  position: absolute;
  left: 0;
  top: 0;
}
.bannerSwiper {
  height: 240rpx;
  margin: 0;
  margin-bottom: 30rpx;
}
.bannerSwiper .swiper-item {
  height: 210rpx;
  border-radius: 10rpx;
  overflow: hidden;
  width: 720rpx;
  margin: 30rpx 20rpx;
  margin-bottom: 0;
}
.dptj {
  height: 68rpx;
  font-size: 30rpx;
}
.tuijian {
  position: relative;
  font-weight: bold;
}
.tuijian::before {
  content: "\E601";
  font-family: "iconfont" !important;
  font-size: 50rpx;
  position: absolute;
  color: var(--red);
  left: -50rpx;
  top: -10rpx;
}
.tuijian::after {
  content: "\E601";
  font-family: "iconfont" !important;
  font-size: 50rpx;
  color: var(--red);
  position: absolute;
  right: -50rpx;
  top: -10rpx;
  transform: rotate(180deg);
}
.ul1 {
  padding: 0 20rpx;
}
.li1 {
  width: 348rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #FCF9FC;
  margin-bottom: 20rpx;
}
.li1 .imgBox {
  height: 348rpx;
  overflow: hidden;
}
.li1 image {
  width: 100%;
}
.ljgm {
  display: inline-block;
  width: 150rpx;
  text-align: center;
  height: 36rpx;
  line-height: 36rpx;
  font-size: 24rpx;
  position: relative;
  right: 0;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.shiti {
  display: inline-block;
  width: 88rpx;
  height: 36rpx;
  line-height: 36rpx;
  border-radius: 10rpx;
  background-color: #EF6156;
  color: #fff;
  text-align: center;
  margin-left: 10rpx;
  font-size: 22rpx;
  font-weight: normal;
}
.ul2 {
  height: 88rpx;
  background-color: #fff;
}
.li2 {
  width: 110rpx;
  height: 48rpx;
  line-height: 48rpx;
  background-color: #f8f8f8;
  vertical-align: middle;
  margin-right: 66rpx;
}
.li2:last-child {
  margin-right: 0;
}
.posCenter {
  position: absolute;
  width: 470rpx;
  overflow: hidden;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.goodList {
  padding: 12rpx 20rpx 100rpx;
}
.goodList .goodItem {
  width: 344rpx;
  height: 532rpx;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}
.goodList .imgBox {
  height: 344rpx;
  overflow: hidden;
}
.goodList .imgBox image {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.flexItem {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  margin: 6rpx 6rpx 6rpx 0;
  display: inline-block;
}
.tagList {
  height: 48rpx;
  overflow: hidden;
}
</style>
