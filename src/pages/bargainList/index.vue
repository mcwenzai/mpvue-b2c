　　　　　
<template>
  <view>
    <view class="topBox" v-if="loginList.length>0">
      <view class="title1">
        正在进行中
      </view>
      <view class="listBox cf" v-for="(item,index) in loginList" :key="index" @click="goContinue(item)">
        <image :src="item.cover?item.cover:'/static/images/default.png'" class="img fl"></image>
        <view class="fr" v-if="item.status=='已成功'">
          <view class="title2">
            <text class="text-red">砍单成功！</text>
          </view>
          <view class="progress round">
            <view class="percent round" :style="{'width':'100%'}"></view>
          </view>
          <view class="cf timeDown">
            <view class="fl box">{{timeDown[index].hour}}</view><text class="fl">:</text>
            <view class="fl box">{{timeDown[index].minute}}</view><text class="fl">:</text>
            <view class="fl box">{{timeDown[index].second}}</view>
            <view class="fl color34">后{{statusName}}</view>
          </view>
          <view class="buyButton bg-red" @click="goContinue(item)">
            立即支付
          </view>
        </view> 
        <view class="fr" v-else>
          <view class="title2">
            已砍{{item.chajia}}元，<text class="text-red">仅差{{100-item.percent}}%</text>
          </view>
          <view class="progress round">
            <view class="percent round" :style="{'width':item.percent+'%'}"></view>
          </view>
          <view class="cf timeDown">
            <view class="fl box">{{timeDown[index].hour}}</view><text class="fl">:</text>
            <view class="fl box">{{timeDown[index].minute}}</view><text class="fl">:</text>
            <view class="fl box">{{timeDown[index].second}}</view>
            <view class="fl color34">后{{statusName}}</view>
          </view>
          <view class="buyButton bg-red" @click="goContinue(item)">
            继续砍价
          </view>
        </view> 
      </view>
    </view>
    <view class="mTitle">
      <image src="/static/images/kanIcon.png"></image>
      <text>低价砍单</text>
      <image src="/static/images/kanIcon.png"></image>
    </view>
    <view class="cf listBox1 flex" v-for="(item,index) in list" :key="index"  @click="(item.status!='已结束'&&item.bargainStockNum!=0) && goDetail(item)">
      <image :src="item.productImgUrl?item.productImgUrl:'/static/images/default.png'" class="img"></image>
      <view class="flex-sub">
        <view class="nowrap">{{item.bargainTitle}}</view>
        <view class="presell text-red" v-if="item.presell">距开始：{{timeDown1[index].hour}} : {{timeDown1[index].minute}} : {{timeDown1[index].second}}</view>
        <view class="info">
          <view class="progress">
            <view class="progress-box">
              <progress :percent="item.percent" :color="'#E54148'" :backgroundColor="'#FFE5E8'"  border-radius="16" stroke-width="16" />
            </view>
            <view class="rush">已抢{{item.percent}}%</view>
            <!-- <text class="surplus fr text-red">剩余{{item.bargainStockNum}}件</text> -->
          </view>
          <view class="allPrice clearfix">
            <text class="text-price secPrice" :class="'text-red'">{{item.priceStr}}</text>
            <text class="text-grey text-price oldPrice">{{item.showPriceStr}}</text>
          </view>
          <view class="buyButton bg-grey" v-if="item.status=='已结束'||item.bargainStockNum==0">
            点击报名拿
          </view>
          <view class="buyButton bg-red" v-else @click="goDetail(item)">
            点击报名拿
          </view>
        </view>
      </view>
    </view>
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
        cutDown:"",
        cutDown1:"",
        timeDown:[],
        timeDown1:[],
        showMask: false,
        statusName:"结束",
        list:"",
        loginList:"",
      }
    },
    onUnload(){
      clearInterval(this.cutDown)
      clearInterval(this.cutDown1)
      this.loginList = "";
      this.list = "";
    },
    onLoad(options){
      if(this.isLogin){
        this.getList();
        this.getNowList();
      }else {
        this.getList()
      }
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '0元砍单',
      });
    },
    onPullDownRefresh() {
      // 下拉刷新
      if(this.isLogin){
        this.getList();
        this.getNowList();
      }else {
        this.getList()
      }
    },
    computed:{
			...mapState(["isLogin", "cartCount", "userInfo"]),
		},
    methods:{
      getList(){
        this.$fly.config.headers = {
          "X-Tag": "flyio"
        };
        this.$fly.post('/bargain/query',{'offset':0,'limit':100}).then(res => {
          wx.stopPullDownRefresh();
          if(res.data.success){
            res.data.data.forEach(item=>{
              item.percent = (item.bargainStockSoldNum / item.bargainFullStockNum).toFixed(2) * 100;
              if(new Date()<item.startTime) {
                item.status = "即将开抢"
                item.presell = this.getDate(new Date(item.startTime))
                item.countdownTime = Math.ceil((new Date(item.startTime)-new Date()) / 1000)
              }else if(new Date()>item.endTime){
                item.status = "已结束"
              }else if(new Date()>item.startTime && new Date()<item.endTime){
                item.status = "抢购中"
              }
            })
            this.list = res.data.data;
            clearTimeout(this.cutDown1)
            this.countDown1()
          }
        })
      },
      getNowList(){
        this.$fly.config.headers = {
          Authorization: this.userInfo.token
        };
        this.$fly.get('/bargain/userJoins').then(res => {
          wx.stopPullDownRefresh();
          if(res.data.success){
            res.data.data.forEach(item=>{
              item.countdownTime = Math.ceil((new Date(item.endTime)-new Date()) / 1000)
              item.percent = ((item.bargainedOriginPrice-item.bargainedPrice) / (item.bargainedOriginPrice-item.bargainTargetPrice)).toFixed(2) * 100;
              item.chajia = (item.bargainedOriginPrice-item.bargainedPrice).toFixed(1)
              if(item.bargainedPrice == item.bargainTargetPrice) {
                item.status = "已成功"
              }else {
                item.status = "已结束"
              }
            })
            this.loginList = res.data.data;
            clearTimeout(this.cutDown)
            this.countDown()
          }
        })
      },
      goContinue(item){
        wx.navigateTo({ url: '/pages/bargainDetail/main?id='+item.id + '&uid=' + this.userInfo.id });
      },
      goDetail(item){
        wx.navigateTo({ url: '/pages/bargainProductDetail/main?productAliasId='+ item.productAliasId + '&bargainProductId=' + item.id });
      },
      close(){
        this.showMask = false
      },
			getDate(now) { 
				var year=now.getFullYear(); 
				var month=this.addZero(now.getMonth()+1);
				var date=this.addZero(now.getDate());
				var hour=this.addZero(now.getHours()); 
        var minute=this.addZero(now.getMinutes());
				// var second=now.getSeconds();
        return year+"/"+month+"/"+date+" "+hour+":"+minute; 
      },
      addZero(i){
        return i < 10 ? "0" + i: i + "";
      },
      //倒计时函数
      countDown() {
        let endTimeList = this.loginList;
        let countDownArr = [];
        // 对结束时间进行处理渲染到页面
        endTimeList.forEach((o,j)=>{
          let obj = null;
          if (o.countdownTime> 0) {
            let time = o.countdownTime;
            var hour = this.addZero(parseInt(time / (60 * 60)));
            var minute = this.addZero(parseInt(time / 60 % 60));
            var second = this.addZero(parseInt(time % 60));
            obj = {
              hour: hour,
              minute: minute,
              second: second
            }
            o.countdownTime = o.countdownTime-1;
          } else { //活动已结束，全部设置为'00'
            // this.getList()
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            }
          }
          countDownArr.push(obj);
        })
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.timeDown = countDownArr
        this.cutDown = setTimeout(this.countDown, 1000);
      },
      //倒计时函数
      countDown1() {
        let endTimeList = this.list;
        let countDownArr = [];
        // 对结束时间进行处理渲染到页面
        endTimeList.forEach((o,j)=>{
          let obj = null;
          if (o.countdownTime> 0) {
            let time = o.countdownTime;
            var hour = this.addZero(parseInt(time / (60 * 60)));
            var minute = this.addZero(parseInt(time / 60 % 60));
            var second = this.addZero(parseInt(time % 60));
            obj = {
              hour: hour,
              minute: minute,
              second: second
            }
            o.countdownTime = o.countdownTime-1;
          } else { //活动已结束，全部设置为'00'
            // this.getList()
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            }
          }
          countDownArr.push(obj);
        })
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.timeDown1 = countDownArr
        this.cutDown1 = setTimeout(this.countDown1, 1000);
      },
    } 　
  }
