　　　　　
<template>
  <view class="card-page">
    <block v-for="(item,index) in list" :key="index">
      <view class="clearfix listBox">
        <image :src="item.productImgUrl?item.productImgUrl:'/static/images/default.png'" class="img fl"></image>
        <view class="flex-sub fr">
          <view class="text-cut">{{item.bargainTitle}}</view>
          <view class="info">
            <view class="progress cf">
              <view class="progress-box fl">
                <progress :percent="item.percent" color="#E54148" backgroundColor="#FFE5E8"  border-radius="16" stroke-width="16" />
              </view>
              <view class="rush">已抢{{item.percent}}%</view>
              <text class="surplus fl text-red">剩余{{item.bargainStockNum}}件</text>
            </view>
            <view class="allPrice clearfix">
              <text class="text-price secPrice" :class="'text-red'">{{item.priceStr}}</text>
              <text class="text-grey text-price oldPrice">{{item.showPriceStr}}</text>
              <button class="goBtn fr cu-btn bg-grey" v-if="item.status=='已结束'||item.bargainStockNum==0">点击报名拿</button>
              <button class="goBtn fr cu-btn bg-red" v-else @click="(goDetail(item))">点击报名拿</button>
            </view>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
  import {
		moneyFormat
	} from "@/utils/index";
  import {
		mapState,
		mapMutations
	} from "vuex";
  export default {
    data(){
      return{
        timeDown:[],
        cutDown:"",
        list:[],
      }
    },
    onLoad(options){
      this.TabCur = 0;
      this.getList()
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '0元砍单',
      });
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.getList();
    },
    computed:{
			...mapState(["isLogin", "cartCount", "userInfo"]),
		},
    methods:{
      getList(){
        this.$fly.config.headers = {
          "X-Tag": "flyio"
        };
        this.$fly.post('/bargain/query',{'offset':0,'limit':20}).then(res => {
          wx.stopPullDownRefresh();
          if(res.data.success){
            res.data.data.forEach(item=>{
              item.percent = (item.bargainStockSoldNum / item.bargainFullStockNum).toFixed(2) * 100;
              if(new Date()<item.startTime) {
                item.status = "即将开抢"
              }else if(new Date()>item.endTime){
                item.status = "已结束"
              }else if(new Date()>item.startTime && new Date()<item.endTime){
                item.status = "抢购中"
              }
            })
            this.list = res.data.data;
          }
        })
      },
      goDetail(item){
        wx.navigateTo({ url: '/pages/bargainProductDetail/main?productAliasId='+ item.productAliasId + '&bargainProductId=' + item.id });
      },
			getDate(now) { 
				var year=now.getFullYear(); 
				var month=this.addZero(now.getMonth()+1);
				var date=this.addZero(now.getDate());
				var hour=this.addZero(now.getHours()); 
        var minute=this.addZero(now.getMinutes());
				// var second=now.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute; 
      },
      addZero(i){
        return i < 10 ? "0" + i: i + "";
      },
    }
  }
</script>

<style>
  page, .card-page{
    height: 100%;
    background: #f8f8f8;
  }
  .contain{
    height: 100%;
    text-align: center;
  }
  /* 声明清除浮动的样式 */
  .clearfix:before,
  .clearfix:after {
  content: "";
  display: table;
  }
  .clearfix:after {
  clear: both;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .flex-sub {
    width: 430rpx;
  }
  .mainBox {
    background-color: #F8F8F8;
    padding: 0 20rpx;
  }
  .listBox {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    position: relative;
    margin: 0 20rpx;
    margin-bottom: 20rpx;
  }
  .saledImg {
    width: 120rpx;
    position: absolute;
    bottom: 10rpx;
    right: 18rpx;
  }
  .img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
  }
  .nowrap {
    height: 76rpx;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .allPrice .secPrice {
    font-size: 38rpx;
    margin-right: 10rpx;
  }
  .allPrice .oldPrice {
    text-decoration: line-through;
    margin-right: 6rpx;
    font-size: 22rpx;
  }
  .allPrice {
    margin-top: 30rpx;
  }
  .goBtn {
    padding: 0 10rpx;
    line-height: 36rpx;
    font-size: 20rpx;
    height: 36rpx;
    position: relative;
    top: 6rpx;
    color: #fff;
    border-radius: 6rpx;
  }
  .progress {
    position: relative;
    margin-top: 30rpx;
  }
  .progress-box {
    width: 240rpx;
  }
  .rush {
    position: absolute;
    color: #fff;
    font-size: 20rpx;
    top: 0;
    left: 20rpx;
  }
  .surplus {
    position: relative;
    margin-left: 30rpx;
    font-size: 22rpx;
  }
  .timeDown {
    font-size: 20rpx;
    line-height: 76rpx;
    color: #666666;
  }
  .timeBox {
    display: inline-block;
    padding: 0 10rpx;
    height: 36rpx;
    line-height: 36rpx;
    border-radius: 6rpx;
    background-color: #E54148;
    color: #fff;
    text-align: center;
    margin: 0 8rpx;
  }
  .countDown {
    font-size: 20rpx;
    padding: 2rpx 14rpx;
    position: relative;
    top: 6rpx;
    border: 1px solid ;
  }
  .card_cateBox {
    overflow: hidden;
    height: 110rpx;
    background-color: var(--red);
  }
  .nav .cu-item {
    height: 80rpx;
    margin: 15rpx 20rpx;
    line-height: 30rpx;
    text-align: center;
    font-weight: bold;
    color: #fff;
  }
  .nav .cu-item.active {
    background-color: #fff;
    color: var(--red);
    border-radius: 8rpx;
  }
  .nav .cu-item .title1 {
    font-size: 28rpx;
    margin-top: 10rpx;
  }
  .nav .cu-item .title2 {
    font-size: 20rpx;
  }
  swiper {
    height: 100%;
  }
  swiper-item{
    overflow: scroll;
  }
</style>