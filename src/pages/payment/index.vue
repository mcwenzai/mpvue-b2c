　　　　　
<template>
  <view>
    <view class="topBox" v-if="canyu">
      <view class="first">
        <text class="cuIcon-roundcheckfill"></text>{{typeCar==4?'开团成功':'参团成功'}}
      </view>
      <view class="second">
        可在个人中心-我的订单查看
      </view>
    </view>
    <view class="goodDetail cf">
      <image class="fl" :src="goodDetail.cover?goodDetail.cover:'/static/images/default.png'"></image>
      <view class="fr padding-lr-df">
        <view class="text-cut text-left">{{goodDetail.name}}</view>
        <view class="prices">
          <text class="msPrice text-red"><text class="text-price"></text> {{goodDetail.groupPrice}}</text>
          <text class="sPrice text-orange">拼团省 <text class="price-normal"></text>{{goodDetail.chajia}}</text>
        </view>
        <view class="text-showPrice">原价{{goodDetail.showPriceStr}}</view>
      </view>
    </view>
    <view class="infoBox">
      <view v-if="goodDetail.groupUserJoinList&&goodDetail.groupUserJoinList[0].requiredNumber!=goodDetail.groupUserJoinList[0].memberNumber">
        <view class="words1">还差 <text class="text-red">{{goodDetail.groupUserJoinList[0].requiredNumber-goodDetail.groupUserJoinList[0].memberNumber}}人</text> 成团</view>
        <view class="words2">距结束 <text class="text-red">{{timeDown.hour}}</text> 时 <text class="text-red">{{timeDown.minute}}</text> 分 <text class="text-red">{{timeDown.second}}</text> 秒</view>
      </view>
      <view v-else>
        <view class="words1"><text class="text-red">拼团已满</text></view>
        <view class="words2 text-grey">点击下方按钮，重新开启拼团</view>
      </view>
      <view class="peoples" v-if="goodDetail">
        <view class="inlineBlock" v-for="(item,index) in goodDetail.groupUserJoinList[0].groupRecordList" :key="index" :class="index==0?'active':''">
          <image class="headImg" :src="item.avatar?item.avatar:'/static/images/person.png'"></image>
        </view>
        <view class="inlineBlock" v-for="(item,index) in (goodDetail.groupUserJoinList[0].requiredNumber-goodDetail.groupUserJoinList[0].memberNumber)" :key="index">
          <image class="headImg" src="/static/images/head.png"></image>
        </view>
      </view>
      <view class="inviteBox cf">
        <view class="kaituan fl" @click="goUrl('groupList')" v-if="!isJoin">我要开团</view>
        <view class="invite fr" @click="addOrders(type=3,goodDetail.groupUserJoinId)" v-if="!isJoin">参与拼团</view>
        <button class="inviteMore" open-type="share" v-if="isJoin">邀请好友参团</button>
      </view>
      <view class="tips">快去邀请好友吧，团满即可拼团成功~</view>
      <view class="rules">
        <view class="title1">- 拼团规则 -</view>
        <view class="title2">1、逾期未满团则拼团失败，系统返还到账户余额</view>
        <view class="title2">2、逾期未支付系统将自动取消该订单</view>
      </view>
    </view>
    <!-- 客服按钮 -->
    <view class="cuIcon-home goHome" @click="goHome"></view>
    <!-- 多规格弹窗 -->
    <GoodsModal ref="goodsModal" @submitStock=submitStock></GoodsModal>
  </view>
</template>

