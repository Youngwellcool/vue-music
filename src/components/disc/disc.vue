<template>
  <transition name="slide">
    <music-list :bgImg="bgImg" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
    import musicList from 'components/music-list/music-list';
    import {mapGetters} from 'vuex';
    import {getDiscSongList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    export default {
      computed: {
        ...mapGetters([
          'disc',
        ]),
        title() {
          return this.disc.dissname
        },
        bgImg() {
          return this.disc.imgurl
        }
      },
      created() {
        this._getDiscSongList();
      },
      methods: {
        _getDiscSongList() {
          getDiscSongList(this.disc.dissid).then((res) => {
            console.log(res);
            if(res.code === ERR_OK) {
              console.log(res.data.cdlist.songlist)
            }
          })
        },

      },
      components: {
        musicList
      },
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
