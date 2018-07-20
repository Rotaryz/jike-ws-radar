<template>
  <transition :name="slide">
    <article class="client-add-user">
      <div class="user-list-wrapper">
        <scroll :data="dataArray">
          <ul class="user-list">
            <li class="user-box" v-if="dataArray.length" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
              <div :class="['check-box',item.is_member?'un-check':'' ,item.isCheck?'active':'']"></div>
              <img class="user-icon" :src="item.image_url" alt="">
              <section class="base-info">
                <div class="name">{{item.name}}</div>
                <div class="status">{{item.last_follow_day}}</div>
              </section>
              <div class="ai">AI预计成交率{{item.conversion_rate}}%</div>
            </li>
          </ul>
        </scroll>
      </div>
      <footer class="btn" @click="submit">确定</footer>
      <toast ref="toast"></toast>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Client} from 'api'
  import Toast from 'components/toast/toast'
  import {ERR_OK} from '../../common/js/config'
  import {mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'

  export default {
    name: 'ClientAddUser',
    data() {
      return {
        dataArray: [],
        id: null
      }
    },
    created() {
      this.id = this.$route.query.id
      const data = {
        group_id: this.id
      }
      Client.getCustomerList(data).then(res => {
        if (res.data) {
          this.dataArray = res.data.map(item => {
            return {...item, isCheck: false}
          })
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      this.$emit('refresh')
      next(true)
    },
    methods: {
      check(item) {
        item.isCheck = !item.isCheck
      },
      submit() {
        let arr = []
        this.dataArray.map(item => {
          item.isCheck && arr.push({customer_id: item.id})
        })
        const data = {
          group_id: this.id,
          data: arr
        }
        Client.addGroupCustomer(data).then(res => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show('保存成功')
            setTimeout(() => {
              this.$emit('refresh')
              this.$router.back()
            }, 300)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    watch: {},
    components: {
      Toast,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .client-add-user
    fill-box()
    background-color: $color-white-fff
    z-index: 10
    .user-list-wrapper
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 45px
      overflow: hidden
      .user-list
        padding-left: 15px
        .user-box
          layout(row, block, no-warp)
          align-items: center
          padding: 15px 0
          border-bottom: 0.5px solid $color-col-line
          height: 45px
          .check-box
            width: 21px
            height: 21px
            border-radius: 50%
            border: 1px solid $color-col-line
            box-sizing: border-box
            background :url("")
            transition :all 0.1s
            &.active
              background: url("./icon-selected@3x.png") no-repeat center / 100%
              border: none
            &.un-check
              background: url("./icon-nocheck@3x.png") no-repeat center / 100%
              border: none
          .user-icon
            width: 45px
            height: 45px
            opacity: 0.8
            margin: 0 10px
          .base-info
            flex: 1
            height: 100%
            layout()
            justify-content: space-around
            .name
              font-family: $font-family-regular
              font-size: $font-size-16
              color: $color-20202E
              letter-spacing: 0.6px
            .status
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-56BA15
          .ai
            width: 105px
            height: 100%
            padding-right: 15px
            padding-top: 5px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-888888

    .btn
      height: 45px
      position: fixed
      bottom: 0
      left: 0
      right: 0
      line-height: 45px
      text-align: center
      background-color: $color-20202E
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-white-fff
      letter-spacing: 0.3px
      z-index: 2
</style>
