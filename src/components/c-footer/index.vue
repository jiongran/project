<template>
  <div class="footer hidden-sm-and-down">
    2017 All rights reservel
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component({
    name: 'CFooter'
  })
  export default class extends Vue {}
</script>

<style scoped lang="less">
.footer {
  color: @link-dark-color;
  text-align: center;
  border-top: 1px solid @footer-line;
  margin-top: 60px;
  padding: 30px 0;
  @media (max-width: 768px) {
    font-size: 0;
    display: none;
  }
}
</style>
