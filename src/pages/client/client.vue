<template>
  <div class="client">
    <scroll bcColor="#fff"
            ref="scroll"
            :data="dataArray"
            :pullUpLoad="pullUpLoadObj"
            @pullingUp="onPullingUp"
    >
      <search @toNav="toSearch"></search>
      <ul class="user-list-box" v-if="userListArr.length">
        <li class="user-list-item"
            v-if="userListArr.length"
            v-for="(item,index) in userListArr"
            :key="index"
            @click="toUserList(item)"
        >
          <slide-view :useType="3" @del="delHandler" :item="item">
            <div slot="content" class="user-list-item">
              <div class="users-avatar">
                <img v-if="item.icon && item.icon.length"
                     v-for="(user,i) in item.icon"
                     class="avatar"
                     :key="i"
                     :src="user"
                />
              </div>
              <div class="item-name">{{item.name}}（{{item.number}}）</div>
            </div>
          </slide-view>
        </li>
      </ul>
      <section class="user-list-box add-list" @click="toCreateGroup">
        <div class="user-list-item">
          <div class="users-avatar add-list"></div>
          <div class="item-name">新建分组</div>
        </div>
      </section>
      <section class="status-bar" @click="showGroupList">
        <div class="left">
          <p>{{checkedGroup.name}}</p>
          <img class="icon" src="./icon-down@3x.png" alt=""/>
        </div>
        <div class="right">全部 {{total}} 位</div>
      </section>
      <div class="scroll-list-wrap" v-if="dataArray.length">
        <ul class="user-list">
          <li class="user-list-item" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
            <slide-view :useType="1" @grouping="groupingHandler" :item="item">
              <user-card :userInfo="item" slot="content" :useType="checkedGroup.orderBy"></user-card>
            </slide-view>
          </li>
        </ul>
      </div>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="customer"></exception>
      </section>
    </scroll>
    <confirm-msg ref="confirm" @confirm="msgConfirm" @cancel="msgCancel"></confirm-msg>
    <action-sheet ref="sheet" :dataArray="groupList" @changeGroup="changeGroup"></action-sheet>
    <toast ref="toast"></toast>
    <router-view @refresh="refresh"></router-view>
  </div>
</template>

