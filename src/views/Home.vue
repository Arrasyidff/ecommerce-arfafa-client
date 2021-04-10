<template>
  <div class="home">
    <nav>
      <div class="logo">
        <h1>Arfafa</h1>
      </div>
      <div class="nav-actions">
        <router-link to="/products">Products</router-link>
        <router-link v-if="token !== ''" to="/transaction">Transaction</router-link>
        <router-link to="/charts">
          <i class="fas fa-shopping-cart"></i>
        </router-link>
        <i @click="logout" v-if="token !== ''" class="fas fa-sign-out-alt"></i>
      </div>
    </nav>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'Home',
  data () {
    return {
      token: ''
    }
  },
  methods: {
    tokennn () {
      if (localStorage.getItem('access_token')) {
        this.token = localStorage.getItem('access_token')
      } else {
        this.token = ''
      }
    },
    logout () {
      localStorage.clear()
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Logout in successfully'
      })
      setTimeout(() => {
        const path = '/products'
        if (this.$route.path !== path) this.$router.push(path)
        // this.$router.push('/products')
        this.tokennn()
      }, 1000)
    }
  },
  mounted () {
    this.tokennn()
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

nav {
  color: white;
  width: 100%;
  background: rgb(11, 11, 94);
  padding: 0px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav .logo h1 {
  font-size: 30px;
}

.nav-actions {
  display: flex;
  justify-content: space-between;
  /* background: red; */
  /* width: 250px; */
  align-items: center;
}

.nav-actions a {
  font-size: 17px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  /* background: rgb(7, 208, 208); */
  padding: 10px;
  border-bottom: rgb(11, 11, 94) 5px solid;
}

.nav-actions a.router-link-exact-active {
  border-bottom: rgb(0, 247, 235) 5px solid;
}

.fa-sign-out-alt {
  margin-left: 20px;
  font-size: 21px;
  margin-top: -3px;
  cursor: pointer;
  transition: .2s;
  padding: 10px;
  border-radius: 50%;
}

.fa-sign-out-alt:hover {
  color: red;
  background: rgba(0, 0, 0, 0.063);
}
</style>
