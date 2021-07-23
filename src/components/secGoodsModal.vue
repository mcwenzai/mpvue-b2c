<template>
  <view
    class="cu-modal bottom-modal"
    :class="modalName == 'ChooseModal' ? 'show' : ''"
    @tap="hideModal"
  >
    <view class="cu-dialog" @tap.stop="">
      <view class="dialog-main bg-white text-left">
        <!--处理 库存，已选择 -->
        <view class="flex goodInfo padding-lr-sm">
          <view class="img-box">
            <!-- ... -->
            <image
              :src="modalStocks[modalStocksIndex].imgUrl?modalStocks[modalStocksIndex].imgUrl:'/static/images/default.png'"
              mode="aspectFill"
              class="cover_img"
            ></image>
            <!-- ... -->
          </view>
          <view class="padding-sm">
            <view class="text-price text-lg text-orange margin-right">{{
              modalStocks[modalStocksIndex].price
            }}</view>
            <view class="text-sm"
              >库存： {{ modalStocks[modalStocksIndex].stockQuantity }}</view
            >
            <view class="text-sm"
              >已选择： {{modalStocks[modalStocksIndex].skuAttrsNames}}</view
            >
          </view>
          <view class="text-xl text-gray" @tap="hideModal">
            <text class="cuIcon-close close"></text>
          </view>
        </view>
        <!-- 这是处理规格 -->
        <view class="flex padding-lr-sm padding-tb-sm attrName_Box">
          <view
            v-for="(itemChild, index1) in modalStocks"
            class="padding-xs"
            :key="index1"
          >
            <button
              class="cu-btn red sm"
              :class="modalStocksIndex == index1? 'bg-red' : 'line-red'"
              @tap="ChooseCheckbox(index1)"
              :data-value="itemChild.id"
            >
              {{ itemChild.skuAttrsNames }}
            </button>
          </view>
        </view>
        <!-- 处理数量 -->
        <view
          class="flex padding-lr-sm padding-top-sm padding-bottom-lg justify-between"
        >
          <view class="button-box">
            <!-- 这是数量的增减 -->
            <text class="label2">
              数量
            </text>
            <!-- 这是 -->
            <text class="btn-box disabled" v-if="modalCuont == 1">
              <text class="lg text-gray cuIcon-move"></text>
            </text>
            <!-- 这是数量减少 -->
            <text class="btn-box" @click="decCount()" v-else>
              <text class="lg text-gray cuIcon-move"></text>
            </text>
            <text class="margin-lr-sm">{{ modalCuont }}</text>
            <text
              class="btn-box disabled"
              v-if="modalCuont >= modalStocks[modalStocksIndex].stockQuantity||this.typeCar==2"
            >
              <text class="lg text-gray cuIcon-add"></text>
            </text> 
            <!-- 这是数量增加 -->
            <text class="btn-box" @click="addCount()" v-else>
              <text class="lg text-gray cuIcon-add"></text>
            </text>
          </view>
          <!-- 确定提交得按钮 -->
          <button
            class="cu-btn bg-red block modal-sub"
            @click="addGoods(modalGood, modalStocksIndex, modalCuont)"
          >
            确定
          </button>
        </view>
        <!-- 处理数量 -->
      </view>
    </view>
  </view>
</template>

