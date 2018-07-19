<template>
  <div id="app" @touchmove.prevent>
    <ceiling ref="ceiling"></ceiling>
    <router-view @login="login"/>
    <tab></tab>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tab from 'components/tab/tab'
  import Ceiling from 'components/ceiling/ceiling'

  const COMPONENT_NAME = 'App'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {}
    },
    created() {
      console.log(process.env)
    },
    methods: {
      login() {
        this.$refs.ceiling.login()
      }
    },
    components: {
      Tab,
      Ceiling
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
