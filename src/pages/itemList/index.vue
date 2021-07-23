<template>
  <view class="bg">
    <!-- 商品 -->
    <view class="cu-card article no-card solid-bottom" v-for="(item, index) in goodsList" :key="index">
      <view class="cu-item shadow padding-tb" @click="goDetail(name.indexOf('同款')!=-1?item.aliasId:item.alias,item.merchantId)">
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
        name:""
      }
    },
    onLoad(options) {
      this.name = options.name||'';
      this.id = options.id;
      this.getGoodsList();
      if(options.name!="undefined"){
        wx.setNavigationBarTitle({
          title: options.name,
        });
      }
    },
    onUnload(){
      this.goodsList=[];
    },
    mounted() {

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
      getGoodsList() {
        if(this.name=="平台推荐"){
          var url = '/products/recommend?offset=0&limit=10';
        }else if(this.name.indexOf('同款')!=-1){
          var url = '/products/query/marketingSame?offset=0&limit=10';
        }else if(this.id){
          var url = '/products/virtual/queryProduct?offset=0&limit=10&virtualId=' + this.id;
        }
        this.$fly.get(url).then(res => {
          this.goodsList = res.data.data
          this.downIndex=1
        })
      },
      getGoodsListLoad() {  
        if(this.downIndex==0){
          this.goodsList = []
        }
        if(this.name=="平台推荐"){
          var url = '/products/recommend?offset='+this.downIndex*10+'&limit=10';
        }else if(this.name.indexOf('同款')!=-1){
          var url = '/products/query/marketingSame?offset='+this.downIndex*10+'&limit=10';
        }else if(this.id){
          var url = '/products/virtual/queryProduct?virtualId=' + this.id + '&offset='+this.downIndex*10+'&limit=10';
        }
        this.$fly.get(url).then(res => {
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
        if(this.name.indexOf('新人')!=-1){
          wx.navigateTo({
            url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}&cantBuy=新人专享`
          })
        }else{
          wx.navigateTo({
            url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`
          })
        }
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
</style>
