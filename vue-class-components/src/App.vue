<template>
  <Viewer />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Viewer from '@/components/Viewer.vue'

@Component({
  components: { Viewer }
})
export default class App extends Vue {}
</script>
