<template>
	<view class="mainBox">
    <view class="mainTitle">
      找回密码
    </view>
    <view class="inputItem">
      <view class="title1">
        手机号
      </view>
      <input type="number" class="input" v-model="phone" placeholder="请输入手机号" adjust-position="false" placeholder-class="placeholder"/>
    </view>
    <view class="inputItem">
      <view class="title1">
        短信验证码
      </view>
      <input type="number" class="input" v-model="code" placeholder="请输入短信验证码" maxlength="6" adjust-position="false" placeholder-class="placeholder"/>
			<view class="yanz text-red text-center round" @click="send">
				{{daojishi}}
			</view>
    </view>
    <view class="inputItem">
      <view class="title1">
        设置新密码
      </view>
      <input type="text" class="input" v-model="password" placeholder="请设置6-18位不含特殊字符的新密码" adjust-position="false" placeholder-class="placeholder" password="true"/>
    </view>
    <view class="inputItem">
      <view class="title1">
        确认新密码
      </view>
      <input type="text" class="input" v-model="repassword" placeholder="请确认新密码" adjust-position="false" placeholder-class="placeholder" password="true"/>
    </view>
    <button class='bg-red round' @click="submit">
      <view>提交</view>
    </button>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex';

  export default {
    data() {
      return {
        userInfo: '',
        phone: '',
        code: '',
        daojishi: "获取验证码",
        isdaojishi: true,
        password: '',
        repassword: ''
      }

    },
    computed: {
      ...mapState([
        'isLogin', 'userInfo'
      ]),
    },

    methods: {
      ...mapMutations(['update']),
      send() {
          let langtime = 60;
          let than = this
          let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
          if (!reg.test(this.phone)) {
            wx.showToast({
              title: "请输入正确的手机号码",
              icon: "none",
              size: 93,
              duration: 20000
            })
          } else {
            this.isdaojishi = false;
            let a = setInterval(function () {
              if (langtime == 0) {
                than.isdaojishi = true;
                than.daojishi = "获取验证码";
                clearInterval(a);
              } else {
                langtime--;
                than.daojishi = `${langtime}秒`;
              }
            }, 1000);
            let params = {
              phone: this.phone,
              type: 4
            }
            this.$fly.post('/sms/send/code', params).then(res => {

            })
          }     
      },
      submit(e) {
        if(this.phone==''){
					wx.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return;
				}else if(this.code==''){
					wx.showToast({
						title: '验证码不能为空',
						icon: 'none'
					})
					return;
				}else if(this.password==''){
					wx.showToast({
						title: '新密码不能为空',
						icon: 'none'
					})
					return;
				}else if(this.password!=this.repassword){
					wx.showToast({
						title: '两次输入密码不一致',
						icon: 'none'
					})
					return;
				}
        let params = {
          "phone": this.phone,
          "code": this.code,
          "password": this.password,
          "repassword": this.repassword
        }
        this.$fly.post('/users/forget-password', params).then(res => {
          if (res.data.success) {
            this.update({
              isLogin: true
            })
            this.update({
              userInfo: res.data.data
            })
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000,
              complete:function(){
              wx.navigateTo({
                url: "/pages/prelogin/main"
              })
              }
            })
            
          }
        })
      },
    }
  }
</script>

<style lang='scss'>
  .mainBox{
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		padding: 0 80rpx;
		background: #fff;
	}
  .mainTitle {
    font-size: 44rpx;
    color: #666;
    font-weight: bold;
    padding: 80rpx 0;
  }
  .inputItem {
    margin-bottom: 80rpx;
		position: relative;
  }
  .title1 {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 20rpx;
  }
  .input {
    line-height: 66rpx;
    border-bottom: 1px solid #DDDDDD;
    padding: 10rpx 6rpx;
    height: 66rpx;
    font-size: 32rpx;
    color: #333;
  }
  .placeholder {
    color: #ccc;
    font-size: 24rpx;
  }
  .forget {
    font-size: 28rpx;
    color: #999;
    margin-top: 40rpx;
  }
  .toRegist {
    font-size: 28rpx;
    color: #999;
    position: absolute;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
  }
	.yanz {
		position: absolute;
		display: inline-block;
		right: 0;
		bottom: 6rpx;
		width: 160rpx;
		height: 54rpx;
		line-height: 54rpx;
		font-size: 24rpx;
		font-weight: bold;
		border: 1px solid var(--red);
		z-index: 9;
	}
</style>
