<template>
  <view class="card-page">
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="index==TabCur?'text-red cur':''" v-for="(item,index) in nav"
          :key="index" @click="tabSelect(index)" :data-id="index">
          {{item.name}}
        </view>
      </view>
    </scroll-view>
    <view class="mainBox">
      <view class="listBox" v-for="(item,index) in voucherlist" :key="index">
        <view class="cf">
          <view class="fl text-df">{{item.des[0]}}</view>
          <view class="fr text-red text-xl">{{item.changeMoney>0?'+':''}} {{item.changeMoney}}</view>
        </view>
        <view class="cf text-grey text-xs">
          <view class="fl">{{item.des[1]}}</view>
          <view class="fr">{{item.createAt}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    moneyFormat,
    formatTime
  } from "@/utils/index";
  import {
    mapState,
    mapMutations
  } from "vuex";

  export default {
    data() {
      return {
        TabCur: 0,
        scrollLeft: 0,
        voucherlist: [],
        status: "",
        nav: [{
          id: 1,
          name: '支出'
        }, {
          id: 2,
          name: '收入'
        }],
      };
    },
    computed: {
      ...mapState(["isLogin", "cartCount", "userInfo"]),
    },
    onShow(){
      wx.setNavigationBarTitle({ title: '钱包明细' });
      // 查看是否授权
      if (!this.isLogin) {
        wx.redirectTo({
          url: "/pages/prelogin/main"
        });
      }
    },
    methods: {
      tabSelect(index) {
        this.TabCur = index;
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        var url = '';
        if (index == 0) {
          url = '/wallet/expenditure';
        } else {
          url = '/wallet/income';
        }
        this.$fly.get(url).then(res => {
          res.data.data.forEach((item, index) => {
            item.createAt = formatTime(new Date(item.createAt));
            item.des = item.des.split(",")
          })
          this.voucherlist = res.data.data
        })
      },
    },
    onLoad() {
      this.tabSelect(0)
    }
  }

</script>

<style lang='scss'>
  /* 空购物车 */
  .mainBox {
    padding: 0 20rpx;
    .listBox {
      border-radius: 10rpx;
      background-color: #fff;
      margin-top: 20rpx;
      padding: 30rpx 40rpx;
    }
  }

</style>
