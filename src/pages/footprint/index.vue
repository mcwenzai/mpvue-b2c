<template>
	<view class="card-page">
		<div class="contain" v-if="!isLogin || goodsList.length == 0">
      <img src="/static/images/cart.png" alt="" class="noList" />
      <view class="padding">暂无收藏～</view>
    </div>
		<view class="cu-list menu-avatar" v-else>
			<view v-for="(item,index) in goodsList" :key="index" class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''"  @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-'+index">
				<view class="cu-avatar lg" :style="{'background-image':'url('+item.cover+')'}" @click="goDetail(item.aliasId,item.merchantId)"></view>
				<view class="content" @click="goDetail(item.aliasId,item.merchantId)">
					<text class="text-black descp">{{item.name}}</text>
					<view class="price">
						<text class="text-red text-lg margin-right-xs">{{item.priceStr}}</text> 
						<text class="text-grey old-price text-sm">{{item.showPriceStr}}</text> 
					</view>
				</view>
				<view class="move">
					<view class="bg-orange" v-if="item.isCollection">已收藏</view>
					<view class="bg-grey" @click="collect(item.id,item.productId,index)" v-else>收藏</view>
					<view class="bg-red" @click="deleted(item.id,index)">删除</view>
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
				ListTouchDirection:"",
				ListTouchStartValue:"",
				modalName:"",
				goodsList:[],
				downIndex:0
			};
		},
		computed:{
			...mapState(["isLogin" , "userInfo"]),
		},
		methods: {
			formatDate(now) { 
				var year=now.getFullYear(); 
				var month=now.getMonth()+1; 
				var date=now.getDate(); 
				var hour=now.getHours(); 
				var minute=now.getMinutes(); 
				return year+"-"+month+"-"+date
			},
			goDetail(id,merchantId){
				wx.navigateTo({
					url: '/pages/goodsDetail/main?id=' + id + "&merchantId=" + merchantId,
				})
			},
			getInfo(){
				this.$fly.config.headers = {
					"X-Tag": "flyio",
					Authorization: this.userInfo.token,
				};
				this.$fly.post('/footprint/query',{"offset":0,"limit":10}).then(res => {
					res.data.data.forEach((item)=>{
						item.createAt = this.formatDate(new Date(item.createAt))
					})
					this.goodsList = res.data.data;
          this.downIndex=1
				})
			},
			getInfoLoad(){
				if(this.downIndex==0){
          this.goodsList = []
				}
				var that = this;
				this.$fly.config.headers = {
					"X-Tag": "flyio",
					Authorization: this.userInfo.token,
				};
				var params = {"offset":that.downIndex*10,"limit":10}
				this.$fly.post('/footprint/query',params).then(res => {
					if(res.data.data.length==0){
            wx.showToast({
              title: '没有更多啦~~',
              icon: 'none'
            })
            return;
					}
					res.data.data.forEach((item)=>{
						item.createAt = this.formatDate(new Date(item.createAt))
					})
          this.goodsList.push.apply(this.goodsList,res.data.data);
          this.downIndex++;
				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.ListTouchStartValue = e.pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.ListTouchDirection = e.pageX - this.ListTouchStartValue > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.ListTouchDirection =='left'){
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.ListTouchDirection = null
			},
			//收藏 
			collect(id,productId,index){
				this.$fly.config.headers = {
					"X-Tag": "flyio",
					Authorization: this.userInfo.token,
				};
				var that = this;
				this.$fly.post('/footprint/collect',{"footprintIds":[id],"productIds":[productId]}).then(res => {
					if(res.data.success){
						wx.showToast({
							title: '收藏成功',
							success: function(){
								that.goodsList[index].isCollection = true
							}
						})
					}
				})
			},
			//删除
			deleted(id,index){
				this.$fly.config.headers = {
					"X-Tag": "flyio",
					Authorization: this.userInfo.token,
				};
				var that = this;
				this.$fly.post('/footprint/delete',{"ids":[id]}).then(res => {
					wx.showToast({
						title: '删除成功',
						success: function(){
							that.goodsList.splice(index,1)
						}
					})
				})
			},
		},
		onLoad(){
			this.goodsList = [];
			this.getInfo()
		},
		onReachBottom() {
      // 上拉加载更多
      this.getInfoLoad()
    },
	}
</script>

<style lang='scss'>
/* 空购物车 */
page, .card-page{
	height: 100%;
	background: #fff;
}
.cu-list.menu-avatar>.cu-item .content {
	width: calc(100% - 160rpx - 60rpx - 20rpx);
	left: 210rpx;
	height: 160rpx;
}
.descp {
	line-height: 1.2;
}
.cu-list.menu-avatar>.cu-item {
	height: 200rpx;
}
.cu-list.menu-avatar>.cu-item>.cu-avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 10rpx;
}
.price {
	position: absolute;
	bottom: 0;
}
.price .old-price {
	text-decoration: line-through;
}
.noList {
	width: 596rpx;
	height: 328rpx;
	margin-top: 200rpx;
}
.contain {
	height: 100%;
	text-align: center;
}

</style>
