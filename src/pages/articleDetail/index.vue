<template>
  <div>
    <swiper class="screen-swiper" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
      duration="500">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <image :src="item?item:'/static/images/default.png'" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <view class="live_ul cf">
      <view class="article solid-bottom live_li" v-for="(item, index) in videList" :key="index" :class="index%2==0?'fl':'fr'" v-show="item.live_status!=107">
        <view class="shadow padding-bottom">
          <view class="imgBox" @click="goLive(item.roomid)">
            <view class="round liveStatus text-center">
              <text class="cuIcon-radiobox lg text-blue"></text>
              {{item.statusName}}
            </view>
            <image :src="item.cover_img?item.cover_img:'/static/images/default.png'" class="coverImg" mode="widthFix"></image>
            <image src="/static/images/play.png" class="playImg" mode="widthFix"></image>
          </view>
          <view class="text-center live_name">
            {{item.name}}
          </view>
          <button open-type="share" class="round shareBtn text-center" hover-class="none" :data-index="index">
            <image src="/static/images/share.png" class="shareImg" mode="widthFix"></image>
            分享
          </button>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
  import { formatDate,formatTime } from '@/utils/index'
  import Banners from '@/components/banners'
  import card from '@/components/card'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    components: {
      Banners
    },
    computed: {
      ...mapState([
        'userInfo',
        'isLogin'
      ]),
    },
    data() {
      return {
        motto: 'Hello miniprograme',
        swiperList: [
          'https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/1.png',
         'https://zcyj-icon.oss-cn-hangzhou.aliyuncs.com/imgs/2.png'
        ],
        videList:[]
      }
    },

    components: {
      card
    },
    onLoad() {
      this.getRoomList()
    },
    onPullDownRefresh() {
      // 下拉刷新
      this.getRoomList()
      wx.stopPullDownRefresh()
    },
    onShow(){
      
    },
    onShareAppMessage(e){
      let customParams = encodeURIComponent(JSON.stringify({
        path: 'pages/articleDetail/index',
        pid: 1
      }))
      let roomId = this.videList[e.target.dataset.index].roomid;
      var url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`;
      return {
        title: this.videList[e.target.dataset.index].name,
        path: url,
        imageUrl: this.videList[e.target.dataset.index].cover_img,
        success: function (res) {},
        console: function (res) {}
      }
    },
    methods: {
      ...mapMutations(["update"]),
      getRoomList(){
        //  var appid = "wx3fe71aea5a30b03c";
        //   var secret = "59233288a5cff790065d3b431e3097ec";
        //   this.$fly.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret).then(res => {
               //console.log(res)
               //if(res.data.access_token){
                  this.$fly.get('/liveStreaming/roomList').then(res2 => {
                    
                           var rommList = JSON.parse(res2.data.data)
                           // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
                           rommList.room_info.forEach((item,index)=>{
                                 item.start_time=formatTime (new Date(item.start_time*1000))
                                 item.end_time=formatTime (new Date(item.end_time*1000))
                                 if(item.live_status==101){
                                   item.statusName = "直播中";
                                 }else if(item.live_status==102){
                                   item.statusName = "未开始";
                                 }else if(item.live_status==103){
                                   item.statusName = "回放";
                                 }
                           })
                           this.videList=rommList.room_info
                  })
               //}
        //})
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
    }
  }

</script>

<style scoped>
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
    background: #fa436a;
    color: #fff;
    font-size: 32rpx;
    border-radius: 100px;
  }
  .position {
    position: relative;
    padding: 0;
  }
  .position image {
    width: 180rpx;
    height: 180rpx;
  }
  .statusName {
    color: rgb(243, 234, 234);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .live_ul {
    padding: 20rpx;
  }
  .live_li {
    width: 344rpx;
    height: 662rpx;
    border-radius: 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    overflow: hidden;
  }
  .coverImg {
    width: 100%;
  }
  .imgBox {
    height: 520rpx;
    overflow: hidden;
    position: relative;
  }
  .live_name {
    font-size: 24rpx;
    color: #323232;
    margin: 20rpx 0;
  }
  .playImg {
    width: 80rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .shareBtn {
    width: 140rpx;
    height: 40rpx;
    color: #E54148;
    border: 1px solid #E54148;
    margin: 0 auto;
    font-size: 22rpx;
    padding: 0;
    line-height: 38rpx;
    background-color: #fff;
  }
  .shareBtn .shareImg {
    width: 22rpx;
    margin-right: 6rpx;
    vertical-align: -3rpx;
  }
  .liveStatus {
    background-color: rgba(0, 0, 0, .1);
    color: #fff;
    line-height: 30rpx;
    display: inline-block;
    padding: 0 10rpx;
    position: absolute;
    left: 10rpx;
    top: 10rpx;
    z-index: 999;
    font-size: 20rpx;
  }
  .cuIcon-radiobox {
    font-size: 22rpx;
  }
</style>
