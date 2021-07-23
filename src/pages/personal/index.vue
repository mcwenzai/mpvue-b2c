<template>
  <view class="pages">
    <view class="cu-list menu-avatar bg-red" v-if="isLogin">
      <view class="cf">
        <view class="fl">
          <view class="cu-avatar round">
            <image :src="userInfo.avatar?userInfo.avatar:'/static/images/person.png'" v-if="userInfo.avatar" mode="widthFix"></image>
            <open-data type="userAvatarUrl" v-else></open-data>
          </view>
        </view>
        <view class="fl">
          <view class="text-black userName">
            <text>{{userInfo.nickname}}</text>
          </view>
          <view>
            <div class='round tagBox'>
              {{userLeveName}}
            </div>
          </view>
        </view>
      </view>
      <view class="buyInfo position">
        <view class="margin-bottom-sm">
          <text class="text-red text-df">购物卡：</text>
          <text class="text-red text-lg text-price"></text>
          <text class="text-red text-lg"> {{balanceList.money}}</text>
        </view>
        <view>
          <text class="title1">社员中心 |</text>
          <text class="title2">会员立享优惠</text>
        </view>
        <view class="rechargeBtn text-white" @click="goRouter('memberCenter')">立即充值</view>
      </view>
    </view>
    <view class="buyCard bg-white">
      <view class="flex text-center">
        <view class="flex-sub" @click="goUrl('会员介绍')">
          <image src="/static/images/huiyuan.png"></image>
          <view class="title1">会员介绍</view>
          <view class="title2">购物有奖</view>
        </view>
        <view class="flex-sub" @click="goUrl('社员介绍')">
          <image src="/static/images/sheyuan.png"></image>
          <view class="title1">社员介绍</view>
          <view class="title2">天天秒杀</view>
        </view>
        <view class="flex-sub" @click="goUrl('店长注册')">
          <image src="/static/images/dianpu.png"></image>
          <view class="title1">店长介绍</view>
          <view class="title2">分享返现</view>
        </view>
      </view>
    </view>

    <view class="cu-list menu card-menu">
      <view class="cu-item arrow" @click="goRouter('dd',-1)">
        <view class="content">
          <text class="text-black">我的订单</text>
        </view>
        <view class="text-gray text-sm">查看全部订单</view>
      </view>
      <view class="cu-list grid col-5 no-border myOrder">
        <view class="cu-item" v-for="(item,index) in cuIconList" :key="index" @click="goRouter('dd',index)">
          <view :class="['iconfont',item.cuIcon,'text-' + item.color]">
            <view class="cu-tag badge" v-if="item.badge!=0">
              <block v-if="item.badge!=0">{{item.badge>99?'99+':item.badge}}</block>
            </view>
          </view>
          <text>{{item.name}}</text>
        </view>
      </view>
    </view>

    <view class="cu-list menu card-menu">
      <view class="cu-item">
        <view class="content">
          <text class="text-black">社员中心</text>
        </view>
        <!-- <view class="text-gray text-sm">查看全部订单</view> -->
      </view>
      <view class="cu-list grid col-2 no-border">
        <view class="cu-item"  @click="goRouter('memberCenter')">
          <view class="text-black">
            购物卡
          </view>
          <text>{{balanceList.money?balanceList.money:'0.00'}}</text>
        </view>
        <view class="cu-item">
          <view class="text-black">
            积分
          </view>
          <text>{{balanceList.point?balanceList.point:'0'}}</text>
        </view>
      </view>
    </view>
    <view class="cu-list menu card-menu">
      <view class="cu-item">
        <view class="content">
          <text class="text-black">服务工具</text>
        </view>
        <!-- <view class="text-gray text-sm">查看全部订单</view> -->
      </view>
      <view class="cu-list grid col-4 no-border myOrder">
        <view class="cu-item" @click="goRouter('myVouchers')">
          <view class="iconfont icon-youhuiquan1 text-black"></view>
          <text>优惠券</text>
        </view>
        <view class="cu-item">
          <view class="iconfont icon-youhuiquan text-black"></view>
          <text>兑换优惠券</text>
        </view>
        <view class="cu-item" @click="goRouter('invited')">
          <view class="iconfont icon-yaoqing text-black"></view>
          <text>我的邀请</text>
        </view>
        <view class="cu-item" @click="goRouter('footprint')">
          <view class="iconfont icon-zuji text-black"></view>
          <text>足迹</text>
        </view>
        <view class="cu-item" @click="goRouter('addresslist')">
          <view class="iconfont icon-weibiaoti2fuzhi08 text-black"></view>
          <text>收货地址</text>
        </view>
        <view class="cu-item" @click="goRouter('myCollection')">
          <view class="iconfont icon-wodeshoucang text-black"></view>
          <text>我的收藏</text>
        </view>
        <view class="cu-item" @click="goRouter('myEvaluate')">
          <view class="iconfont icon-pingjia-01 text-black"></view>
          <text>我的评价</text>
        </view>
        <button class="cu-item" open-type="contact">
          <view class="iconfont icon-kefu text-black"></view>
          <text>客服中心</text>
        </button>
      </view>
    </view>
    <view class="cu-list menu card-menu">
      <!-- <view class="cu-item arrow" @click="goRouter('addresslist')">
        <view class="content">
          <text class="cuIcon-circlefill text-grey"></text>
          <text class="text-grey">地址管理</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="goRouter('addresslist')">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">收藏商品
						<text v-if="userInfo.likeCount">
							（{{userInfo.likeCount}}）
						</text>
					</text>
				</view>
			</view>
      <view class="cu-item arrow">
        <button class="cu-btn content" open-type="contact">
          <text class="cuIcon-service text-olive"></text>
          <text class="text-grey">联系客服</text>
        </button>
      </view>
      <view class="cu-item arrow">
        <navigator class="content" hover-class="none" @click="goRouter('xx')">
          <text class="cuIcon-discoverfill text-orange"></text>
          <text class="text-grey">关于我们</text>
        </navigator>
      </view> -->

      <button @click='loginoutClick()' class="confirm-btn bg-red" v-if="isLogin">退出登录</button>

      <!--<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-emojiflashfill text-pink"></text>
					<text class="text-grey">联系客服</text>
				</view>
			</view>-->
    </view>
  </view>
