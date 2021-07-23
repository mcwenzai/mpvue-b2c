<template>
  <view class="bg">
    <!-- 这是搜索 -->
    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input adjust-position="false" confirm-type="search" placeholder="商品名称" name="search" v-model="name"  @confirm="submit"/>
      </view>
      <view class="action">
        <button class="cu-btn bg-red shadow-blur round" @click="submit">搜索</button>
      </view>
    </view>
    <!-- 商品 -->
    <view class="cu-card article no-card solid-bottom" v-for="(item, index) in goodsList" :key="index">
      <view class="cu-item shadow padding-tb" @click="goDetail(item.aliasId,item.merchantId)">
        <view class="content">
          <image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image>
          <view class="desc">
            <view class="text-cut" style="width: 450rpx">{{item.name}}</view>
            <view class="text-xs text-gray ">{{item.brandName}}</view>
            <view>
              <text v-for="(itemList,indexList) in item.tags" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
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
        downIndex:0,
        goodsList: [],
        id:"",
        url:"",
        name:""
      }
    },
    onLoad(options) {
      this.name = "";
      this.id = "";
      this.url = "";
      if(options.id){
        this.id=options.id
      }
      if(options.name){
        this.name=options.name
      }
      if(options.url){
        this.url=options.url
      }    
      this.getGoodsList();
    },
    onUnload(){
      this.goodsList=[];
    },
     // 下拉刷新
    onPullDownRefresh() {
       this.getGoodsList()
       wx.stopPullDownRefresh()
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
      submit: function (data) {
        let keyWord = this.name;
        if (keyWord) {
          this.getGoodsList()
        }
      },
      getGoodsList() {
        var url = '/products/accessList?offset=0&limit=10'
        if (this.id) {
          url = url + '&categoryId=' + this.id;
        }
        if (this.name) {
          url = url + '&name=' + this.name;
        }
        if (this.url) {
          url=this.url;
        }
        this.$fly.get(url).then(res => {
          if(res.data.data.length==0){
            wx.showToast({
              title: '没有相关商品哦~~',
              icon: 'none'
            })
            return;
          }
          this.goodsList = res.data.data
          this.downIndex=1
          })     
      },     
      getGoodsListLoad() {  
        if(this.downIndex==0){
          this.goodsList = []
        }
        var url = '/products/accessList?offset='+this.downIndex+'&limit=10'
        if (this.id) {
          url = url + '&categoryId=' + this.id;
        }
        if (this.name) {
          url = url + '&name=' + this.name;
        }
        if (this.url) {
          url=this.url;
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
        console.log(`/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`)
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

  .bg-yellow.light {
    color: #a5673f;
    background-color: #f8e470;
  }

  .no-card .content>image {
    height: 220rpx !important;
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
