<template>
  <div class="container mt-3">
    <Loading v-if="loading === true" />
    <div class="row" v-if="openTransactions === true">
      <div class="list col-sm-12" v-for="(item, index) in fetchTransactions" :key="index">
        <div class="item">
          <div class="item-header">
            {{formatDate(item.createdAt)}}
          </div>
          <div class="item-list" v-for="(productItem, j) in item.products" :key="j">
            <div @click="toDetailPage(productItem.product_id)" class="image-item">
              <img :src="productItem.image_url" :alt="productItem.product_name">
            </div>
            <div class="desc-item">
              <p>nama: <span>{{productItem.product_name}}</span></p>
              <p>jumlah barang: <span>{{productItem.quantity}}</span></p>
              <p>total harga: <span>{{rupiahFormat(productItem.total_price)}}</span></p>
            </div>
          </div>
          <p>Grand Total: <span>{{rupiahFormat(item.total_price)}}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '../components/Loading'

export default {
  name: 'TransactionPage',
  components: {
    Loading
  },
  data () {
    return {
      loading: false,
      openTransactions: false
    }
  },
  methods: {
    toDetailPage (idProduct) {
      // console.log(idProduct)
      this.$router.push('/product-' + idProduct)
    },
    fetchAllTransaction () {
      this.$store.dispatch('fetchTransactions')
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.openTransactions = true
      }, 1000)
    },
    formatDate (value) {
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ]
      const month = value.split('T')[0].split('-')
      const getMonth = monthNames[month[1].split('')[1] - 1]
      const date = [month[2], getMonth, month[0]]
      return date.join(' ')
    },
    rupiahFormat (value) {
      const numb = value + ''
      const format = numb.split('').reverse().join('')
      const convert = format.match(/\d{1,3}/g)
      return 'Rp ' + convert?.join('.').split('').reverse().join('')
    }
  },
  computed: {
    fetchTransactions () {
      return this.$store.state.transactions
    }
  },
  created () {
    this.fetchAllTransaction()
  }
}
</script>

<style scoped>
.list {
  width: 100%;
  /* background: red; */
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  margin-bottom: 20px;
}

.item {
  padding: 5px 0 5px 0;
}

.item span {
  font-weight: bold;
}

.item-list {
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.097);
  padding: 5px;
  display: flex;
}

.image-item {
  width: 65px;
  height: 65px;
  background: blue;
  overflow: hidden;
  cursor: pointer;
}

.image-item img {
  width: 100%;
}

.desc-item {
  padding-left: 5px;
}

.desc-item p {
  margin-bottom: -3.5px;
}

.desc-item span {
  font-weight: bold;
}
</style>
