<template>
  <view class="detail">
    <swiper class="screen-swiper" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
      duration="500">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <image :src="item?item:'/static/images/default.png'" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <view class="cf titleBox">
      <view class="fl">
        <view>
          {{goodDetail.needNumber}}人团：<text class="text-price"></text><text class="realPrice">{{goodDetail.groupPrice}}</text>
          <text class="text-price oldPrice"></text><text class="oldPrice">{{goodDetail.priceStr}}</text>
        </view>
        <text class="limit">再售{{goodDetail.storeNumber}}件恢复￥{{goodDetail.priceStr}}</text>
      </view>
      <view class="fr">
        <view class="text-center remain">距离结束仅剩</view>
        <text class="round countDown">
          {{timeDown.hour}} : {{timeDown.minute}} : {{timeDown.second}}
        </text>
      </view>
    </view>
    <view class="solid-bottom padding-sm bg-white">
      <!--<text class="text-gray text-sm">{{goodDetail.desc}}</text>-->
      <view class="flex justify-between">
        <view class="text-bold text-lg text-black descp">
          {{goodDetail.name}}
        </view>
        <!-- <button open-type="share" class="cu-btn cu-avatar bg-red round share">
          <view class="cuIcon-share"></view>
        </button> -->
      </view>
      <view class="tips" v-if="goodDetail.buyLimitNum!=0"><text class="cuIcon-info text-red"></text> 每人限购 <text class="text-red">{{goodDetail.buyLimitNum}}</text> 件</view>
    </view>
    <!-- 玩法介绍 -->
    <view class="bg-white margin-top jieshao" v-if="goodDetail.groupUserJoinList">
      <view class="mainTitle">
        已有<text class="text-red">{{goodDetail.groupUserJoinList.length}}</text>人开团，可直接参与
        <view class="viewAll" @click="showViewAll">查看全部 <text class="cuIcon-right"></text></view>
      </view>
      <swiper class="allGroup" circular="true" vertical="true" :display-multiple-items="goodDetail.groupUserJoinList.length>=2?'2':'1'"
        autoplay="true" interval="4000" duration="500">
        <swiper-item v-for="(item,index) in goodDetail.groupUserJoinList" :key="index">
          <view class="swiper-item cf margin-top">
            <image :src="item.avatar?item.avatar:'/static/images/default.png'" class="head round fl"></image>
            <text class="userName fl">{{item.nickname}}</text>
            <view class="groupInfo fl">
              <view class="title1">差 <text class="text-red">{{item.requiredNumber-item.memberNumber}}</text> 人可成团</view>
              <view class="title2">
                剩余{{timeDown1[index].hour}} : {{timeDown1[index].minute}} : {{timeDown1[index].second}}
              </view>
            </view>
            <view class="getGroup fl" @click="addOrders(goodDetail,type=3,item.id)">去参团</view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 参数 规格 服务等信息 -->
    <view class="bg-white margin-top">
      <view class="sevBox cf" @click="showInfoModal(goodDetail.guarantees,'保障服务','基础服务')">
        <view class="fl text-grey sevName">
          保障
        </view>
        <view class="fl sevInfo text-black" v-for="(item,index) in goodDetail.guarantees" :key="index">
          {{item.title}}
        </view>
        <text class="cuIcon-right lg text-gray fr"></text>
      </view>
      <view class="sevBox cf" @click="showInfoModal(goodDetail.logisticsServices,'配送服务','配送规则')">
        <view class="fl text-grey sevName">
          配送
        </view>
        <view class="fl sevInfo text-black" v-for="(item,index) in goodDetail.logisticsServices" :key="index">
          {{item.title}}
        </view>
        <text class="cuIcon-right lg text-gray fr"></text>
      </view>
    </view>
    <view
      class="sevInfoBox"
      :class="infoModalName == 'infoModal' ? 'show' : ''"
      @click="infohideModal"
    >
      <view class="infoModal bg-white">
        <view class="infoTitle1 text-center">{{title1}}</view>
        <view class="infoTitle2 text-grey">
          {{title2}}
        </view>
        <view class="sevList" v-for="(item,index) in sevInfoList" :key="index">
          <text class="cuIcon-roundcheck lg text-gray sevIcon"></text>
          <view class="text-black">{{item.title}}</view>
          <view class="text-grey">{{item.desc}}</view>
        </view>
      </view>
    </view>
    <!-- 这是处理商品详情和规格参数 -->
    <scroll-view scroll-x class="bg-white nav margin-top solid-bottom">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in nav"
          :key="index" @tap="tabSelect(index)" :data-id="index">
          {{item.name}}
        </view>
      </view>
    </scroll-view>
    <!-- 这是处理商品详情和规格参数 -->
    <view class="cu-card no-card bg-white view_box" v-if="TabCur==0">
      <wxParse :content="goodDetail.desc"></wxParse>
    </view>

    <view class="cu-card no-card padding bg-white" v-else>
      {{goodDetail.parameter}}规格参数
    </view>
    <!-- 这是处理商品详情和规格参数 -->
    <view class="cu-bar bg-white tabbar border shop">
      <!--<view class="action" :class="goodDetail.collect ? 'text-orange' : ''" @click="like(goodDetail.collect)">
				<view class="cuIcon-favorfill"></view> {{goodDetail.collect ? '已收藏' : '收藏'}}
			</view>-->
      <view class="action" @click="goTab('index')">
        <view class="cuIcon-home">
        </view>
        主页
      </view>
      <view class="bg-orange submit round" @click="addOrders(goodDetail,type=0)" data-target="ChooseModal">￥{{goodDetail.priceStr}} 直接购买</view>
      <view class="bg-red submit round" @click="addOrders(goodDetail,type=4)" data-target="ChooseModal">￥{{goodDetail.groupPrice}} 我来开团</view>
    </view>
    <!-- 多规格弹窗 -->
    <GoodsModal ref="goodsModal" @submitStock=submitStock></GoodsModal>
    <!-- 查看全部弹窗 -->
    <view class="popUp" v-if="viewAll">
      <view class="position">
        <text class="close cuIcon-close lg text-grey" @click="close"></text>
        <view class="mainBox">
          <view class="title1 text-center">正在进行</view>
          <view class="itemList cf" v-for="(item,index) in goodDetail.groupUserJoinList" :key="index">
            <view class="fl">
              <image :src="item.avatar?item.avatar:'/static/images/default.png'" class="round fl"></image>
              <view class="fl">
                <view><text class="userName text-cut">{{item.nickname}}</text> <text>还差{{item.requiredNumber-item.memberNumber}}人</text></view>
                <view>剩余{{timeDown1[index].hour}} : {{timeDown1[index].minute}} : {{timeDown1[index].second}}</view>
              </view>
            </view>
            <view class="fr goGroup" @click="addOrders(goodDetail,type=3,item.id)">去参团</view>
          </view>
        </view>
      </view>
    </view>
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
  import GoodsModal from '@/components/groupModal'
  import wxParse from 'mpvue-wxparse'
  export default {
    components: {
      GoodsModal,
      wxParse
    },
    data() {
      return {
        // goodDetail这是请求到的当前商品详细信息
        goodDetail: {},
        swiperList: [],
        avatar: [],
        cutDown:"",
        TabCur: 0,
        scrollLeft: 0,
        viewAll: false,
        infoModalName: "",
        sevInfoList:[],
        title1:'',
        title2:'',
        nav: [{
          id: 1,
          name: '商品详情',
        }, ],
        timeDown:{
          hour: '00',
          minute: '00',
          second: '00'
        },
        timeDown1:[],
        groupProductId:"",
        goodDetail_name: '',
        priceStr: '',
       merchantId:0,
       id:0,
      };
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo'
      ]),
    },
    onLoad(options) {
        this.groupProductId=options.groupProductId||'133';
        this.goodDetail = {};
        this.swiperList = [];
        this.getGoodsDetail()
    },
    onUnload(){
      clearTimeout(this.cutDown)
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.getGoodsDetail();
    },
    onShow(){
    },
    methods: {
      addZero(i){
        return i < 10 ? "0" + i: i + "";
      },
      close(){
        this.viewAll = false
      },
      showViewAll(){
        this.viewAll = true
      },
      //隐藏服务规则
      infohideModal(){
        this.infoModalName = "";
      },
      //显示服务模态框
      showInfoModal(item,title1,title2){
        this.infoModalName = "infoModal";
        this.sevInfoList = item;
        this.title1 = title1;
        this.title2 = title2;
      },
      //已开团倒计时函数
      countDown1() {
        let endTimeList = this.goodDetail.groupUserJoinList;
        let countDownArr = [];
        // 对结束时间进行处理渲染到页面
        endTimeList.forEach((o,j)=>{
          let obj = null;
          var end = new Date(o.endTime);
          var now = new Date().getTime();
          o.countdownTime = end-now;
          o.countdownTime = parseInt(o.countdownTime / 1000);
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
          this.getGoodsDetail();
          this.timeDown={
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        this.cutDown = setTimeout(this.countDown, 1000);
      },
      addGoods(goods, index) {
        if(this.isLogin){
          if (2 > 1) {
            this.$fly.get('/products/' + goods.aliasId + '?merchantId=' + goods.merchantId).then(res => {
              this.$refs.goodsModal.showModal(res.data.data)
            })
          } else {
            this.submitStock(goods, 0, 1)
          }
        }
      },
      addOrders(goods, index,url) {
        //index 3为参加团 4自己开团 0普通直接购买
        if (!this.isLogin) {
          wx.navigateTo({
            url: "/pages/prelogin/main"
          });
        } else {
          if(index==4){
            if(new Date()<goods.startTime) {
              wx.showToast({
                title: '团购即将开始~', //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return;
            }else if(new Date()>goods.endTime){
              wx.showToast({
                title: '团购已经结束~', //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return;
            }
          }
          this.$refs.goodsModal.showModal(goods,index,url)
        }
      },
      getGoodsDetail() {
        // 
        // this.$fly.config.headers = {
        //   Authorization: this.userInfo.token
        // };
        this.$fly.post('/group/getGroupProductDetailCapp',{groupProductId:this.groupProductId,}).then(res => {
          // res.data.data.attrs[0].attrValues = res.data.data.productSkus[0].skuAttrs
          wx.stopPullDownRefresh();
          this.goodDetail = res.data.data
          this.swiperList = res.data.data.bannerUrls
          this.goodDetail_name = "【￥:" + res.data.data.priceStr + "】" + res.data.data.name;
          var end = new Date(this.goodDetail.endTime);
          var now = new Date().getTime();
          if(now<end){
            this.goodDetail.status = "抢购中";
            this.goodDetail.countdownTime = end-now;
            this.goodDetail.countdownTime = parseInt(this.goodDetail.countdownTime / 1000);
            clearTimeout(this.cutDown)
            clearTimeout(this.cutDown1)
            this.countDown()
            if(this.goodDetail.groupUserJoinList){
              this.countDown1()
            }
          }
        })
      },
      goRouter(url) {
        wx.navigateTo({
          url: `/pages/${url}/main`
        })
      },
      goTab(url) {
        wx.switchTab({
          url: `/pages/${url}/main`
        })
      },
      tabSelect(index) {
        this.TabCur = index;
        this.desc = this.nav[index].desc
      },
      like(active) {
        if (!this.isLogin) {
          return false
        }

        // acitve falss 没收藏
        let params = {
          goods_id: this.goodDetail.id,
          user_id: this.userInfo.openid,
          active: active
        }
        this.$fly.post('/goods/likeGoods', params).then(res => {
          this.goodDetail.collect = !this.goodDetail.collect
          let text = ''
          this.goodDetail.collect ? text = '商品收藏成功！' : text = '已取消收藏'
          wx.showToast({
            title: text,
            icon: 'none',
            duration: 2000
          });
        })

      },
      // 这是商品详情的图片操作
      Good_preview(src, e) {
        // do something
        //console.log(src, e);
      },
      Good_navigate(href, e) {
        // do something
        //console.log(href, e);

      }
    },
    // 分享内容
    onShareAppMessage: function (share) {
      return {
        title: this.goodDetail_name,
        path: url,
        success: function (res) {
          //console.log(res)
        },
        console: function (res) {
          //console.log(res);
        }
      }
    },
  }
</script>

<style lang='scss'>
  @import url("~mpvue-wxparse/src/wxParse.css");

  .detail {
    padding-bottom: 60px;
  }

  .screen-swiper {
    min-height: 260px;
  }
  .tips {
    line-height: 48rpx;
    font-size: 22rpx;
    color: #333;
    padding: 0 8rpx;
    height: 48rpx;
    background: #FFEEED;
    margin-top: 15rpx;
    .cuIcon-info {
      font-size: 26rpx;
      margin: 0 6rpx;
    }
  }
  .tabbar {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .show {
    display: block!important;
  }
  .cu-bar.tabbar .submit {
    height: 72rpx;
    margin: 14rpx 16rpx;
  }
  .bg-yellow.light {
    color: #a5673f;
    background-color: #f8e470;
  }

  /* .goodDetail_text {
    width:100%;
	height: 500rpx;
  } */

  .view_box {
    width: 100%;
    height: auto;
  }

  .html_d {
    width: 100%;
    height: 100%;
  }
  .allGroup {
    height: 220rpx;
    .swiper-item {
      font-size: 24rpx;
      padding: 0 16rpx;
      .head {
        width: 80rpx;
        height: 80rpx;
      }
      .userName {
        display: inline-block;
        width: 230rpx;
        color: #666;
        line-height: 80rpx;
        margin-left: 30rpx;
      }
      .groupInfo {
        width: 210rpx;
        text-align: center;
        height: 80rpx;
        padding: 10rpx 0;
        .title1 {
          color: #333;
        }
        .title2 {
          font-size: 22rpx;
          color: #999;
        }
      }
      .getGroup {
        width: 120rpx;
        height: 48rpx;
        line-height: 48rpx;
        background: linear-gradient(-90deg, #EE4C40 0%, #FD644F 100%);
        border-radius: 8rpx;
        text-align: center;
        margin-top: 16rpx;
        color: #fff;
      }
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
  .mainBox {
    width: 634rpx;
    border-radius: 20rpx;
    background-color: #fff;
    padding-bottom: 20rpx;
    height: 440rpx;
    overflow: scroll;
    .title1 {
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;
      padding: 34rpx 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .itemList {
      height: 110rpx;
      border-bottom: 1px solid #f5f5f5;
      padding: 20rpx 34rpx;
      position: relative;
      >.fl {
        width: 400rpx;
        font-size: 22rpx;
        color: #666;
        text {
          display: inline-block;
        }
        .userName {
          color: #333;
          margin-right: 10rpx;
          max-width: 80rpx;
          margin-top: 2rpx;
          vertical-align: -4rpx;
        }
      }
      image {
        width: 70rpx;
        height: 70rpx;
        margin-right: 20rpx;
      }
      .goGroup {
        width: 144rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 24rpx;
        color: #fff;
        text-align: center;
        background: linear-gradient(90deg, #F65150, #F81943);
        box-shadow: 2rpx 3rpx 7rpx 0px rgba(211, 0, 17, 0.42);
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .position{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .close {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    font-size: 42rpx;
    z-index: 999;
  }
}
  .mainTitle {
    line-height: 34rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
    padding-left: 17rpx;
    position: relative;
    margin-bottom: 30rpx;
    .viewAll {
      font-size: 24rpx;
      color: #9A9A9A;
      float: right;
      font-weight: normal;
    }
  }
  .mainTitle::before {
    content: "";
    width: 6rpx;
    height: 34rpx;
    background: #EE4C40;
    border-radius: 6rpx;
    position: absolute;
    left: 0;
    top: 0;
  }
  .jieshao {
    padding: 30rpx 20rpx;
    .steps {
      .step {
        width: 176rpx;
        padding-left: 14rpx;
        font-size: 24rpx;
        font-weight: bold;
        color: #333;
        line-height: 24rpx;
        .circle {
          color: #fff;
          font-size: 18rpx;
          width: 24rpx;
          height: 24rpx;
          border-radius: 24rpx;
          background-color: #CBCBCB;
          text-align: center;
          display: inline-block;
          margin-right: 6rpx;
          vertical-align: 2rpx;
        }
        .cuIcon-right {
          color: #CBCBCB;
        }
      }
    }
  }
  .titleBox {
    background-color: #E54148;
    color: #fff;
    font-size: 26rpx;
    height: 108rpx;
    .limit {
      background: #FFFFFF;
      border-radius: 4rpx;
      height: 30rpx;
      font-size: 20rpx;
      display: inline-block;
      color: #EE4C40;
      text-align: center;
      margin-left: 2rpx;
      margin-top: 6rpx;
      padding: 0 16rpx;
    }
    >.fl {
      width: 508rpx;
      padding: 14rpx;
    }
    >.fr {
      width: 242rpx;
      padding: 20rpx;
      background-color: #FFAD43;
      height: 100%;
      box-sizing: border-box;
      /* clip-path: polygon(20rpx 0, 100% 0, 100% 100%, 20rpx 100%, 0 54rpx) */
    }
    .text-price::before {
      font-size: 26rpx;
    }
  }
  .oldPrice {
    text-decoration: line-through;
    font-size: 24rpx;
  }
  .realPrice {
    font-size: 38rpx;
    margin-right: 6rpx;
  }
  .countDown {
    display: block;
    line-height: 16rpx;
    height: 36rpx;
    text-align: center;
    width: 200rpx;
    margin: 0 auto;
    color: #fff;
    font-size: 28rpx;
  }
  .remain {
    color: #fff;
    font-size: 20rpx;
  }
  .share {
    width: 60rpx;
    height: 60rpx;
  }
  .sevBox {
    line-height: 82rpx;
    font-size: 26rpx;
    padding: 0 22rpx;
  }
  .sevName {
    display: inline-block;
    padding-right: 22rpx;
  }
  .sevInfo {
    display: inline-block;
    margin-right: 16rpx;
  }
  .sevInfoBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.2);
    z-index: 999;
    display: none;
  }
  .infoModal {
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 22rpx;
    height: 700rpx;
    z-index: 9;
  }
  .infoTitle1 {
    font-size: 32rpx;
    padding: 48rpx 0;
  }
  .infoTitle2 {
    font-size: 32rpx;
    margin-bottom: 48rpx;
  }
  .sevList {
    padding-left: 68rpx;
    position: relative;
  }
  .sevList view {
    margin-bottom: 30rpx;
    font-size: 26rpx;
  }
  .sevIcon {
    position: absolute;
    left: 20rpx;
    top: 4rpx;
    color: var(--red);
  }
</style>
