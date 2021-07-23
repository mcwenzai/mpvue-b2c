<template>
  <div>
    <web-view :src="aSrcs" v-if="aSrcs!=''"></web-view>
    
  </div>
</template>

<script>
  export default {
    data(){
      return{
        aSrcs:""
      }
    },
    onLoad(options){
      this.aSrcs=''
      let pathurl = JSON.parse(decodeURIComponent(options.url))
      this.aSrcs = pathurl
      
    } 　
  }
</script>
<style>
</style>