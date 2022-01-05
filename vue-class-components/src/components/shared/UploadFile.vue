<template>
  <div class="upload-file-input">
    <button
      class="upload-file-button"
      @click="onClick"
      v-text="'Upload file'"
    />
    <input
      name="fileToUpload"
      type="file"
      ref="input"
      style="display: none"
      @change="fileChanged"
      :accept="accept"
    />
    <p class="viewer-upload-status">{{ uploadStatus }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator'

@Component
export default class UploadFile extends Vue {
  @Prop({ default: '' }) uploadStatus!: string
  @Prop({ default: '.ifc' }) accept!: string

  private onClick() {
    ;(this.$refs.input as HTMLInputElement).click()
  }

  @Emit()
  private fileChanged(e: Event): File | null {
    const target = e.target as HTMLInputElement

    if (target.files && target.files.length) {
      return target.files[0] as File
    }

    return null
  }
}
</script>