</script>

<style lang="scss">
page, .card-page{
  height: 100%;
  background: #f8f8f8;
}
.topBox {
  margin: 20rpx;
  padding: 0 14rpx;
  border-radius: 12rpx;
  background-color: #EE4C40;
  overflow: hidden;
  .title1 {
    color: #fff;
    text-align: center;
    font-size: 28rpx;
    font-weight: bold;
    margin: 25rpx 0;
  }
}
.presell {
  line-height: 46rpx;
  font-size: 22rpx;
}
.info {
  position: relative;
}
.buyButton {
  width: 120rpx;
  height: 38rpx;
  line-height: 38rpx;
  // background-color: #EE4C40;
  color: #fff;
  font-size: 20rpx;
  font-weight: bold;
  text-align: center;
  border-radius: 6rpx;
  position: absolute;
}
.listBox {
  border-radius: 8rpx;
  padding: 20rpx 16rpx;
  background-color: #fff;
  margin-bottom: 14rpx;
  position: relative;
  .progress {
    border: 2rpx solid #F7CA1C;
    height: 32rpx;
    margin-top: 20rpx;
    margin-bottom: 30rpx;
    position: relative;
    .percent {
      position: absolute;
      top: -2rpx;
      left: 0;
      height: 32rpx;
      background:linear-gradient(90deg,rgba(247,202,28,1),rgba(255,174,68,1));
      width: 50%;
    }
  }
  >.fr {
    width: 430rpx;
    text-align: left;
    .title2 {
      font-size: 24rpx;
      color: #999;
    }
    .buyButton {
      bottom: 30rpx;
      right: 16rpx;
    }
    .timeDown {
      font-size: 22rpx;
      color: #fff;
      line-height: 36rpx;
      font-weight: bold;
      .box {
        padding: 0 8rpx;
        text-align: center;
        background-color: #343434;
        border-radius: 4rpx;
      }
      text.fl {
        margin: 0 10rpx;
        color: #343434;
      }
      .color34 {
        margin-left: 10rpx;
      }
    }
  }
  .img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
  }
}
.listBox1 {
  background-color: #fff;
  border-radius: 20rpx;
  margin:0 20rpx 20rpx;
  padding: 30rpx;
  position: relative;
  .buyButton {
    bottom: 0;
    right: 0;
  }
  .saledImg {
    width: 120rpx;
    position: absolute;
    bottom: 10rpx;
    right: 18rpx;
  }
  .img {
    width: 220rpx;
    height: 220rpx;
    border-radius: 20rpx;
    margin-right: 30rpx;
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
    font-size: 40rpx;
    margin-right: 10rpx;
  }
  .allPrice .oldPrice {
    text-decoration: line-through;
    margin-right: 6rpx;
    font-size: 24rpx;
  }
  .allPrice {
    margin-top: 30rpx;
  }
  .goBtn {
    padding: 0;
    width: 120rpx;
    line-height: 36rpx;
    font-size: 24rpx;
    height: 44rpx;
    position: relative;
    top: 6rpx;
    color: #fff;
    border-radius: 10rpx;
  }
  .progress {
    position: relative;
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
    position: absolute;
    top: 0;
    left: 260rpx;
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
}
.mTitle {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-top: 40rpx;
  margin-bottom: 30rpx;
  image {
    width: 34rpx;
    height: 30rpx;
    vertical-align: -2rpx;
  }
  text {
    margin: 0 16rpx;
  }
}
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
    width: 560rpx;
    height: 656rpx;
  }
  .close {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    font-size: 60rpx;
    z-index: 999;
  }
}

.price-normal::before  {
  content: "¥";
  font-size: 100%;
  margin-right: 4rpx;
}
.color34 {
  color: #343434;
}
</style>