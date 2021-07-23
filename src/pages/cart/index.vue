<template>
  <view class="card-page">
    <div class="contain" v-if="!isLogin || cartList.length == 0">
      <img src="/static/images/cart.png" alt="" class="noList" />
      <view class="padding">购物车是空的哦～</view>
      <!-- <button class="cu-btn bg-red" >去逛逛</button> -->
      <navigator url="/pages/index/main" open-type="switchTab" hover-class="none">
        <button class="cu-btn bg-red">去逛逛</button>
      </navigator>
      
    </div>

    <div v-else class="cart">
      <view class="cf topBox">
        <view class="text-grey text-lg fl">
          <text class="cuIcon-goods"></text> 共{{total}}件商品
        </view>
        <text class="fr" @click="del">{{delStatusName}}</text>
      </view>
      <view class="list" v-for="(item, index) in cartList" :key="index">
        <view class="shopName">
          <checkbox-group class="radio-group" @change="_checkAll(item)">
            <checkbox class="round" :model="item.checked" :checked="item.checked" @change="_checkAll(item)"></checkbox>
          </checkbox-group>
          <text class="cuIcon-shop lg text-red"></text>
          {{item.merchantName}}
        </view>
        <view v-for="(itemList, indexList) in item.products" :key="indexList">
          <view class="clearfix listBox">
            <view class="leftBox fl">
              <checkbox-group class="radio-group" @change="handleCheck(itemList,indexList)">
                <checkbox class="round single" :model="itemList.checked" @change="handleCheck(itemList,indexList)"
                  :checked="itemList.checked"></checkbox>
              </checkbox-group>

              <image class="shopImg" :src="itemList.productCover?itemList.productCover:'/static/images/default.png'"></image>
            </view>
            <view class="rightBox fr">
              <text class="nowrap">{{itemList.productName}}</text>
              <view class="size">{{itemList.skuAttrsNames}}</view>
              <!-- 价格 -->
              <view class="">
                <view class="text-price text-xl text-orange margin-right">{{
                  itemList.price
                }}</view>
              </view>
              <!-- 价格 -->
              <!-- 按钮 -->

              <view class="button-box btnchang">
                <text class="btn-box" v-if="itemList.quantity <= 1">
                  <text class="lg text-gray cuIcon-move"></text>
                </text>
                <text class="btn-box" @click="decCount(itemList, index,indexList)" v-else>
                  <text class="lg text-gray cuIcon-move"></text>
                </text>
                <input class="numberChange" disabled type="number" :value="itemList.quantity" />
                <text class="btn-box disabled" v-if="itemList.quantity >= itemList.stockQuantity">
                  <text class="lg text-gray cuIcon-add"></text>
                </text>
                <text class="btn-box" @click="addCount(itemList, indexList)" v-else>
                  <text class="lg text-gray cuIcon-add"></text>
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white tabbar border shop solid-top">
        <!-- <text class="text-xxl padding-lr-sm" @click="handleAllCheck">
					<text class="text-green cuIcon-roundcheckfill" v-if="allCheck"></text>
					<text class="text-ddd cuIcon-roundcheck" v-else></text>
				</text> -->
        <view class="cu-form-group">
          <view class="title"></view>
          <!-- <radio @click="handleAllCheck"></radio> -->
          <view class="cu-form-group">
            <checkbox-group class="radio-group" @change="checkAll">
              <checkbox class="round" :checked="checkedAll" @change="checkAll"></checkbox>
            </checkbox-group>
          </view>
        </view>
        <text class="text-df">
          全选
        </text>

        <view class="action" :class="delStatusName == '完成'?'opacity0':''">
          <text class="noFreight text-grey">
            不含运费
          </text>
          合计：
          <text class="text-lg text-orange margin-right">{{ allPrice }}元</text>
        </view>
        <view class="bg-red submit round padding-3rpx" @click="submitOrder" v-if="delStatusName == '编辑'">去结算</view>
        <view class="bg-red submit round padding-3rpx" @click="deleted" v-if="delStatusName == '完成'">删除</view>
      </view>
    </div>
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
    data() {
      return {
        address: "",
        checked: false,
        cartList: [],
        delStatusName:"编辑",
        checkedAll: false
      };
    },
    onShow(){
      this.delStatusName = "编辑";
      // 查看是否授权
      if (!this.isLogin) {
        wx.redirectTo({
          url: "/pages/prelogin/main"
        });
      } else {
        this.getCarts();
      }
    },
    onPullDownRefresh() {
      // 下拉刷新
       if (!this.isLogin) {
        wx.navigateTo({
          url: "/pages/prelogin/main"
        });
      } else {
        this.getCarts();
      }
      wx.stopPullDownRefresh()
    },
    computed: {
      ...mapState(["isLogin", "cartCount", "userInfo"]),
      // 所有价格
      allPrice: function () {
        let sum = 0;
        this.cartList.forEach((item) => {
          item.products.forEach((itemList) => {
            if (itemList.checked) {
              sum += itemList.quantity * itemList.price
            }
          });
        });
        return sum.toFixed(2);;
      },
      //商品总数
      total: function(){
        var total = 0;
        this.cartList.forEach((item) => {
          total += item.products.length
        });
        return total
      },
      // 是否全选 (需要除去失效的商品)
      allCheck: function () {
        const checkAdult = (item) => {
          return item.check;
        };
        if (!this.cartList.every(checkAdult)) {
          return false;
        } else {
          return true;
        }
      },
      // 购物车数量
      allCount: function () {
        if (!this.isLogin) {
          wx.hideTabBarRedDot({
            index: 3,
          });
          return "0";
        }
        let sum = 0;
        this.cartList.forEach((item) => {
          if (item.check) {
            sum += item.count;
          }
        });
        if (sum > 0) {
          wx.setTabBarBadge({
            index: 3,
            text: sum.toString(),
          });
        } else {
          wx.hideTabBarRedDot({
            index: 3,
          });
        }
        return sum.toString();
      },
    },
    created() {
      if (this.allCount != "0") {
        wx.setTabBarBadge({
          index: 3,
          text: this.allCount,
        });
      } else {
        wx.hideTabBarRedDot({
          index: 3,
        });
      }
    },
    onTabItemTap() {
      
    },
    methods: {
      ...mapMutations(["update"]),
      //全选
      checkAll() {
        this.checkedAll = !this.checkedAll
        this.cartList.forEach(item => {
          item.checked = this.checkedAll;
          if (item.products) {
            item.products.forEach(citem => {
              this.$set(citem, "checked", this.checkedAll)
            })
          }
        })
      },
      //商家全选
      _checkAll(val, k) {
        if (val.checked) {
          val.checked = !val.checked;
          val.products.forEach(item => {
            this.$set(item, "checked", false)
          });
        } else {
          val.checked = !val.checked;
          val.products.forEach(item => {
            this.$set(item, "checked", true)
          });
        }
        if (this.cartList.every(item => item.checked)) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
      },
      //商品选择框
      handleCheck(item, index) {
        var check = []; //保存中间层是否被选中的布尔值
        item.checked = !item.checked
        this.cartList.forEach((items, index) => {
          if (items.products) {
            var bool = items.products.every(citem => citem.checked);
            if (bool) {
              this.$set(items, "checked", true)
            } else {
              this.$set(items, "checked", false)
            }
            check.push(bool);
          }
        })
        if (check.indexOf(false) == -1) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
      },
      //编辑删除
      del(){
        if(this.delStatusName == "编辑"){
          this.delStatusName = "完成"
        }else if(this.delStatusName == "完成"){
          this.delStatusName = "编辑"
        }
      },
      getCarts() {
        //
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        //console.log("购物车userInfo", this.userInfo);
        this.$fly.get("/carts").then((res) => {
          this.cartList = res.data.data;
          this.$forceUpdate({
            cartList: res.data.data
          });
          this.update({
            cartList: res.data.data
          });
          this.cartList.forEach(item => {
            this.$set(item, "checked", false) //Vue 解决不能检测到对象属性的添加或删除
            // item.checked = false; //如果为真实数据直接设置的对象改变值不会更新视图
            if (item.products) {
              item.products.forEach((citem) => {
                this.$set(citem, "checked", false)
                // citem.checked = false;
              })
            }
          });
          //console.log(this.cartList);
        });
      },
      //删除商品
      deleted(){
        let that = this;
        var ids = [];
        this.cartList.forEach(function (item, index) {
          item.products.forEach(function (itemList, indexList) {
            if (itemList.checked) {
              ids.push(itemList.id)
            }
          });
        });
        wx.showModal({
          title: "是否删除该商品？",
          content: "",
          success(res) {
            if (res.confirm) {
              that.$fly.post("/carts/batch-delete", {ids:ids}).then(() => {
                that.getCarts()
              });
            }
          },
        });
      },
      decCount(item, index ,indexList) {
        let params = {
          id: item.id,
          quantity: -1
        };
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        if (item.quantity > 1) {
          this.$fly.post("/carts/change-quantity", params).then(() => {
            item.quantity--
          });
          this.$forceUpdate(this.cartList)
        }
      },
      addCount(item, index) {
        let params = {
          id: item.id,
          quantity: 1
        };
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.$fly.post("/carts/change-quantity", params).then(() => {
          item.quantity++
        });
        this.$forceUpdate(this.cartList)
      },
      handleAllCheck() {
        this.allCheck = !this.allCheck;
        this.allPrice = 0;
        if (this.allCheck) {
          this.cartList.forEach((item) => {
            item.check = false;
          });
        } else {
          this.cartList.forEach((item) => {
            item.check = true;
            this.allPrice += item.price * item.count;
          });
        }
        // this.$forceUpdate(this.cartList)
      },
      goHome(){
        wx.switchTab({
          url: '/pages/index/main',
        })
      },
      submitOrder() {
        let params = [];
        const filterGoods = () => {
          return this.cartList.filter((item) => item.checked == true);
        };
        this.cartList.forEach(function (item, index) {
          let obj = {
            merchantId:"",
            type:"",
            type:"",
            skuItems:[]
          }
          item.products.forEach(function (itemList, indexList) {
            if (itemList.checked) {
              obj.merchantId = item.merchantId;
              obj.type = 0;
              obj.usePoint = true;
              obj.skuItems.push(item.products[indexList]);
            }
          });
          if(obj.skuItems.length>0){
            params.push(obj)
          }
        });
        if (params.length==0) {
          wx.showToast({
            title: "请选择需要购买的商品",
            icon: "none",
            duration: 2000,
          });
          return
        } else {
          console.log("params", params)
          this.$fly.config.headers = {
            "X-Tag": "flyio",
            Authorization: this.userInfo.token
          };
          var cartIds = [];
          params.forEach((item,index)=>{
            item.skuItems.forEach((itemList,indexList)=>{
              cartIds.push(itemList.id)
            })
          })
          this.$fly.post("/orders/prepare/batch", params).then((res) => {
            
            if (res.data.success) {
              this.update({
                orderGoods: res.data.data,
              });
              this.update({
                cartIds: cartIds,
              });
              this.update({
                cartPrice: this.allPrice
              });
              wx.navigateTo({
                url: "/pages/createOrder/main"
              });
            }
          });
        }
      },
    },
  };

