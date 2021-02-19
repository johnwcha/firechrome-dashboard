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
            <v-text-field v-model="vid" @change="parseURL" />
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">
                    JSON.stringify(this.videoCollection)
                  </th>
                  <th class="text-left">
                    <v-btn outlined small @click="saveDoc">
                      save doc
                    </v-btn>
                  </th>
                </tr>
              </thead>
            </v-simple-table>
            <v-textarea
              v-model="taVocab"
              outlined
              label="paste JSON Object here"
              @change="parseJson"
            />
          </div>
        </v-col>
        <v-col class="mr-5">
          <v-simple-table dense>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    Time
                  </th>
                  <th class="text-left">
                    Subtitle
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, i) in videoCollection"
                  :key="i"
                >
                  <td style="font-weight: bolds; width: 140px;">
                    <v-text-field v-model="item.id" @change="adjustTime(item, i)" />
                  </td>
                  <td @click="playSegment(item, i)">
                    <v-text-field v-model="item.sub" />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <material-alert
            :color="alertColor"
            dark
            dismissible
          >
            {{ indexCount }} characters indexed ...
          </material-alert>
          <v-btn :disabled="videoCollection.length==0 || vid==''" outlined small @click="save_db">
            start indexing
          </v-btn>
          <v-card outlined>
            <v-card-actions>
              <v-select v-model="ccSel" :items="ccItems" label="CC" />
              <v-select v-model="accessSel" :items="accessItems" label="Access" />
            </v-card-actions>
            <v-card-actions>
              <v-select v-model="genreSel" :items="genreItems" label="Genre" />
              <v-select v-model="levelSel" :items="levelItems" label="Level" />
            </v-card-actions>
            <v-card-actions>
              <v-text-field v-model="title" label="Title" />
            </v-card-actions>
            <v-card-actions>
              <v-text-field v-model="duration" label="duration" />
              <v-btn outlined small :disabled="duration==='' || title===''" @click="save_meta">
                save meta & doc
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-text-field v-model="total_char" label="total_char" />
              <v-text-field v-model="video_length" label="video_length" />
              <v-btn outlined small :disabled="video_length==='' || total_char===''" @click="update_stats">
                update stats
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
    <!-- <v-snackbar
      :timeout="1000"
      :value="saving"
      absolute
      bottom
      :color="alertColor"
    >
      {{indexCount}} characters indexed ...
    </v-snackbar> -->
  </v-layout>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import MaterialAlert from '~/components/base/MaterialAlert'

Vue.use(VueYoutube)

export default {
  components: {
    MaterialAlert
  },
  data () {
    return {
      stats_obj: null,
      unique_char: [],
      total_char: '',
      video_length: '',
      accessItems: [1, 2, 3, 4],
      accessSel: 1,
      ccItems: ['eng', 'soft', 'hard', 'none'],
      ccSel: 'eng',
      genreItems: ['劇情 💕', '記錄 🎞', '動畫 😁', '單口 🙎‍♂️', '新聞 ☰', '歌曲 ♫'],
      genreSel: '劇情 💕',
      levelItems: ['novice', 'intermediate', 'advanced'],
      levelSel: 'novice',
      duration: '',
      title: '',
      alertColor: 'info',
      indexCount: 0,
      saving: false,
      videoCollection: [],
      taVocab: '',
      vid: '',
      vocab: '',
      videoId: 'qKTAf5hSyzY',
      repeatwords: [],
      skipwords: ['：', '、', '"', '\'', '-', '_', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '哦', '喲', '呢', '啊', '呀', '呐', '唉', '哎', '了', '我', ' ', '，', '。', '！', '？', '《', '》', ',', '.', '?', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
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
    this.init()
  },
  methods: {
    async saveDoc () {
      const res = await this.$fire.firestore.collection('-video_coll').doc(this.videoId).set({ sub: this.videoCollection })
      console.warn(res)
    },
    update_stats () {
      // video_count +1, total_char, video_length, unique_char[]
      const vCount = this.stats_obj.video_count + 1
      const tChar = this.stats_obj.total_char + Number(this.indexCount)
      const vLength = this.stats_obj.video_length + Number(this.video_length)
      const obj = { video_count: vCount, total_char: tChar, video_length: vLength, unique_char: this.unique_char }
      // console.log(obj)
      this.$fire.firestore.collection('-video_stats').doc('stats_doc').set(obj).then(() => {
        console.log('stats update success')
      }).catch((err) => { console.log(err.message) })
    },
    save_meta () {
      const obj = { level: this.levelSel, access: this.accessSel, cc: this.ccSel, genre: this.genreSel, duration: Number(this.duration), title: this.title }
      this.$fire.firestore.collection('-video_meta').doc(this.videoId).set(obj).then(() => {
        console.log('meta saved success')
      }).catch((err) => { console.log(err.message) })
      this.saveDoc()
    },
    save_db () {
      this.videoCollection.forEach((obj) => {
        // console.log(obj.sub)
        this.repeatwords = []
        this.indexCount = 0
        obj.sub.split('').forEach((char) => {
          if (!this.skipwords.includes(char)) {
            if (!this.repeatwords.includes(char)) {
              this.repeatwords.push(char)
              this.saving = true
              if (!this.unique_char.includes(char)) {
                this.unique_char.push(char)
              }
              this.insert(char, obj)
            }
          }
        })
      })
    },
    insert (char, obj) {
      // sentence: this.$fireModule.firestore.FieldValue.arrayUnion({ start: obj.start, sub: obj.sub })
      this.$fire.firestore.collection(char).doc(this.videoId).set({ [`${obj.id}`]: { start: obj.start, sub: obj.sub } }, { merge: true }
      ).then(() => {
        console.log('update success')
        this.indexCount += 1
      }).catch((err) => { console.log(err.message) })
    },
    adjustTime (item, index) {
      // console.log(item)
      const time = item.id.split(':')
      this.videoCollection[index].start = parseInt(time[0]) * 60 * 60 + parseInt(time[1]) * 60 + parseFloat(time[2])
      this.taVocab = JSON.stringify(this.videoCollection)
    },
    playSegment (obj, i) {
      this.counter = i
      this.$refs.youtube.player.seekTo(obj.start, true)
      this.$refs.youtube.player.playVideo()
    },
    parseURL () {
      const temp = this.vid.split('&')
      this.videoId = temp[0].split('?v=')[1]
      // console.log(temp[0].split('?v=')[1])
    },
    parseJson () {
      this.videoCollection = JSON.parse(this.taVocab)
    },
    async init () {
      const res = await this.$fire.firestore.collection('-video_stats').doc('stats_doc').get()
      // console.log(res.data())
      this.stats_obj = res.data()
      this.total_char = res.data().total_char.toString()
      this.unique_char = res.data().unique_char
      this.video_count = res.data().video_count.toString()
      this.video_length = (res.data().video_length / 60).toFixed(2).toString()
    }
  }
}
</script>
