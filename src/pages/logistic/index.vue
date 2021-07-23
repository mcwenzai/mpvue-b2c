<template>
  
    <view class="contain">
      <!-- ===================================================== -->
      <view class='pages' :v-show="showexpress" bindtap='closeexpress'> 
          <!-- 头部 -->
        <view class='head' :v-if="expresslist.length>0">
          <image class='head_img' src='/static/images/send.png' mode="widthFix"></image>
          <view class='tabulate'>
          <label class='head_name'>订单编号：<text style='color:#000;font-size:30rpx;' :data-code="expresslist.orderId" @longtap="copy">{{expresslist.orderId}}</text> </label>
          <label class='head_title'>物流公司：<text style='color:#000'>{{expresslist.shipperName}}</text></label>
          <label class='head_tel_name'>快递单号: <text style='color:#000' :data-code="expresslist.logisticCode" @longtap="copy">{{expresslist.logisticCode}}</text></label>
          </view>
      </view>           
        <!-- 追踪 -->
    <view v-if='expresslist.traces.length>0'>
      <view class='logisit' v-for="(item, index) in expresslist.traces" :key="index" :data-id="index">    
        <!-- 左边子容器 -->
        <!-- 显示顶部收的圆点 -->
        <view class='dot-shou  dot_two' v-if="index!=0"></view>   
        <view class='express-middle-axis'  v-else>             
            <view class='dot-closing'  v-if='item.display==1'>></view>
            <view class='dot-closing_two' v-else></view>
            <view class='online-top-closing'></view>
        </view>
        <!-- 右边子容器 -->
        <view class='express-right'>
          <view class='express-status-address color_second'>{{item.acceptStation}}</view>
          <view class='express-statusing color_second'>{{item.acceptTime}}</view>
        </view>
      </view>
    </view>
    <view class='buttom' v-else>
      <text>暂时没有物流信息,请稍后再来~</text>
    </view> 
     
  </view>
<view class='line'></view>
    </view>

</template>

<script>
  import {
    moneyFormat
  } from '@/utils/index'
  import {
    mapState,
    mapMutations
  } from 'vuex'


  export default {
    data() {
      return {
        expresslist: [],//物流详情列表 ,
        expressstatus:'',//物流状态
        showexpress:false
      };
    },
    computed: {
      ...mapState(["isLogin", "cartCount", "userInfo"]),
    },
    onLoad(option) {     
        //this.logisticCode =  
        //this.orderId = 
        this.logistics(option.logisticCode,option.orderId);
    },
    methods: {
       copy(e){
         wx.setClipboardData({
          data: e.target.dataset.code,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                })
              }
            })
          }
        })
       },
       logistics(logisticCode,orderId){
       
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          "Authorization": this.userInfo.token
        }
        // 
        let params = {
            logisticCode:logisticCode,
            orderId:orderId
        }
        this.$fly.get('/logistics/query',params).then(resp => {
          this.expresslist = resp.data.data;
          this.expresslist.traces = this.expresslist.traces.reverse();
          console.log( this.expresslist)
        })
      },
    },
    
        //点击关闭物流信息盒子
        closeexpress(){
            this.setData({
            showexpress: false
            })
        },
    }
  

</script>

<style>
  /* 物流信息展示 */
.pages{
  background: #fff;
  overflow-x: hidden;
  position: absolute;
  /* top: 100rpx; */
  width: 100%;
  height: 100%;
}
.head{
  width: 100%;
  height: 225rpx;
  border-bottom: 20rpx solid #eee; 
  display: flex;
}
.tabulate{
  display:flex;
  flex-direction:column;
  justify-content:space-evenly;
 
}
/* 收货图片 */
.head_img{
  width: 160rpx;
  margin: auto 20rpx;
  }
/* 快递状态 */
.head_name{ 
  font-size: 26rpx;
  color: #666;
}
/* 快递编号 */
.head_title{
font-size: 26rpx;
color: #666;
}
.head_tel_name{
font-size: 26rpx;
color: #666;
}
 
/* 追踪 */
.logisit{
  width: 100%;
  margin-left: 10rpx;
  margin-top: 50rpx;
  display: flex;
  
}
.express-middle-axis {
  width: 48rpx;
  position: relative;
  top: -218rpx;
  left: -1rpx;
}
.express-status-address{
  font-size: 28rpx;
  color: #666;
}
.express-statusing{
  font-size: 22rpx;
  color: #999
}
.express-left-date {
  display: flex;
  width: 300rpx;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
 
.online-top-closing {
  width: 1rpx;
  height: 180rpx;
  background: #d7d7d7;
  position:absolute;
  top:40rpx;
  left:21rpx;
 
}
.color{
  color: #000;
  font-weight: bold;
}
.color_second{
  color: #999;
}
 
.dot-closing {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-top: 50rpx;
  /* margin-bottom:-45rpx; */
  border:1rpx  solid #d7d7d7;
  text-align:center;
  line-height:30rpx;
  font-size:30rpx;
  color:#d7d7d7;
  animation:myfirst;
  animation-fill-mode:forwards;
  position:absolute;
  top:175rpx;
  left:4rpx;
 
}
.dot-closing_two {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-top: 50rpx;
  /* margin-bottom:-45rpx; */
  border:1rpx  solid #000;
  background: #000;
  animation:myfirst;
  animation-fill-mode:forwards;
  position:absolute;
  top:175rpx;
  left:4rpx;
 
}
@keyframes myfirst
{
	to {
      font-weight: bold;
      transform: rotate(270deg);
    }
}
.dot-shou {
   width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border:1rpx  solid #000;
  background: #000;
  margin-left: 3rpx;
  margin-top: 6rpx;
}
.dot_two{
   width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border:1rpx  solid #d7d7d7;
  background: #d7d7d7;
  margin-left: 3rpx;
  margin-top: 6rpx;
}
.express-right {
  width:90%;
  height: 170rpx; 
  color: #666;  
  margin-left: 20rpx;
  margin-right: 40rpx;
  }
.line{
  height: 180rpx;
}
 
.buttom{
  width: 100%;
  height: 400rpx;
  line-height: 400rpx;
  text-align: center;
  color: #999;
}

</style>