<script>
  import {
		moneyFormat
  } from "@/utils/index";
  import GoodsModal from '@/components/groupModal'
  import {
		mapState,
		mapMutations
	} from "vuex";
  export default {
    components: {
      GoodsModal
    },
    data(){
      return{
        cutDown:"",
        timeDown:{
          hour: '00',
          minute: '00',
          second: '00'
        },
        orderId:'',
        status:'',
        targetId:'',
        uid:'',
        canyu:false,
        isJoin:false,
        goodDetail:"",
        goodsDetail:'',
      }
    },
    onUnload(){
      this.orderId = '';
      this.status = '';
      this.targetId = '';
      this.typeCar = '';
      this.uid = '';
    },
    onLoad(options){
      this.orderId = options.orderId || '';
      this.status = options.status || '';
      this.targetId = options.targetId || '';
      this.uid = options.uid || '';
      this.canyu = false;
      this.isJoin = false;
      if(options.typeCar==4){
        this.status = 0
      }else if(options.typeCar==3){
        this.status = 0
      }
      var pages = getCurrentPages() //获取加载的页面
      if(pages.length>=2){
        var currentPage = pages[pages.length-2] //获取当前页面的对象
        var url = currentPage.route //当前页面url
        if(url.indexOf('createOrder')!=-1){
          this.canyu = true;
        }else {
          this.canyu = false
        }
      }
      this.getList();
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '拼团详情',
      });
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.getList()
    },
    computed:{
			...mapState(["isLogin", "cartCount", "userInfo"]),
    },
    // 分享内容
    onShareAppMessage: function (share) {
      var that = this;
      return {
        title: that.goodDetail.name,
        path: '/pages/payment/main?status=1&targetId=' + that.goodDetail.groupUserJoinList[0].id + '&uid=' + + that.goodDetail.groupUserJoinList[0].userId,
        success: function (res) {
          //console.log(res)
        },
        console: function (res) {
          //console.log(res);
        }
      }
    },
    methods:{
      addOrders(index,url) {
        this.$fly.post('/group/getGroupProductDetailCapp',{groupProductId:this.goodDetail.productId,}).then(res => {
          //index 3为参加团 4自己开团 0普通直接购买
          var goods = res.data.data
          if (!this.isLogin) {
            wx.navigateTo({
              url: "/pages/prelogin/main"
            });
          } else {
            console.log(goods);
            this.$refs.goodsModal.showModal(goods,index,url)
          }
        })
        
      },
      goUrl(name){
        wx.navigateTo({ url: '/pages/'+name+'/main' });
      },
      goHome(){
        wx.switchTab({ url: '/pages/index/main' });
      },
      getList(){
        if(this.userInfo){
          this.$fly.config.headers = {
            "X-Tag": "flyio",
            "Authorization": this.userInfo.token
          };
        }
        var params = {
          'orderId':this.orderId,
          'status':this.status,
          'targetId':this.targetId,
          'uid':this.uid,
        }
        this.$fly.post('/group/getGroupJoinUserDetail',params).then(res => {
          wx.stopPullDownRefresh();
          if(res.data.success){
            this.goodDetail = res.data.data;
            this.goodDetail.chajia = (this.goodDetail.showPriceStr-this.goodDetail.groupPrice).toFixed(1)
            this.swiperList = res.data.data.bannerUrls
            this.goodDetail_name = "【￥:" + res.data.data.priceStr + "】" + res.data.data.name;
            var end = new Date(this.goodDetail.endTime);
            var now = new Date().getTime();
            if(now<end){
              this.goodDetail.status = "抢购中";
              this.goodDetail.countdownTime = end-now;
              this.goodDetail.countdownTime = parseInt(this.goodDetail.countdownTime / 1000);
              clearTimeout(this.cutDown)
              this.countDown()
            }
            this.goodDetail.groupUserJoinList[0].groupRecordList.forEach((item,index)=>{
              if(this.userInfo&&this.userInfo.id==item.userId){
                this.isJoin = true;
              }else {
                this.isJoin = false;
              }
            })
          }else {
            wx.showModal({
              title: '提示', //提示的标题,
              content: res.data.message, //提示的内容,
              showCancel: false, //是否显示取消按钮,
              confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  wx.switchTab({ url: '/pages/index/main' });
                }
              }
            });
          }
        })
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
        return year+"/;"+month+"/;"+date+" "+hour+":"+minute; 
      },
      addZero(i){
        return i < 10 ? "0" + i: i + "";
      },
      //倒计时函数
      countDown() {
        // 对结束时间进行处理渲染到页面
        if (this.goodDetail.countdownTime> 0) {
          let time = this.goodDetail.countdownTime;
          this.timeDown.hour = this.addZero(parseInt(time / (60 * 60)));
          this.timeDown.minute = this.addZero(parseInt(time / 60 % 60));
          this.timeDown.second = this.addZero(parseInt(time % 60));
          this.goodDetail.countdownTime = this.goodDetail.countdownTime-1;
        } else { //倒计时已结束，全部设置为'00'
          this.getList();
          this.timeDown={
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        this.cutDown = setTimeout(this.countDown, 1000);
      },
    } 　
  }
</script>

