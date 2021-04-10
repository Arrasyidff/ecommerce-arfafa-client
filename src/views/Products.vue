<template>
  <div class="container-fluid">
    <Loading v-if="loading === true" />
    <div class="row" v-if="openProduct === true">
      <div class="card-products col-sm-3" v-for="(item, index) in fetchProducts" :key="index">
        <div @click="toDetailPage(item.id)" class="card-image">
          <img :src="item.image_url" :alt="item.name">
        </div>
        <div class="card-desc">
          <p class="p-first">{{item.name}}</p>
          <p class="p-second">{{rupiahFormat(item.price)}}</p>
          <i v-if="item.stock === 0" style="color: grey;" class="fas fa-shopping-cart"></i>
          <i v-if="item.stock !== 0" @click="addToChart(item.id)" class="fas fa-shopping-cart"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from '../config/axiosInstance'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
export default {
  name: 'ProductsPage',
  components: {
    Loading
  },
  data () {
    return {
      loading: false,
      openProduct: false,
      token: ''
    }
  },
  computed: {
    fetchProducts () {
      return this.$store.state.products
    }
  },
  methods: {
    toDetailPage (idProduct) {
      // console.log(idProduct)
      this.$router.push('/product-' + idProduct)
    },
    addToChart (idProduct) {
      if (this.token === '') {
        console.log('to login page')
      } else {
        Axios({
          url: 'charts',
          method: 'POST',
          headers: {
            access_token: localStorage.getItem('access_token')
          },
          data: {
            product_id: idProduct
          }
        })
          .then(({ data }) => {
            // console.log(data)
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: false,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: data.msg
            })
          })
          .catch(err => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: false,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'error',
              title: err.response.data.msg
            })
          })
      }
    },
    fetchAllProducts () {
      this.$store.dispatch('fetchProducts')
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.openProduct = true
      }, 1000)
    },
    rupiahFormat (value) {
      const numb = value
      const format = numb.toString().split('').reverse().join('')
      const convert = format.match(/\d{1,3}/g)
      return 'Rp ' + convert.join('.').split('').reverse().join('')
    },
    tokennn () {
      if (localStorage.getItem('access_token')) {
        this.token = localStorage.getItem('access_token')
      } else {
        this.token = ''
      }
    }
  },
  mounted () {
    this.fetchAllProducts()
    this.tokennn()
  }
}
</script>

<style scoped>
.container-fluid {
  width: 93% !important;
}

.card-products {
  height: 380px;
  background: rgba(242, 242, 242, 0.713);
  /* background: red; */
  padding: 5px;
  cursor: pointer;
}

.card-image {
  height: 250px;
  width: 100%;
  /* background: blue; */
  overflow: hidden;
}

.card-image img {
  width: 100%;
}

.card-desc {
  text-align: center;
  padding: 10px;
  flex-direction: column;
  display: flex;
  align-items: center;
  position: relative;
}

.card-desc .fas {
  position: absolute;
  bottom: 31px;
  right: 10px;
  color: rgb(40, 40, 73);
  cursor: pointer;
  z-index: 1000;
  transition: .3s;
  padding: 7px;
  border-radius: 50%;
}

.card-desc .fas:hover {
  color: rgb(77, 62, 179);
  background: rgba(0, 0, 0, 0.063);
}

.p-first {
  height: 75px;
}

.p-second {
  margin-top: -10px;
}

</style>
