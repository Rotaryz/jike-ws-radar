<template>
  <transition :name="slide">
    <div class="useful-word">
      <scroll :data="latelyList" :bcColor="'#ffffff'" ref="scroll">
        <div class="word-list">
          <div class="word-item">
            <div class="item-left"></div>
            <div class="item-right">
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import {ERR_OK} from '../../common/js/config'
  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      Im.getLastGroupMsg().then(res => {
        if (res.error === ERR_OK) {
          let msg = {
            time: res.data.created_at || '',
            lastMsg: res.data.content || ''
          }
          this.setGroupItem(msg)
        }
      })
    },
    mounted() {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    data() {
      return {
        slide: 'slide'
      }
    },
    methods: {
      ...mapActions([
        'setCurrent',
        'setGroupItem',
        'setNewsGetType'
      ]),
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item.sessionId
        }
        this.setCurrent(currentMsg)
        let url = '/chat/' + item.sessionId
        this.$router.push(url)
      },
      createGroup() {
        let url = '/new-group-msg'
        this.$router.push(url)
      }
    },
    computed: {
      ...mapGetters([
        'latelyList',
        'groupItem',
        'newsGetType'
      ])
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
      padding: 0 15px

</style>
