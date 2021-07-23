<template>
	<view class="addresslist">
        <div class="contain" v-if="addressList.length==0">
			<img src="/static/images/address.png" alt="" class="noList">
			<view class="padding">还没有收货地址</view>
		</div>
        <view class="margin-top address-page" v-else>
            <view class="cu-card article no-card bg-white solid-bottom" v-for="(item, index) in addressList" :key="index" @click="selectAdd(item, index)">
                <text class="text-xxl margin-left-sm" >
                    <text class="text-green cuIcon-roundcheckfill" v-if="item.active"></text>
                    <text class="text-gray text-ddd cuIcon-round" v-else></text>
                </text>
                <view class="cu-item flex-sub">
                    <view class="padding-lr padding-top">
                        <view class="flex justify-between text-lg ">
                            <view class="">{{item.name}}</view>
                            <view class="">{{item.phone}}</view>
                        </view>
                        <view class="text-gray padding-top-sm detailAddress">
                            <text class='cuIcon-locationfill text-orange'></text>
                            {{item.newCity + ' ' + item.address}}
                        </view> 
                    </view>
                </view>
                <view class="text-xl padding-right-sm" @click.stop="edit(item)">
                    <text class='cuIcon-edit'></text>
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
                addressList: []
			};
        },
        computed: {
			...mapState([
				'userInfo'
            ]),
        },
        onShow() {
            this.getAddressList()
        },
		methods: {
            ...mapMutations(["update"]),
            getAddressList() {
                this.$fly.post('/address/list', {user_id: this.userInfo.openid}).then(res => {
                    res.data.forEach(item => {
                        item.newCity = item.city.split(',').join('')
                    })
                    this.addressList = res.data

                    // 获取上一次选择的地址
                    let id = this.userInfo.defaultAddress.id
                    this.addressList.forEach(item => {
                        item.active = null
                        if (item.id == id) {
                            item.active = 'active'
                        }
                    })
                })
            },
            goRouter(url) {			                
                wx.navigateTo({url: `/pages/${url}/main`})
            },
            selectAdd(data, index) {
                this.addressList.forEach(item => {
                    item.active = null
                })
                this.addressList[index].active = 'active'

                this.userInfo.defaultAddress = data
                this.update({userInfo: this.userInfo})
                setTimeout(() => {
                    wx.navigateBack()
                }, 400)
            },
            edit(item) {
                wx.navigateTo({url: `/pages/address/main?edit=true&item=${JSON.stringify(item)}`})
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
.address-page .article{
    display: flex;
    align-items: center;
}
.detailAddress{
    overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box !important;
	-webkit-line-clamp:2;
	-webkit-box-orient: vertical;
}

.newAdd{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 100;
}
</style>
