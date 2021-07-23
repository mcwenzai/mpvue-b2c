const Fly = require("flyio/dist/npm/wx");
const fly = new Fly();
const host = "https://api.zcbaihe.com/capp/v1";
// const host = "http://192.168.5.250:9000/capp/v1";

// 添加请求拦截器
fly.interceptors.request.use(request => { 
  wx.showLoading({
    title: '加载中',
  })
  
  setTimeout(function () {
    wx.hideLoading()
  }, 500)
  //console.log("request",request)
  return request;
});

// 添加响应拦截器
fly.interceptors.response.use(
  response => { 
    //console.log("response", response.data)  
    if (response.data.success||response.data.openid) {
      return response; // 请求成功之后将返回值返回
    } else {
      if(response.data.errmsg){
        return response;
      }else{
        wx.showToast({
          title: response.data.message,
          icon: "none",
          duration: 2000
        });
      }     
    }
  },
  err => {
    // 请求出错，根据返回状态码判断出错原因
    if (err.status == 401) {
      wx.showToast({
        title: '登录失效，请重新登录。',
        icon: 'none',
        duration: 1500,
        success:function(){
          setTimeout(function () { 
            wx.navigateTo({
              url: "/pages/prelogin/main"
            })
         }, 1500) 
        }
      })
      
    }
  }
);
fly.config.baseURL = host;
export default fly;
