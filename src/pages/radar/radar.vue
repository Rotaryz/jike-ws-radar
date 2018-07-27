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
                @pullingUp="onPullingUp"
                :showNoMore="showNoMore"
                :pullDownRefresh="pullDownRefreshObj"
                @pullingDown="onPullingDown">
          <div class="msgs-list">
            <div class="msgs-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
              <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
              <div class="msg-item-content">
                <img :src="item.image_url" class="msgs-left">
                <div class="msgs-right">
                  <div class="msgs-container">
                    <p class="msgs-p" v-show="item.event_no * 1 === 10000">{{item.nickname}}通过扫描他人分享的名片海报<span class="green">查看</span>了<span class="green">你的名片</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10001">{{item.nickname}}通过点击他人分享的名片链接<span class="green">查看</span>了<span class="green">你的名片</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10002">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了<span class="green">你的名片</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10003">{{item.nickname}}给你<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10004">{{item.nickname}}<span class="green">取消</span>给你点的<span class="green">赞</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10005">{{item.nickname}}<span class="green">转发</span>了你的<span class="green">名片</span>，你的人脉圈正在裂变</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10006">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">名片海报</span>，看来TA对你感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10007">{{item.nickname}}<span class="green">拨打</span>了你的<span class="green">手机</span>，请记录跟进内容</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10008">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">电话</span>，可以考虑主动沟通</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10009">{{item.nickname}}<span class="green">复制</span>了你的<span class="green">邮箱</span>，请留意邮件</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10010">{{item.nickname}}<span class="green">浏览</span>了你的<span class="green">地址</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20002">{{item.nickname}}正在对砍价活动<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20003">{{item.nickname}}正在对商品<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20004">{{item.nickname}}正在对拼团活动<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20006">{{item.nickname}}通过扫描他人分享的商品海报<span class="green">查看</span>了<span class="green">你的商品</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20007">{{item.nickname}}通过点击他人分享的商品链接<span class="green">查看</span>了<span class="green">你的商品</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20008">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了<span class="green">你的商品</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20009">{{item.nickname}}正在<span class="green">购买</span>拼团活动<span class="green">{{item.title  | titleCut}}</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20010">{{item.nickname}}提交了拼团活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20011">{{item.nickname}}提交了拼团活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20012">{{item.nickname}}正在参与砍价活动<span class="green">{{item.title  | titleCut}}</span>，成功砍掉<span class="green">{{item.total}}元</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20013">{{item.nickname}}转发了砍价活动<span class="green">{{item.title  | titleCut}}</span>，你的活动正在裂变</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20014">{{item.nickname}}通过他人分享的链接<span class="green">查看</span>了砍价活动<span class="green">{{item.title  | titleCut}}</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20015">{{item.nickname}}正在<span class="green">购买</span>砍价活动<span class="green">{{item.title  | titleCut}}</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20016">{{item.nickname}}提交了砍价活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20017">{{item.nickname}}提交了砍价活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20018">{{item.nickname}}<span class="green">转发</span>了你的商品<span class="green">{{item.title  | titleCut}}</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20019">{{item.nickname}}<span class="green">保存</span>了你的商品<span class="green">{{item.title  | titleCut}}</span>的海报图片</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20020">{{item.nickname}}提交了商品<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 30001">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了你发布的<span class="green">动态</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 30002">{{item.nickname}}给你发布的动态<span class="green">点了</span><span class="green">赞</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 30003">{{item.nickname}}<span class="green">评论</span>了你发布的<span class="green">动态</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 40001">{{item.nickname}}主动<span class="green">添加</span>了<span class="green">收货地址</span>，该客户有望成交</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 50001">{{item.nickname}}正在向你<span class="green">咨询</span>，请做好准备应答</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60001">{{item.nickname}}通过扫描他人分享的小店海报<span class="green">访问</span>了<span class="green">你的小店</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60002">{{item.nickname}}通过扫描他人分享的小店链接<span class="green">访问</span>了<span class="green">你的小店</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60003">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了<span class="green">你的海报</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60004">{{item.nickname}}<span class="green">转发</span>了你的<span class="green">小店</span>，你的人脉圈正在裂变</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60005">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">小店海报</span>，看来TA对你感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60006">{{item.nickname}}正在<span class="green">查看</span>你的<span class="green">名片</span>，看来TA对你感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60007">{{item.nickname}}给你的名片<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60008">{{item.nickname}}正在<span class="green">查看</span>拼团活动<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60009">{{item.nickname}}给拼团活动<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60010">{{item.nickname}}正在<span class="green">查看</span>砍价活动<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60011">{{item.nickname}}给砍价活动<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60012">{{item.nickname}}正在<span class="green">查看</span>商品<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 60013">{{item.nickname}}给商品<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                  </div>
                  <img src="./icon-pressed@2x.png" class="msgs-rt">
                </div>
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
  import utils from 'common/js/utils'
  export default {
    name: 'Radar',
    created() {
      if (!this.imIng) {
        this.$emit('login')
      }
      Im.getRadarList(0, 30, this.userInfo.id).then((res) => {
        if (res.error === ERR_OK) {
          this.list = res.data
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 20)
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
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        showNoMore: false
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
        Im.getRadarList(0, 30, this.userInfo.id).then((res) => {
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
        if (this.showNoMore) return
        Im.getRadarList(this.list.length, 30, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            let list = res.data
            if (!list.length) {
              this.showNoMore = true
            } else {
              this.list = [...this.list, ...list]
            }
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      onPullingDown() {
        Im.getRadarList(0, 30, this.userInfo.id).then((res) => {
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
      rebuildScroll() {
        this.nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      }
    },
    filters: {
      titleCut(val) {
        if (val && val.length > 8) {
          return val.slice(0, 8) + '···'
        } else {
          return val
        }
      },
      timeFormat(val) {
        if (val) {
          let res = utils.radarTimeFormat(val)
          return res.time
        }
        return ''
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
      pullDownRefreshObj: function () {
        return this.pullDownRefresh && !this.noMore ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop),
          txt: '没有更多了'
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
      },
      pullDownRefreshObj: {
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
    .container
      width: 100%
      height: 100%
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
      padding: 10px 15px 0
      .msgs-item
        margin-top: 15px
        .item-time
          font-family: PingFangSC-Medium
          font-size: $font-size-14
          color: #20202E
          padding: 10px 0 15px
        .msg-item-content
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
