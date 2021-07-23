<template>
  <view class="bg">
    <!-- 这是搜索 -->
    <form @submit.prevent="submit">
      <view class="cu-bar search bg-white">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="商品名称"
            name="search" />
        </view>
        <view class="action">
          <button class="cu-btn bg-red shadow-blur round" formType="submit">搜索</button>
        </view>
      </view>
    </form>
    <!-- 这是搜索 -->
    <!-- 这是一级菜单 -->
    <view class="VerticalBox cf">
      <!-- 这是显示一级 -->
      <scroll-view class="VerticalNav nav bg-white text-df fl" scroll-y scroll-with-animation :scroll-top="verticalNavTop"
        style="height:calc(100vh - 100rpx)">
        <view class="cu-item" :class="index==tabCur?'text-red cur':''" v-for="(item,index) in classifys" :key="index"
          @tap="TabSelect(index)" :data-id="index">
          {{item.name}}
        </view>
      </scroll-view>
      <view class="fr" style="width:590rpx">
        <view class="secondNav">
          <scroll-view
            scroll-x
            class="nav"
            scroll-with-animation
            :scroll-left="scrollLeft"
            scroll-anchoring="true"
            @scroll="scrollMove"
          >
            <view
              class="cu-item tabs"
              :id="'v'+index"
              v-for="(item, index) in categoryList.grandChildren"
              :key="index"
              :data-id="index"
              @tap="TabSelectSecond(index)"
              :class="index==tabCurSecond?'text-red':''"
            >
              {{item.name}}
            </view>
          </scroll-view>
        </view>
        <view class="thridNav">
          <view class="thridBox" v-for="(item, index) in sortList" :key="index" :data-id="index" @tap="TabSelectThrid(index)" :class="index==sort?'text-red':''">{{item}}</view>
        </view>
        <scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 250rpx)"
          :scroll-into-view="'main-'+mainCur" @scrolltolower="getGoodsList" :scroll-top='topNum' >
          <view class="">
            <view class="cu-card article no-card solid-bottom" v-for="(item, index) in goodsList" :key="index">
              <view class="cu-item shadow padding-tb" @click="goDetail(item.aliasId,item.merchantId)">
                <view class="content">
                  <image :src="item.cover?item.cover:'/static/images/default.png'"></image>
                  <view class="desc">
                    <view class="text-cut">{{item.name}}</view>
                    <view class="text-xs text-gray ">{{item.brandName}}</view>
                    <view class="tagList">
                      <text v-for="(itemList,indexList) in item.tags" :key="indexList" class="flexItem round" :style="{ color: itemList.color||'#CB2D3D', border: '1px solid ' + (itemList.color||'#CB2D3D') }">{{itemList.name}}</text>
                    </view>
                    <view class="flex align-end justify-between">
                      <view class="margin-top-sm">
                        <view class="text-price text-xl text-red margin-right">{{item.priceStr}}</view>
                      </view>
                    </view>
                    <view
                      class="cu-btn cu-avatar bg-red round addCar"
                      @tap.stop="addGoods(item, 0)"
                      data-target="ChooseModal"
                    >
                      <text class="cuIcon-cart"></text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- 多规格弹窗 -->
    <GoodsModal ref="goodsModal"></GoodsModal>
  </view>
</template>