</template>

<script>
  import card from '@/components/card'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'userInfo',
        'isLogin'
      ]),
    },
    data() {
      return {
        userLeveName: '',
        orderList: {},
        balanceList:'',
        cuIconList: [{
          cuIcon: 'icon-daifukuan',
          color: 'red',
          badge: 0,
          name: '待付款'
        }, {
          cuIcon: 'icon-daifahuo',
          color: 'red',
          badge: 0,
          name: '待分享'
        }, {
          cuIcon: 'icon-daishouhuo',
          color: 'red',
          badge: 0,
          name: '待收货'
        }, {
          cuIcon: 'icon-evaluate',
          color: 'red',
          badge: 0,
          name: '待评价'
        }, {
          cuIcon: 'icon-tuihuotuikuan',
          color: 'red',
          badge: 0,
          name: '退换货'
        }, ],

      }
    },

    components: {
      card
    },
    onLoad() {
      // if (this.isLogin) {
      //   this.getUserInfo()
      //   this.getOrderNumbers()
      // }
    },
    onShow() {
      if (this.isLogin) {
        this.getUserInfo()
        this.getOrderNumbers()
      }else{
        wx.navigateTo({
          url: `/pages/prelogin/main`
        })
      }
    },
    onPullDownRefresh() {
      // 下拉刷新
      if (this.isLogin) {
        this.getUserInfo()
        this.getOrderNumbers()
      }
      wx.stopPullDownRefresh()
    },
    methods: {
      ...mapMutations(["update"]),
      loginoutClick() {
        this.update({
          isLogin: false
        });
        this.update({
          userInfo: null
        });
        this.update({
          cartList: {}
        });
        this.update({
          orderGoods: {}
        });    
        this.cuIconList = [{
            cuIcon: 'icon-daifukuan',
            color: 'red',
            badge: 0,
            name: '待付款'
          }, {
            cuIcon: 'icon-daifahuo',
            color: 'red',
            badge: 0,
            name: '待分享'
          }, {
            cuIcon: 'icon-daishouhuo',
            color: 'red',
            badge: 0,
            name: '待收货'
          }, {
            cuIcon: 'icon-evaluate',
            color: 'red',
            badge: 0,
            name: '待评价'
          }, {
            cuIcon: 'icon-tuihuotuikuan',
            color: 'red',
            badge: 0,
            name: '退换货'
          }]
        wx.navigateTo({
          url: `/pages/prelogin/main`
        })
      },
      goUrl(name){
        wx.navigateTo({
          url: '/pages/introduce/main?name=' + name,
        })
      },
      goRouter(url, index) {
        if (url == 'xx') {
          wx.navigateTo({
            url: '/pages/content/main?url=' + encodeURIComponent(JSON.stringify(
              "https://mp.weixin.qq.com/s?__biz=MzI5NzI5NzMwMw==&mid=100000231&idx=2&sn=f2d1b4edd674f07cc85ec89de11875f5&chksm=6cb6751f5bc1fc0961721eff49823f39ecbd419b69fbaffb57ba6def3dd67480b953865e171f#rd"
              ))
          })
        } else if (url == 'dd') {
          wx.navigateTo({
            url: `/pages/orderlist/main?index=` + (index + 1)
          })
        } else {
          wx.navigateTo({
            url: `/pages/${url}/main`
          })
        }

      },
      getOrderNumbers() {
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token,
        };
        this.$fly.get('/orders/number').then(res => {
          this.cuIconList.forEach(element => {
            if (element.name == "待付款") {
              element.badge = res.data.data.unPaidNumber
            } else if (element.name == "待分享") {
              element.badge = res.data.data.unShareNumber
            } else if (element.name == "待收货") {
              element.badge = res.data.data.unSendNumber
            } else if (element.name == "待评价") {
              element.badge = res.data.data.unEvaluateNumber
            } else if (element.name == "退换货") {
              element.badge = res.data.data.refundingNumber
            }
          });
        })
      },
      getUserInfo() {
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          "Authorization": this.userInfo.token
        }
        this.$fly.get('/users/' + this.userInfo.id).then(res => {
          if (res.data.data.level == 1) {
            this.userLeveName = '社员卡社员'
          } else if (res.data.data.level == 2) {
            this.userLeveName = '金卡社员'
          } else if (res.data.data.level == 3) {
            this.userLeveName = '宝石卡社员'
          } else if (res.data.data.level == 4) {
            this.userLeveName = '钻石卡社员'
          } else {
            this.userLeveName = '普通会员'
          }
          this.balanceList = res.data.data;
        })
      }
    }

  }

