<template>
  <view class="card-page">
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub"  v-for="(item,index) in nav"
          :key="index" @click="tabSelect(index)" :data-id="index">
          {{item.name}}
        </view>
      </view>
    </scroll-view>
    <view class="itemCard" v-for="(item,index) in goodsList" :key="index">
      <view class="userInfo cf">
        <image :src="item.uavater?item.uavater:'/static/images/person.png'" class="avatar fl round"></image>
        <view class="fr">
          <view class="text-black cf">
            <view class="fl">{{item.uname}}</view>
            <!--评分-->
            <view class="score fl">
              <view class="right">
                <view
                  class="rightstars"
                  v-for="(i, index1) in list"
                  :key="index1"
                >
                  <image :src="item.skuScore > index1 ? stara : starb"></image>
                </view>
              </view>
              <view class="scorep fl">{{ rateScoreDesc[item.skuScore-1] }}</view>
            </view>
            <text class="cuIcon-more text-lg" @click="caozuo(index)"></text>
          </view>
          <view class="text-grey text-cut text-sm">
            {{item.createAt}}
          </view>
        </view>
      </view>
      <view>{{item.des}}</view>
      <view class="imgList">
        <image v-for="(itemList,indexList) in item.imgUrl" :key="indexList" :src="itemList" mode="widthFix" @click='imgYu(index,indexList)'></image>
      </view>
      <!-- <view class="cf product">
        <image src="/static/images/normalUserBg.png" mode="widthFix" class="fl"></image>
        <view class="fr">
          <view></view>
        </view>
      </view> -->
    </view>
    <view class="cu-modal" :class="showModal?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">操作</view>
          <view class="action" @click="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="cu-bar bg-white">
          <view class="action margin-0 flex-sub solid-left" @click="changeEvaluate">改为好评</view>
          <view class="action margin-0 flex-sub solid-left" @click="delEvaluate">删除评价</view>
        </view>
      </view>
    </view>
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
        nav: [{
          name: '全部评价'
        }],
        TabCur: 0,
        goodsList: [],
        selectIndex:"",
        stara: "/static/images/on.png", //亮星星
        list: [0, 1, 2, 3, 4],
        starb: "/static/images/off.png", //暗星星
        rateScoreDesc: ["差评", "中评", "中评", "好评", "好评"],
        showModal: false
      };
    },
    computed:{
			...mapState(["isLogin" , "userInfo"]),
		},
    onLoad(){
      this.getInfo();
    },
    methods: {
      ...mapMutations(["update"]),
     tabSelect(index) {
        this.TabCur = index;
      },
      formatDate(now) { 
				var year=now.getFullYear(); 
				var month=now.getMonth()+1; 
				var date=now.getDate(); 
				var hour=now.getHours(); 
				var minute=now.getMinutes(); 
				return year+"-"+month+"-"+date+" "+hour+":"+minute
			},
      imgYu(index,indexList){
        var that=this;
        var src = this.goodsList[index].imgUrl[indexList];
        var imgList = this.goodsList[index].imgUrl;
        //图片预览
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: imgList // 需要预览的图片http链接列表
        })
      },
      goDetail(id, merchantId) {
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`
        })
      },
      getInfo(){
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.$fly.get('/users/reviews').then(res => {
					res.data.data.forEach((item)=>{
						item.createAt = this.formatDate(new Date(item.createAt))
          })
          res.data.data.forEach((item)=>{
            if(item.imgUrl!=''){
              item.imgUrl = item.imgUrl.split(',')
            }else{
              item.imgUrl = []
            }
          })
          this.goodsList = res.data.data;
				})
      },
      caozuo(index){
        this.showModal = true;
        this.selectIndex = index;
      },
      hideModal(){
        this.showModal = false;
      },
      // 改为好评
      changeEvaluate(){
        var that = this;
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.$fly.post('/users/reviews/' + this.goodsList[this.selectIndex].id + "?skuScore=5").then(res => {
          if(res.data.success){
            wx.showToast({
              title: '修改成功',
              success: function(){
                that.hideModal();
                that.goodsList[that.selectIndex].skuScore = 5;
              }
            })
          }
				})
      },
      // 删除评价
      delEvaluate(){
        var that = this;
        this.$fly.config.headers = {
          "X-Tag": "flyio",
          Authorization: this.userInfo.token
        };
        this.$fly.delete('/users/reviews/' + this.goodsList[this.selectIndex].id).then(res => {
          if(res.data.success){
            wx.showToast({
              title: '已删除',
              success: function(){
                that.hideModal();
                that.goodsList.splice(that.selectIndex,1);
              }
            })
          }
				})
      },
    },
  };

</script>

<style>
  /* 空购物车 */
  page,
  .card-page {
    height: 100%;
    background: #fff;
  }
  .opacity0 {
    opacity: 0;
  }
  .itemCard {
    padding: 0 22rpx;
    margin-bottom: 30rpx;
  }
  .userInfo {
    padding: 30rpx 0;
  }
  .avatar {
    width: 70rpx;
    height: 70rpx;
  }
  .userInfo>.fr {
    width: 620rpx;
    position: relative;
  }
  .imgList {
    padding: 30rpx 0;
  }
  .imgList image {
    width: 170rpx;
    border-radius: 10rpx;
    margin-right: 10rpx;
    /* max-height: 240rpx; */
  }
  .product {
    position: relative;
  }
  .product .fl {
    width: 190rpx;
  }
  .product .fr {
    width: 512rpx;
    padding: 20rpx;
  }
  .score .left {
    width: 100rpx;
    font-size: 30rpx;
    float: left;
  }
  .score .right {
    width: 210rpx;
    font-size: 30rpx;
    float: left;
    color: #888;
    margin: 0 10rpx;
  }
  .score image {
    width: 40rpx;
    height: 36rpx;
  }
  .score .right .rtxt {
    display: inline-block;
    height: 100rpx;
    margin-left: 15rpx;
    color: #c00;
    font-weight: bold;
  }
  .scorep {
    color: #e54148;
    font-weight: 900;
  }
  .score.right img {
    float: left;
  }
  .rightstars {
    width: 40rpx;
    height: 36rpx;
    float: left;
  }
  .rightp {
    width: 224rpx;
    height: 48rpx;
    float: right;
  }
  .cuIcon-more {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
