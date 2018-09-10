<template>
  <transition :name="slide">
    <div class="share-card">
      <div class="card-con"></div>
      <div class="card-main">
        <div class="main-con">
          <div class="title">{{card.name}}</div>
          <img src="./pic-myshop@2x.png" alt="" class="title-img">
          <img :src="card.avatar" alt="" class="avatar-img">
          <img :src="card.qrcode" alt="" class="avatar-card">
          <div class="qrcode-text">点击识别二维码</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Business, Global } from 'api'
  import { mapGetters } from 'vuex'
  import { ERR_OK } from 'common/js/config'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'share-card',
    data () {
      return {
        card: {},
        showPosition: true,
        showMobile: true
      }
    },
    created () {
      Business.Myshop({is_hyaline: 0}).then((res) => {
        this.card = res.data || {}
        if (this.card.position.length === 0) {
          this.showPosition = false
        }
        if (this.card.business_card_mobile.length === 0) {
          this.showMobile = false
        }
      })
      let url = location.href
      Global.jssdkConfig({weixin: 'ai_radar', url, current_type: 'weishang'}).then((res) => {
        if (res.error === ERR_OK) {
          res = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      })
    },
    methods: {
      showPic(item) {
        wx.previewImage({urls: [item]})
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide () {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    -webkit-box-sizing: border-box
    box-sizing: border-box

  .card-con
    padding-top: 31px

  .card-main
    width: 317px
    position: relative
    padding: 20px 20px 25px
    margin: auto
    background: url("./bg-shopcode@2x.png") no-repeat center center
    .main-con
      background: $color-white
      padding-top: 29px
      padding-bottom: 15px
      width: 275px
      margin: 0 auto
      layout()
      align-items: center
      position: relative
      z-index: 1
      .title
        font-family: $font-family-medium
        font-size: $font-size-18
        color: $color-20202E
      .title-img
        display: block
        width: 175px
        height: 16px
        margin-top: 13.5px
      .avatar-img
        display: block
        width: 235px
        height: 235px
        margin-top: 21px
      .avatar-card
        display: block
        width: 120px
        height: 120px
        padding: 20px
        -webkit-box-sizing: border-box
        box-sizing: border-box
      .qrcode-text
        font-family: $font-family-regular
        font-size: $font-size-12
        color: #7C7C8F
        margin-top: -10px

  .share-card
    background: $color-text
    position: fixed
    background: share-card
    z-index: 10
    left: 0
    right: 0
    bottom: 0
    top: 0
</style>
