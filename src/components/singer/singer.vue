<template>
  <div>歌手</div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config'
  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code == ERR_OK){
            this.singers = res.data.list;
            console.log(this.singers)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
