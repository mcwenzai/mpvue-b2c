<template>
	<view class="card-page">
		<div class="mine cf">
			<div class="div-img fl">
				<img class="myHead round" :src="userlist.avatar==''?'/static/images/person.png':userlist.avatar" />
			</div>
			<div class="fl">
				<p class="myName">{{userlist.nickname}}</p>
				<p class="info">
					邀请人数：<span class="span1 text-red">{{userlist.totalInviteNumber}}人</span>
					我的积分：<span class="text-red">{{userlist.points}}</span>
				</p>
			</div>
		</div>
		<view class="cu-card article no-card solid-bottom" >
			<div class="coupon">
				
				<div class="other cf"  v-for="(item, index) in userlist.inviteUsers" :key="index">
					<div class="div-img fl">
						<img class="myHead round" :src="item.avatar==''?'/static/images/person.png':item.avatar" />
					</div>
					<div class="fl">
						<p class="myName">{{item.nickname}}</p>
						<p class="info">
							<span class="text-grey">{{item.phone}} ({{item.createAt}})</span>
						</p>
					</div>
				</div>
			</div>
				
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
				TabCur: 0,
				scrollLeft: 0,
				desc: '暂无可用优惠券~',
				userlist:[],//存储用户其他信息
				
			};
		},
		computed:{
			...mapState(["isLogin", "cartCount", "userInfo"]),
		},
		onShow(){
      // 查看是否授权
      if (!this.isLogin) {
        wx.redirectTo({
          url: "/pages/prelogin/main"
        });
      }
    },
		methods: {
			getInfo() {
				this.$fly.config.headers = {
					"X-Tag": "flyio",
					Authorization: this.userInfo.token
				};
				this.$fly.get('/users/invite-users').then(res => {
					res.data.data.inviteUsers.forEach((item,index)=>{
						item.createAt = this.formatDate(new Date(item.createAt));
					})
					this.userlist=res.data.data
				})
			},
			formatDate(now) { 
				var year=now.getFullYear(); 
				var month=now.getMonth()+1; 
				var date=now.getDate(); 
				var hour=now.getHours(); 
				var minute=now.getMinutes(); 
				return year+"-"+month+"-"+date+" "+hour+":"+minute; 
			} 
		},
		onLoad(){
			this.getInfo()
		},
		onPullDownRefresh(){
			this.getInfo()
		}
	}
</script>

<style lang='scss'>
/* 空购物车 */
page, .card-page{
	height: 100%;
	background: #fff;
}
.contain{
	height: 100%;
	text-align: center;
}
.noList{
	width: 596rpx;
	height: 328rpx;
	margin-top: 200rpx;
}
.cu-btn{
	border-radius: 0;
	padding: 0 80rpx;
}

//------------------------------
.myHead {
	width: 86rpx;
	height: 86rpx;
	margin-right: 30rpx;
}
.ivHead {
	width: 80rpx;
	height: 80rpx;
	margin-right: 30rpx;
}
.coupon{
	width: 100%;
}
.mine{
	width: 710rpx;
	background-color: #fff;	
	margin: 0 auto;
	border-radius: 20rpx;
	height: 166rpx;
	padding: 38rpx 30rpx 42rpx 30rpx;
	margin-top: 20rpx;
	box-shadow: 0 0 20rpx rgba(34, 34, 34,.1);
	margin-bottom: 20rpx;
	position: fixed;
	left: 20rpx;
	z-index: 9;
}
.myName {
	font-size: 26rpx;
	font-weight: bold;
	line-height: 2;
}
.info {
	font-size: 24rpx;
}
.other {
	width: 650rpx;
	padding: 20rpx 0;
	margin: 0 auto;
	border-bottom: 2rpx solid #F8F8F8;
}
.article {
	padding-top: 206rpx;
}
</style>
