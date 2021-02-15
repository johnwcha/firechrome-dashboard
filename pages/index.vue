<template>
  <v-row justify="center" align="center">
    <v-text-field
      v-model="pattern"
      @change="patternSearch"
    >
    </v-text-field>
    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <material-stats-card
        class="my-5"
        color="info"
        icon="mdi-twitter"
        title="# of unique chars indexed"
        value="+2246"
        sub-icon="mdi-clock"
        sub-text="Just Updated"
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <material-stats-card
        color="pink"
        icon="mdi-poll"
        title="total # of chars indexed"
        value="115521"
        sub-icon="mdi-tag"
        sub-text="Tracked from Google Analytics"
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <material-stats-card
        color="success"
        icon="mdi-store"
        title="total # of minutes of video"
        value="34245"
        sub-icon="mdi-calendar"
        sub-text="Last 24 Hours"
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <material-stats-card
        color="orange"
        icon="mdi-sofa"
        title="# of videos indexed"
        value="184"
        sub-icon="mdi-alert"
        sub-icon-color="red"
        sub-text="Get More Space..."
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <material-card
        color="purple"
        class="px-5 py-3 my-6"
      >
        <template #heading>
          <div class="display-1 font-weight-light">
            Employees Stats
          </div>

          <!-- <div class="subtitle-1 font-weight-light">
            New employees on 15th September, 2016
          </div> -->
        </template>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
          />
        </v-card-text>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'
