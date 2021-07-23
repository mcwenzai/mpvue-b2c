<template>
  <view class="evaluate">
    <!-- ====================================== -->
    <form @submit="submitEvaluation">
      <!--服务评价-->
      <view class="service">
        <!-- 头部 -->
        <view class="head">
          <image class="head_img" :src="orderItems[0].productCover"></image>
          <view class="tabulate">
            <label class="head_name"
              ><text
                class="head_title"
                style="color: #a9a9a9; font-size: 26rpx;"
                >{{ orderItems[0].productName }}</text
              >
            </label>
          </view>
        </view>
        <!--评分-->
        <view class="score">
          <view class="left">评分</view>
          <view class="right">
            <view
              class="rightstars"
              v-for="(i, index) in list"
              :key="index"
              @click="clickStars(index)"
            >
              <image :src="xing > index ? stara : starb"></image>
            </view>
          </view>
          <view class="scorep">{{ rateScoreText }}</view>
        </view>

        <!--textarea-->
        <view class="conts">
          <textarea
            class="areas"
            placeholder="说一说您对宝贝的描述如何？来张好看的照片呗..."
            :minlength="min"
            :maxlength="max"
            v-model="inputvalue"
          >
          </textarea>
        </view>

        <!--图片-->
        <view class="img-list">
          <view class="list">
            <!-- 图片展示列表 -->
            <view
              class="li"
              v-for="(item, index) in imgList"
              :name="item"
              :key="index"
            >
              <image class="file" :src="item"></image>
              <text
                class="cuIcon-close lg text-gray close round"
                :data-index="index"
                @click="delImg"
              ></text>
            </view>
            <!-- 添加图片 -->
            <view class="li" @click="selectPictures">
              <image class="file" src="/static/images/add.png"></image>
            </view>
          </view>
        </view>
        <view class="anon">
          <checkbox
            @click="checkb"
            :checked="flag"
            class="round checkBox"
          ></checkbox>
          <span>匿名</span>
          <span class="inte">评价可以攒积分哦</span>
        </view>
      </view>
      <!--提交评价-->
      <button form-type="submit" class="btn">发表</button>
    </form>
    <!-- ====================================== -->
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      flag: true,
      items: [],
      inputvalue: "",
      orderItems: [],
      pics: ["/static/images/add.png"],
      stara: "/static/images/on.png", //亮星星
      list: [0, 1, 2, 3, 4],
      starb: "/static/images/off.png", //暗星星
      xing: 5,
      rateScoreText: "好评",
      rateScoreDesc: ["差评", "中评", "中评", "好评", "好评"],
      imgList: [], // 图片集合
      baseImg: [], // base64图片集合
      maxImg: 2, // 图片上传最高数量
      min: 5, //最少字数
      max: 300, //最多字数
    };
  },
  onLoad(option) {
    // this.evaluate(option.orderItems)
    this.orderItems = JSON.parse(option.orderItems);
    console.log(this.orderItems);
    this.productAliasId = this.orderItems[0].productAliasId;
    this.orderId = this.orderItems[0].couponDto.orderId;
    this.skuId = this.orderItems[0].skuId;
    this.orderItemId = this.orderItems[0].orderItemId;
    console.log(
      this.productAliasId,
      this.orderId,
      this.skuId,
      this.orderItemId
    );
  },
  computed: {
    ...mapState(["isLogin", "userInfo"]),
  },

  methods: {
    checkb() {
      if (this.flag) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },

    // 删除图片（选中图片移除）
    delImg: function (e) {
      const that = this;
      const index = e.currentTarget.dataset.index; // 当前点击图片索引
      that.imgList.splice(index, 1);
    },
    // 选择图片
    selectPictures: function () {
      const that = this;
      // 最多上传图片数量
      if (that.imgList.length < that.maxImg) {
        wx.chooseImage({
          // 最多可以选择的图片张数（最大数量-当前已上传数量）
          count: that.maxImg - that.imgList.length,
          sizeType: "compressed",
          success: function (res) {
            for (let i = 0; i < res.tempFilePaths.length; i++) {
              that.imgList.push(res.tempFilePaths[i]);
            }
          },
        });
      } else {
        wx.showToast({
          title: "最多上传" + that.maxImg + "张照片！",
          icon: 'none'
        });
      }
    },
    //星级评价
    clickStars(i) {
      this.rateScoreText = this.rateScoreDesc[i];
      this.xing = i + 1;
    },
    //提交评价
    submitEvaluation() {
      // 图片转base64
      const that = this;
      // 判断是否有图片
      if (that.imgList.length !== 0) {
        for (let i = 0; i < that.imgList.length; i++) {
          // 转base64
          wx.getFileSystemManager().readFile({
            filePath: that.imgList[i],
            encoding: "base64",
            success: function (res) {
              that.baseImg.push("data:image/png;base64," + res.data);
            },
          });
        }
      } else {
        wx.showToast({
          title: "请先选择图片！",
        });
      }
      this.$fly.config.headers = {
        Authorization: this.userInfo.token,
      };
      let params = [{
        productAliasId: this.productAliasId,
        orderId: this.orderId,
        skuId: this.skuId,
        orderItemId: this.orderItemId,
        des: this.inputvalue,
        skuScore: this.xing,
        imgUrl: this.imgList,
        anonymous: this.flag,
      }];
      this.$fly.post("/orders/review", params).then((resp) => {
        if (resp.data.success) {
          wx.showToast({
            title: "评价发表成功",
            icon: "success",
            duration: 1500,
          });
          wx.redirectTo({
            url: "/pages/orderlist/main",
          });
        } else {
          wx.showToast({
            title: resp.data.message,
            icon: "none",
            duration: 1500,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.anon {
  width: 100%;
  line-height: 80rpx;
  color: #9a9a9a;
  font-size: 12px;
}
.inte {
  float: right;
}
.checkBox {
  scale: 0.6;
  margin-right: 14rpx;
}
.img-list {
  width: 700rpx;
  margin: 0 auto;
}
.img-list .txt {
  width: 680rpx;
  padding: 40rpx 0 20rpx;
  margin: 0 auto;
  color: #b2b2b2;
}
.img-list .list {
  width: 700rpx;
  overflow: hidden;
}
.img-list .list .li {
  width: 160rpx;
  margin: 10rpx 0 0 10rpx;
  height: 120rpx;
  border: 1rpx solid #fff;
  float: left;
  position: relative;
}
.img-list .list .li:last-child {
  border: 1rpx solid #f7f7f7;
}
.img-list .list .li .file {
  display: block;
  width: 160rpx;
  height: 120rpx;
}
.img-list .list .li .close {
  position: absolute;
  top: 0;
  right: 0;
  width: 30rpx;
  height: 30rpx;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-align: center;
}

page {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}
.head_name {
  width: 525rpx;
  margin-left: 20rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.scorep {
  line-height: 100rpx;
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
.head {
  height: 165rpx;
  display: flex;
}
.head_img {
  width: 110rpx;
  height: 110rpx;
  margin: auto 1rpx;
  border-radius: 20rpx;
}

.head_title {
  font-size: 26rpx;
  color: #666;
}
.tabulate {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.service {
  box-sizing: border-box;
  background: #fff;
  border-radius: 20rpx;
  margin: 20rpx;
  padding: 20rpx;
}
.score {
  height: 100rpx;
  margin-left: 10rpx;
}
.star {
  float: left;
  width: 54rpx;
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
}
image {
  width: 40rpx;
  height: 36rpx;
}
.star image {
  width: 40rpx;
  height: 40rpx;
  margin-top: 30rpx;
}
.score .left {
  width: 100rpx;
  line-height: 100rpx;
  font-size: 30rpx;
  float: left;
}
.score .right {
  width: 210rpx;
  font-size: 30rpx;
  float: left;
  color: #888;
  margin-top: 30rpx;
}

.score .right .rtxt {
  display: inline-block;
  height: 100rpx;
  line-height: 100rpx;
  margin-left: 15rpx;
  color: #c00;
  font-weight: bold;
}

.picture {
  width: 94%;
  padding-left: 6%;
  overflow: hidden;
  background: #fff;
}
.picture .left {
  width: 100rpx;
  font-size: 30rpx;
  float: left;
  padding-top: 20rpx;
}
.picture .right {
  width: 610rpx;
  font-size: 24rpx;
  float: left;
  color: #888;
  box-sizing: border-box;
  padding-top: 36rpx;
}
.picture .right .add {
  width: 120rpx;
  height: 120rpx;
  margin-right: 10rpx;
}
.According {
  width: 120rpx;
  height: 120rpx;
  float: left;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}
.parcel {
  width: 120rpx;
  height: 120rpx;
  float: left;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  position: relative;
}
.deleteimg {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}
.conts {
  width: 100%;
  height: auto;
  background: #fff;
}
textarea {
  width: 687rpx;
}
.areas {
  height: 170rpx;
  font-size: 30rpx;
  padding-top: 30rpx;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding-left: 10rpx;
}
.currentWordNumber {
  font-size: 28rpx;
  position: absolute;
  left: 0%;
  bottom: 0rpx;
  color: #c00;
}
.hint {
  font-size: 28rpx;
  position: absolute;
  top: 120rpx;
  left: 30rpx;
  color: #ff6600;
}
.btn {
  width: 697rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  color: #fff;
  background: #c00;
  position: fixed;
  left: 27rpx;
  border-radius: 1000rpx;
}
button:after {
  border: 0;
}
.parcel img {
  width: 100rpx;
  height: 70rpx;
}
</style>
