<template>
  <div class="loading-class">
    <div class="sub-loading-class">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style scoped>
.loading-class {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: chartreuse; */
  height: 80vh;
}

.sub-loading-class {
  /* background: red; */
  width: 130px;
  display: flex;
  justify-content: space-between;
}

.spinner-grow {
  color: rgb(11, 11, 94) !important;
  width: 25px;
  height: 25px;
}
</style>
