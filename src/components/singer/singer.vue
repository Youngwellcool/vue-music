<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="listView"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex' // 引入vuex提供的mapMutations语法糖(修改state中的数据的方法的简写映射)
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.listView.refresh();
      },
      selectSinger(singer) {
        console.log(singer);
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer)  // 执行store/mutations.js中的[types.SET_SINGER]方法 (state.singer = singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code == ERR_OK){
            this.singers = res.data.list;
//            console.log(this.singers)
            this.singers = this._normalizeSinger(this.singers)
//            console.log(this.singers)
          }
        })
      },
      /**
       * 规范化 获取到的歌手列表数据
       * 按照歌手的名字从A-Z归类，并把排名前十的歌手放到hot对象中
       * @param list
       * @private
       * @return map对象
       */
      _normalizeSinger(list) {
        let map = {
          hot: {
            title:HOT_NAME, // 技巧：HOT_NAME用变量，避免写死
            items: []
          }
        }
        list.forEach((item,index) => {
            // 【热门歌手】把排序小于HOT_SINGER_LEN的歌手放入hot.items中
          if(index < HOT_SINGER_LEN) {
//            map.hot.items.push({
//              id: item.Fsinger_mid,
//              name: item.Fsinger_name,
//              avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
//            })

            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }
          const key = item.Findex; // 分类标记A~Z
          // 如果map中还没有该key分类标记，就新增该key分类标记
          if(!map[key]){
            map[key] = {
              title: key,
              items: []
            }
          }
          // TODO 此处的items.push的对象和上面map.hot.items.push的对象是一样的，就可以把这个对象抽象为Singer对象，定义在common/js/singer.js中
//          map[key].items.push({
//            id: item.Fsinger_mid,
//            name: item.Fsinger_name,
//            avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
//          })

          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        })
        console.log(map);


        // 因为经过以上步骤，拿到的map并不是有序的，我们要的顺序是：先是热门，然后是A到Z排列的顺序(hot-A-Z)，所以，以下是对map做进一步的排序
        let hot = [];
        let ret = [];
        for(let key in map){
          let val = map[key];
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)  // 如果是字母标记就放入ret数组中
          }else if(val.title === HOT_NAME){
            hot.push(val) // 如果是热门标记，就放入hot数组中
          }
        }

        /**
         * 将ret数组，按照title字段，升序排列(A-Z)
         * charCodeAt()方法返回指定位置的字符的 Unicode 编码
         */
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret);
      },
      // 使用对象展开运算符将 mutations 混入 methods 对象中
      ...mapMutations({
        setSinger: 'SET_SINGER' // 将this.setSinger()方法映射为this.$store.commit('SET_SINGER'),也就是执行了store/mutations.js中的[types.SET_SINGER]方法，this.setSinger()是执行这个方法的简写
      })
    },
    components: {
      ListView
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
