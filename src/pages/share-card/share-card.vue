<template>
  <transition :name="slide">
    <div class="share-card">
      <div class="card-con"></div>
      <div class="card-main">
        <img src="./bg-shopcode@2x.png" alt="" class="card-bg">
        <div class="main-con">
          <div class="title">{{card.name}}</div>
          <img src="./pic-myshop@2x.png" alt="" class="title-img">
          <img :src="card.avatar" alt="" class="avatar-img">
          <img :src="card.qrcode" alt="" class="avatar-card">
          <div class="qrcode-text">长按识别二维码</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Business } from 'api'
  import { mapGetters } from 'vuex'

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
      Business.Myshop().then((res) => {
        this.card = res.data || {}
        if (this.card.position.length === 0) {
          this.showPosition = false
        }
        if (this.card.business_card_mobile.length === 0) {
          this.showMobile = false
        }
      })
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
    .card-bg
      position: absolute
      width: 100%
      height: 100%
      left: 0
      top: 0
      display: block
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
    .share-box
      display: flex
      flex-direction: column
      width: 305px
      margin: 0 auto
      padding-top: 20px
    .share-con
      border-radius: 2px
      .share-top
        display: block
        width: 305px
        height: 305px
        border: 0px solid #fff
      .share-bottom
        padding: 20px
        position: relative
        .name-profession
          layout(row)
          align-items: flex-end
          .name
            font-family: 'PingFangSC-Semibold'
            font-size: $font-size-18
            color: $color-20202E
          .name-profession
            font-family: $font-family-regular
            font-size: $font-size-medium
            color: $color-text-88
          .line
            height: 16px
            width: 1px
            margin: 0 10px
            background: rgba(0, 0, 0, .1)

        .buss-name
          font-family: $font-family-regular
          font-size: $font-size-medium
          color: $color-20202E
          margin-top: 15px
        .code-padding
          padding-bottom: 147px
          width: 100%
        .code-phone
          layout(row)
          .img-phone
            display: block
            width: 14px
            height: 14px
            margin-right: 5px
          .text
            font-family: $font-family-regular
            font-size: $font-size-medium
            color: $color-text-88

        .share-code
          position: absolute
          z-index: 11
          width: 74px
          height: 74px
          display: block
          right: 20px
          bottom: 20px
</style>
