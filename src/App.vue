<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ]),
    },
    onLaunch: function () {
      // ......
      /* 版本自动更新代码 */
      console.log(211);
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log(res.hasUpdate) // 请求完新版本信息的回调 true说明有更新
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新检测', // 此处可自定义提示标题
          content: '检测到新版本，是否重启小程序？', // 此处可自定义提示消息内容
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false
        })
      })
    },
    created() {
        // this.update({
        //   isLogin: false
        // });
        // this.update({
        //   userInfo: null
        // });
        this.update({
          cartList: {}
        });
        this.update({
          orderGoods: {}
        }); 
    },
    log() {
      //console.log(`log at:${Date.now()}`)
    },
    methods: {
      ...mapMutations(["update"]),

      // updates(){
      // 	this.update({ 
      // 		userInfo: {cc: 'ddd'}
      // 	});
      // }
    }
  }

</script>

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
  }

  /* this rule will be remove */
  * {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }

</style>
