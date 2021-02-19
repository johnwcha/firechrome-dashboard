<template>
  <v-row justify="center" align="center">
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
        :value="unique_char"
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
        :value="total_char"
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
        :value="video_length"
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
        :value="video_count"
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
      total_char: '',
      unique_char: '',
      video_count: '',
      video_length: '',
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
      const res = await this.$fire.firestore.collection('-video_stats').doc('stats_doc').get()
      // console.log(res.data())
      this.total_char = res.data().total_char.toString()
      this.unique_char = res.data().unique_char.length.toString()
      this.video_count = res.data().video_count.toString()
      this.video_length = (res.data().video_length / 60).toFixed(2).toString()
    }
  }
}
</script>

<style scoped>
.v-sheet {
  border-radius: 8px;
}
</style>
