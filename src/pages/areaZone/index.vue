<template>
  <view>
    <image
      :src="bannerUrl"
      mode="widthFix"
      style="width:100%">
    </image>
    <view class="searchBox bg-white cf">
      <picker
        @change="bindPickerChange"
        :value="index"
        :range="nameList"
        class="fl round text-cut"
        :data-id="idList[index]">
        {{nameList[index]}}<text class="iconfont icon-tubiaozhizuo-"></text>
      </picker>
      <input confirm-type="search" class="search fl round" placeholder="搜索店内商品" v-model="name" placeholder-style="color:#666" @confirm="submit">
      <view class="fl sousuo text-center text-red" @click="submit">搜索</view>
    </view>
    <view class="goodList cf">
      <view class="goodItem" v-for="(item,index) in goodsList" :key="index" :class="index%2==0?'fl':'fr'" @click="goDetail(item.alias,item.merchantId)">
        <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
        <view class="padding-lr-xs">
          <view class="text-cut margin-bottom-xs margin-top-xs">{{item.name}}</view>
          <view>
            <text v-for="(itemList,indexList) in item.tags" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
          </view>
          <view class="price cf margin-tb-sm">
            <view class="fl text-red text-bold text-xl">
              <text class="text-price"></text> {{item.priceStr}}
            </view>
            <view class="text-grey fr text-xs">销量：{{item.soldNumber}}</view>
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
        nameList:[],
        idList:[],
        downIndex:0,
        bannerUrl:"",
        areaId:"",
        index:0,
        name:""
      }
    },
    onReachBottom() {
      // 上拉加载更多
      this.getList()
    },
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: "地理标志专区",
      });
      this.downIndex = 0;
      this.index=0;
      this.goodsList=[];
      this.getBanner();
      this.getAreaList();
    },
    onPullDownRefresh(){
      this.downIndex = 0;
      this.goodsList=[];
      this.getAreaList();
    },
    mounted() {

    },
    // onReachBottom() {
      
    // },
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
      submit(){
        this.downIndex = 0;
        this.getList()
      },
      bindPickerChange: function(e) {
        this.downIndex = 0;
        this.goodsList=[];
        this.index=e.target.value;
        this.areaId=this.idList[this.index];
        console.log(e,"11111");
        this.getList();
      },
      getBanner(){
        this.$fly.get("/getBanner?id=7").then(res => {
          this.bannerUrl = res.data.data[0].imgUrl
        })
      },
      getAreaList() {
        this.$fly.get("/products/virtual/queryByApp?type=2").then(res => {
          this.nameList=[];
          this.idList=[];
          this.areaId = res.data.data[0].id;
          this.getList()
          res.data.data.forEach(item=>{
            item.title = item.title.replace(/\s*/g,"");
            if(item.title){
              this.nameList.push(item.title);
              this.idList.push(item.id);
            }
          })
        })
      },
      getList(){//获取商品
        if(this.downIndex==0){
          this.goodsList = []
        }
        var param = {
          virtualId: this.areaId,
          offset: this.downIndex*10,
          limit: 10,
          name: this.name,
        }
        this.$fly.get("/products/virtual/queryProduct",param).then(res => {
          wx.stopPullDownRefresh();
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
.searchBox {
  height: 98rpx;
  padding: 20rpx;
  picker {
    width: 160rpx;
    height: 58rpx;
    line-height: 58rpx;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid var(--red);
    color: var(--red);
    font-size: 24rpx;
    margin-right: 30rpx;
    .icon-tubiaozhizuo- {
      font-size: 24rpx;
      margin-left: 6rpx;
    }
  }
  .search {
    width: 420rpx;
    height: 58rpx;
    line-height: 58rpx;
    background-color: #eee;
    font-size: 24rpx;
    color: #333333;
    padding-left: 80rpx;
    padding-right: 30rpx;
    position: relative;
  }
  .search::before {
    font-family: "cuIcon";
    content: "\e65c";
    position: absolute;
    left: 40rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30rpx;
  }
  .sousuo {
    width: 100rpx;
    line-height: 58rpx;
    font-size: 26rpx;
  }
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
</style>
