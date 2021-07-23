<template>
	<view >
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">收货人</view>
				<input placeholder="请输入收货人姓名" name="input" v-model="formData.name"/>
			</view>
			<view class="cu-form-group">
				<view class="title">联系电话</view>
				<input placeholder="请输入收货人手机号码" name="input" type="number" max="11" v-model="formData.phone"/>
			</view>
			<view class="cu-form-group">
				<view class="title">地址选择</view>
				<picker mode="region" @change="RegionChange" v-model="region">
					<view class="picker">
						{{region[0]}}，{{region[1]}}，{{region[2]}}
					</view>
				</picker>
			</view>

			<view class="cu-form-group align-start">
				<view class="title">详细地址</view>
				<textarea maxlength="-1" v-model="formData.address" placeholder="请输入详细地址"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">设为默认</view>
				<switch @change="SwitchA" :class="formData.active?'checked':''" :checked="formData.active"></switch>
			</view>
		</form>

		<view class="padding flex flex-direction margin-top-lg">
			<button class="cu-btn bg-red lg round" @click="handleSubmit">{{isEdit ? '保存地址' : '新增地址'}}</button>
		</view>

	</view>
</template>

<script>
import {mapState, mapMutations } from 'vuex'

	export default {
		data() {
			return {
				region: ['湖南省', '长沙市', '岳麓区'],
				isEdit: false,
				formData: {
					name: '',
					phone: '',
					city: ['湖南省', '长沙市', '岳麓区'],
					address: '',
					check: true,
					active: 'active',
				}
			};
		},
		computed: {
            ...mapState([
                'userInfo'
            ]),
		},
		onLoad(options){
			//console.log(options, 43);
			if (options.edit=='true') {
				this.isEdit = true
				this.formData = JSON.parse(options.item)
				this.region = JSON.parse(options.item).city.split(',')
				//console.log(this.formData, JSON.parse(options.item), 34);
			} else {
				// 清空页面数据
				Object.assign(this.$data, this.$options.data())
			}
		},
		methods: {
			...mapMutations(["update"]),
			SwitchA(e) {
				this.formData.check = !this.formData.check
				this.formData.active = this.formData.check ? 'active' : null
			},
			RegionChange(e) {
				this.region = e.mp.detail.value
			},
			// 添加
			handleSubmit() { 
				
				//console.log("region",this.region)
				//console.log("this.formData",this.formData);
				let	params ={
						address: this.formData.address,
						area: this.region[2],
						city: this.region[1],
						defaultIn: true,
						name: this.formData.name,
						phone: this.formData.phone,
						province:this.region[0],
						tag: 0
					}				
				let url = '/users/addresses'
				if (this.isEdit) {
					url = '/users/addresses/'+this.formData.id
				}

				//this.formData.city = this.region.join(',')
				this.$fly.config.headers = {
                    Authorization:this.userInfo.token
                }
				this.$fly.post(url, params).then(res => {
					
					if (res.data.success) {
						wx.showToast({
							title: res.data.message,
							icon: 'success',
							duration: 2000,
						});
						if (this.formData.active) {
							this.userInfo.defaultAddress = this.formData
							this.update({userInfo: this.userInfo})
						}
						setTimeout(() => {
							wx.navigateBack()
						},1500)
					} else {
						wx.showToast({
							title: '错误:' + res.data.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			}
		},
	}
</script>

<style>

.cu-form-group .title {
	min-width: calc(4em + 15px);
}


</style>
