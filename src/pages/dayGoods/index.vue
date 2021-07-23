<template>
  <view>
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
          v-for="(item, index) in navList"
          :key="index"
          :id="'v'+index"
          @tap="tabSelect(index, item.id)"
          :data-id="index"
        >
          <view class="tabs-item text-df">
            <view class="position" :class="[item.id == virtualId ? 'active' : '']">{{
              item.subTitle
            }}</view>
          </view>
        </view>
        <!-- </view> -->
      </scroll-view>
    </view>
    <image
      :src="bannerUrl"
      style="width:100%"
      mode="widthFix"
      v-if="name!='爆款预热'&&name!='社员专区'&&name!='百荷旗舰'&&bannerUrl">
    </image>
    <view class="goodList cf">
      <view class="goodItem" v-for="(item,index) in goodsList" :key="index" :class="index%2==0?'fl':'fr'" @click="goDetail(item.alias,item.merchantId,item)">
        <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
        <view class="padding-lr-xs">
          <view class="text-cut margin-bottom-xs margin-top-xs">{{item.name}}</view>
          <view>
            <text v-for="(itemList,indexList) in item.tags" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
          </view>
          <view class="zhekou" v-if="item.typeValueText">{{item.typeValueText}}</view>
          <view class="price cf margin-tb-sm">
            <view class="fl text-bold">
              <text class="text-red text-xl"><text class="text-price"></text>{{item.priceStr}} </text>
              <text class="text-grey text-xm"> <text class="text-price"></text>{{item.showPriceStr}}</text>
            </view>
          </view>
          <view class="goumai bg-red text-center">立即抢购</view>
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
        navList: [],
        virtualId: "",
        scrollLeft:"",
        downIndex:0,
        startTime:'',
        bannerUrl:'',
        endTime:'',
        name:""
      }
    },
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: options.name,
      });
      this.navList = [];
      this.downIndex=0;
      this.virtualId = options.virtualId;
      this.name = options.name;
      if(this.name == "百荷旗舰"){
        this.getNav();
      }
      this.getList()
      let scrollInfo = {
        prevDistance: 0,
        screenHalfwidth: wx.getSystemInfoSync().windowWidth / 2,
      };
      this.scrollInfo = scrollInfo;
      if(options.imgUrl){
        this.bannerUrl = options.imgUrl
      }else {
        this.bannerUrl = ''
      }
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
      goDetail(id, merchantId, item) {
        if(this.name.indexOf('社员')!=-1){
          wx.navigateTo({
            url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}&cantBuy=社员专区`
          })
        }else if(this.name.indexOf('爆款')!=-1){
          wx.navigateTo({
            url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}&startTime=${this.startTime}&endTime=${this.endTime}`
          })
        }else{
          wx.navigateTo({
            url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}&typeValueText=${item.typeValueText}`
          })
        }
      },
      tabSelect(index, virtualId) {
        this.virtualId = virtualId;
        this.downIndex = 0;
        this.getRect(index);
        this.getList();
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
      bindPickerChange: function(e) {
        this.index=e.target.value
      },
      getNav(){
        this.$fly.get("/products/flagship/queryFlagship")//百合旗舰
        .then((res) => {
          this.navList = res.data.data;
          this.virtualId = res.data.data[0].id;
        });
      },
      getList(){//获取商品
        if(this.downIndex==0){
          this.goodsList = []
        }
        if(this.name == "爆款预热") {
          var url = "/products/hot/queryProduct?virtualId=";
          this.getHot();
        }else if(this.name == "百荷旗舰") {
          var url = "/products/flagship/queryProduct?virtualId=";
        }else if(this.name == '社员专区'){
          var url = "/products/virtual/queryProductByName?name=社员专区";
        }else{
          var url = "/products/topgoods/queryProduct?virtualId=";
        }
        this.$fly.get(url+this.virtualId+"&offset="+this.downIndex*10+"&limit=10")
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
            res.data.data.forEach(item=>{
              item.priceStr = item.priceStr.replace(/.00/g, '');
              item.showPriceStr = item.showPriceStr.replace(/.00/g, '');
              //活动类型 1满N件N折 2第二件半价  3 满减
              if(item.types==1){
                var list = item.typeValue.split(',');
                item.typeValueText = '满'+list[0]+'件'+(list[list.length-1]*10).toFixed(2)+'折'
              }else if(item.types==2){
                item.typeValueText = '第二件半价'
              }else if(item.types==3){
                var list = item.typeValue.split(',');
                item.typeValueText = '满'+list[0]+'减'+list[list.length-1]
              }
            })
            this.goodsList.push.apply(this.goodsList,res.data.data);
          }
        });
      },
      getHot(){//获取爆款时间
        this.$fly.get('/products/hot/queryHot')
        .then((res) => {
          if(res.data.success){
            this.startTime = res.data.data[0].startTime;
            this.endTime = res.data.data[0].endTime;
          }
        });
      }
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

.zhekou {
  color: var(--red);
  padding: 0 10rpx;
  margin: 10rpx 0;
  font-size: 20rpx;
  display: inline-block;
  border: 1px solid var(--red);
}
.card_cateBox {
  overflow: hidden;
}
.nav .cu-item {
  height: 70rpx;
  line-height: 70rpx;
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
  height: 600rpx;
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
.price {
  padding-left: 10rpx;
}
.price .text-grey {
  text-decoration: line-through;
}
.goumai {
  line-height: 38rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  margin-bottom: 30rpx;
}
</style>
