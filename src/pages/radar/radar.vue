<template>
  <div>
    <div class="radar">
      <span class="msg-box" :class="customCount ? '' : 'show'" @click.stop="clearNum">
        <img src="./icon-news_up@3x.png" class="msg-arrow">
        <span class="msg-hint">{{customCount}}条信息</span>
      </span>
      <div class="container">
        <scroll ref="scroll"
                :data="list"
                :bcColor="'#f1f2f5'"
                :pullUpLoad="pullUpLoadObj"
                @pullingUp="onPullingUp">
          <div class="msgs-list">
            <div class="msgs-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
              <img :src="item.image_url" class="msgs-left">
              <div class="msgs-right">
                <div class="msgs-container">
                  <p class="msgs-p" v-show="item.event_no * 1 === 10000">{{item.nickname}}<span class="green">查看</span>了<span class="green">你的名片</span>第{{item.count_sum}}次，看来TA对你感兴趣</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10001">{{item.nickname}}给你<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10002">{{item.nickname}}<span class="green">取消</span>给你点的<span class="green">赞</span></p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10003">{{item.nickname}}<span class="green">复制</span>了你的<span class="green">邮箱</span>，请留意邮件</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10004">{{item.nickname}}<span class="green">浏览</span>了你的<span class="green">地址</span></p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10005">{{item.nickname}}<span class="green">转发</span>了你的<span class="green">名片</span>，你的人脉圈正在裂变</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10006">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">名片海报</span>，看来TA对你感兴趣</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10007">{{item.nickname}}<span class="green">拨打</span>了你的<span class="green">手机</span>，请记录跟进内容</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10008">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">电话</span>，可以考虑主动沟通</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 10009">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">名片海报</span></p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 20001">{{item.nickname}}正在<span class="green">查看</span>你的<span class="green">产品</span>第{{item.count_sum}}次，请把握商机</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 20002">{{item.nickname}}正在<span class="green">查看</span><span class="green">{{item.name | titleCut}}</span>，可能对该产品感兴趣</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 20003">{{item.nickname}}正在对<span class="green">{{item.name | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 20004">{{item.nickname}}<span class="green">转发</span>了<span class="green">{{item.name | titleCut}}</span>，可能在咨询他人建议</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 30001">{{item.nickname}}正在<span class="green">查看</span>你发布的<span class="green">动态</span>第{{item.count_sum}}次</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 30002">{{item.nickname}}给你发布的动态<span class="green">点了</span><span class="green">赞</span></p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 40001">{{item.nickname}}正在<span class="green">查看</span>你公司的<span class="green">官网</span>第{{item.count_sum}}次</p>
                  <p class="msgs-p" v-show="item.event_no * 1 === 50001">{{item.nickname}}正在向你<span class="green">咨询</span>，请做好准备应答</p>
                </div>
                <img src="./icon-pressed@2x.png" class="msgs-rt">
              </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import {mapActions, mapGetters} from 'vuex'
  import {Im} from 'api'
  import {ERR_OK} from 'common/js/config'
  import storage from 'storage-controller'
  import {ease} from 'common/js/ease'
  export default {
    name: 'Radar',
    created() {
      if (!this.imIng) {
        this.$emit('login')
      }
      Im.getRadarList(this.page, 30, this.userInfo.id).then((res) => {
        if (res.error === ERR_OK) {
          this.list = res.data
        }
      })
    },
    data() {
      return {
        list: [],
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        page: 1,
        scrollToEasing: 'bounce'
      }
    },
    methods: {
      ...mapActions([
        'setCustomCount',
        'setImIng',
        'setImInfo'
      ]),
      toDetail(item) {
        let url = '/radar/client-detail'
        this.$router.push({path: url, query: {id: item.customer_id, pageUrl: url}})
      },
      clearNum() {
        this.page = 1
        let limit = this.list.length + this.customCount
        Im.getRadarList(this.page, limit, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.setCustomCount('clear')
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
              this.$refs.scroll.scrollTo(0, 0, 300, ease[this.scrollToEasing])
            }, 20)
          }
        })
      },
      onPullingUp() {
        this.page++
        Im.getRadarList(this.page, 30, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            let list = res.data
            if (!list.length) {
              this.page--
            } else {
              this.list = [...this.list, ...list]
            }
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      rebuildScroll() {
        this.nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      }
    },
    filters: {
      titleCut(val) {
        if (val.length > 8) {
          return val.slice(0, 8) + '···'
        } else {
          return val
        }
      }
    },
    computed: {
      ...mapGetters([
        'customCount',
        'imIng'
      ]),
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      userInfo() {
        return storage.get('info')
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
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
  .radar
    width: 100vw
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 45px
    background: $color-background
    display: flex
    flex-direction: column
    .container
      flex: 1
      overflow: hidden
      position: relative
    .msg-box
      min-width: 95px
      height: 30px
      background: $color-white
      border-radius: 15px 0 0 15px
      line-height: 30px
      font-size: 0
      position: fixed
      top: 15px
      right: 0
      z-index: 9
      transition: all .3s
      .msg-arrow
        width: 7px
        height: 8px
        padding-bottom: 1px
        margin-left: 12px
      .msg-hint
        font-size: $font-size-medium
        color: $color-text-56
        margin: 0 10px
    .show.msg-box
      right: -100%
    .msgs-list
      padding: 50px 15px 0
      .msgs-item
        margin-top: 15px
        width: 100%
        height: 55px
        background: $color-white
        border: 0.5px solid rgba(32,32,46,0.10)
        box-shadow: 0 4px 12px 0 rgba(43,43,145,0.04)
        border-radius: 2px
        display: flex
        justify-content: space-between
        align-items: center
        .msgs-left
          margin: 0 10px
          width: 40px
          height: 40px
          border: 0.5px solid rgba(32,32,46,0.10)
        .msgs-right
          flex: 1
          overflow: hidden
          margin-right: 13.5px
          height: 100%
          display: flex
          justify-content: space-between
          align-items: center
          .msgs-container
            flex: 1
            overflow: hidden
            height: 100%
            display: flex
            align-items: center
            .msgs-p
              line-height: 18px
              font-family: $font-family-regular
              font-size: $font-size-medium
              .green
                color: $color-text-56
          .msgs-rt
            width: 7.5px
            height: 11.5px
            margin-left: 33px
</style>