<script>
  import {moneyFormat} from "@/utils/index";
  import {mapState,mapMutations} from "vuex";
  export default {
    computed: {
      ...mapState([
        'userInfo','isLogin','inviteCode'
      ])
    },
    data() {
      return {
      address: "",
      test:0,
      modalStocksIndex: 0,
      modalCuont: 1,
      modalGood: [],
      modalName: null,
      modalStocks: [
        {
          price: "",
        },
      ],
      size:[],
      sizeName:[],
      skuAttrsNames:'',
      chooseList:[],
      // 区别购物车
      typeCar: 0,
      sumbiturl: "",
    };
    },
    methods: {
      ...mapMutations(["update"]),
    showModal(item, type, url) {
      // modalGood是总的数据，
      // modalStocks是其中数据。有几个规格就几个数组。默认0checked
      // modalStocksIndex是当前规格的索引。默认0
      //
      this.modalGood = item;
      item.productSkus.forEach((item1,index1)=>{
        item1.skuAttrsNames = '';
        item1.skuAttrs.forEach((item2,index2)=>{
          if(index2 == item1.skuAttrs.length-1) {
            item1.skuAttrsNames+=item2.attrValueName;
          }else{
            item1.skuAttrsNames+=item2.attrValueName + '-';
          }
        })
      })
      this.modalStocks = item.productSkus;
      this.modalStocksIndex = 0;
      this.modalCuont = 1;
      this.typeCar = type;
      this.sumbiturl = url;
      this.size = [];
      this.chooseList = [];
      this.sizeName = [];
      this.skuAttrsNames = '';
      item.productSkus.forEach((items,index) => {
        this.chooseList[index] = items.id;
      });
      // this.chooseStocksIndex()
      this.modalName = "ChooseModal";
    },
    sortNum(a,b){
      return a-b
    },
    chooseStocksIndex(){
      //判断skuid 和skuname
      var list = this.size;
      for(var i=0;i<this.modalStocks.length;i++){
        var item = this.modalStocks[i].skuAttrs;
        var checkedList = []
        for(var j=0;j<item.length;j++){
          checkedList.push(item[j].attrValueId);
        }
        if(checkedList.toString() == list.toString()||checkedList.reverse().toString() == list.toString()){
          this.modalStocksIndex = i;
          break;
        }
      }
      this.skuAttrsNames = "";
      this.sizeName.forEach((item,index)=>{
        if(index == this.sizeName.length-1) {
          this.skuAttrsNames+=item;
        }else{
          this.skuAttrsNames+=item + '-';
        }
      })
    },
    // 切换规格
    ChooseCheckbox(index1) {
      this.modalCuont = 1;
      // this.chooseList[index] = this.modalGood.attrs[index].attrValues[index1].attrValueId;
      // this.size[index] = this.modalGood.attrs[index].attrValues[index1].attrValueId;
      // this.sizeName[index] = this.modalGood.attrs[index].attrValues[index1].attrValueName;
      this.modalStocksIndex = index1
      this.test++;
    },
    decCount() {
      this.modalCuont--;
    },
    addCount() {
      this.modalCuont++;
    },
    hideModal() {
      this.modalName = "null";
    },
      // z这是添加的点击按钮
      addGoods(goods, index, Cuont,userInfo) {
        
        // 多规格的情况弹窗goods.stocks.length
        // if (2>1) {
        if (false) {
          // 
          this.$fly
            .get("/products/" + goods.aliasId + "?merchantId=" + goods.merchantId)
            .then((res) => {
              this.showModal(res.data.data);
            });
        } else {
          this.submitStock(goods, index, Cuont);
        }
      },
      // 这是当前的确定提交按钮（1添加购物车，2直接购买）
      // 商品，第几个label，数量
      submitStock(goods, index, count) {
        var pages = getCurrentPages();
        //console.log(pages)
        this.buyGoods(goods, index, count)
        // if(pages.length>=2){
        //   var prevPage = pages[pages.length - 2].route;
        // }else{
        //   var prevPage = "";
        // }
        // if(prevPage == "pages/regist/main"){
        //   this.buyGoods(goods,index,1)
        // }else if(goods.aliasId=="P482630322075066369"){
        //   wx.navigateTo({
        //     url: '/pages/regist/main?inviteCode=' + this.inviteCode,
        //   })
        // }else{
        //   this.buyGoods(goods, index, count)
        // }
      },
      buyGoods(goods, index, count){
        if(this.isLogin){
          //console.log("submitStock", index, goods);
          //  把当前的这个参数，请求了服务器
          this.$fly.config.headers = {
            Authorization: this.userInfo.token,
          },
          this.$fly.get("/users/addresses/default").then((res) => {
            this.address = res.data.data;
          }),
          this.$fly.get("/merchants/" + goods.merchantId).then((res) => {
            
            let merchantName = "";
            merchantName = res.data.data.name;
            var price = goods.productSkus[this.modalStocksIndex].price;
            var skuId = goods.productSkus[this.modalStocksIndex].id;
            if (this.typeCar == 0||this.typeCar == 2) {
              var params = {
                merchantId:goods.merchantId,
                type:0,
                usePoint: true,
                skuItems: [{
                  "skuId": skuId,
                  "quantity": count,
                  "productAliasId":goods.aliasId,
                  "productId":goods.productId,
                  skuAttrsNames: this.skuAttrsNames,
                }]
              }
              let orderParams = {
                buyerMessage: "",
                productAliasId: goods.aliasId,
                productName: goods.name,
                productCover: goods.cover,
                productItems: [{
                  merchantUserCouponId: "-1",
                }, ],
                merchantId: goods.merchantId,
                merchantName: merchantName,
                skuId: skuId,
                skuAttrsNames: this.skuAttrsNames,
                price: price,
                quantity: count,
                usePoint: true,
                addressId: this.address.id,
                payType: 0,
                type: 0,
                logisticsType: 0
              };
              if(this.typeCar==2){
                params.type = 1;
                params.skuItems[0].skuId = goods.productSkus[this.modalStocksIndex].discountId;
                params.usePoint = false;
                orderParams.type = 1;
                orderParams.payType = 1;
                orderParams.usePoint = false;
              }
              this.$fly.post("/orders/prepare", params).then((res) => {
                
                if (res.data.success) {
                  this.update({
                    orderGoods: res.data.data,
                  });
                  this.update({
                    cartIds: [],
                  });
                  this.update({
                    cartPrice: price * count
                  });
                  if(this.typeCar == 2){
                    wx.navigateTo({
                      url: "/pages/createOrder/main?orderParams=" + JSON.stringify(orderParams) + "&typeCar=" + this.typeCar + '&discountId=' + goods.productSkus[0].discountId
                    });
                  }else{
                    wx.navigateTo({
                      url: "/pages/createOrder/main?orderParams=" + JSON.stringify(orderParams) + "&typeCar=" + this.typeCar
                    });
                  }
                  
                }
              });
              
            } else {
              let params = {
                aliasId: goods.aliasId,
                productName: goods.name,
                productCover: goods.cover,
                merchantId: goods.merchantId,
                merchantName: merchantName,
                skuId: skuId,
                skuAttrsNames: this.skuAttrsNames,
                price: goods.priceStr,
                quantity: count,
              };
              this.$fly.post("/carts", params).then((res) => {
                
                // //console.log(res);
                if (res.data.success) {
                  wx.showToast({
                    title: "商品添加成功",
                    icon: "none",
                    duration: 1200,
                  });
                } else {
                  wx.showToast({
                    title: res.message,
                    icon: "none",
                    duration: 1200,
                  });
                }
              });
            }
          });
          //   //console.log("购物车请求数据成功");
          setTimeout(() => {
            this.hideModal();
          }, 300);
        }else{
          wx.navigateTo({
            url: "/pages/prelogin/main"
          })
        }
      }
    }
  };

</script>

<style>
/* 弹窗 */
.cu-dialog {
  background: transparent;
  padding-top: 40rpx;
}
.cu-dialog .label {
  padding-top: 12rpx;
  padding-right: 14rpx;
}

.cu-dialog .label2 {
  padding-top: 2rpx;
  padding-right: 24rpx;
}

.cu-dialog .goodInfo .img-box {
  width: 180rpx !important;
  height: 160rpx !important;
}
.cu-dialog .goodInfo image {
  width: 100%;
  height: 100% !important;
  /* margin-top: -40rpx; */
  object-fit: cover;
  border: 2px solid #fff;
}

.cu-dialog .close {
  position: absolute;
  right: 20rpx;
  top: 60rpx;
}
.button-box {
  display: flex;
  line-height: 40xrpx;
  justify-content: flex-start;
  align-items: center;
}
.btn-box {
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
}
.disabled {
  opacity: 0.4;
}
.text-ddd {
  color: #ddd;
}
.attrName_Box {
  display: flex;
  flex-wrap: wrap;
}
.text_attrName {
  flex: 0 0 100%;
  font-size: 18rpx;
}
.padding-xs {
  display: flex;
}
.cover_img {
  width: 100%;
  height: 100%;
}
</style>

