<template>
  <div class="container mt-3">
    <Loading v-if="loading === true" />
    <div class="row" v-if="openCharts === true">
      <!-- Modal -->
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Your Item</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p> Grand Total: {{rupiahFormat(total_price)}}</p>
              <div class="item-modal" v-for="(item, index) in charts" :key="index">
                <div class="item-modal-img">
                  <img :src="item.image_url" :alt="item.product_name">
                </div>
                <div class="item-modal-desc">
                  <p>name: {{item.product_name}}</p>
                  <p>quantity: {{item.quantity}}</p>
                  <p>total price: {{rupiahFormat(item.total_price)}}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button @click="checkout" type="button" class="btn btn-primary" data-bs-dismiss="modal">Checkout</button>
            </div>
          </div>
        </div>
      </div>
      <div class="list-chart">
        <div class="not-found-item" v-if="fetchCharts.length === 0">
          Not found item
        </div>
        <div v-else class="item" v-for="(item, index) in fetchCharts" :key="index">
          <div class="item-image" @click="toDetailPage(item.product_id)">
            <img :src="item.Product.image_url" alt="">
          </div>
          <div class="item-desc">
            <p>name: {{item.Product.name}}</p>
            <p>price: {{rupiahFormat(item.Product.price)}}</p>
          </div>
          <div class="quantity-actions">
            <i @click="deleteChart(item.id)" class="fas fa-trash"></i>
            <div class="update-quantity">
              <button type="button" @click="decrementChartQuantity(item)" :disabled="item.quantity < 2">
                <i class="fas fa-minus-circle"></i>
              </button>
              <p>{{item.quantity}}</p>
              <button type="button" @click="incrementChartQuantity(item)" :disabled="item.quantity >= item.Product.stock" >
                <i class="fas fa-plus-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="grand-total-charts">
        <div class="top">
          <p class="top-title">Ringkasan Belanja</p>
          <div class="top-desc">
            <p>Total Harga ({{fetchCharts.length}} barang)</p>
            <p>{{grandTotal(fetchCharts)}}</p>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-desc">
            <p>Total Harga</p>
            <p>{{grandTotal(fetchCharts)}}</p>
          </div>
          <div class="checkoutAction">
            <button v-if="fetchCharts.length !== 0" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="openModalCheckout(fetchCharts)" type="button">Beli {{fetchCharts.length}}</button>
            <button v-if="fetchCharts.length === 0" @click="openModalCheckout(fetchCharts)" type="button">Beli {{fetchCharts.length}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from '../config/axiosInstance'
import Loading from '../components/Loading'
import Swal from 'sweetalert2'

export default {
  name: 'ChartsPage',
  components: {
    Loading
  },
  data () {
    return {
      charts: [],
      total_price: 0,
      loading: false,
      openCharts: false
    }
  },
  computed: {
    fetchCharts () {
      return this.$store.state.charts
    }
  },
  methods: {
    toDetailPage (idProduct) {
      console.log(idProduct)
      this.$router.push('/product-' + idProduct)
    },
    fetchAllCharts () {
      this.$store.dispatch('fetchCharts')
    },
    incrementChartQuantity (item) {
      Axios({
        url: 'charts/' + item.id,
        method: 'PATCH',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          quantity: item.quantity,
          stock: item.Product.stock
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.fetchAllCharts()
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    decrementChartQuantity (item) {
      Axios({
        url: 'charts-decrement/' + item.id,
        method: 'PATCH',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          quantity: item.quantity
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.fetchAllCharts()
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    deleteChart (id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Axios({
            url: 'charts/' + id,
            method: 'DELETE',
            headers: {
              access_token: localStorage.getItem('access_token')
            }
          })
            .then(({ data }) => {
              Swal.fire(
                'Deleted!',
                'Your item has been deleted.',
                'success'
              )
              this.fetchAllCharts()
            })
            .catch(err => {
              console.log(err.response.data)
            })
        }
      })
    },
    openModalCheckout (payload) {
      if (payload.length === 0) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'error',
          title: 'You must add your item to chart'
        })
      } else {
        const products = []
        let totalPrice = 0
        for (let i = 0; i < payload.length; i++) {
          products.push(
            {
              product_name: payload[i].Product.name,
              quantity: payload[i].quantity,
              product_id: payload[i].Product.id,
              image_url: payload[i].Product.image_url,
              total_price: payload[i].Product.price * payload[i].quantity
            }
          )
        }
        for (let i = 0; i < products.length; i++) {
          totalPrice += products[i].total_price
        }
        this.charts = products
        this.total_price = totalPrice
      }
    },
    checkout () {
      Axios({
        url: 'transactions',
        method: 'POST',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          products: this.charts,
          total_price: this.total_price
        }
      })
        .then(({ data }) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: 'success transaction'
          })
          this.fetchAllCharts()
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    grandTotal (value) {
      let total = 0
      for (let i = 0; i < value.length; i++) {
        total += value[i].Product.price * value[i].quantity
      }
      const numb = total.toString().split('')
      const format = numb.reverse().join('')
      const convert = format.match(/\d{1,3}/g)
      return 'Rp ' + convert.join('.').split('').reverse().join('')
    },
    rupiahFormat (value) {
      const numb = value
      const format = numb.toString().split('').reverse().join('')
      const convert = format.match(/\d{1,3}/g)
      return 'Rp ' + convert.join('.').split('').reverse().join('')
    }
  },
  created () {
    this.fetchAllCharts()
    this.loading = true
    setTimeout(() => {
      this.loading = false
      this.openCharts = true
    }, 1000)
  }
}
</script>

