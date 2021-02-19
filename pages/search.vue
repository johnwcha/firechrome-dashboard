<template>
  <v-layout row justify-center align-center>
    <v-flex>
      <v-row>
        <v-col cols="7" class="ml-5">
          <div class="iframe_div">
            <youtube
              ref="youtube"
              :video-id="videoId"
              :player-vars="playerVars"
              :resize="true"
              :fit-parent="true"
            />
            <p> [T] {{ subtrad }} </p>
            <p> [S] {{ subsimp }} </p>
          </div>
        </v-col>
        <v-col class="mr-5">
          <v-card outlined>
            <v-card-actions>
              <v-text-field v-model="keyword" append-outer-icon="mdi-send" label="Search" placeholder="Traditional characters ONLY" @click:append-outer="parse" />
            </v-card-actions>
          </v-card>
          <v-simple-table dense>
            <template v-for="item in videoCollection">
              <thead v-if="item.entry.length > 0" :key="item.title">
                <tr>
                  <th class="text-left subtitle-1 blue--text">
                    {{ item.title }}
                  </th>
                  <th class="text-right" />
                </tr>
              </thead>
              <tbody v-for="entry in item.entry" :key="entry.start">
                <tr>
                  <td v-html="entry.html" />
                  <td class="text-right">
                    <v-icon color="blue" @click="rewind5()">
                      mdi-rewind-5
                    </v-icon>
                    <v-icon color="green" @click="playSegment(entry)">
                      mdi-play-circle
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
// import OpenCC from 'opencc-js'

Vue.use(VueYoutube)

export default {
  data () {
    return {
      subtrad: '',
      subsimp: '',
      catItems: [],
      videoCollection: [],
      keyword: '',
      vid: '',
      vocab: '',
      videoId: 'qKTAf5hSyzY',
      repeatwords: [],
      skipwords: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '哦', '喲', '呢', '啊', '呀', '呐', '唉', '哎', '了', '我', '', '，', '。', '！', '？', '《', '》', ',', '.', '?', ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      playerVars: {
        autoplay: 0,
        controls: 1,
        fs: 1,
        iv_load_policy: 3, // not working
        loop: 1, // not working
        modestbranding: 0, // no effect
        rel: 0,
        showinfo: 0
      }
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    async convertChar (str) {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      this.subsimp = convert(str)
      // console.log(this.subsimp)
      if (str.length !== this.subsimp.length) {
        // this.subsimp = this.subsimp.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        this.subsimp = this.subsimp.replace('\r', '')
        // console.log(JSON.stringify(this.subsimp))
      }
    },
    playSegment (obj) {
      // console.log(obj)
      // console.log( this.$refs.youtube )
      // const OpenCC = require('opencc-js')
      // OpenCC.Converter('tw', 'cn').then((convert) => { this.subsimp = convert(obj.sub) })
      this.convertChar(obj.sub)
      this.subtrad = obj.sub
      if (obj.vid === this.videoId) { // same video
        this.$refs.youtube.player.seekTo(obj.start, true)
      } else {
        this.videoId = obj.vid
        this.$refs.youtube.player.getPlayerState().then((state) => {
          this.$refs.youtube.player.loadVideoById(this.videoId, obj.start)
          // console.log('player state :', state)
        })
      }
    },
    rewind5 () {
      this.$refs.youtube.player.getCurrentTime().then((time) => {
        if (time > 5) {
          this.$refs.youtube.player.seekTo(time - 5, true)
          this.$refs.youtube.player.playVideo()
        } else {
          this.$refs.youtube.player.seekTo(0, true)
          this.$refs.youtube.player.playVideo()
        }
      })
    },
    parse () {
      if (this.keyword.trim() === '') { return }
      this.doSearch(this.keyword.trim())
    },
    gsearch (keyword, res) {
      let g1 = ''
      let g2 = ''
      if (keyword.includes('x')) {
        const tmp = keyword.split(' ').join('').split('x')
        g1 = tmp[0]
        g2 = tmp[1]
      }
      if (keyword.includes('X')) {
        const tmp = keyword.split(' ').join('').split('X')
        g1 = tmp[0]
        g2 = tmp[1]
      }
      if (g2 === '') {
        this.vsearch(g1, res)
      } else {
        res.forEach((item) => {
          this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
            this.catItems = []
            for (const prop in item.data()) {
              const sub = item.data()[prop]
              if (sub.sub.includes(g2)) {
                const p1 = String(sub.sub).indexOf(g1)
                const p2 = String(sub.sub).lastIndexOf(g2)
                if (p1 < p2) {
                  let tag = sub.sub.split(g1).join(`<span class="pink--text">${g1}</span>`)
                  tag = tag.split(g2).join(`<span class="pink--text">${g2}</span>`)
                  this.catItems.push({ html: tag, vid: item.id, start: sub.start, sub: sub.sub })
                  // this.videoCollection.push({ html: tag, vid: item.id, start: sub.start, sub: sub.sub })
                }
              }
            }
            this.videoCollection.push({ title: meta.data().title, entry: this.catItems })
          }).catch((err) => { console.log(err.message) })
        })
      }
      if (this.videoCollection.length === 0) {
        console.warn('no data by the pattern')
      }
    },
    vsearch (keyword, res) {
      res.forEach((item) => {
        // console.warn(item.id, item.data())
        this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
          // console.log(meta.data())
          this.catItems = []
          for (const prop in item.data()) {
            const sub = item.data()[prop]
            // console.log(sub.sub)
            if (sub.sub.includes(keyword)) {
              const tag = sub.sub.split(keyword).join(`<span class="pink--text">${keyword}</span>`)
              this.catItems.push({ html: tag, vid: item.id, start: sub.start, sub: sub.sub })
            }
            // console.log(this.catItems)
          }
          this.videoCollection.push({ title: meta.data().title, entry: this.catItems })
          if (this.videoCollection.length === 0) {
            console.warn('no data by the key phrase')
          }
        })
      })
    },
    async doSearch (keyword) {
      const firstChar = keyword.split('')[0]
      this.videoCollection = []
      const res = await this.$fire.firestore.collection(firstChar).get()
      // console.log(res.size)
      if (res.size > 0) {
        if (keyword.includes('x') || keyword.includes('X')) {
          this.gsearch(keyword, res)
        } else {
          this.vsearch(keyword, res)
        }
      } else {
        console.warn('no data by the keyword')
      }
    }
  }
}
</script>
