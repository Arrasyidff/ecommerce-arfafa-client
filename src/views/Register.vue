<template>
  <div class="login-page">
    <div class="form-register">
      <form @submit.prevent="submitLogin">
        <h1>SIGN UP</h1>
        <div class="mb-3">
          <label for="firstName-register" class="form-label">First name</label>
          <input v-model="firstName" type="text" class="form-control" id="firstName-register">
        </div>
        <div class="mb-3">
          <label for="lastName-register" class="form-label">Last name</label>
          <input v-model="lastName" type="text" class="form-control" id="lastName-register">
        </div>
        <div class="mb-3">
          <label for="email-register" class="form-label">Email address</label>
          <input v-model="email" type="text" class="form-control" id="email-register">
        </div>
        <div class="mb-3">
          <label for="password-register" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password-register" >
        </div>
        <div v-if="errorDisplay !== ''" class="alert alert-danger" role="alert">
          {{errorDisplay}}
        </div>
        <div class="action-register-form">
          <button type="submit" class="btn btn-primary">submit</button>
          <button @click="toLoginPage" type="button" class="btn btn-warning">cancel</button>
        </div>
      </form>
    </div>
    <div class="cover-register">
      <p>Are you ready to see our product, and buy it</p>
    </div>
  </div>
</template>

<script>
import Axios from '../config/axiosInstance'
import Swal from 'sweetalert2'

export default {
  name: 'LoginPage',
  data () {
    return {
      token: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      errorDisplay: ''
    }
  },
  methods: {
    resetData () {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.password = ''
      this.errorDisplay = ''
    },
    toLoginPage () {
      this.$router.push('/login')
    },
    submitLogin (e) {
      e.preventDefault()
      Axios({
        url: 'register-user',
        method: 'POST',
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        }
      })
        .then(({ data }) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-start',
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
            title: 'Sign up successfully'
          })
          setTimeout(() => {
            this.$router.push('/login')
            this.resetData()
          }, 1000)
        })
        .catch(err => {
          // console.log(err.response.data)
          this.errorDisplay = err.response.data.msg
          setTimeout(() => {
            this.errorDisplay = ''
          }, 3000)
        })
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
}

.cover-register, .form-register {
  width: 50%;
  height: 100vh;
}

.cover-register {
  background: linear-gradient(rgba(0,0,0,0.5),#116094), url('https://cdn.britannica.com/w:1100/44/193844-131-1E4A9F84/ball-net-basketball-game-arena.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-register p {
  font-size: 30px;
  font-weight: bold;
  color: white;
  width: 350px;
  text-align: center;
}

.form-register {
  /* background: blue; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-register form {
  width: 400px;
}

.form-register form h1 {
  /* margin-top: -50px; */
  margin-bottom: 20px;
}

.alert {
  padding: 5px 10px !important;
}

.action-register-form {
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  overflow: hidden;
  width: 40%;
}
</style>
