<template>
  <view class="bg">
    <!-- 这是搜索 -->
    <form @submit.prevent="submit">
      <view class="cu-bar search bg-white">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="商品名称"
            name="search" />
        </view>
        <view class="action">
          <button class="cu-btn bg-red shadow-blur round" formType="submit">搜索</button>
        </view>
      </view>
    </form>


    <!-- banner -->
    <Banners></Banners>

    <!-- 分类 -->
    <view class="cu-card no-card">
      <view class=" cu-list grid col-4 no-border card_cateBox ">
        <view class="cu-item" v-for="(item,index) in cuIconList" :key="index" @click="goGoodsList(item.url)">
          <view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
          </view>
          <text>{{item.name}}</text>
        </view>
      </view>
    </view>

    <!-- 分类 -->
    <view class="bg-red  cu-card no-card navChange card_cateBox card_cateBoxbox ">
      <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
        <!-- <view class="boxView"> -->
        <view class="cu-item tabs" v-for="(item, index) in nav" :key="index" @tap="tabSelect(index,item.id)"
          :data-id="index">
          <view class="tabs-item">
            <view :class="[index==activeId?'bgcTabs':'bgcTabs_fw']">{{item.title}}</view>
            <!-- 处理下方的滑动切换图标 -->
            <view class="changetip" :class="[index==activeId?'viewBgc':'bgcTabs_fw']">{{item.subTitle}}</view>
          </view>
        </view>
        <!-- </view> -->
      </scroll-view>
    </view>
    <!-- 商品-->
    <view class="  cu-card article no-card solid-bottom card_cateBox" v-for="(item, index) in goodsList" :key="index">
      <view class="bg-red cu-item cu-choose  shadow padding-tb" @click="goDetail(item.alias,item.merchantId)">
        <view class="content">
          <image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image>
          <view class="desc">
            <view class="text-cut" style="width: 450rpx">{{item.brandName}}</view>
            <view class="text-xs text-gray descp">{{item.name}}</view>
            <view class="flex align-end justify-between">
              <view class="margin-top-sm">
                <!--<view class="cu-tag bg-yellow light sm radius" v-if="item.stocks[0].vip_price">会员价: ¥{{item.stocks[0].vip_price}}</view>-->
                <view class="text-price text-xl text-orange margin-right">{{item.showPriceStr}}</view>
              </view>
              <view class="cu-btn cu-avatar bg-red round" @tap.stop="addGoods(item, 0, 1)" data-target="ChooseModal">
                <text class="cuIcon-cart"></text>
              </view>
            </view>
          </view>
        </view>
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
  import GoodsModal from '@/components/goodsModal'
  import Banners from '@/components/banners'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    components: {
      GoodsModal,
      Banners
    },
    data() {
      return {
        modalStocksIndex: 0,
        modalCuont: 1,
        modalName: null,
        modalStocks: [{
          price: ''
        }],
        modalGood: {},
        direction: '',
        cuIconList: [{
          cuIcon: 'redpacket_fill',
          color: 'red',
          badge: 22,
          name: '新品上市',
          url: '/products/news?offset=0&limit=20'
        }, {
          cuIcon: 'appreciatefill',
          color: 'orange',
          badge: 1,
          name: '平台推介',
          url: '/products/recommend?offset=0&limit=20&merchantId=1'
        }, {
          cuIcon: 'goodsfill',
          color: 'blue',
          badge: 0,
          name: '爆款直降',
          url: '/products/virtual/queryProduct?virtualId=41'
        }, {
          cuIcon: 'peoplefill',
          color: 'pink',
          badge: 22,
          name: '商场同款',
          url: '/products/query/marketingSame?offset=0&limit=20'
        }],
        goodsList: [],
        nav: [],
        // tab栏切换
        activeId: 0
      };
    },
    onLoad() {
      this.getNavList();
      //this.getCuIconList();
      this.tabSelect(0, 16);
    },
    mounted() {

    },
    computed: {
      ...mapState([
        'cartList',
        'userInfo'
      ]),
    },
    methods: {
      ...mapMutations(["update"]),
      getGoodsList(virtualId) {
        this.$fly.get('/products/virtual/queryProduct?virtualId=' + virtualId + '&offset=0&limit=100').then(res => {
          this.goodsList = res.data.data
          //console.log("this.goodsList", this.goodsList)
        })
      },
      // 小程序 点击搜索 按钮时  事件
      submit: function (data) {
        //console.log(data.mp.detail.value.search) //  {username: "hgj", password: "fsdfsd"}
        let keyWord = data.mp.detail.value.search
        if (keyWord) {
          wx.navigateTo({
            url: `/pages/goodsList/main?name=${keyWord}`
          })
        }
      },
      getCuIconList() {
        this.$fly.get('/entrances').then(res => {
          //console.log("res.data.data", res.data.data)
          this.cuIconList = res.data.data
        })
      },

      tabSelect(index, virtualId) {
        this.activeId = index;
        this.getGoodsList(virtualId)
      },
      getNavList() {
        this.$fly.get('products/virtual/queryByApp').then(res => {
          this.nav = res.data.data
          ////console.log("nav==="+this.nav)
        })
      },

      goDetail(id, merchantId) {
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`
        })
      },

      addGoods(goods, index) {
        //console.log("goods", goods)
        // 多规格的情况弹窗goods.stocks.length
        if (true) {
          this.$fly.get('/products/' + goods.alias + '?merchantId=' + goods.merchantId).then(res => {
            this.$refs.goodsModal.showModal(res.data.data)
          })

        } else {
          this.submitStock(goods, 0, 1)
        }
      },
      
      // 这是点击图片的跳转
      goGoodsList(url) {
        wx.navigateTo({
          url: `/pages/goodsList/main?url=${url}`
        })
      }
    },
  }

</script>

<style>
  .descp {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .bg-yellow.light {
    color: #a5673f;
    background-color: #f8e470;
  }

  .no-card .content>image {
    height: 6.8em !important;
  }

  .tower-swiper .tower-item {
    transform: scale(calc(0.5 + var(--index) / 10));
    margin-left: calc(var(--left) * 100rpx - 150rpx);
    z-index: var(--index);
  }

  .changetip {
    margin-top: 10rpx;
    padding: 5rpx 10rpx;
  }

  .viewBgc {
    border-radius: 20rpx;
    color: #fff;
    background-color: red;
  }

  .cu-item {
    text-align: center;
  }

  .tabs {
    line-height: 35rpx !important;
    font-size: 25rpx;
  }

  .bgcTabs {
    font-weight: 800;
  }

  .bgcTabs_fw {
    font-weight: 100;
    /* font-size: 20rpx; */
  }

  .card_cateBox {
    border-radius: 20rpx;
    margin: 15rpx;
    overflow: hidden;
  }

  .card_cateBoxbox {
    margin-top: 0;
    margin-bottom: 0;
    padding: 2rpx;
  }

  .card_catetab {
    margin-top: 0;
  }

  .cu-choose {
    text-align: left;
  }

  .tabs-item {
    margin-left: 10rpx;
  }

  .card-swiper {
    border-radius: 20rpx;
    margin: 15rpx;
    overflow: hidden;
    margin-bottom: 0;
  }

  .navigator_view {
    width: 25%;
  }

  .view_cate_box {
    display: flex;
    flex-wrap: wrap;
  }

  .bg {
      background: rgb(28, 185, 164);
  }

</style>
