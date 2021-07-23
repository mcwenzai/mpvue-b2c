<template>
	<view class="addresslist ">
        <div class="contain" v-if="addressList.length==0">
			<img src="/static/images/address.png" alt="" class="noList">
			<view class="padding">还没有收货地址</view>
		</div>
        <view class="margin-top address-page" v-else>
            <view class=" bg-white solid-bottom" v-for="(item, index) in addressList" :key="index">
                <view class="cu-item">
                    <view class="padding-lr padding-top">
                        <view class="flex justify-between text-lg" @click="chooseAddress(item)">
                            <view class="">{{item.name}}</view>
                            <view class="">{{item.phone}}</view>
                        </view>
                        <view class="text-cut text-grey padding-top-sm" @click="chooseAddress(item)">
                            <text class='cuIcon-locationfill text-orange'></text>
                            {{item.province + " "+item.city + " "+item.area + " " + item.address}}
                        </view> 
                        <view class="flex">
                            <view class="flex-sub cu-form-group" style="padding-left: 0">
                                <radio :class="item.defaultIn ? 'checked':''" :checked="item.defaultIn" @click="checkAddress(item, index)">
                                    <view class="title padding-left-xs">设为默认</view>
                                </radio>
                            </view>
                            <view class="flex-twice flex justify-end align-center" style="font-size: 20px">
                                <text class='cuIcon-edit margin-left' @click="edit(item)"></text>
                                <text class='cuIcon-delete margin-left' @click="handleDelele(item.id, index)"></text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
		<view class="padding flex flex-direction newAdd" >
			<button class="cu-btn bg-red lg round" @click="goRouter('address')">新增地址</button>
		</view>
	</view>
</template>

<script>
import {mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
                addressList: [],
				region: ['广东省', '广州市', '海珠区'],
			};
        },
        computed: {
            ...mapState([
                'userInfo','isLogin'
            ]),
        },
        onShow() {
            // 查看是否授权
            if (!this.isLogin) {
                wx.redirectTo({
                url: "/pages/prelogin/main"
                });
            }
            this.getAddressList();
        },
        onLoad(options) {
            this.from = options.isFrom || '';
            this.orderParams=options.orderParams;
            this.couponId = options.couponId||-1;
            this.discountAmount = options.discountAmount||0;
            this.flag  =options.flag;
        },
		methods: {
            ...mapMutations(["update"]),
            getAddressList() {
                //
                this.$fly.config.headers = {
                    Authorization:this.userInfo.token
                    },              
                this.$fly.get('/users/addresses',{offset:0,limit:30}).then(res => {
                   //
                    this.addressList = res.data.data
                })
            },
            //选择地址
            chooseAddress(item){
                if(this.from){
                    if(this.orderParams!=undefined){
                        wx.redirectTo({
                            url: '/pages/createOrder/main?address=' + JSON.stringify(item) + '&orderParams=' + this.orderParams + '&couponId=' + this.couponId + '&discountAmount=' + this.discountAmount + '&flag=' + this.flag,
                        });
                    }else {
                        wx.redirectTo({
                            url: '/pages/createOrder/main?address=' + JSON.stringify(item) + '&couponId=' + this.couponId + '&discountAmount=' + this.discountAmount + '&flag=' + this.flag,
                        });
                    }
                }
            },
			RegionChange(e) {
				this.region = e.mp.detail.value
            },
            checkAddress(item, index) {
                item.defaultIn = true;
                var params = item;
                this.$fly.post('/users/addresses/' + item.id, params).then((res) => {
                    if(res.data.success){
                        this.getAddressList()
                    }
                })
            },
            goRouter(url) {			
                wx.navigateTo({url: `/pages/${url}/main`})
            },
            edit(item) {
                item.city=item.province+","+item.city+","+item.area
                //console.log(JSON.stringify(item));
                wx.navigateTo({url: `/pages/address/main?edit=true&item=${JSON.stringify(item)}`})
            },
            handleDelele(id, index) {
                wx.showModal({
                    title: '是否删除该地址？',
                    content: '',
                    success: resp => {
                        if(resp.confirm){
                            this.$fly.delete('users/addresses/'+id).then(res => {
                                this.addressList.splice(index, 1)
                            })
                        }
                    }
                })
            }
		},
	}
</script>

<style>
page, .addresslist{
	height: 100%;
}
.contain{
	height: 100%;
    background: #fff;
	text-align: center;
}
.noList{
	width: 614rpx;
	height: 352rpx;
	margin-top: 200rpx;
}

.address-page{
    padding-bottom: 160rpx;
}
.cu-form-group .title {
	min-width: calc(4em + 15px);
}

radio::before, checkbox::before{
    left: 10rpx;
    right: 0;
}
.newAdd{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 100;
}
</style>