import MaterialCard from '~/components/base/MaterialCard'
import MaterialStatsCard from '~/components/base/MaterialStatsCard'
export default {
  components: {
    MaterialCard,
    MaterialStatsCard
  },
  data () {
    return {
      pattern: '',
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: 'City',
          value: 'city',
          align: 'right'
        }
      ],
      items: [
        {
          id: 1,
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        },
        {
          id: 4,
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        },
        {
          id: 5,
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }
      ]
    }
  },
  mounted () {
    // console.log(this.$fire)
    this.init()
  },
  methods: {
    async init () {
      const res = await this.$fire.firestore.collection('-video_meta').get()
      res.forEach((item) => {
        console.log(item.data())
      })
    },
    searchPhraseByFirstChar (item) {
      this.vocabCollection = []
      const keyword = item.split('')[0]
      this.$fire.firestore.collection('-char_index').doc(keyword).get().then((doc) => {
        // console.log( doc );
        if (doc.exists) {
          console.log(doc.data())
          // this.vocabCollection = doc.data().vocab
          let found = false
          doc.data().vocab.forEach((phrase) => {
            if (phrase.includes(item)) {
              found = true
              this.vocabCollection.push({ vocab: phrase, html: phrase.split(item).join('<span style="color:red">' + item + '</span>') })
            }
          })
          console.log(this.vocabCollection)
          if (!found) {
            this.snackbar = true
            this.snackbar_text = 'Sorry. No data by the keyword：' + item
            this.snackbar_color = 'warning'
          }
        } else {
          this.snackbar = true
          this.snackbar_text = 'Sorry. No data by the keyword：' + item
          this.snackbar_color = 'warning'
        }
        this.searchBusy = false
      }).catch((error) => { console.log(error.message) })
    },
    getPhrase (item) {
      console.log(item)
      this.videoList = []
      this.videoListOrig = []
      this.searchBusy = true
      this.$fire.firestore.collection(item).get().then((snapshots) => {
        // console.log(snapshots)
        this.searchBusy = false
        if (snapshots.empty) {
          // this.snackbar = true
          // this.snackbar_text = 'Searching ' + item + ' ... Please wait'
          // this.snackbar_color = 'info'
          this.searchPhraseByFirstChar(item)
          return
        }
        snapshots.forEach((doc) => {
          console.log(doc.id, doc.data())
          this.contentList[doc.id] = doc.data()
          this.$fire.firestore.collection('-video_meta').doc(doc.id).get().then((vid) => {
            if (!vid.data().active) {
              return
            }
            this.videoList.push({ id: doc.id, ...vid.data() })
            this.videoListOrig.push({ id: doc.id, ...vid.data() })
            console.log(doc.id, vid.data())
          }).catch((error) => { console.log(error.message) })
        })
      }).catch((error) => { console.log(error.message) })
    },
    browse () {
      this.vocabCollection = []
      this.searchBusy = true
      this.videoList = []
      this.videoListOrig = []
      // db == '-char_index'
      const tmp = this.keyword.trim()
      console.log(tmp)
      if (tmp === '') {
        this.searchBusy = false
      } else if (tmp.length === 1) {
        // this.vocabCollection = []
        this.$fire.firestore.collection('-char_index').doc(tmp).get().then((doc) => {
          // console.log( doc );
          if (doc.exists) {
            console.log(doc.data())
            // this.vocabCollection = doc.data().vocab
            doc.data().vocab.forEach((item) => {
              // this.vocabCollection.push({vocab: item, html: item.split(tmp).join('<span style="color: red">'+tmp+'</span>')})
              this.$fire.firestore.collection(item).get().then((vid) => {
                vid.forEach((sub) => {
                  console.log(sub.id, sub.data())
                })
              })
            })
            console.log(this.vocabCollection)
          } else {
            this.snackbar = true
            this.snackbar_text = 'No data by the keyword：' + tmp
            this.snackbar_color = 'warning'
          }
          this.searchBusy = false
        }).catch((error) => { console.log(error.message) })
      } else if (tmp.length > 1) {
        this.searchPhraseByFirstChar(tmp)
      }
    },
    patternSearch () {
      if (!this.pattern.includes('x')) {
        this.keyword = this.pattern
        this.vocabCollection = []
        this.browse()
        return
      }
      // pattern search
      const strArray = this.pattern.split('x')
      let found = false
      this.patternList = []
      if (strArray.length !== 2) {
        console.error('incorrect pattern format')
      } else {
        this.vocabCollection = []
        if (strArray[0].trim() === '') {
          console.log('x 在 ？')
          const firstChar = strArray[1].trim().split('')[0]
          this.$fire.firestore.collection('-char_index').doc(firstChar).get().then((doc) => {
            // console.log( doc );
            if (doc.exists) {
              console.log(doc.data())
              doc.data().vocab.forEach((phrase) => {
                // console.log(phrase.split(strArray[0].trim()))
                if (phrase.includes(strArray[1].trim())) {
                  console.log(phrase)
                  if (phrase.split(strArray[1].trim())[0] !== '') {
                    this.vocabCollection.push(phrase)
                    found = true
                  }
                }
              })
              if (!found) {
                console.log('not found 472')
                this.snackbar = true
                this.snackbar_text = 'No data by the pattern：' + this.pattern
                this.snackbar_color = 'warning'
              }
            } else {
              this.snackbar = true
              this.snackbar_text = 'No data by the  pattern：' + this.pattern
              this.snackbar_color = 'warning'
            }
            this.searchBusy = false
          }).catch((error) => { console.log(error.message) })
        } else {
          console.log('太 x 了')
          const firstChar = strArray[0].trim().split('')[0]
          this.$fire.firestore.collection('-char_index').doc(firstChar).get().then((doc) => {
            // console.log( doc );
            if (doc.exists) {
              // console.log( doc.data() )
              doc.data().vocab.forEach((phrase) => {
                // console.log(phrase)
                if (!phrase.includes(strArray[0].trim())) {
                  return
                }
                this.$fire.firestore.collection(phrase).get().then((docs) => {
                  docs.forEach((doc) => {
                    // console.log(doc.id, doc.data())
                    this.$fire.firestore.collection('-video_meta').doc(doc.id).get().then((meta) => {
                      // console.log(meta.data())
                      if (!meta.data().active) {
                        return
                      }
                      for (const prop in doc.data()) {
                        // console.log( prop, doc.data()[prop]['sub'], doc.data()[prop]['sub'].indexOf(strArray[1].trim()) )
                        // 句子裡出現 過
                        if (doc.data()[prop].sub.includes(strArray[1].trim())) {
                          // 句子裡的 沒 在 過 的前面 -- algorithm 不对
                          const phraseAfterKeyword = doc.data()[prop].sub.substring(doc.data()[prop].sub.includes(strArray[0].trim()), doc.data()[prop].sub.length)
                          if (phraseAfterKeyword.includes(strArray[1].trim())) {
                            // console.log( prop, doc.data()[prop]['sub'], doc.data()[prop]['start'] )
                            // console.log( doc.data() )
                            let htmlsubs = doc.data()[prop].sub.split(strArray[0].trim()).join('<span style="color: red">' + strArray[0].trim() + '</span>')
                            htmlsubs = htmlsubs.split(strArray[1].trim()).join('<span style="color: red">' + strArray[1].trim() + '</span>')
                            this.patternList.push({ htmlsub: htmlsubs, id: doc.id, sub: doc.data()[prop].sub, time: prop, start: doc.data()[prop].start, ...meta.data() })
                            // console.log( meta.data() )
                            found = true
                          }
                        }
                      }
                    }).catch((error) => { console.log(error.message) })
                  })
                }).catch((error) => { console.log(error.message) })
              })
            } else {
              this.snackbar = true
              this.snackbar_text = 'No data by the pattern：' + this.pattern
              this.snackbar_color = 'warning'
            }
            this.searchBusy = false
          }).catch((error) => { console.log(error.message) })
        }
      }
    }
  }
}
</script>

<style scoped>
.v-sheet {
  border-radius: 8px;
}
</style>