<style scoped>
.list-chart {
  width: 70%;
}

.not-found-item {
  width: 100%;
  background: rgb(255, 255, 255);
  padding: 15px 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  margin-bottom: 20px;
  width: 100%;
  background: rgb(255, 255, 255);
  padding: 15px 15px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  position: relative;
}

.item .fas {
  cursor: pointer;
}

.item-image {
  cursor: pointer;
  width: 11%;
  height: 80px;
  background: green;
  overflow: hidden;
}

.item-image img {
  width: 100%;
}

.item-desc {
  width: 89%;
  padding-left: 10px;
  padding-top: 10px;
}

.item-desc p {
  margin-bottom: -2px;
}

.quantity-actions {
  position: absolute;
  right: 10px;
  bottom: 10px;
  /* width: 100px; */
  height: 20px;
  display: flex;
  justify-content: space-between;
}

.update-quantity {
  display: flex;
  justify-content: space-between;
  width: 100px;
  border-left: solid 1px black;
  padding: 0 10px;
}

.update-quantity button {
  /* background: rgb(11, 11, 94); */
  border: none;
  background: none;
  margin-top: -2px;
}

.fa-trash {
  margin-right: 15px;
}

.quantity-actions p {
  margin-top: -2px;
}

.grand-total-charts {
  width: 30%;
  height: 210px;
  padding: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.top {
  border-bottom: 1px solid rgba(0, 0, 0, 0.213);
}

.top-title {
  font-weight: bold;
}

.top-desc {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.bottom-desc {
  margin-top: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.checkoutAction {
  width: 100%;
}

.checkoutAction button {
  background: rgb(11, 11, 94);
  color: white;
  font-weight: bold;
  width: 100%;
  border-radius: 5px;
  padding: 5px 15px;
  border: none;
  transition: .2s;
}

.checkoutAction button:hover {
  background: rgb(27, 27, 150);
}

.modal-content {
  margin-left: -100px;
  width: 760px !important;
}

.modal-body {
  height: 200px !important;
  overflow: scroll;
}

.item-modal {
  display: flex;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.207);
  border-radius: 5px;
  margin-bottom: 10px;
}

.item-modal-img {
  width: 58px;
  height: 58px;
  background: red;
}

.item-modal-img img {
  width: 100%;
}

.item-modal-desc {
  padding-left: 10px;
}

.item-modal-desc p {
  margin-bottom: -5px;
}
</style>
