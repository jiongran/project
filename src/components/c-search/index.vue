<template>
  <el-input prefix-icon='el-icon-search'
            :placeholder="placeholder" id="search"
            @change=onSearchChange v-model="val">
  </el-input>
</template>
<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

  @Component({
    name: 'CSearch'
  })
  export default class extends Vue {
    @Prop({ default: '' }) private valueData!: string
    public val: string = this.valueData

    get placeholder():string {
      return (this.$t('components.search') as string)
    }

    @Watch('valueData')
    private onValueDataChange(newVal: string):void {
      this.val = newVal
    }

    public onSearchChange(): void {
      this.$emit('onSearchChange', this.val)
    }
  }
</script>
