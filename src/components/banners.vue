<template>
	<!-- banner -->
	<swiper class="bannerSwiper square-dot" :indicator-dots="true" :circular="true"
		:autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
		indicator-active-color="var(--red)">
		<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''" >
			<view class="swiper-item"  @tap="goContent(item.url,item.paths)">
				<image :src="item.imgUrl?item.imgUrl:'/static/images/default.png'"></image>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
export default {
	data() {
		return {
			cardCur: 0,
			swiperList:[]
		}
	},
	onLoad() {
	  this.getBanners();
		//this.TowerSwiper(swiperList);
	},
	onPullDownRefresh() {
    // 下拉刷新
    this.getBanners();
  },
  	methods: {
		getBanners() {	
			this.$fly.get('/banners').then(res => {	
				this.swiperList = res.data.data
			})			
		},
		getJianHuo(info){
			this.jianhuoInfo = info;
		},
		goContent(urls,paths) {
			if(paths.indexOf("seckill")>0){
				wx.navigateTo({url: '/pages/seckill/main'})
			}else if(urls){
				if(urls.indexOf('roomId')!=-1){
					this.goLive(urls.substring(urls.lastIndexOf("\=")+1,urls.length))
				}else if(urls.indexOf('articleId=34')!=-1){
					wx.navigateTo({ url: '/pages/introduce/main?name=红包' });
				}else{
					wx.navigateTo({url: '/pages/content/main?url=' + encodeURIComponent(JSON.stringify(urls))})
				}
			}else if(paths.indexOf("virtualId")>0){
				var id = '';
				if(paths.lastIndexOf("\=")!=-1){
					id = paths.substring(paths.lastIndexOf("\=")+1,paths.length);
				}
				wx.navigateTo({
					url: '/pages/itemList/main?id=' + id 
				})
			}else if(paths.indexOf("productDetail")>0){
				var id = '';
				if(paths.lastIndexOf("\=")!=-1){
					id = paths.substring(paths.lastIndexOf("\=")+1,paths.length);
				}
				wx.navigateTo({
				url: '/pages/goodsDetail/main?id=' + id + '&merchantId=0'
				})
			}else if (paths.indexOf("topGoods") != -1) {//跳转活动专区
        wx.navigateTo({ url: '/pages/dayGoods/main?imgUrl='+ this.jianhuoInfo.imgUrl +'&&name=' + this.jianhuoInfo.title + '&virtualId=' + this.jianhuoInfo.id });
      }else{
				return
			}	
		},
		goLive(room_id) {
			let roomId = room_id // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
			let livePlayer = requirePlugin('live-player-plugin')
			livePlayer.getLiveStatus({
				room_id: roomId
			})
			.then(res => {
				// 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
				const liveStatus = res.liveStatus
				console.log('get live status', liveStatus)
			})
			.catch(err => {
				console.log('get live status', err)
			})
			let customParams = encodeURIComponent(JSON.stringify({
			path: 'pages/articleDetail/index',
			pid: 1
			})) 
			wx.navigateTo({
			url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
			})
		},
		// banner特效
		// cardSwiper
		cardSwiper(e) {
			this.cardCur = e.mp.detail.current
		},
		// towerSwiper
		// 初始化towerSwiper
		TowerSwiper(name) {
			let list = this[name];
			for (let i = 0; i < list.length; i++) {
				list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
				list[i].mLeft = i - parseInt(list.length / 2)
			}
			this.swiperList = list
		},

		// towerSwiper触摸开始
		TowerStart(e) {
			this.towerStart = e.touches[0].pageX
		},
		// towerSwiper计算方向
		TowerMove(e) {
			this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
		},
		// towerSwiper计算滚动
		TowerEnd(e) {
			let direction = this.direction;
			let list = this.swiperList;
			if (direction == 'right') {
				let mLeft = list[0].mLeft;
				let zIndex = list[0].zIndex;
				for (let i = 1; i < this.swiperList.length; i++) {
					this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
					this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
				}
				this.swiperList[list.length - 1].mLeft = mLeft;
				this.swiperList[list.length - 1].zIndex = zIndex;
			} else {
				let mLeft = list[list.length - 1].mLeft;
				let zIndex = list[list.length - 1].zIndex;
				for (let i = this.swiperList.length - 1; i > 0; i--) {
					this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
					this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
				}
				this.swiperList[0].mLeft = mLeft;
				this.swiperList[0].zIndex = zIndex;
			}
			this.direction = ""
			this.swiperList = this.swiperList
		},
  }
}
</script>

<style>
.card-swiper{
	background: #fff;
}
.bannerSwiper {
	height: 420rpx;
	margin: 0;
}
.bannerSwiper .swiper-item {
	height: 400rpx;
	overflow: hidden;
	width: 710rpx;
	margin: 20rpx auto;
	margin-bottom: 0;
}
</style>
