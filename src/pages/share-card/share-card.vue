<template>
  <transition :name="slide">
    <div class="share-card">
      <scroll>
        <div class="share-box">
          <div class="share-con">
            <img class="share-top" :src="card.avatar" alt="">
            <div class="share-bottom">
              <img :src="card.qrcode" alt="" class="share-code">
              <div class="name-profession">
                <div class="name">{{card.name}}</div>
                <div class="line" v-if="showPosition"></div>
                <div class="name-profession">{{card.position}}</div>
              </div>
              <div class="buss-name">{{card.department}}</div>
              <div class="code-padding"></div>
              <div class="code-phone" v-if="showMobile">
                <img src="./icon-telephone_ash@2x.png" alt="" class="img-phone">
                <div class="text">{{card.business_card_mobile}}</div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Business } from 'api'
  import {mapGetters} from 'vuex'

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
      Business.Myqrcode().then((res) => {
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
      slide() {
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
      background: $color-white-fff
      border-radius: 2px
      box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
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
            background: rgba(0,0,0, .1)


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
