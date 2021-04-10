<template>
  <div class="container">
    <div class="row">
      <div class="item mt-3 col-sm-12">
        <div class="picture-item">
          <img :src="detailData.image_url" :alt="detailData.name">
        </div>
        <div class="desc-item">
          <p>nama: <span>{{detailData.name}}</span></p>
          <p>harga: <span>{{rupiahFormat(detailData.price)}}</span></p>
          <p>sisa barang: <span>{{detailData.stock}} barang</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from '../config/axiosInstance'

export default {
  name: 'DetailPage',
  data () {
    return {
      detailData: {}
    }
  },
  methods: {
    fetchDetailData () {
      Axios({
        url: 'products/' + this.$route.params.id,
        method: 'GET'
      })
        .then(({ data }) => {
          console.log(data)
          this.detailData = data
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    rupiahFormat (value) {
      const numb = value
      const format = numb?.toString()?.split('')?.reverse().join('')
      const convert = format?.match(/\d{1,3}/g)
      return 'Rp ' + convert?.join('.')?.split('')?.reverse()?.join('')
    }
  },
  created () {
    this.fetchDetailData()
    // console.log(this.fetchDetailData(), 'ini funtion')
    // console.log(this.$route.params.id, 'heyy detail')
  }
}
</script>

<style scoped>
.item {
  /* height: 200px; */
  padding: 10px;
  /* background: red; */
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.picture-item {
  width: 450px;
  height: 450px;
  /* background: blue; */
  overflow: hidden;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.picture-item img {
  width: 100%;
}

.desc-item {
  padding-left: 10px;
}

.desc-item span {
  font-weight: bold;
}
</style>
