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
              typeCar==0?modalStocks[modalStocksIndex].price:modalStocks[modalStocksIndex].groupPrice
            }}</view>
            <view class="text-sm"
              >库存： {{ modalStocks[modalStocksIndex].stockQuantity }}</view
            >
            <view class="text-sm"
              >已选择： {{skuAttrsNames}}</view
            >
          </view>
          <view class="text-xl text-gray" @tap="hideModal">
            <text class="cuIcon-close close"></text>
          </view>
        </view>
        <!-- 这是处理规格 -->
        <view class="flex padding-lr-sm padding-tb-sm attrName_Box">
          <block v-for="(item, index) in modalGood.attrs"
              :key="index">
            <view
              class="label text_attrName"
            >
              {{ item.attrName }}
            </view>
            <!-- 这是处理规格 -->
            <view
              v-for="(itemChild, index1) in item.attrValues"
              class="padding-xs"
              :key="index1"
              v-show="itemChild.check"
            >
              <button
                class="cu-btn red sm"
                :class="chooseList[index] == itemChild.attrValueId? 'bg-red' : 'line-red'"
                @tap="ChooseCheckbox(index,index1)"
                :data-value="itemChild.attrValueId"
                v-if="item.attrValues"
              >
                {{ itemChild.attrValueName }}
              </button>
            </view>
          </block>
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
              v-if="modalCuont >= modalStocks[modalStocksIndex].stockQuantity?true:typeCar==0?false:modalCuont==modalGood.buyLimitNum"
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
      groupUserJoinId: "",
    };
    },
    onHide(){
      this.modalName = "null";
    },
    methods: {
      ...mapMutations(["update"]),
    showModal(item, type, userId) {
      // modalGood是总的数据，
      // modalStocks是其中数据。有几个规格就几个数组。默认0checked
      // modalStocksIndex是当前规格的索引。默认0
      //
      item.newPeople = item.name.indexOf('新人')!=-1
      this.modalGood = item;
      this.modalStocks = item.productSkus;
      this.modalCuont = 1;
      this.typeCar = type;
      this.groupUserJoinId = userId;
      this.size = [];
      this.chooseList = [];
      this.sizeName = [];
      this.skuAttrsNames = '';
      this.modalStocks.forEach((item1,index1) => {
        var ceshi = [];
        item1.skuAttrs.forEach((item2,index2) => {
          ceshi[index2] = item2.attrValueId
        });
        ceshi = ceshi.reverse();
        item.attrs.forEach((items1,indexs1) => {
          items1.attrValues.forEach((items2,indexs2) => {
            if(items2.attrValueId == ceshi[indexs1]){
              items2.check = true
            }
          });
        });
      });
      item.attrs.forEach((items,index) => {
        items.attrValues.forEach((items2,indexs2) => {
          if(items2.check){
            this.chooseList[index] = items2.attrValueId;
            //选中的规格名称
            this.size[index] = items2.attrValueId;
            this.sizeName[index] = items2.attrValueName;
            return
          }
        });
      });
      this.chooseStocksIndex()
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
    ChooseCheckbox(index,index1) {
      this.modalCuont = 1;
      this.chooseList[index] = this.modalGood.attrs[index].attrValues[index1].attrValueId;
      this.size[index] = this.modalGood.attrs[index].attrValues[index1].attrValueId;
      this.sizeName[index] = this.modalGood.attrs[index].attrValues[index1].attrValueName;
      this.chooseStocksIndex()
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
            if(this.typeCar!=0){
              params.skuItems[0].skuId = goods.productSkus[this.modalStocksIndex].discountId;
              params.usePoint = false;
              params.type = 3;
              orderParams.usePoint = false;
              params.uid = this.userInfo.id;
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
                if(this.typeCar != 0){
                  wx.navigateTo({
                    url: "/pages/createOrder/main?orderParams=" + JSON.stringify(orderParams) + "&typeCar=" + this.typeCar + '&discountId=' + goods.productSkus[0].discountId + '&groupUserJoinId=' + this.groupUserJoinId
                  });
                }else{
                  wx.navigateTo({
                    url: "/pages/createOrder/main?orderParams=" + JSON.stringify(orderParams) + "&typeCar=" + this.typeCar
                  });
                }
                
              }
            });
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

