<template>
  <section class="search-box">
    <div class="input-box" @click="clickHandler">
      <img class="icon" src="./icon-search@3x.png" alt=""/>
      <span class="txt">客户姓名</span>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    methods: {
      clickHandler() {
        this.$emit('toNav')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-box
    height: 45px
    background-color: $color-F0F2F5
    layout()
    justify-content: center
    align-items: center
    box-sizing: border-box
    padding: 4.5px 15px
    .input-box
      height: 100%
      width: 100%
      background-color: $color-white-fff
      layout(row)
      justify-content: center
      align-items: center
      .icon
        width: 12.8px
        height: 13.2px
        margin-right: 5px
      .txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-ccc

</style>
