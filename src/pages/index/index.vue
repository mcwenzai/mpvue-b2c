<template>
  <view class="bg">
    <view class="logoBox">
      <image
        :src="topBannerUrl?topBannerUrl:'/static/images/default.png'"
        class="logo"
        mode="widthFix"
      ></image>
      <view class="mTitle text-white position" :style="{'margin-top':MenuButtonInfo+'px',}">晓百合智慧商城</view>
      <view class="bgJianB position">
        <!-- 这是搜索 -->
        <view class="search position cf">
          <view class="search-form fl">
            <text class="cuIcon-search"></text>
            <input
              adjust-position="false"
              confirm-type="search"
              placeholder="商品名称"
              name="search"
              v-model="searchName"
              @confirm="submit"
            />
          </view>
          <button class="cu-btn bg-white text-red fl searchBtn" @click="submit">
              搜索
          </button>
          <image src='/static/images/shareBtn.png' class="shareBtn" @click="shareCode"></image>
        </view>
        <!-- 导航栏目 -->
        <view class="cu-card no-card navChange card_cateBox card_cateBoxbox">
          <scroll-view
            scroll-x
            class="nav"
            scroll-with-animation
            :scroll-left="scrollLeft"
            scroll-anchoring="true"
            @scroll="scrollMove"
          >
            <!-- <view class="boxView"> -->
            <view
              class="cu-item tabs"
              :id="'v'+index"
              v-for="(item, index) in nav"
              :key="index"
              @tap="tabSelect(index, item.id)"
              :data-id="index"
            >
              <view class="tabs-item text-df">
                <view class="position" :class="[index == activeId ? 'bgcTabs' : 'bgcTabs_fw']">{{
                  item.subTitle
                }}</view>
              </view>
            </view>
            <!-- </view> -->
          </scroll-view>
        </view>
      </view>
    </view>
    

    <view v-show="(activeId==0)">
      <!-- banner -->
      <Banners  ref="banners"></Banners>

      <!-- 分类 -->
      <swiper
        class="item-swiper square-dot"
        :indicator-dots="true"
        :circular="true"
        indicator-color="#8799a3"
        indicator-active-color="var(--red)"
        :autoplay="false"
      >
        <swiper-item
          class="cu-list grid no-border"
          v-for="(item, index) in cuIconList"
          :key="index"
        >
          <view
            class="cu-item width20"
            v-for="(itemList, indexList) in item"
            :key="indexList"
            @tap="goUrl(itemList.paths, itemList.name)"
          >
            <image
              :src="itemList.imgUrl?itemList.imgUrl:'/static/images/default.png'"
              class="itemIcon"
              mode="aspectFill"
            ></image>
            <text>{{ itemList.name }}</text>
          </view>
        </swiper-item>
      </swiper>

      <!-- 中部广告 -->
      <image
        :src="midBannerUrl?midBannerUrl[0].imgUrl:'/static/images/default.png'"
        mode="widthFix"
        class="midBar"
        @click="goContent( midBannerUrl[0].url,midBannerUrl[0].paths)"
        v-if="midBannerUrl.length>0">
      </image>
      <view class="sharp margin-bottom-xm bg-white margin-bottom-xs" v-if="topGoods.length">
        <!-- 尖货 -->
        <view class="margin-bottom-xs cf">
          <text class="text-black text-bold fs30">{{jianhuoInfo.title}}</text>
          <text class="text-xs margin-left-xs">{{jianhuoInfo.subTitle}}</text>
          <text class="fr" @click="goNewList(jianhuoInfo)">更多</text>
        </view>
        <scroll-view scroll-x>
          <view class="goodsItem position" v-for="(item,index) in topGoods" :key="index" @click="goDetail(item.alias,item.merchantId,item.typeValueText)">
            <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
            <view class="text-cut title1">{{item.name}}</view>
            <view class="title2 text-red"><text class="text-price"></text>{{item.priceStr}}</view>
            <view class="title3 text-grey"><text class="text-price"></text>{{item.showPriceStr}}</view>
            <view
              class="cu-btn cu-avatar bg-red round addCar"
              @tap.stop="addGoods(item, 0)"
              data-target="ChooseModal"
            >
              <text class="cuIcon-cart"></text>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 专区 -->
      <view class="prefecture cf bg-white margin-bottom-xs">
        <view class="fl areaZone">
          <view class="position" @click="navigate('areaZone')">
            <view class="title1 text-black">地理标志</view>
            <view class="title2 text-grey">当地最具特色产品</view>
            <view class="text-sm text-bold text-red">立即进入</view>
            <image src="/static/images/prefecture.png" mode="widthFix" class="pic"></image>
          </view>
          <view class="position" @click="navigate('sourceArea')">
            <view class="title1 text-black">原产地专区</view>
            <view class="title2 text-grey">原地发货到你身边</view>
            <view class="text-sm text-bold text-red">立即进入</view>
            <image src="/static/images/prefecture1.png" mode="widthFix"></image>
          </view>
        </view>
        <view class="fr hotZone" @click="goMember()">
          <view class="title1 text-red">社员专区 <text class="hot bg-red text-center">hot</text></view>
          <view class="title2 text-grey">自购省钱 分享赚钱</view>
          <view class="cf">
            <view class="fl imgBox position" v-for="(item,index) in memberList" :key="index"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
          </view>
        </view>
      </view>
      <view class="sharp margin-bottom-xm bg-white">
        <view class="cf flagship flex">
          <view class="fl flex-sub" @click="goNewList(qijianInfo)" v-if="qijianList.length">
            <view class="cf title">
              <text class="fl title1 text-bold text-red">百荷旗舰</text>
              <text class="fr text-xs text-grey">更多</text>
            </view>
            <view class="text-xs">体验一站式购物</view>
            <view class="cf">
              <view class="fl w50" v-for="(item,index) in qijianList" :key="index">
                <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
                <view class="text-center">
                  <text class="text-red text-lg margin-right-xs"><text class="text-price"></text>{{item.priceStr}}</text>
                  <text class="text-grey text-xs"><text class="text-price"></text>{{item.showPriceStr}}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="fl flex-sub" @click="goNewList(baokuanInfo)" v-if="baokuanList.length">
            <view class="cf title">
              <text class="fl title1 text-bold text-red">{{baokuanInfo.title}}</text>
              <text class="fr text-xs text-grey">更多</text>
            </view>
            <view class="text-orange text-xs">预售时间：{{baokuanInfo.startDate}}-{{baokuanInfo.endDate}}</view>
            <view class="cf">
              <view class="fl w50" v-for="(item,index) in baokuanList" :key="index">
                <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
                <view class="text-center">
                  <text class="text-red text-lg margin-right-xs"><text class="text-price"></text>{{item.priceStr}}</text>
                  <text class="text-grey text-xs"><text class="text-price"></text>{{item.showPriceStr}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 商品-->
    <!-- <view
      class="cu-card article no-card solid-bottom card_cateBox"
      v-for="(item, index) in goodsList"
      :key="index"
    >
      <view
        class="cu-item cu-choose shadow padding-tb"
        @click="goDetail(item.alias, item.merchantId)"
      >
        <view class="content">
          <image :src="item.cover" mode="widthFix"></image>
          <view class="desc">
            <view class="text-cut" style="width: 450rpx;">{{ item.name }}</view>
            <view class="text-xs text-gray margin-xs">{{ item.brandName }}</view>
            <view>
              <text v-for="(itemList,indexList) in item.tages" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
            </view>
            <view class="flex align-end justify-between">
              <view class="margin-top-sm">
                <view class="text-price text-xl text-red margin-right">{{
                  item.priceStr
                }}</view>
              </view>
              <view
                class="cu-btn cu-avatar bg-red round"
                @tap.stop="addGoods(item, 0)"
                data-target="ChooseModal"
              >
                <text class="cuIcon-cart"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view> -->
    <view class="text-df padding-sm text-red" v-show="(activeId==0)">精选好物</view>
    <view class="goodList cf">
      <view class="goodItem" v-for="(item,index) in goodsList" :key="index" :class="index%2==0?'fl':'fr'" @click="goDetail(item.alias,item.merchantId)">
        <view class="imgBox position"><image :src="item.cover?item.cover:'/static/images/default.png'" mode="aspectFill"></image></view>
        <view class="padding-lr-xs">
          <view class="text-cut margin-bottom-xs margin-top-xs">{{item.name}}</view>
          <view class="tagList">
            <text v-for="(itemList,indexList) in item.tages" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
          </view>
          <view class="price cf margin-tb-sm">
            <view class="fl text-red text-bold text-xl">
              <text class="text-price"></text> {{item.priceStr}}
            </view>
            <view class="text-grey fr text-xs">销量：{{item.soldNumber}}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 多规格弹窗 -->
    <GoodsModal ref="goodsModal"></GoodsModal>
    <!-- 客服按钮 -->
    <view class="iconfont icon-kefu kefu" @click="showPhone"></view>
    <!-- 邀请弹窗 -->
    <view class="popUp" v-if="showPop">
      <view class="position">
        <text class="close cuIcon-close lg text-white" @click="close"></text>
        <image
          src="/static/images/activety.png"
          mode="widthFix"
          class="popUpBg"
          >
        </image>
        <view class="mainBox text-center">
          <view class="text-white title1">邀请用户</view>
          <image
            :src="shareImgUrl"
            mode="widthFix"
            lazy-load="false">
          </image>
          <view class="text-white title2">邀请码：{{userInfo.inviteCode}}</view>
          <view class="bg-white bottomBox">
            <view class="button margin-bottom-xs" @click="saveImg" v-if="openSettingBtnHidden">保存图片</view>
            <button class='button margin-bottom-xs bg-white' open-type="openSetting" @click="handleSetting" v-else>授权</button>
            <view class="button margin-bottom-xs bg-red" @click="navigate('invited')">我的邀请</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 首页弹窗 -->
    <view class="popUp" v-if="showPop1">
      <view class="position text-center">
        <text class="close cuIcon-close lg text-white" @click="close"></text>
        <image
          :src="activeWindow?activeWindow:'/static/images/active.png'"
          class="popUpBg2"
          mode="widthFix"
          @click="goUrl('introduce','活动')"
          >
        </image>
        <!-- <image
          src="/static/images/activeBtn.png"
          mode="widthFix"
          class="activityBtn"
          @click="goUrl('introduce','活动')"
          >
        </image> -->
      </view>
    </view>
  </view>
</template>

<script>
import { moneyFormat } from "@/utils/index";
import { base64src } from '@/utils/base64src'
import GoodsModal from "@/components/goodsModal";
import Banners from "@/components/banners";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    GoodsModal,
    Banners,
  },
  data() {
    return {
      modalStocksIndex: 0,
      modalCuont: 1,
      showPop: false,
      showPop1: false,
      openSettingBtnHidden:true,
      modalName: null,
      modalStocks: [
        {
          price: "",
        },
      ],
      scrollLeft:"",
      topBannerUrl:"",
      midBannerUrl:"",
      modalGood: {},
      direction: "",
      memberList: [],
      cuIconList: [],
      goodsList: [],
      topGoods: [],
      jianhuoInfo:"",
      qijianInfo:"",
      baokuanInfo:"",
      baokuanList:[],
      shareImgUrl:"",
      qijianList:[],
      downIndex: 0,
      searchName: '',
      activeWindow:'',
      nav: [],
      // tab栏切换
      activeId: 0,
      MenuButtonInfo:"48",
      animation:{}
    };
  },
  onShow(){
    this.searchName = '';
    this.MenuButtonInfo = wx.getMenuButtonBoundingClientRect().top
  },
  onLoad() {
    this.getNavList();
    this.getCuIconList();
    this.getBanner();
    this.getActiveBanner();
    this.getInfos();
    var that = this;
    let scrollInfo = {
      prevDistance: 0,
      screenHalfwidth: wx.getSystemInfoSync().windowWidth / 2,
    };
    this.scrollInfo = scrollInfo;
    // setTimeout(function () {
    //   that.showPop = false;
    // }, 3000);
  },
  mounted() {},
  computed: {
    ...mapState(["cartList", "userInfo","isLogin"]),
  },
  onPullDownRefresh() {
    // 下拉刷新
    // this.tabSelect(0, this.nav[0].id);
    this.getNavList();
    this.getBanner();
    this.getCuIconList();
    this.getInfos();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage() {
    return {
      title: '晓百合智慧商城',
      path: '/pages/index/main',
      success: res => {},
      fail: () => {},
      complete: () => {}
    };
  },
  onReachBottom() {
    // 上拉加载更多
    this.getGoodsList(this.nav[this.activeId].id);
  },
  methods: {
    ...mapMutations(["update"]),
    // 小程序 点击搜索 按钮时  事件
    submit: function (data) {
      let keyWord = this.searchName;
      if (keyWord) {
        wx.navigateTo({
          url: `/pages/goodsList/main?name=${keyWord}`,
        });
      }
    },
    close() {
      this.showPop = false;
      this.showPop1 = false;
    },
    shareCode(){//生成二维码
      if(!this.isLogin){
        wx.navigateTo({ url: '/pages/prelogin/main' });
        return
      }
      // if(this.shareImgUrl){
      //   this.showPop = true;
      //   return;
      // }
      this.$fly.get("/liveStreaming/createPicture?scene="+this.userInfo.inviteCode+"&path=pages/inviteCode/main")
      .then((res) => {
        /// 获取到base64Data
        var base64Data = res.data.data;
        /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
        base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
        var base64ImgUrl = "data:image/png;base64," + base64Data;
        base64src(base64ImgUrl, res => {
          console.log(res) // 返回图片地址，直接赋值到image标签即可
          this.shareImgUrl = res;
          this.showPop = true;
        });
      });
    },
    saveImg:function(e){
      let that = this;
      //获取相册授权
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                //这里是用户同意授权后的回调
                that.saveImgToLocal();
              },
              fail() {//这里是用户拒绝授权后的回调
                that.openSettingBtnHidden = false
              }
            })
          } else {//用户已经授权过了
            that.saveImgToLocal();
          }
        }
      })

    },
    saveImgToLocal: function (e) {
      let that = this;
      let imgSrc = that.shareImgUrl;
      console.log(imgSrc);
      wx.saveImageToPhotosAlbum({
        filePath: imgSrc,
        success: function (data) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        },
      })
    },
    // 授权
    handleSetting: function (e) {
      let that = this;
      that.openSettingBtnHidden = true
    },
    getInfos(){//获取每日尖货、百合旗舰、爆款
      this.$fly.get("/products/virtual/queryProductByName?name=社员专区&offset=0&limit=2 ")//社员专区
      .then((res) => {
        this.memberList = res.data.data;
      });
      this.$fly.get("/products/topgoods/queryTopGoods")//每日尖货
      .then((res) => {
        this.jianhuoInfo = res.data.data[0];
        this.$refs.banners.getJianHuo(this.jianhuoInfo)
        this.$fly.get("/products/topgoods/queryProduct?virtualId="+res.data.data[0].id+"&offset=0&limit=10")
        .then((resp) => {
          resp.data.data.forEach(item=>{
            item.priceStr = item.priceStr.replace(/.00/g, '');
            item.showPriceStr = item.showPriceStr.replace(/.00/g, '');
            var priceStr = item.priceStr.split('-');
            var showPriceStr = item.showPriceStr.split('-');
            item.priceStr = priceStr[0];
            item.showPriceStr = showPriceStr.length>1?showPriceStr[1]:showPriceStr[0];
            if(item.types==1){
              var list = item.typeValue.split(',');
              item.typeValueText = '满'+list[0]+'件'+(list[list.length-1]*10).toFixed(2)+'折'
            }else if(item.types==2){
              item.typeValueText = '第二件半价'
            }else if(item.types==3){
              var list = item.typeValue.split(',');
              item.typeValueText = '满'+list[0]+'减'+list[list.length-1]
            }
          })
          this.topGoods = resp.data.data;
          console.log(this.topGoods);
        });
      });
      this.$fly.get("/products/flagship/queryFlagship")//百合旗舰
      .then((res) => {
        this.qijianInfo = res.data.data[0];
        this.qijianInfo.title = '百荷旗舰'
        this.$fly.get("/products/flagship/queryProduct?virtualId="+res.data.data[0].id+"&offset=0&limit=2")
        .then((resp) => {
          this.qijianList = resp.data.data;
          this.qijianList.forEach(item=>{
            item.priceStr = item.priceStr.replace(/.00/g, '');
            item.showPriceStr = item.showPriceStr.replace(/.00/g, '');
            var priceStr = item.priceStr.split('-');
            var showPriceStr = item.showPriceStr.split('-');
            item.priceStr = priceStr[0];
            item.showPriceStr = showPriceStr.length>1?showPriceStr[1]:showPriceStr[0];
          })
        });
      });
      this.$fly.get("/products/hot/queryHot")//爆款
      .then((res) => {
        this.baokuanInfo = res.data.data[0];
        this.baokuanInfo.startDate = this.getDate(new Date(this.baokuanInfo.startTime));
        this.baokuanInfo.endDate = this.getDate(new Date(this.baokuanInfo.endTime));
        this.$fly.get("/products/hot/queryProduct?virtualId="+res.data.data[0].id+"&offset=0&limit=2")
        .then((resp) => {
          this.baokuanList = resp.data.data;
          this.baokuanList.forEach(item=>{
            item.priceStr = item.priceStr.replace(/.00/g, '');
            item.showPriceStr = item.showPriceStr.replace(/.00/g, '');
            var priceStr = item.priceStr.split('-');
            var showPriceStr = item.showPriceStr.split('-');
            item.priceStr = priceStr[0];
            item.showPriceStr = showPriceStr.length>1?showPriceStr[1]:showPriceStr[0];
          })
        });
      });
    },
    getGoodsList(virtualId) {
      if (this.downIndex == 0) {
        this.goodsList = [];
      }
      this.$fly
        .get(
          "/products/virtual/queryProduct?virtualId=" +
            virtualId +
            "&offset=" +
            this.downIndex * 10 +
            "&limit=10"
        )
        .then((res) => {
          if (res.data.data.length == 0) {
            wx.showToast({
              title: "没有更多啦~~",
              icon: "none",
            });
            return;
          }
          this.goodsList.push.apply(this.goodsList, res.data.data);
          this.downIndex++;
        });
    },
    getDate(now) { 
      var year=now.getFullYear(); 
      var month=this.addZero(now.getMonth()+1);
      var date=this.addZero(now.getDate());
      var hour=this.addZero(now.getHours()); 
      var minute=this.addZero(now.getMinutes());
      var second=now.getSeconds();
      return month+"."+date;
    },
    addZero(i){
      return i < 10 ? "0" + i: i + "";
    },
    getCuIconList() {
      this.$fly.get("/entrances").then((res) => {
        this.cuIconList = this.spArray(10, res.data.data);
      });
    },
    getBanner(){//首页banner
      this.$fly.get("/getBanner?id=1").then(res => {
        this.midBannerUrl = res.data.data
      })
      this.$fly.get("/getBanner?id=8").then(res => {
        if(res.data.data.length>0){
          this.topBannerUrl = res.data.data[0].imgUrl
        }
      })
    },
    getActiveBanner(){//活动banner
      this.$fly.get("/getBanner?id=9").then(res => {
        if(res.data.data.length>0){
          this.activeWindow = res.data.data[0].imgUrl;
          this.showPop1 = true;
        }
      })
    },
    showPhone(){//获取客服电话
      wx.showModal({
        title: '客服热线：17352850084', //提示的标题,
        content: '值班时间：早上8:30-21:30', //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        confirmText: '拨打', //确定按钮的文字，默认为取消，最多 4 个字符,
        success: res => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: '17352850084'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    },
    //获取类目的宽高
    getRect: function (index) {
      let that = this;
      let query = wx.createSelectorQuery();
      if(index!=0){
        query
        .select("#v" + index)
        .boundingClientRect(function (rect) {
          that.scrollInfo.subLeft = rect.left; //元素一半宽度
          that.scrollInfo.subHalfWidth = rect.width / 2;
          that.moveTo();
        })
        .exec();
      }
    },
    //移动导航栏
    moveTo: function () {
      let subLeft = this.scrollInfo.subLeft;
      let subHalfWidth = this.scrollInfo.subHalfWidth;
      let prevDistance = this.scrollInfo.prevDistance;
      let screenHalfwidth = this.scrollInfo.screenHalfwidth;
      let needScroll = subLeft - screenHalfwidth + subHalfWidth;
      let scrollLeft = needScroll + prevDistance;
      this.scrollLeft = scrollLeft
    },
    //记录滚动的距离
    scrollMove: function (e) {
      let distance = e.target.scrollLeft;
      this.scrollInfo.prevDistance = distance;
    },
    tabSelect(index, virtualId) {
      this.activeId = index;
      this.downIndex = 0;
      this.getRect(index);
      this.getGoodsList(virtualId);
    },
    getNavList() {
      this.$fly.config.headers = {
        async: false,
      };
      this.$fly.get("products/virtual/queryByApp").then((res) => {
        var result = res.data.data.filter(function(item) {return item.title != "百荷旗舰";});
        this.nav = result;
        this.tabSelect(0, this.nav[0].id);
        ////console.log("nav==="+this.nav)
      });
    },

    spArray(N, Q) {
      var R = [],
        F;
      for (F = 0; F < Q.length; ) {
        R.push(Q.slice(F, (F += N)));
      }
      return R;
    },

    goDetail(id, merchantId, typeValueText) {
      if(typeValueText){
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}&typeValueText=${typeValueText}`
        });
      }else{
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`,
        });
      }
    },
    goItem() {
      wx.navigateTo({
        url: '/pages/itemList/main?name=新人专享&id=10029'
      })
    },
    addGoods(goods) {
      //
      this.$fly
        .get("/products/" + goods.alias + "?merchantId=" + goods.merchantId)
        .then((res) => {
          this.$refs.goodsModal.showModal(res.data.data);
        });
    },
    navigate(name){
      wx.navigateTo({ url: '/pages/'+name+'/main' });
    },
    goMember(){
      wx.navigateTo({ url: '/pages/dayGoods/main?name=社员专区&virtualId=' });
      // wx.navigateTo({ url: '/pages/bargainList/main' });
    },
    goNewList(item){//尖货，爆款
      wx.navigateTo({ url: '/pages/dayGoods/main?imgUrl='+ item.imgUrl +'&&name=' + item.title + '&virtualId=' + item.id });
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
    goUrl(url, name) {
      if (url.indexOf("seckillCenter") != -1) {
        wx.navigateTo({
          url: "/pages/seckill/main",
        });
      } else if (name=="社员介绍") {
        wx.navigateTo({
          url: "/pages/introduce/main?name=" + name,
        });
      }else if (url.indexOf("introduce") != -1) {
        wx.navigateTo({
          url: "/pages/introduce/main?name=" + name,
        });
      } else if (url.indexOf("cutOrderCenter") != -1) {//砍单
        wx.navigateTo({
          url: "/pages/bargainList/main",
        });
      } else if (url.indexOf("groupCenter") != -1) {//拼团
        wx.navigateTo({
          url: "/pages/groupList/main",
        });
      } else if (url.indexOf("couponCenter") != -1) {
        wx.navigateTo({
          url: "/pages/vouchers/main",
        });
      } else if (url.indexOf("store") != -1) {
        var id = "";
        if (url.lastIndexOf("\=") != -1) {
          id = url.substring(url.lastIndexOf("\=") + 1, url.length);
        }
        wx.navigateTo({
          url: "/pages/itemList/main?name=" + name + "&id=" + id,
        });
      }
    },
  },
};
</script>

