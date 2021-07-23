<template>
  <view>
    <image
      :src="bannerUrl?bannerUrl:'/static/images/default.png'"
      mode="widthFix"
      style="width:100%"
      lazy-load="false">
    </image>
    <!-- 导航栏目 -->
    <view class="cu-card no-card navChange card_cateBox card_cateBoxbox bg-white">
      <scroll-view
        scroll-x
        class="nav"
        scroll-with-animation
        :scroll-left="scrollLeft"
        scroll-anchoring="true"
        @scroll="scrollMove"
      >
        <!-- <view class="boxView"> -->
        <view
          class="cu-item tabs"
          v-for="(item, index) in areaList"
          :key="index"
          :id="'v'+index"
          @tap="tabSelect(index, item.id)"
          :data-id="index"
        >
          <view class="tabs-item text-df">
            <view class="position" :class="[item.id == areaId ? 'active' : '']">{{
              item.title
            }}</view>
          </view>
        </view>
        <!-- </view> -->
      </scroll-view>
    </view>
    <!-- 商品 -->
    <view class="cu-card article no-card solid-bottom" v-for="(item, index) in goodsList" :key="index">
      <view class="cu-item shadow padding-tb" @click="goDetail(item.alias,item.merchantId)">
        <view class="content">
          <image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image>
          <view class="desc">
            <view class="text-cut" style="width: 450rpx">{{item.name}}</view>
            <view class="text-xs text-gray ">{{item.brandName}}</view>
            <view>
              <text v-for="(itemList,indexList) in item.tages" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
            </view>
            <view class="flex align-end justify-between">
              <view class="margin-top-sm">
                <view class="text-price text-xl text-red margin-right">{{item.priceStr}}</view>
              </view>
            </view>
          </view>
        </view>
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
        downIndex:0,
        scrollLeft:"",
        areaId:9999,
        bannerUrl:"",
        areaList: [],
        name:""
      }
    },
    onLoad(options) {
      this.getAreaList()
      this.getGoodsList()
      this.getBanner()
    },
    onUnload(){
      this.goodsList=[];
    },
    mounted() {

    },
    onShow(){
      wx.setNavigationBarTitle({ title: '原产地专区' });
      let scrollInfo = {
        prevDistance: 0,
        screenHalfwidth: wx.getSystemInfoSync().windowWidth / 2,
      };
      this.scrollInfo = scrollInfo;
    },
    onReachBottom() {
      // 上拉加载更多
      this.getGoodsListLoad()
      
    },
    computed: {
      ...mapState([
        'cartList',
        'userInfo'
      ]),
    },
    methods: {
      ...mapMutations(["update"]),
      getBanner(){
        this.$fly.get("/getBanner?id=5").then(res => {
          this.bannerUrl = res.data.data[0].imgUrl
        })
      },
      tabSelect(index, virtualId) {
        this.areaId = virtualId;
        this.downIndex = 0;
        this.getRect(index);
        this.getGoodsList();
      },
      //获取类目的宽高
      getRect: function (index) {
        let that = this;
        let query = wx.createSelectorQuery();
        if(index!=0){
          query
          .select("#v" + index)
          .boundingClientRect(function (rect) {
            that.scrollInfo.subLeft = rect.left; //元素一半宽度
            that.scrollInfo.subHalfWidth = rect.width / 2;
            that.moveTo();
          })
          .exec();
        }
      },
      //移动导航栏
      moveTo: function () {
        let subLeft = this.scrollInfo.subLeft;
        let subHalfWidth = this.scrollInfo.subHalfWidth;
        let prevDistance = this.scrollInfo.prevDistance;
        let screenHalfwidth = this.scrollInfo.screenHalfwidth;
        let needScroll = subLeft - screenHalfwidth + subHalfWidth;
        let scrollLeft = needScroll + prevDistance;
        this.scrollLeft = scrollLeft
      },
      //记录滚动的距离
      scrollMove: function (e) {
        let distance = e.target.scrollLeft;
        this.scrollInfo.prevDistance = distance;
      },
      getGoodsList() {
        this.$fly.get("/products/virtual/queryProduct?virtualId=" + this.areaId +'&offset='+this.downIndex*10+'&limit=10').then(res => {
          this.goodsList = res.data.data
          this.downIndex=1
        })
      },
      getAreaList() {
        this.$fly.get("/products/virtual/queryByApp?type=1").then(res => {
          this.areaList = res.data.data
        })
      },
      getGoodsListLoad() {  
        if(this.downIndex==0){
          this.goodsList = []
        }
        this.$fly.get("/products/virtual/queryProduct?virtualId=" + this.areaId +'&offset='+this.downIndex*10+'&limit=10').then(res => {
          if(res.data.data.length==0){
            wx.showToast({
              title: '没有更多啦~~',
              icon: 'none'
            })
            return;
          }
          this.goodsList.push.apply(this.goodsList,res.data.data);
          this.downIndex++;
        })
      },
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
  .card_cateBox {
    overflow: hidden;
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
    .bg{
    background: rgb(14, 181, 187);
    /**background: #fff;**/
  }
  .flexItem {
    font-size: 20rpx;
    padding: 2rpx 10rpx;
    margin: 6rpx 6rpx 6rpx 0;
    display: inline-block;
  }
  .active {
    font-weight: bold;
    color: var(--red);
    position: relative;
  }
  .active::after {
    content: "";
    width: 90%;
    height: 4rpx;
    background-color: var(--red);
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
