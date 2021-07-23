<template>
  <image src="/static/images/dianzhang.png" mode="widthFix" @click="go"></image>
</template>

<script>
  import { formatDate,formatTime } from '@/utils/index'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
      }
    },
    onLoad() {
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: '注册店长',
      });
    },
    computed: {
      ...mapState(["isLogin", "userInfo"]),
    },
    methods: {
      go(){
        this.$fly.config.headers = {
          Authorization: this.userInfo.token,
        };
        this.$fly.get('/users/' + this.userInfo.id).then(res => {
          if (res.data.data.level) {
            if(this.userInfo.managerStatus){
              wx.redirectTo({
                url: '/pages/managerWallet/main',
              })
            }else {
              this.$fly.post("/users/manager",{"userId":this.userInfo.id})
              .then((res) => {
                if(res.data.success){
                  wx.redirectTo({
                    url: '/pages/managerWallet/main',
                  })
                }
              });
            }
          }else {
            wx.showModal({
              title: '提示',
              content: '必须充值成为社员才可以申请哦。',
              cancelText: '再想想',
              confirmText: '去充值',
              success (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/memberCenter/main',
                  })
                }else if(res.cancel){
                  
                }
              }
            })
          }
        })
        
      }
    }
  }

</script>

<style>
  image {
    width: 100%;
  }
</style>
