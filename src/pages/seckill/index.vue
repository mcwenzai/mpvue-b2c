　　　　　
<template>
  <view class="card-page">
    <!-- 导航栏目 -->
    <view class="cu-card no-card navChange card_cateBox card_cateBoxbox">
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
          v-for="(item, index) in list1"
          :key="index"
          :id="'v'+index"
          @tap="tabSelect(index)"
          :data-id="index"
          :class="[index == TabCur ? 'active' : '']"
        >
          <view class="tabs-item text-df">
            <view class="position">
              <view class="title1">{{item.times}}</view>
              <view class="title2">{{item.status}}</view>
            </view>
          </view>
        </view>
        <!-- </view> -->
      </scroll-view>
    </view>
    <swiper @change="changeSwiper" :current="TabCur" style="height:calc(100vh - 110rpx)">
        <block v-for="(itemList,indexList) in list1" :key="indexList">
            <swiper-item >
              <block v-for="(item,index) in itemList.list" :key="index">
                <view class="clearfix listBox flex" @click="(goDetail(item))" :class="item.status=='已结束'?'text-grey':item.status=='即将开抢'?'text-green':''">
                  <image :src="item.productImgUrl?item.productImgUrl:'/static/images/default.png'" class="img"></image>
                  <view class="flex-sub">
                    <view class="nowrap">{{item.flashSaleTitle}}</view>
                    <view class="info">
                      <view class="progress">
                        <view class="progress-box">
                          <progress :percent="item.status=='即将开抢'?100:item.percent" :color="item.status=='已结束'?'#A8A8A8':item.status=='即将开抢'?'var(--green)':'#E54148'" :backgroundColor="item.status=='已结束'?'#F7F7F7':'#FFE5E8'"  border-radius="16" stroke-width="16" />
                        </view>
                        <view class="rush" v-if="item.status=='即将开抢'">库存100%</view>
                        <view class="rush" v-else>已抢{{item.percent}}%</view>
                        <text class="surplus fr text-green" v-if="item.status=='即将开抢'">库存{{item.flashSaleFullStockNum}}件</text>
                        <text class="surplus fr text-grey" v-else>剩余{{item.flashSaleStockNum}}件</text>
                      </view>
                      <text class="round countDown" v-if="item.status!='已结束'" :class="item.status=='即将开抢'?'text-green line-green':'text-red line-red'">
                        倒计时 {{timeDown[indexList].list[index].hour}} : {{timeDown[indexList].list[index].minute}} : {{timeDown[indexList].list[index].second}}
                      </text>
                      <view class="allPrice clearfix">
                        <text class="text-price secPrice" :class="item.status=='已结束'?'text-grey':'text-red'">{{item.discountMinPrice}}</text>
                        <text class="text-grey text-price oldPrice">{{item.originalPrice}}</text>
                        <button class="goBtn fr cu-btn bg-green" v-if="item.status=='即将开抢'">即将开始</button>
                        <button class="goBtn fr cu-btn bg-red" v-if="item.status=='抢购中'">{{item.flashSaleStockNum==0?'抢光了':'马上抢'}}</button>
                        <image src="/static/images/saled.png" class="saledImg" mode="widthFix" v-if="item.status=='已结束'"></image>
                      </view>
                    </view>
                  </view>
                </view>
              </block>
            </swiper-item>
        </block>
    </swiper>
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
				TabCur: 0,
        nav: [
					{
						name: '活动预告',
          },
          {
						name: '正在进行',
					},
          {
						name: '往期回顾',
					}
        ],
        timeDown:[],
        cutDown:"",
        status:"即将开抢",
        timeOut:0,
        activeIndex:"",
        scrollLeft:"",
        list:[],
        list1:[]
      }
    },
    onLoad(options){
      this.TabCur = 0;
      this.getList()
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '限时秒杀',
      });
      let scrollInfo = {
        prevDistance: 0,
        screenHalfwidth: wx.getSystemInfoSync().windowWidth / 2,
      };
      this.scrollInfo = scrollInfo;
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.TabCur = 0;
      this.getList();
    },
    computed:{
			...mapState(["isLogin", "cartCount", "userInfo"]),
		},
    methods:{
      tabSelect(index) {
        this.TabCur = index;
        this.getRect(index);
      },
      changeSwiper(e){
        this.TabCur = e.target.current;
        this.getRect(e.target.current);
      },
      getList(){
        this.$fly.config.headers = {
          "X-Tag": "flyio"
        };
        this.list1 = []
        this.$fly.post('/flashsale/query/V2',{'offset':0,'limit':20}).then(res => {
          if(res.data.success){
            wx.stopPullDownRefresh();
            res.data.data.forEach((item,index)=>{
              item.percent = ((item.flashSaleStockSoldNum/item.flashSaleFullStockNum) * 100).toFixed(0);
              item.countdownTime = Math.ceil(item.countdownTime / 1000)
              if(new Date()<item.startTime) {
                item.status = "即将开抢"
              }else if(new Date()>item.endTime){
                item.status = "已结束"
              }else if(new Date()>item.startTime && new Date()<item.endTime){
                item.status = "抢购中"
              }
              if(item.status!="已结束"){
                var array = {"date":"",list:[],times:'',status:''}
                if(this.list1.length!=0){
                  var flag = false;
                  var index = "";
                  this.list1.forEach((item1,index1)=>{
                    if(item1.date==this.getDate(new Date(item.startTime))){
                      flag = true
                      index = index1
                    }else{
                      flag = false
                    }
                  })
                  if(flag){
                    this.list1[index].list.push(item);
                  }else{
                    this.list1.push(array);
                    this.list1[this.list1.length-1].date = this.getDate(new Date(item.startTime));
                    // if(new Date().getDate()==new Date(item.startTime).getDate()){
                    //   this.list1[this.list1.length-1].times = this.list1[this.list1.length-1].date.substr(11,5);
                    // }else {
                    //   this.list1[this.list1.length-1].times = this.list1[this.list1.length-1].date.substr(5,11);
                    // }
                    this.list1[this.list1.length-1].times = this.list1[this.list1.length-1].date.substr(5,11);
                    this.list1[this.list1.length-1].status = item.status;
                    this.list1[this.list1.length-1].list.push(item);
                  }
                }else{
                  this.list1.push(array);
                  this.list1[0].date = this.getDate(new Date(item.startTime));
                  if(new Date().getDate()==new Date(item.startTime).getDate()){
                    this.list1[0].times = this.list1[0].date.substr(11,5);
                  }else {
                    this.list1[0].times = this.list1[0].date.substr(5,11);
                  }
                  this.list1[0].status = item.status;
                  this.list1[0].list.push(item);
                }
              }
            })
            this.list = res.data.data;
            clearTimeout(this.cutDown)
            this.countDown()
          }
        })
      },
      goDetail(item){
        wx.navigateTo({
          url: '/pages/seckillDetail/main?productAliasId=' + item.productAliasId + '&flashSaleProductId=' + item.id + '&merchantId=' + item.merchantId,
        })
        // if(item.status == "抢购中"){
        //   wx.navigateTo({
        //     url: '/pages/seckillDetail/main?productAliasId=' + item.productAliasId + '&flashSaleProductId=' + item.id + '&merchantId=' + item.merchantId,
        //   })
        // }else {
        //   wx.showToast({
        //     title: '秒杀活动' + item.status,
        //     icon: "none"
        //   })
        // }
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
      //倒计时函数
      countDown() {
        let endTimeList = this.list1;
        let countDownArr = [];
        // 对结束时间进行处理渲染到页面
        endTimeList.forEach((item,index) => {
          var array = {list:[]}
          countDownArr.push(array);
          item.list.forEach((o,j)=>{
            let obj = null;
            if(o.status!="已结束"){
              // 如果活动未结束，对时间进行处理
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
            }
            countDownArr[index].list.push(obj);
            })
        })
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.timeDown = countDownArr
        this.cutDown = setTimeout(this.countDown, 1000);
      },
    } 　
  }
</script>

<style>
  page, .card-page{
    height: 100%;
    background: #fff;
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
  .mainBox {
    background-color: #F8F8F8;
    padding: 0 20rpx;
  }
  .listBox {
    background-color: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    position: relative;
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
    margin-top: 10rpx;
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
    top: -30rpx;
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
  swiper-item{
    overflow: scroll;
  }
</style>