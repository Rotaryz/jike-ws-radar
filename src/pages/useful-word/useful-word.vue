<template>
  <transition :name="slide">
    <div class="useful-word">
      <scroll :data="wordList" :bcColor="'#ffffff'" ref="scroll">
        <div class="word-list">
          <div class="word-item border-bottom-1px" v-for="(item, index) in wordList" :key="index" @click="choice(item)">
            <div class="item-left">{{item.message}}</div>
            <div class="item-right">
              <div class="right-icon" :class="item.id == itemChecked.id ? 'icon-select' : 'icon-unSelect'"></div>
            </div>
          </div>
        </div>
      </scroll>
      <div class="word-bottom">
        <div class="bottom-left border-top-1px" @click="addWord">
          <div class="left-icon"></div>
        </div>
        <div class="bottom-right" @click="sendMsg">发送</div>
      </div>
      <toast ref="toast"></toast>
      <router-view @getMsg="getMsg"/>
    </div>
  </transition>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import {ERR_OK, TIMELAG} from '../../common/js/config'
  import webimHandler from 'common/js/webim_handler'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'
  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      this.getMsg(true)
    },
    data() {
      return {
        itemChecked: {},
        wordList: [],
        slide: 'slide'
      }
    },
    methods: {
      ...mapActions([
        'addListMsg',
        'setNowChat'
      ]),
      getMsg(loading = false) {
        Im.getMyWordList(loading).then(res => {
          if (res.error === ERR_OK) {
            this.wordList = res.data
            setTimeout(() => {
              this.$refs.scroll.refresh()
            }, 20)
          }
        })
      },
      choice(item) {
        this.itemChecked = item
      },
      sendMsg() {
        if (!this.itemChecked.id) {
          this.$refs.toast.show('请先选择您要发送的内容')
          return
        }
        this.userInfo = storage.get('info')
        let timeStamp = parseInt(Date.parse(new Date()) / 1000)
        let msg = {
          from_account_id: this.imInfo.im_account,
          avatar: this.userInfo.avatar,
          content: this.itemChecked.message,
          time: timeStamp,
          msgTimeStamp: timeStamp,
          nickName: this.userInfo.nickName,
          sessionId: this.userInfo.account,
          unreadMsgCount: 0,
          type: 1
        }
        if (this.nowChat.length) {
          let lastItem = this.nowChat[this.nowChat.length - 1]
          let lastTime = lastItem.created_at ? lastItem.created_at : lastItem.msgTimeStamp
          msg.is_showtime = timeStamp - lastTime > TIMELAG
        } else {
          msg.is_showtime = true
        }
        let list = [...this.nowChat, msg]
        this.setNowChat(list)
        let addMsg = {
          text: this.itemChecked.message,
          time: timeStamp,
          msgTimeStamp: timeStamp,
          fromAccount: this.currentMsg.account,
          sessionId: this.currentMsg.account,
          unreadMsgCount: 0,
          avatar: this.currentMsg.avatar,
          nickName: this.currentMsg.nickName
        }
        this.addListMsg({msg: addMsg, type: 'mineAdd'})
        this.$emit('refushBox')
        this.$router.back()
        webimHandler.onSendMsg(this.itemChecked.message, this.currentMsg.account).then(res => {
        }, () => {
          // this.$refs.toast.show('网络异常, 请稍后重试')
        })
      },
      addWord() {
        let url = this.$route.fullPath + '/add-word'
        this.$router.push({path: url})
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'imInfo',
        'nowChat',
        'ios'
      ])
    },
    components: {
      Scroll,
      Toast
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .useful-word
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 20
    background: $color-white
    .word-list
      background: $color-white
      padding-left: 15px
      padding-bottom: 50px
      .word-item
        padding: 16px 0
        display: flex
        align-items: center
        .item-left
          flex: 1
          overflow: hidden
          line-height: 21px
          white-space: normal
          word-break: break-all
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-000
        .item-right
          height: 100%
          padding: 0 15px 0 44px
          display: flex
          align-items: center
          .right-icon
            width: 20px
            height: 20px
          .icon-select.right-icon
            icon-image('./icon-select')
          .icon-unSelect.right-icon
            icon-image('./icon-uncheck')

    .word-bottom
      width: 100%
      height: 44px
      display: flex
      position: fixed
      left: 0
      right: 0
      bottom: 0
      z-index: 25
      .bottom-left
        width: 70px
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        background: $color-background
        .left-icon
          width: 21px
          height: 21px
          icon-image('./btn-install')
      .bottom-right
        flex: 1
        overflow: hidden
        line-height: 44px
        text-align: center
        background: $color-20202E
        color: $color-white
        font-family: $font-family-medium
        font-size: $font-size-16
        letter-spacing: 0.3px
</style>