</script>

<style scoped>
  .pages {
    background-color: #f8f8f8;
    padding: 0 20rpx;
    height: 100%;
  }
  .menu-avatar .cu-avatar {
    border: 2px solid #fff;
    overflow: hidden;
  }

  .menu-avatar .cu-avatar>._open-data {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .menu-avatar .cu-tag {
    height: 19px;
    font-size: 10px;
  }

  .person-bg {
    padding: 30px 0 50px;
    overflow: hidden;
  }

  .person-bg .bg-no {
    padding-right: 0 !important;
  }

  .img-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

  }

  .margin--top {
    margin-top: -40px;
  }


  .confirm-btn {
    width: 630rpx;
    height: 76rpx;
    line-height: 76rpx;
    border-radius: 50px;
    margin-top: 70rpx;
    color: #fff;
    font-size: 32rpx;
    margin-bottom: 30rpx;
    border-radius: 100px;

  }
  .cu-avatar {
    width: 120rpx;
    height: 120rpx;
    margin: 0 30rpx;
  }
  .menu-avatar {
    padding: 40rpx 20rpx 50rpx 20rpx;
    width: 750rpx;
    position: relative;
    left: -20rpx;
    padding-bottom: 0;
  }
  .userName {
    line-height: 60rpx;
    font-size: 30rpx;
    padding-top: 6rpx;
  }
  .menu-avatar .tagBox {
    background-color: #724A21;
    color: #fff;
    font-size: 20rpx;
    line-height: 36rpx;
    padding: 0 22rpx;
    display: inline-block;
  }
  .buyInfo {
    background-image: linear-gradient(#FFC8A1, #FAAF83);
    padding: 30rpx 60rpx;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    margin-top: 50rpx;
  }
  .buyCard .flex {
    padding: 30rpx 0;
  }
  .buyCard .flex-sub image {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 8rpx;
  }
  .buyCard .flex-sub .title1 {
    font-size: 26rpx;
    color: #333;
  }
  .buyCard .flex-sub .title2 {
    font-size: 22rpx;
    color: #FBA470;
  }
  .buyInfo .title1 {
    font-size: 22rpx;
    color: #7A2212;
    margin-right: 20rpx;
  }
  .buyInfo .title2 {
    font-size: 20rpx;
    color: #7A2212;
  }
  .rechargeBtn {
    position: absolute;
    width: 130rpx;
    height: 50rpx;
    line-height: 50rpx;
    background-color: #333333;
    font-size: 22rpx;
    text-align: center;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 10rpx;
  }
  .cu-list.card-menu {
    margin: 0;
    margin-top: 20rpx;
  }
  .myOrder .iconfont {
    font-size: 44rpx;
  }
  .cu-list.grid>.cu-item text {
    color: var(--black);
  }
  .cu-list.grid>.cu-item .text-black {
    color: #666;
  }
  .myOrder button {
    background-color: inherit;
    line-height: normal;
  }
</style>
