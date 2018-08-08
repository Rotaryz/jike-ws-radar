<template>
  <div class="mine">
    <Scroll :bcColor="'#f1f2f5'">
      <div class="ba-dark">
        <!--我的-->
      </div>
      <div class="mine-card">
        <div class="mine-card-bg">
          <div class="mine-header-box">
            <img class="mine-header" :src="mine.avatar">
          </div>
          <p class="peo-name">{{mine.name}}</p>
          <!--<p class="mine-free" v-if="mine.expire_status === 2">免费试用</p>-->
          <div class="mine-btn">
            <router-link tag="div" class="mine-btn-item" to="/shareCard">
              <img src="./icon-shopcode@2x.png" class="mine-btn-item-icon">
              <span class="mine-btn-item-text">店铺二维码</span>
            </router-link>
            <div class="mine-btn-item">
              <img src="./icon-shoppreview@2x.png" class="mine-btn-item-icon">
              <span class="mine-btn-item-text">预览店铺</span>
            </div>
          </div>
        </div>
      </div>
      <ul class="content-list">
        <li class="content-item" v-for="(item, index) in contentList" :key="index" @click="_goPage(item.src)">
          <span class="text">{{item.title}}</span>
          <span class="icon"></span>
          <span class="tip" v-if="item.title === '使用教程'">开发中</span>
        </li>
      </ul>
    </Scroll>
    <router-view @refresh="refresh"></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Business } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'

  const CONTENTLIST = [{title: '我的报表', src: 'mine/my-data'}, {title: '使用教程', src: ''}]

  export default {
    name: 'Mine',
    data () {
      return {
        contentList: CONTENTLIST,
        mine: {}
      }
    },
    created () {
      this.$emit('tabChange', '我的')
      this.getMine()
    },
    methods: {
      _goPage (src) {
        if (!src) {
          return
        }
        this.$router.push(src)
      },
      refresh () {
        this.mine = storage.get('info', {})
      },
      getMine () {
        Business.myBusinessCard().then((res) => {
          console.log(res)
          if (res.error === ERR_OK) {
            this.mine = res.data
          }
        })
      }
    },
    components: {
      Scroll
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .mine
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 45px
    top: 0

  .ba-dark
    background-color: $color-text
    text-align: center
    color: $color-white
    width: 100vw
    font-size: $font-size-large
    font-family: $font-family-regular
    height: 105.5px

  .mine-card
    position: relative
    z-index: 100
    background-color: $color-white
    margin: -57px auto 0
    height: 50.67vw
    width: 92vw
    .mine-card-bg
      padding: 0 15px
      display: flex
      flex-direction: column
      box-sizing: border-box
      align-items: center
      background-size: cover
      bg-image('bg-customer_details')
      height: 100%
      width: 100%
      position: relative
      .peo-name
        margin-top: 15px
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text
      .mine-free
        margin-top: 10px
        width: 60px
        height: 20px
        line-height: 20px
        text-align: center
        background: rgba(86, 186, 21, 0.20)
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-56
      .mine-header-box
        height: 60px
        width: 60px
        margin-top: -19px
        overflow: hidden
        background: $color-white
        border-1px($color-row-line, 0)
        .mine-header
          width: 100%
      .mine-btn
        border-top-1px($color-row-line)
        position: absolute
        bottom: 0
        left: 0
        width: 91%
        margin-left: 4.5%
        height: 45px
        display: flex
        .mine-btn-item
          flex: 1
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-20202E
          display: flex
          align-items: center
          justify-content: center
          &:first-child
            position: relative
            &:after
              content: ''
              height: 16px
              width: 1px
              background: $color-col-line
              right: 0
              transform: scaleX(0.5)
              col-center()
          .mine-btn-item-icon
            margin-right: 4.5px
            width: 14px

  .content-list
    background-color: $color-white
    width: 92vw
    margin: 15px auto 0
    padding-left: 15px
    box-sizing: border-box
    border-radius: 2px
    border-1px($color-row-line)
    .content-item
      font-family: $font-family-regular
      font-size: $font-size-medium
      color: $color-text
      height: 45px
      align-items: center
      display: flex
      padding-right: 15px
      box-sizing: border-box
      justify-content: space-between
      position: relative
      border-bottom-1px($color-row-line)
      .tip
        position: absolute
        col-center()
        right: 25px
        color: $color-888888
        font-size: $font-size-12
      &:last-child
        border-none()
      .icon
        icon-image('icon-pressed')
        width: 5px
        height: 10px
</style>