<style lang="scss">
/* page {
  padding: 0 20rpx;
  box-sizing: border-box;
} */
.bg {
  background-color: #f7f7f7;
  padding-top: 350rpx;
}

.descp {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bg-yellow.light {
  color: #a5673f;
  background-color: #f8e470;
}

.no-card .content > image {
  height: 6.8em !important;
}

.tower-swiper .tower-item {
  transform: scale(calc(0.5 + var(--index) / 10));
  margin-left: calc(var(--left) * 100rpx - 150rpx);
  z-index: var(--index);
}

.changetip {
  margin-top: 10rpx;
  padding: 5rpx 10rpx;
}

.viewBgc {
  border-radius: 20rpx;
  color: #fff;
  background-color: var(--red);
}

.cu-item {
  text-align: center;
}

.tabs {
  line-height: 35rpx !important;
  font-size: 25rpx;
}

.bgcTabs {
  font-weight: bold;
  font-size: 30rpx;
  color: var(--red);
  height: 50rpx;
}
.bgcTabs::before {
  content: "";
  width: 68rpx;
  height: 4rpx;
  background-color: var(--red);
  position: absolute;
  bottom: 4rpx;
  left: 50%;
  transform: translateX(-50%);
}

.bgcTabs_fw {
  color: #666;
}

.width20 {
  width: 20%;
}

.card_cateBox {
  border-radius: 20rpx;
  margin: 20rpx 0;
  overflow: hidden;
}

.card_cateBoxbox {
  margin-top: 0;
  margin-bottom: 0;
  padding: 2rpx;
}

.card_catetab {
  margin-top: 0;
}

.cu-choose {
  text-align: left;
}

.card-swiper {
  border-radius: 20rpx;
  margin: 15rpx 0;
  overflow: hidden;
  margin-bottom: 0;
}

.navigator_view {
  width: 25%;
}

.view_cate_box {
  display: flex;
  flex-wrap: wrap;
}

.fs30 {
  font-size: 30rpx;
}

.w50 {
  width: 50%;
}

.item-swiper {
  background-color: #fff;
  margin: 15rpx 0;
  border-radius: 20rpx;
  overflow: hidden;
  height: 380rpx !important;
}

.item-swiper swiper-item {
  border-radius: 20rpx;
  box-sizing: border-box;
  width: 100% !important;
  left: 0 !important;
  margin: 0 !important;
}

.item-swiper .itemIcon {
  width: 90rpx;
  height: 90rpx;
  margin: 0 auto;
}

scroll-view {
  padding: 10rpx 0;
}
.popUp {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  .position{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .popUpBg {
    width: 590rpx;
  }
  .popUpBg2 {
    width: 750rpx;
  }
  .activityBtn {
    width: 260rpx;
    animation: scaleBtn 1.2s linear infinite;
  }
  .mainBox {
    width: 590rpx;
    height: 820rpx;
    position: absolute;
    top: 0;
    left: 0;
    .bottomBox {
      padding: 28rpx 0 20rpx 0;
    }
    .title1 {
      text-align: center;
      font-weight: bold;
      font-size: 70rpx;
      margin-top: 20rpx;
    }
    image {
      width: 344rpx;
      height: 344rpx;
      margin-top: 30rpx;
    }
    .title2 {
      font-size: 30rpx;
      margin: 26rpx 0;
    }
    .button {
      width: 418rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      text-align: center;
      margin: 0 auto;
      border: 1px solid var(--red);
      color: var(--red);
      border-radius: 0;
    }
    .button.bg-red {
      color: #fff;
      margin-top: 14rpx;
    }
  }
  
  .gif {
    width: 600rpx;
    height: 668rpx;
  }
  .activity {
    position: absolute;
    width: 100%;
    bottom: 90rpx;
    height: 98rpx;
    text-align: center;
  }
  
  .close {
    position: absolute;
    top: 60rpx;
    right: 60rpx;
    font-size: 60rpx;
    z-index: 999;
  }
}
@keyframes scaleBtn {
  50% { transform: scale(0.86) }
  100% { transform: scale(1)  }
}

.popBtn {
  width: 385rpx;
  height: 69rpx;
  position: absolute;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
}
.popBtn image {
  width: 100%;
  height: 100%;
  animation: scaleBtn 1.2s linear infinite;
}

.logo {
  width: 100%;
  position: absolute;
}
.logoBox {
  width: 100%;
  height: 350rpx;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 99;
}
.mTitle {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 64rpx;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
}
.flexItem {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  margin: 6rpx 6rpx 6rpx 0;
  display: inline-block;
}
.search {
  min-height: auto;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}
.search-form {
  display: flex;
  width: 484rpx;
  height: 64rpx;
  line-height: 64rpx;
  background-color: rgba(255,255,255,0.7);
}
.search-form input {
  height: 64rpx;
}
.search-form .cuIcon-search {
  margin: 0 8rpx 0 28rpx
}
.search .searchBtn {
  width: 132rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 0;
}
.bgJianB .card_cateBox {
  margin: 20rpx;
}
.search .cuIcon-cascades {
  font-size: 64rpx;
  margin-left: 20rpx;
}
.nav .cu-item {
  height: auto;
  padding: 0;
  margin: 0;
  margin-right: 55rpx;
}
.nav .cu-item:last-of-type {
  margin-right: 0;
}
.cu-list.grid>.cu-item text {
  color: #333;
  font-weight: bold;
}
.midBar {
  width: 710rpx;
  margin: 0 20rpx;
}
.prefecture>view {
  width: 50%;
}
.areaZone>view {
  padding: 40rpx 10rpx 20rpx 24rpx;
}
.prefecture {
  margin: 0 20rpx;
  margin-bottom: 20rpx;
}
.prefecture .title1 {
  font-size: 30rpx;
  font-weight: bold;
}
.prefecture .title2 {
  font-size: 22rpx;
  margin: 10rpx 0;
}
.areaZone image {
  width: 135rpx;
  position: absolute;
  top: 40rpx;
  right: 16rpx;
}
.hotZone .title1 {
  font-size: 30rpx;
  font-weight: bold;
  padding-left: 26rpx;
  padding-right: 34rpx;
}
.hotZone .title2 {
  font-size: 22rpx;
  margin: 10rpx 0;
  padding-left: 26rpx;
  padding-right: 34rpx;
}
.hotZone {
  padding: 40rpx 0 30rpx 0;
  max-height: 360rpx;
  overflow: hidden;
}
.hotZone .hot {
  display: inline-block;
  font-size: 20rpx;
  width: 62rpx;
  height: 26rpx;
  line-height: 26rpx;
  border-top-right-radius: 13rpx;
  border-bottom-left-radius: 13rpx;
  vertical-align: middle;
}
.hotZone .imgBox {
  width: 173rpx;
  height: 173rpx;
  margin-top: 40rpx;
}
.sharp {
  padding: 26rpx 20rpx 0 20rpx;
  overflow:hidden;white-space:nowrap;
}
.sharp scroll-view {
  height: 400rpx;
}
.goodsItem {
  width: 214rpx;
  margin-right: 34rpx;
  height: 400rpx;
  font-size: 22rpx;
  display: inline-block;
}
.goodsItem:last-child {
  margin-right: 0;
}
.imgBox {
  border-radius: 10rpx;
  overflow: hidden;
}
.imgBox image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.goodsItem .imgBox {
  width: 214rpx;
  height: 214rpx;
}
.goodsItem .title1 {
  line-height: 50rpx;
  font-size: 22rpx;
}
.goodsItem .title2 {
  font-size: 32rpx;
}
.goodsItem .title3 {
  font-size: 22rpx;
  margin-top: 10rpx;
  text-decoration: line-through;
}
.goodsItem .addCar {
  position: absolute;
  bottom: 68rpx;
  right: 0;
}
.flagship>view {
   background-image: linear-gradient(#FFD1D8, #ffffff, #ffffff);
   padding: 30rpx 10rpx 50rpx;
}
.flagship>view:last-of-type {
  background-image: linear-gradient(#FFE3D1, #ffffff, #ffffff);
}
.flagship .title1 {
  font-size: 30rpx;
}
.flagship .title {
  line-height: 40rpx;
}
.flagship .imgBox {
  width: 128rpx;
  height: 128rpx;
  margin: 50rpx auto 20rpx;
}
.goodList {
  padding: 12rpx 20rpx 100rpx;
}
.goodList .goodItem {
  width: 344rpx;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}
.goodList .imgBox {
  height: 344rpx;
  overflow: hidden;
}
.goodList .imgBox image {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.flexItem {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  margin: 6rpx 6rpx 6rpx 0;
  display: inline-block;
}
.tagList {
  height: 48rpx;
  overflow: hidden;
}
.shareBtn {
  width: 44rpx;
  height: 44rpx;
  margin-left: 20rpx;
  margin-top: 10rpx;
}
.kefu {
  position: fixed;
  bottom: 300rpx;
  right: 20rpx;
  z-index: 99;
  width: 60rpx;
  height: 60rpx;
  border-radius: 9999rpx;
  background-color: #fff;
  text-align: center;
  line-height: 60rpx;
  box-shadow: 0 0 2rpx 2rpx rgba(0,0,0,0.1);
  font-size: 40rpx;
}
</style>