</script>

<style>
  /* 空购物车 */
  page,
  .card-page {
    height: 100%;
    background: #F8F8F8;
  }

  .contain {
    height: 100%;
    text-align: center;
  }

  .noList {
    width: 596rpx;
    height: 328rpx;
    margin-top: 200rpx;
  }

  .cu-btn {
    border-radius: 0;
    padding: 0 80rpx;
  }

  .card-page .article {
    display: flex;
    align-items: center;
  }

  .cart {
    padding-bottom: 100rpx;
  }

  .titles {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .button-box {
    line-height: 40xrpx;
    align-items: right;
    position: absolute;
    right: 27rpx;
    bottom: 0rpx;
  }

  .btn-box {
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 40rpx;
    height: 40rpx;
    text-align: center;
    line-height: 40rpx;
  }

  .text-ddd {
    color: #ddd;
  }

  .cu-card.article>.cu-item .content {
    padding-left: 20rpx;
  }

  .cu-card>.cu-item {
    flex: 1;
  }

  .tabbar {
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .cu-bar.tabbar.shop .action {
    width: 430rpx;
    text-align: right;
    padding-left: 30rpx;
    font-size: 28rpx;
  }

  .isDelete {
    position: absolute;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    height: 100%;
    padding-left: 160rpx;
    padding-top: 72rpx;
    color: #444;
    z-index: 10;
  }

  .disabled {
    opacity: 0.4;
  }

  .noFreight {
    font-size: 20rpx;
    margin-right: 8rpx;
    ;
  }

  .radioLeft {
    margin-left: 30rpx;
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }

  .shopName {
    font-size: 30rpx;
    font-weight: 400;
    margin-bottom: 20rpx;
    font-weight: bold;
  }

  .cuIcon-shop {
    margin-left: 10rpx;
    font-size: 34rpx;
    vertical-align: -2rpx;
  }

  .cu-form-group {
    padding-right: 0;
    padding-left: 0;
  }

  .attrname {
    margin-bottom: 9rpx;
    font-weight: 100;
  }

  .text-df {
    margin-left: 5rpx;
  }

  .btnchang {
    margin-top: 50rpx;
  }

  .numberChange {
    width: 70rpx;
    text-align: center;
  }

  .btn-box {
    border-radius: 0;
  }

  .cu-bar.tabbar .submit {
    margin: 3rpx;
    font-size: 30rpx;
    transform: scale(0.8);
  }

  .cuIcon-right {
    margin-left: 5rpx;
  }

  .list {
    border-radius: 20rpx;
    margin: 16rpx;
    padding: 30rpx;
    background-color: #fff;
  }

  checkbox {
    transform: scale(0.6, 0.6)
  }

  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    /* 触发 hasLayout */
    zoom: 1;
  }

  .fl {
    float: left
  }

  .fr {
    float: right
  }

  .leftBox {
    height: 180rpx;
    width: 240rpx;
  }

  .rightBox {
    width: 390rpx;
    position: relative;
  }

  .shopImg {
    width: 180rpx;
    height: 180rpx;
    border-radius: 20rpx;
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

  .single {
    position: relative;
    top: -50%;
    margin-right: 8rpx;
  }

  .size {
    font-size: 28rpx;
    opacity: .7;
    margin-top: 24rpx;
    margin-bottom: 36rpx;
  }

  checkbox-group {
    display: inline;
  }
  .listBox {
    margin-bottom: 20rpx;
  }
  .topBox {
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 48rpx;
    background-color: #fff;
  }
  .opacity0 {
    opacity: 0;
  }
</style>
