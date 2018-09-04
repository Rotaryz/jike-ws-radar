<template>
  <transition :name="slide">
    <div class="robot-main-box">
      <Scroll bcColor="#fff">
        <div class="wechat-top">
          <div class="wechat-img">
            <img :src="wechatImg" alt="">
          </div>
          <div class="wehcat-text">
            用机器人的微信账号扫描上方二维码(<span class="green">长按识别无效</span>)，重新登录微信机器人
          </div>
        </div>
        <div class="f0f2f5"></div>
        <div class="wechat-bottom">
          <div class="wechat-title">如何让专属机器人更加稳定，不容易掉线？</div>
          <div class="wechat-noet">
            <p class="wechat-text">1.添加掉线提醒客服为好友，即可享受实时的掉线提醒服务。<span class="green">(本产品中提供的所有服务均以机器人在线为基础，为保证您的正常使用，强烈建议添加）</span></p>
            <p class="wechat-text"> 添加方法：复制微信号<span class="green">wykt_wl</span>，在微信右上角“添加朋友“中搜索添加。</p>
          </div>
          <div class="wechat-noet">
            <div class="wechat-text">2.机器人微信账号不要退出微信登录，也不要在电脑上登录微信；
            </div>
          </div>
          <div class="wechat-noet">
            <div class="wechat-text">3.机器人手机不要长时间处于断网或关机状态；</div>
          </div>
          <div class="wechat-noet">
            <div class="wechat-text">4.机器人微信最好设置微信ID号；</div>
          </div>
          <div class="wechat-noet">
            <div class="wechat-text">5.7天左右定时查看登录机器人的手机微信存储量。</div>
          </div>
        </div>
      </Scroll>
      <router-view></router-view>
      <div class="loding-box" v-show="loading">
        <img class="loading" src="./loading.gif" alt="" width="30" height="30">
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Mine } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'
  import { mapGetters } from 'vuex'

  export default {
    name: 'robot-code',
    data () {
      return {
        wechatImg: '',
        loading: true
      }
    },
    created () {
      this.getDataCode()
    },
    methods: {
      getDataCode() {
        Mine.getWechatLogin().then((res) => {
          if (res.error === ERR_OK) {
            this.getWechatLoginCodeData()
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getWechatLoginCodeData() {
        Mine.getWechatLoginCode().then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.wx_mock_image.length === 0) {
              setTimeout(() => {
                this.getWechatLoginCodeData()
              }, 1000)
            } else {
              this.wechatImg = res.data.wx_mock_image
              this.loading = false
            }
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
      userInfo() {
        return storage.get('info')
      },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .robot-main-box
    position: fixed
    background: $color-background
    z-index: 151
    left: 0
    right: 0
    bottom: 0
    top: 0
  .wechat-top
    padding: 25px 0 20px
    box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
    .wechat-img
      width: 160px
      height: 160px
      margin: 0 auto 17.5px
      img
        width: 100%
        height: 100%
    .wehcat-text
      padding: 0 35.5px
      font-size: $font-size-16
      font-family: $font-family-medium
      color: $color-20202E
      line-height: 24px
      text-align: justify
      .green
        color: $color-56BA15
  .f0f2f5
    height: 10px
    background: $color-F0F2F5
    width: 100%
  .wechat-bottom
    padding: 0 20px 20px 15px
    box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
    .wechat-title
      padding: 20px 0 15px
      font-size: $font-size-16
      font-family: $font-family-medium
      color: $color-20202E
    .wechat-noet
      margin-bottom: 10px
      line-height: 20px
      .wechat-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-888888
        text-align: justify
        .green
          color: $color-56BA15
  .loding-box
    background: rgba(255,255,255,.5)
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 11
    .loading
      all-center()
  .w
    width: 100%
</style>
