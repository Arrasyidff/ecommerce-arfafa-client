<template>
  <div class="login-page">
    <div class="cover-login">
      <p>Are you ready to see our product, and buy it</p>
    </div>
    <div class="form-login">
      <form @submit.prevent="submitLogin">
        <h1>SIGN IN</h1>
        <div class="mb-3">
          <label for="email-login" class="form-label">Email address</label>
          <input v-model="email" type="email" class="form-control" id="email-login">
        </div>
        <div class="mb-3">
          <label for="password-login" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password-login" >
        </div>
        <div v-if="errorDisplay !== ''" class="alert alert-danger" role="alert">
          {{errorDisplay}}
        </div>
        <div class="action-login-form">
          <button type="submit" class="btn btn-primary">submit</button>
          <button @click="toRegisterPage" type="button" class="btn btn-warning">register</button>
        </div>
      </form>
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
      email: '',
      password: '',
      errorDisplay: ''
    }
  },
  methods: {
    toRegisterPage () {
      this.$router.push('/register')
    },
    resetData () {
      this.email = ''
      this.password = ''
      this.errorDisplay = ''
    },
    submitLogin (e) {
      e.preventDefault()
      if (this.email === '') {
        this.errorDisplay = 'email cant be empty'
        setTimeout(() => {
          this.errorDisplay = ''
        }, 3000)
      } else if (this.password === '') {
        this.errorDisplay = 'password cant be empty'
        setTimeout(() => {
          this.errorDisplay = ''
        }, 3000)
      } else {
        Axios({
          url: 'login-user',
          method: 'POST',
          data: {
            email: this.email,
            password: this.password
          }
        })
          .then(({ data }) => {
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
              title: 'Signed in successfully'
            })
            localStorage.setItem('access_token', data.access_token)
            setTimeout(() => {
              this.$router.push('/')
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
}
</script>

<style scoped>
.login-page {
  display: flex;
}

.cover-login, .form-login {
  width: 50%;
  height: 100vh;
}

.cover-login {
  background: linear-gradient(rgba(0,0,0,0.5),#116094), url('https://cdn.britannica.com/w:1100/44/193844-131-1E4A9F84/ball-net-basketball-game-arena.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-login p {
  font-size: 30px;
  font-weight: bold;
  color: white;
  width: 350px;
  text-align: center;
}

.form-login {
  /* background: blue; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-login form {
  margin-top: -150px;
  width: 400px;
}

.form-login form h1 {
  /* margin-top: -50px; */
  margin-bottom: 20px;
}

.alert {
  padding: 5px 10px !important;
}

.action-login-form {
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  overflow: hidden;
  width: 43%;
}
</style>
