<template>
  <view class="order-page">
    <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
      <view class="cu-item" :class="index==TabCur?'text-red cur':''" v-for="(item, index) in nav" :key="index"
        @tap="tabSelect(index)" :data-id="index">
        {{item.name}}
      </view>
    </scroll-view>
    <view class="contain" v-if="orderList.length==0">
      <img src="/static/images/order.png" alt="" class="noList">
      <view class="padding">暂无订单</view>
    </view>

    <div v-else class="orderBox">
      <view class="cu-list menu orderList" v-for="(item, index) in orderList" :key="index">
        <view class="cu-item">
          <view class="content flex justify-between">
            <text class="text-sm">店铺名称>：{{item.merchantName}}</text>
            <!-- <text class="text-sm" :class="item.status==0?'text-red':'text-grey'">{{nav[item.status+1].name}}</text> -->
            <text class="text-sm" :class="item.status==1?'text-red':'text-grey'">{{item.statusName}}</text>
          </view>
        </view>
        <view class="cu-card article no-card solid-bottom bg-white" @click="goRouter(item)">
          <view class="cu-item shadow padding-tb" v-for="(goods, index2) in item.orderItems" :key="index2">
            <view class="content padding-left-sm">
              <image :src="goods.productCover?goods.productCover:'/static/images/default.png'" mode="aspectFill"></image>
              <view class="desc">
                <view class="titles">
                  {{goods.productName}}
                </view>
                <view>
                  <view class='cu-tag texxt-ct radius sm'>{{goods.skuAttrsName}}</view>
                </view>
                <text class="text-sm">
                  <text class="text-price text-sm text-gray">{{goods.perPayPrice}}</text>
                  <text class="text-gray"> x {{goods.quantity}}</text>
                </text>
              </view>
            </view>
          </view>
        </view>
        <view class="cu-item ">
          <view class="content flex justify-between">
            <text class="text-sm">
              共 {{item.quantity}} 件商品 实付：
              <text class="text-price text-lg">{{item.payPrice}}</text>
            </text>
            <view v-if="item.status == 0">
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="cancelOrder(item.payId)">取消订单</button>
              <button class="cu-btn bg-red sm shadow-blur round" @click="goRouter(item)">立即付款</button>
            </view>
            <view v-if="item.status == 1">
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="remind(item.orderId)">提醒发货</button>
            </view>
            <view v-if="item.status == 2">
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="logistic(item.logisticCode,item.orderId)">查看物流</button>
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="confirmReceipt(item.orderId)">确认收货</button>
            </view>
            <view v-if="item.status==11">
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="anotherOne(item.orderItems[0].productAliasId,item.merchantId)">再来一单</button>
            </view>
            <view v-if="item.status == 10">
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="anotherOne(item.orderItems[0].productAliasId,item.merchantId)">再来一单</button>
              <button class="cu-btn lines-gray sm round margin-right-sm" @click="evaluate(item.orderItems)">去评价</button>
            </view>
          </view>
        </view>
      </view>
    </div>
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
        scrollLeft: 0,
        TabCur: 0,
        statusName:'',
        downIndex: 0,
        nav: [{
          id: 0,
          name: '全部',
          desc: '暂无订单~'
        }, {
          id: 1,
          name: '待付款',
          desc: '暂无订单~'
        }, {
          id: 2,
          name: '待分享',
          desc: '暂无订单~'
        },{
          id: 3,
          name: '待收货',
          desc: '暂无订单~'
        }, {
          id: 4,
          name: '待评价',
          desc: '暂无订单~'
        }],
        orderList: [],
        index:0
      };
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo',
      ]),
    },
    onLoad(option) {
      if (this.isLogin) {
        this.tabSelect(option.index||0); 
      } else {
        this.orderList = []
      }
    },

    onShow() {
      // 查看是否授权
      if (!this.isLogin) {
          wx.redirectTo({
          url: "/pages/prelogin/main"
          });
      }
      //console.log("isLogin", this.isLogin)
      // if (this.isLogin) {
      //   this.getOrderList(0)
      // } else {
      //   this.orderList = []
      // }
    },
    onPullDownRefresh() {
    // 下拉刷新
    this.downIndex = 0;
    this.getOrderList(this.index)
    wx.stopPullDownRefresh();
  },
    onReachBottom() {
      // 上拉加载更多
      this.getOrderList(this.index)
      
    },
    methods: {
      //评价
      evaluate(orderItems){
        wx.navigateTo({
            url: "/pages/evaluate/main?orderItems="+ JSON.stringify(orderItems)
          }) 
      },
      tabSelect(index) {
        this.TabCur = index;
        this.index=this.TabCur;
        this.downIndex = 0;
        this.getOrderList(index);
      },
      getOrderList(index) {
        if(this.downIndex==0){
          this.orderList = []
        }
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          "Authorization": this.userInfo.token
        }
        this.$fly.get('/orders/query?queryType=' + index + '&query=&offset='+this.downIndex*20+'&limit=20').then(res => {
          if(this.downIndex!=0&&res.data.data.length==0){
            wx.showToast({
              title: '没有更多啦~~',
              icon: 'none'
            })
            return;
          }
          this.orderList.push.apply(this.orderList,res.data.data);
          this.downIndex++;
          this.orderList.forEach(item => {
            item.totalPay = 0
            item.allCount = 0
            
            if(item.status==0){item.statusName ='待付款'}
            if(item.status==1){item.statusName ='待收货'}
            if(item.status==2){item.statusName ='已发货'}
            if(item.status==10){item.statusName ='已完成'}
            if(item.status==11){item.statusName ='交易成功'}
            
            item.orderItems.forEach(goods => {
              item.totalPay +=  goods.price
              item.allCount += goods.quantity
              
            })
          })
          
        })
      },
      //再来一单
      anotherOne(id,merchantId){
        
         wx.navigateTo({
            url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`
          }) 
      },
    //取消订单
      cancelOrder(id) {
        var _this2 = this;
        wx.showModal({
          title: '取消订单',
          content: '确定要取消订单吗？',
          success: (res) => {
            if (!res.cancel) {
               _this2.$fly.config.headers = {
                    "X-Tag": "flyio",
                    Authorization: _this2.userInfo.token,
                    "Content-Type":"form-data"
                };
              _this2.$fly.post('/orders/cancel?payId='+id).then(resp => {
                wx.showToast({
                  title: "订单取消成功",
                  icon: 'success',
                  duration: 1500,
                  //success-->接口调用成功的回调函数
                  complete:function(){
                    _this2.tabSelect(_this2.index) 
                  }
                });
              })
              //_this2.getOrderList()
            }
          }
        })

      },
      //确认收货
      confirmReceipt(id){
        var _this2 = this;
        wx.showModal({
          title: '确认收货',
          content: '是否确认收货',
          success: (res) => {
            if (!res.cancel) {
               _this2.$fly.config.headers = {
                    "X-Tag": "flyio",
                    Authorization: _this2.userInfo.token,
                };
              _this2.$fly.post('/orders/confirm-product?orderId='+id).then(resp => {
                wx.showToast({
                  title: "确认收货",
                  icon: 'success',
                  duration: 1500,
                  //success-->接口调用成功的回调函数
                  complete:function(){
                    _this2.tabSelect(_this2.index) 
                  }
                });
              })
              //_this2.getOrderList()
            }
          }
        })
      },
      //查看物流
      logistic(logisticCode,orderId){    
        wx.navigateTo({
            url:"/pages/logistic/main?logisticCode="+logisticCode+"&orderId="+orderId
          }) 
      },
      payOrder(id) {
        let params = {
          payId: id,
        }
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.$fly.post('/order/payOrder', params).then(resp => {
          wx.showToast({
            title: resp.message,
            icon: 'success',
            duration: 1200
          });
        })
        this.TabCur = 2
        this.getOrderList()
      },

      goRouter(item) {
        if(item.status==20){
           wx.navigateTo({ url: '/pages/payment/main?status=0&orderId=' + item.orderId });
        }else {
          wx.navigateTo({
            url: `/pages/orderDetail/main?order=${JSON.stringify(item)}`
          })
        }
      },
      //提醒发货
       remind(orderId){
        this.$fly.post('/orders/remain-delivery?orderId='+orderId).then(res => {
          console.log(res.data)
          if (res.data.success) {
             wx.showToast({
                  title: "提醒成功",
                  icon: 'success',
                  duration: 1500
                });
          } else {
            console.log("提醒发货失败")
          }
        })
      },
      // 订单预览页面
      orderPrepare() {
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        let params = {
          merchantId: 122,
          type: 0,
          usePoint: true,
          skuItems: [{
            skuId: 697,
            quantity: 24,
            productAliasId: "P694198732920516608",
            productId: 204,
          }, ],
        };
        //   发送请求
        this.$fly.post("/orders/prepare", params).then((resp) => {
          //console.log(res);

          wx.showToast({
            title: "订单预览",
            icon: "success",
            duration: 1500,
          });
        });

      },

    },
  }

</script>

<style>
  page,
  .order-page {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .contain {
    height: 100%;
    text-align: center;
    background: #fff;
    margin-top: 16rpx;
  }

  .orderBox {
    padding-bottom: 30rpx;
  }

  .orderList {
    margin: 16rpx 16rpx 0;
  }

  .cu-card.article>.cu-item .content>image {
    width: 140rpx;
    height: 120rpx;
  }

  .cu-list+.cu-list {
    margin-top: 16rpx;
  }

  .noList {
    width: 596rpx;
    height: 328rpx;
    margin-top: 200rpx;
  }

</style>