<script>
  // import {ease} from 'common/js/ease'
  import Search from 'components/client-header-search/client-header-search'
  import SlideView from 'components/slide-view/slide-view'
  import Scroll from 'components/scroll/scroll'
  import UserCard from 'components/client-user-card/client-user-card'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import {Client} from 'api'
  import ActionSheet from 'components/action-sheet/action-sheet'
  import Toast from 'components/toast/toast'
  import {ERR_OK} from '../../common/js/config'
  import Exception from 'components/exception/exception'

  const groupList = [{
    orderBy: '',
    name: '预计成交率',
    isCheck: true
  }, {
    orderBy: 'follow',
    name: '最后跟进时间',
    isCheck: false
  }, {
    orderBy: 'active',
    name: '最后活跃时间',
    isCheck: false
  }, {
    orderBy: 'join',
    name: '最新加入时间',
    isCheck: false
  }]
  const LIMIT = 10
  export default {
    name: 'Client',
    data() {
      return {
        groupList: groupList,
        userListArr: [],
        dataArray: [],
        isEmpty: false,
        checkedItem: null, // 被选中的分组
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        page: 1,
        limit: LIMIT,
        isAll: false,
        total: 0
      }
    },
    created() {
      this.$emit('tabChange', 3)
      this.getGroupList()
      this.getCustomerList()
    },
    beforeDestroy() {
    },
    mounted() {
    },
    methods: {
      refresh() {
        this.isAll = false
        this.page = 1
        this.limit = LIMIT
        this.getGroupList()
        this.getCustomerList()
      },
      toSearch() {
        const path = `/client/client-search`
        this.$router.push({path})
      },
      getGroupList() {
        Client.getGroupList().then(res => {
          if (res.error === ERR_OK) {
            this.userListArr = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getCustomerList() {
        const data = {order_by: this.checkedGroup.orderBy, page: 1, limit: LIMIT}
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            this.dataArray = res.data
            this.total = res.meta.total // 共多少人
            this.isEmpty = !this.dataArray.length
            this.pullUpLoad = !!this.dataArray.length // 防止下拉报错
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      toUserList(item) {
        const path = `/client/client-user-list`
        this.$router.push({path, query: {title: item.name, id: item.id}}) // 分组名称 和 分组id
      },
      toCreateGroup() {
        const path = `/client/client-create-group`
        this.$router.push({path})
      },
      check(item) {
        const path = `/client/client-detail`
        this.$router.push({path, query: {id: item.id, pageUrl: path}})
      },
      groupingHandler(index, item) {
        const path = `/client/client-set-group`
        this.$router.push({path, query: {id: item.id}}) // 客户id
      },
      showGroupList() {
        this.$refs.sheet.show()
      },
      changeGroup() {
        const data = {order_by: this.checkedGroup.orderBy}
        Client.getCustomerList(data).then(res => {
          if (res.data) {
            this.dataArray = res.data
            this.total = res.meta.total // 共多少人
          }
        })
      },
      delHandler(index, item) {
        this.checkedItem = item
        this.$refs.confirm.show()
      },
      msgConfirm() {
        const data = {groupId: this.checkedItem.id}
        const idx = this.userListArr.findIndex(val => val.id === this.checkedItem.id)
        this.userListArr.splice(idx, 1)
        Client.delGroup(data).then(res => {
          if (res.error === ERR_OK) {
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      msgCancel() {
        this.checkedItem = null
      },
      scrollTop() {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
      },
      onPullingUp() {
        // 更新数据
        console.info('pulling up and load data')
        if (!this.pullUpLoad) return
        if (this.isAll) return this.$refs.scroll.forceUpdate()

        let page = ++this.page
        let limit = this.limit
        const data = {order_by: this.checkedGroup.orderBy, page, limit}
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            if (res.data && res.data.length) {
              let newArr = this.dataArray.concat(res.data)
              this.dataArray = newArr
              this.total = res.meta.total // 共多少人
            } else {
              this.$refs.scroll.forceUpdate()
              this.isAll = true
            }
          } else {
            this.$refs.toast.show(res.message)
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
    watch: {
      pullUpLoadObj: {
        handler() {
          if (!this.pullUpLoad) return // 防止下拉报错
          this.rebuildScroll()
        },
        deep: true
      }
    },
    computed: {
      checkedGroup() {
        let node = this.groupList.find(val => val.isCheck)
        return node
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    components: {
      Search,
      Scroll,
      SlideView,
      UserCard,
      ConfirmMsg,
      ActionSheet,
      Toast,
      Exception
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .exception-box
    padding-top: 70px

  .client
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 45px
    background-color: $color-white-fff
    .user-list-box
      background-color: $color-white-fff
      .user-list-item
        layout(row)
        height: 75px
        align-items: center
        margin-left: 15px
        border-bottom: 0.5px solid $color-col-line
        &.add-list
          border: none
        .users-avatar
          width: 45px
          height: 45px
          background-color: $color-f5f7f9
          margin-right: 10px
          overflow: hidden
          &.add-list
            opacity: 0.8
            background: $color-20202E url("./icon-newconstruction@3x.png") no-repeat center / 20px 20px
          .avatar
            float: left
            width: 15px
            height: 15px
            box-sizing: border-box
            border: 1px solid $color-white-fff

        .item-name
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-20202E
          letter-spacing: 0.6px
    .status-bar
      height: 34px
      background-color: $color-F0F2F5
      layout(row)
      justify-content: space-between
      align-items: center
      padding: 0 15px
      .left
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-20202E
        layout(row)
        align-items: center
        .icon
          margin-left: 5px
          width: 10px
          height: 5px
      .right
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-888888
    .scroll-list-wrap
      position relative
      overflow: hidden

    .user-list
      position: relative
      .user-list-item
        height: 76px
</style>
