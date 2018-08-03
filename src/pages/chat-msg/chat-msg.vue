<template>
  <transition :name="slide">
    <div class="chat">
      <div class="chat-container" ref="chat">
        <scroll ref="scroll"
                :data="nowChat"
                :pullDownRefresh="pullDownRefreshObj"
                @pullingDown="onPullingDown">
          <div class="chat-list" ref="list">
            <div class="list-line"></div>
            <div class="chat-item" v-for="(item, index) in nowChat" :key="index">
              <div class="item-time" v-if="item.is_showtime">
                <span class="time-box">{{item.created_at ? item.created_at : item.msgTimeStamp | timeFormat}}</span>
              </div>
              <div class="chat-content" v-if="item.from_account_id !== imInfo.im_account">
                <div :style="{backgroundImage: 'url(' + currentMsg.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="avatar"></div>
                <div class="chat-msg-box other" v-if="item.type * 1 == 1">
                  <div class="arrow-box">
                    <div class="gray-arrow">
                      <div class="white-arrow"></div>
                    </div>
                  </div>
                  <div class="chat-msg-content-max-box">
                    <div class="chat-msg-content other">{{item.content}}</div>
                  </div>
                </div>
                <div class="chat-msg-goods" v-if="item.type * 1 == 2">
                  <img :src="item.url" class="goods-img" @load="refushBox">
                  <p class="goods-title">{{item.title}}</p>
                </div>
              </div>
              <div class="chat-content mine" v-if="item.from_account_id === imInfo.im_account">
                <div class="chat-msg-box mine">
                  <div class="chat-msg-content-max-box">
                    <div class="chat-msg-content mine">{{item.content}}</div>
                  </div>
                  <div class="arrow-box">
                    <div class="green-arrow"></div>
                  </div>
                </div>
                <div class="avatar" :style="{backgroundImage: 'url(' + userInfo.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"></div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <div class="chat-input border-top-1px">
        <div class="input-container" ref="textBox">
          <textarea class="textarea" type="text" ref="inputTxt" v-model="inputMsg" rows="1"></textarea>
        </div>
        <div class="submit-btn" @click="sendMsg">发送</div>
      </div>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Toast from 'components/toast/toast'
  import {ease} from 'common/js/ease'
  import {mapActions, mapGetters} from 'vuex'
  import webimHandler from 'common/js/webim_handler'
  import storage from 'storage-controller'
  import {Im} from 'api'
  import {ERR_OK, TIMELAG} from 'common/js/config'
  import utils from 'common/js/utils'
  export default {
    name: 'Chat',
    created() {
      this.id = this.$route.query.id
      let data = {
        'end_date': this.endDate,
        limit: 40,
        customer_im_account: this.id,
        employee_im_account: this.imInfo.im_account
      }
      Im.getMsgList(data).then((res) => {
        if (res.error === ERR_OK) {
          let list = res.data.reverse()
          this.setNowChat(list)
          let timer = setTimeout(() => {
            let startY
            if (this.listDom.clientHeight < this.chatDom.clientHeight) {
              startY = 20
            } else {
              startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
            }
            this.$refs.scroll.scrollTo(0, startY, 10, ease[this.scrollToEasing])
            clearTimeout(timer)
          }, 20)
        }
      })
    },
    mounted() {
      this.textareaDom = this.$refs.inputTxt
      this.textBoxDom = this.$refs.textBox
      this.chatDom = this.$refs.chat
      this.listDom = this.$refs.list
      document.title = this.currentMsg.nickName
      webimHandler.getC2CMsgList(this.currentMsg.account) // 消息已读处理
      this.setUnreadCount(this.currentMsg.account) // vuex
    },
    beforeDestroy() {
      this.setCurrent({})
      this.setNowChat([])
    },
    methods: {
      ...mapActions([
        'setUnreadCount',
        'setCurrent',
        'addListMsg',
        'setNowChat'
      ]),
      textHeight() {
        let timer = setTimeout(() => {
          this.textareaDom.style.height = 'auto'
          this.textareaDom.style.height = this.textareaDom.scrollHeight + 'px'
          this.textBoxDom.scrollTop = this.textareaDom.scrollHeight
          clearTimeout(timer)
        }, 20)
      },
      refushBox() {
        let timer = setTimeout(() => {
          let startY
          if (this.listDom.clientHeight < this.chatDom.clientHeight) {
            startY = 20
          } else {
            startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
          }
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0, startY, 10, ease[this.scrollToEasing])
          clearTimeout(timer)
        }, 20)
      },
      onPullingDown() {
        let heightBegin = this.listDom.clientHeight
        let data = {
          'end_date': this.endDate,
          limit: 40,
          customer_im_account: this.id,
          employee_im_account: this.imInfo.im_account
        }
        Im.getMsgList(data).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length) {
              let resData = res.data.reverse()
              let list = [...resData, ...this.nowChat]
              this.setNowChat(list)
              this.$refs.scroll.forceUpdate()
              let timer = setTimeout(() => {
                let heightEnd = this.listDom.clientHeight
                this.$refs.scroll.scrollTo(0, heightBegin - heightEnd, 10, ease[this.scrollToEasing])
                clearTimeout(timer)
              }, 30)
            } else {
              this.noMore = true
              this.page--
            }
            this.$refs.scroll.forceUpdate()
          }
        })
      },
      rebuildScroll() {
        this.nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      sendMsg() {
        let value = this.inputMsg.trim()
        if (!value) {
          this.$refs.toast.show('发送消息不能为空')
          return
        }
        let timeStamp = parseInt(Date.parse(new Date()) / 1000)
        let msg = {
          from_account_id: this.imInfo.im_account,
          avatar: this.userInfo.avatar,
          content: value,
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
          text: value,
          time: timeStamp,
          msgTimeStamp: timeStamp,
          fromAccount: this.id,
          sessionId: this.id,
          unreadMsgCount: 0,
          avatar: this.currentMsg.avatar,
          nickName: this.currentMsg.nickName
        }
        this.addListMsg(addMsg)
        this.inputMsg = ''
        this.$refs.scroll.forceUpdate()
        if (this.listDom.clientHeight > this.chatDom.clientHeight) {
          let timer = setTimeout(() => {
            let startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
            this.$refs.scroll.scrollTo(0, startY, 300, ease[this.scrollToEasing])
            clearTimeout(timer)
          }, 20)
        }
        webimHandler.onSendMsg(value, this.id).then(res => {
        }, () => {
          this.$refs.toast.show('网络异常, 请稍后重试')
        })
      }
    },
    data() {
      return {
        textareaDom: '',
        heightBoxDom: '',
        txtHeight: '36px',
        inputMsg: '',
        list: [],
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        startY: '',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        id: '',
        page: 1,
        noMore: false
      }
    },
    components: {
      Scroll,
      Toast
    },
    filters: {
      timeFormat(val) {
        if (val) {
          let res = utils.radarTimeFormat(val)
          return res.time
        }
        return ''
      }
    },
    watch: {
      inputMsg() {
        this.textHeight()
      },
      pullDownRefreshObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'imInfo',
        'nowChat',
        'ios'
      ]),
      pullDownRefreshObj: function () {
        return this.pullDownRefresh && !this.noMore ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop),
          txt: ' '
        } : false
      },
      userInfo() {
        return storage.get('info')
      },
      slide() {
        return this.ios ? '' : 'slide'
      },
      endDate() {
        if (this.nowChat.length) {
          return this.nowChat[0].created_at ? this.nowChat[0].created_at : this.nowChat[0].msgTimeStamp
        } else {
          return ''
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  @import '~common/stylus/base'
  .chat
    width: 100vw
    height: 100vh
    position: fixed
    left: 0
    top: 0
    background: $color-background
    display: flex
    flex-direction: column
    justify-content: space-between
    z-index: 200
    .chat-container
      position: absolute
      top: 0
      bottom: 50px
      left: 0
      right: 0
      width: 100%
      overflow: hidden
      .chat-list
        width: 100%
        padding-bottom: 40px
        .list-line
          height: 20px
      .chat-item
        width: 100%
        box-sizing: border-box
        padding: 0 15px
        margin-top: 15px
        .item-time
          padding-bottom: 15px
          text-align: center
          .time-box
            display: inline-block
            padding: 4px 8px
            background: #D6D6D9
            border-radius: 2px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-white
            line-height: 14px
        .chat-content
          display: flex
          width: 100%
          .avatar
            width: 45px
            height: 45px
          .chat-msg-box
            flex: 1
            overflow: hidden
            display: flex
            .chat-msg-content-max-box
              flex: 1
              overflow: hidden
              display: flex
            .chat-msg-content
              padding: 13px 15px
              border-radius: 8px
              line-height: 19px
              font-size: $font-size-medium
              font-family: $font-family-regular
              word-wrap: break-word
              word-break: break-all
            .chat-msg-content.other
              background: $color-white
              border: 0.5px solid #D6DCE0
            .chat-msg-content.mine
              background: $color-green
          .other.chat-msg-box
            margin-right: 50px
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .gray-arrow
                width:0
                height:0
                border-width: 5px 6px 5px 0
                border-style: solid
                border-color: transparent #D6DCE0 transparent transparent/*透明 灰 透明 透明 */
                position: absolute
                right: 0
                top: 17.5px
                .white-arrow
                  width:0
                  height:0
                  border-width: 5px 6px 5px 0
                  border-style: solid
                  border-color: transparent #FFF transparent transparent/*透明 灰 透明 透明 */
                  position: absolute
                  left: 1px
                  top: -5px
          .mine.chat-msg-box
            margin-left: 50px
            .chat-msg-content-max-box
              justify-content: flex-end
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .green-arrow
                width:0
                height:0
                border-width: 5px 0 5px 6px
                border-style: solid
                border-color: transparent transparent transparent $color-green/*透明 灰 透明 透明 */
                position: absolute
                left: 0
                top: 17.5px
          .chat-msg-goods
            width: 200px
            border: 0.5px solid rgba(0,0,0,0.10)
            border-radius: 8px
            background: $color-white
            margin-left: 6px
            overflow: hidden
            font-size: 0
            .goods-img
              width: 100%
            .goods-title
              line-height: 30px
              font-size: $font-size-small
              font-family: $font-family-regular
              padding: 0 10px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
        .chat-content.mine
          justify-content: flex-end

    .chat-input
      width: 100%
      box-sizing: border-box
      min-height: 38px
      background: $color-background-f9
      padding: 6px 15px
      display: flex
      align-items: center
      position: absolute
      left: 0
      right: 0
      bottom: 0
      .submit-btn
        width: 50px
        height: 36px
        border: 1px solid rgba(0,0,0,0.10)
        border-radius: 2px
        background: $color-white
        text-align: center
        line-height: 36px
        font-size: $font-size-medium
        font-family: $font-family-regular
        margin-left: 5px
      .input-container
        flex: 1
        overflow-x: hidden
        min-height: 28px
        border: 1px solid rgba(0,0,0,0.10)
        background: $color-white
        max-height: 100px
        overflow-y: auto
        padding: 8px 10px 0
        .textarea
          width: 100%
          height: auto
          padding: 0
          margin: 0
          resize: none
          border: 0 none
          outline: none
          overflow-y: visible
          display: block
          font-size: $font-size-medium



</style>