<style lang="scss">
page, .card-page{
  height: 100%;
  background: #fff;
  padding: 0 20rpx;
  text-align: center;
  box-sizing: border-box;
}
.topBox {
  height: 285rpx;
  overflow: hidden;
  .first {
    margin-top: 80rpx;
    font-size: 34rpx;
    color: #343434;
    line-height: 60rpx;
    margin-bottom: 40rpx;
    .cuIcon-roundcheckfill {
      font-size: 60rpx;
      color: #20D04C;
      vertical-align: -12rpx;
      margin-right: 24rpx;
    }
  }
  .second {
    font-size: 24rpx;
    color: #9A9A9A;
    text {
      color: #529CE7;
      margin-left: 10rpx;
    }
  }
}
.infoBox {
  border-radius: 12rpx;
  background-color: #fff;
  padding: 60rpx 0;
  .words1 {
    font-size: 36rpx;
    font-weight: bold;
    color: #343434;
    margin-bottom: 30rpx;
  }
  .words2 {
    color: #666;
    font-size: 26rpx;
    font-weight: bold;
  }
  .peoples {
    margin: 60rpx 0;
    .inlineBlock {
      display: inline-block;
      margin-right: 24rpx;
      position: relative;
    }
    .inlineBlock:last-child {
      margin-right: 0;
    }
    .headImg {
      width: 88rpx;
      height: 88rpx;
      border-radius: 88rpx;
    }
    .active::after {
      content: '团长';
      position: absolute;
      width: 68rpx;
      height: 28rpx;
      line-height: 28rpx;
      background: #EE4C40;
      border-radius: 14rpx;
      font-size: 20rpx;
      font-weight: bold;
      color: #fff;
      left: 50%;
      bottom: 4rpx;
      transform: translateX(-50%);
    }
  }
  .tips {
    font-size: 22rpx;
    color: #9A9A9A;
    margin-top: 20rpx;
  }
}
.inviteBox {
  width: 600rpx;
  margin: 0 auto;
  view {
    display: inline-block;
    width: 280rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
  }
  .invite {
    background: linear-gradient(-90deg, #EE4C40 0%, #FD6450 100%);
    box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(238, 76, 64, 0.6);
    color: #fff;
  }
  .kaituan {
    border: 2rpx solid #EE4C40;
    color: #EE4C40;
    border-radius: 40px;
  }
  .inviteMore {
    display: inline-block;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    background: linear-gradient(-90deg, #EE4C40 0%, #FD6450 100%);
    box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(238, 76, 64, 0.6);
    color: #fff;
  }
}
.li {
  margin-bottom: 30rpx;
  line-height: 64rpx;
  height: 64rpx;
  font-size: 28rpx;
  .head {
    width: 64rpx;
    height: 64rpx;
    vertical-align: -26rpx;
  }
  .title1 {
    color: #666666;
    margin-left: 20rpx;
    width: 320rpx;
    display: inline-block;
  }
  .title2 {
    width: 200rpx;
    image {
      width: 34rpx;
      height: 30rpx;
      vertical-align: -6rpx;
      margin-right: 6rpx;
    }
  }
}
.li:last-of-type {
  margin-bottom: 0;
}
.goodDetail {
  padding: 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  font-size: 26rpx;
  >.fl {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
  }
  >.fr {
    width: 430rpx;
    padding: 4rpx 40rpx;
    .text-cut {
      color: #343434;
      margin-bottom: 30rpx;
    }
    .prices {
      margin-bottom: 30rpx;
      text-align: left;
      .msPrice {
        font-size: 38rpx;
        font-weight: bold;
      }
      .sPrice {
        font-weight: bold;
        margin-left: 18rpx;
        font-size: 26rpx;
      }
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
}
.text-showPrice {
  color: #9a9a9a;
  font-size: 24rpx;
  text-align: left;
  text-decoration: line-through;
}
.rules {
  padding: 0 50rpx;
  .title1 {
    font-size: 30rpx;
    margin: 40rpx 0;
    color: #333;
  }
  .title2 {
    font-size: 24rpx;
    color: #666;
    line-height: 2;
  }
}
.goHome {
  position: fixed;
  bottom: 300rpx;
  right: 20rpx;
  z-index: 99;
  width: 60rpx;
  height: 60rpx;
  border-radius: 9999rpx;
  background-color: #fff;
  text-align: center;
  line-height: 60rpx;
  box-shadow: 0 0 2rpx 2rpx rgba(0,0,0,0.2);
  font-size: 40rpx;
}
</style>