<script>
  import {
    moneyFormat
  } from '@/utils/index'
  import GoodsModal from '@/components/goodsModal'
  import Banners from '@/components/banners'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    components: {
      GoodsModal,
      Banners,
    },
    data() {
      return {
        list: [],
				classifys: [],
				tabCurSecond: 0,
        sortList:['综合','销量','新品'],
				categoryList: [],
				scrollLeft:"",
        goodsList: [],
        topNum: 0,
        tabCur: 0,
        mainCur: 0,
        sort: '',
        downIndex:0,
        verticalNavTop: 0,
        load: true
      };
    },
    onLoad() {
			this.getGoodsClassify()
			let scrollInfo = {
				prevDistance: 0,
				screenHalfwidth: wx.getSystemInfoSync().windowWidth / 2,
			};
			this.scrollInfo = scrollInfo;
    },
    onPullDownRefresh() {
      // 下拉刷新
			this.getGoodsClassify()
			let scrollInfo = {
				prevDistance: 0,
				screenHalfwidth: wx.getSystemInfoSync().windowWidth / 2,
			};
			this.scrollInfo = scrollInfo;
      wx.stopPullDownRefresh()
    },
    methods: {
      ...mapMutations(["update"]),
      addGoods(goods) {
        //
        this.$fly
          .get("/products/" + goods.aliasId + "?merchantId=" + goods.merchantId)
          .then((res) => {
            this.$refs.goodsModal.showModal(res.data.data);
          });
      },
      goDetail(id, merchantId) {
        wx.navigateTo({
          url: `/pages/goodsDetail/main?id=${id}&merchantId=${merchantId}`,
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
      submit: function (data) {
        //console.log(data.mp.detail.value.search) //  {username: "hgj", password: "fsdfsd"}
        let keyWord = data.mp.detail.value.search
        if (keyWord) {
          wx.navigateTo({
            url: `/pages/goodsList/main?name=${keyWord}`
          })
        }
      },
      getGoodsClassify() {
        this.$fly.get('/products/queryCategoriesNew').then(res => {
          // 
          this.classifys = res.data.data
          this.getCategoryList(this.classifys[this.mainCur])
          //console.log(this.classifys)
        })
      },
      getCategoryList(classify) {
        this.downIndex=0;
        console.log(this.downIndex);
        let params = {
          classify: classify
        }
				this.categoryList = classify;
				this.getGoodsList()
			},
			getGoodsList(){
				this.$fly.get('/products/accessList?offset='+this.downIndex+'&limit=10&sort='+this.sort+'&categoryId='+this.categoryList.grandChildren[this.tabCurSecond].id).then(res => {
          // 
          if (this.downIndex == 0) {
            this.topNum = 0;
            this.goodsList = [];
          }
          if(res.data.data.length>0){
            this.goodsList.push.apply(this.goodsList, res.data.data);
            this.downIndex++;
          }else {
            wx.showToast({
              title: '没有更多商品~', //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
          
        })
			},
      TabSelect(index) {
				this.tabCur = index;
				this.tabCurSecond = 0;
				this.getRect(0);
        this.mainCur = index;
        this.getCategoryList(this.classifys[index])
      },
      TabSelectSecond(index) {
				this.tabCurSecond = index;
        this.getRect(index);
        this.downIndex=0;
        this.getGoodsList();
      },
      TabSelectThrid(index) {
				this.sort = index;
        this.downIndex=0;
        this.getGoodsList();
      },
      VerticalMain(e) {
        let tabHeight = 0;
        if (this.load) {
          for (let i = 0; i < this.list.length; i++) {
            let view = wx.createSelectorQuery().select("#main-" + this.list[i].id);
            view.fields({
              size: true
            }, data => {
              this.list[i].top = tabHeight;
              tabHeight = tabHeight + data.height;
              this.list[i].bottom = tabHeight;
            }).exec();
          }
          this.load = false
        }
        let scrollTop = e.mp.detail.scrollTop + 10;
        for (let i = 0; i < this.list.length; i++) {
          if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
            this.verticalNavTop = (this.list[i].id - 1) * 50
            this.tabCur = this.list[i].id
            //console.log(scrollTop)
            return false
          }
        }
      },
      // 这是点击图片的跳转
      btnTodetail(id) {
        wx.navigateTo({
          url: `/pages/goodsList/main?id=${id}`
        })
      }
    },
  }

</script>

<style lang="scss">
.titles {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box !important;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.pt100 {
  padding-top: 100rpx;
}
.button-box {
	display: flex;
	line-height: 40xrpx;
	justify-content: space-between;
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

.cu-card.article>.cu-item .content>image {
	width: 210rpx;
  height: 210rpx;
}
.cu-card.article>.cu-item .content {
  padding: 0;
  padding-right: 20rpx;
}

.desc {
  width: 300rpx;
  position: relative;
  .addCar {
    position: absolute;
    bottom: 0;
    right: 16rpx;
    scale: 0.8;
  }
}

.fixed {
	position: fixed;
	z-index: 99;
}

.VerticalNav.nav {
	width: 160rpx;
	white-space: initial;
  display: inline-block;
}

.VerticalNav.nav .cu-item {
	width: 100%;
	text-align: center;
	background-color: #F8F8F8;
	color: #808080;
	margin: 0;
	border: none;
	height: 50px;
	line-height: 50px;
	position: relative;
}

.VerticalNav.nav .cu-item.cur {
	background-color: #fff;
	color: #343434;
}

.VerticalNav.nav .cu-item.cur::after {
	content: "";
	width: 6rpx;
	height: 48rpx;
	/* border-radius: 10rpx 0 0 10rpx; */
	position: absolute;
	background-color: var(--red);
	top: 50%;
	transform: translateY(-50%);
	left: 0;
	margin: auto;
}

.VerticalBox {
	// display: flex;
	flex: 1;
  position: relative;
}

.VerticalMain {
	background-color: #f1f1f1;
	// flex: 1;
  width: 590rpx;
  position: relative;
}
.secondNav {
  height: 100rpx;
  width: 590rpx;
}
.hr {
	height: 2rpx;
	width: 80rpx;
	background: #ccc;
	display: inline-block;
	margin: 0 6rpx;
}

.navigatorBox {
	width: 33.33%;
}

.nav_img {
	position: absolute;
	width: 160rpx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.imgBox {
	position: relative;
	width: 100%;
	height: 170rpx;
	overflow: hidden;
}

.box_img_text {
	display: flex;
	flex-wrap: wrap;
	text-align: center;

}

.nav_text {
	vertical-align: top;
}

.text_title {
	margin-left: 10rpx;
	margin-top: -20rpx;
}

.bg {
	// background: rgb(14, 181, 187);
	/**background: #fff;**/
}
.nav {
	background-color: #fff;
	.tabs {
		height: 100rpx;
		line-height: 100rpx;
	}
}
.tagList {
  overflow: hidden;
  height: 40rpx;
}
.flexItem {
  font-size: 18rpx;
  padding: 2rpx 4rpx;
  margin-right: 4rpx;
  display: inline-block;
}
.thridNav {
  text-align: right;
  background-color: #fff;
  .thridBox{
    display: inline-block;
    padding: 0 20rpx;
    line-height: 50rpx;
    font-size: 26rpx;
  }
}
</style>
