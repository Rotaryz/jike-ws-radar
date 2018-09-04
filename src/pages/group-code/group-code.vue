<template>
  <div class="group-box">
    <Scroll bcColor="#f1f2f5">
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  // import { Business } from 'api'
  // import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'

  export default {
    name: 'group-code',
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
    },
    computed: {
      userInfo() {
        return storage.get('info')
      },
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
  .group-box
    position: fixed
    background: $color-background
    z-index: 21
    left: 0
    right: 0
    bottom: 0
    top: 0
</style>
