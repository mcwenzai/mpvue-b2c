<template>
  <view>
    <view class="goodList cf">
      <view class="goodItem" v-for="(item,index) in goodsList" :key="index" :class="index%2==0?'fl':'fr'" @click="goDetail(item.alias,item.merchantId)">
        <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
        <view class="padding-lr-xs">
          <view class="text-cut margin-bottom-xs margin-top-xs">{{item.name}}</view>
          <view>
            <text v-for="(itemList,indexList) in item.tags" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
          </view>
          <view class="price cf margin-tb-sm">
            <view class="fl text-bold">
              <text class="text-red text-xl"><text class="text-price"></text> {{item.priceStr}} </text>
              <text class="text-grey text-xm"> <text class="text-price"></text> {{item.showPriceStr}}</text>
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
      wx.setNavigationBarTitle({
        title: "每日尖货",
      });
      this.virtualId = options.virtualId||1
      this.getList()
    },
    onUnload(){
      this.goodsList=[];
    },
    mounted() {

    },
    onReachBottom() {
      // 上拉加载更多
      this.getList()
    },
    computed: {
      ...mapState([
        'cartList',
        'userInfo'
      ]),
    },
    methods: {
      ...mapMutations(["update"]),
      goDetail(id, merchantId) {
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`
        })
      },
      bindPickerChange: function(e) {
        this.index=e.target.value
      },
      getList(){//获取商品
        if(this.downIndex==0){
          this.goodsList = []
        }
        this.$fly.get("/products/topgoods/queryProduct?virtualId="+this.virtualId+"&offset="+this.downIndex*10+"&limit=10")
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
    }
  }

</script>
<style lang="scss">
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
page {
  background: #F8F8F8;
}

.imgBox {
  border-radius: 10rpx;
  overflow: hidden;
}
.imgBox image {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.goodList {
  padding: 12rpx 20rpx 100rpx;
}
.goodList .goodItem {
  width: 344rpx;
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
  height: 100%;
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
.price .text-grey {
  text-decoration: line-through;
}
</style>
