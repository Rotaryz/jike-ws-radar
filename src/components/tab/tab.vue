<template>
  <div class="tab border-top-1px" v-show="tabMode === mode.show">
    <div class="tab-item" v-for="(item, index) in tabList" :key="index">
      <div class="item-container" @click="changeTab(item, index)">
        <img :src="'../../static/img/' + (index === activeIndex ? item.activeIcon : item.icon)" class="icon">
        <p class="icon-text">{{item.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {tabMode} from 'common/js/constants'

  const COMPONENT_NAME = 'Tab'
  const TABS = [
    {text: '雷达', path: '/radar', id: 1, icon: 'icon-radar_tabbar@2x.png', activeIcon: 'icon-radar_selected@2x.png'},
    {text: '消息', path: '/news', id: 2, icon: 'icon-news_tabbar@2x.png', activeIcon: 'icon-news_selected@2x.png'},
    {text: '客户', path: '/client', id: 3, icon: 'icon-customer_tabbar@2x.png', activeIcon: 'icon-customer_selected@2x.png'},
    {text: '我的', path: '/mine', id: 4, icon: 'icon-my_tabbar@2x.png', activeIcon: 'icon-my_selected@2x.png'}
  ]
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        tabList: TABS,
        activeIndex: 0,
        mode: tabMode
      }
    },
    computed: {
      ...mapGetters([
        'tabMode'
      ])
    },
    created() {
    },
    methods: {
      changeTab(item, index) {
        if (index === this.activeIndex) {
          return
        }
        this.activeIndex = index
        this.$router.push(item.path)
      }
    },
    watch: {
      '$route'(to) {
        let path = to.path
        let routeArr = this.tabList.filter((item) => {
          return item.path === path
        })
        if (routeArr.length) {
          this.activeIndex = routeArr[0].id - 1
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .tab
    position: fixed
    bottom: 0
    width: 100vw
    height: 45px
    background: $color-white
    display: flex
    .tab-item
      flex: 1
      overflow: hidden
      height: 45px
      .item-container
        overflow: hidden
        width: 100%
        height: 100%
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        font-size: 0
        .icon
          width: 20px
          height: 20px
          margin-bottom: 3px
        .icon-text
          font-family: $font-family-light
          font-size: $font-size-small-s
</style>
