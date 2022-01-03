<template>
  <section>
    <canvas id="viewer" @dblclick="pick" class="viewer-wrapper" />
    <UploadFile
      @file-changed="renderUploadedFile"
      :upload-status="uploadStatus"
    />
    <p class="viewer-properties-text" v-text="`ID: ${entityData}`" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IfcManager from '@/controllers/IFC/IfcManager'
import { Intersection, Raycaster, Vector2 } from 'three'
import UploadFile from '@/components/shared/UploadFile.vue'

@Component({
  components: { UploadFile }
})
export default class Viewer extends Vue {
  private entityData: string = ''
  private raycaster!: Raycaster
  private mouse!: { x: number; y: number }
  private bounds!: DOMRect
  private x1!: number
  private x2!: number
  private y1!: number
  private y2!: number
  private IFCManager!: any
  private found!: Intersection
  private geometry: any
  private id: string = ''
  private threeCanvas!: HTMLCanvasElement
  private uploadStatus: string = ''

  mounted() {
    this.IFCManager = new IfcManager('viewer')
    this.threeCanvas = document.getElementById('viewer') as HTMLCanvasElement
  }

  private async renderUploadedFile(file: File) {
    try {
      this.uploadStatus = 'Loading...'
      const ifcURL = URL.createObjectURL(file)

      this.IFCManager.scene.ifcModel =
        await this.IFCManager.ifcLoader.loadAsync(ifcURL)

      this.IFCManager.scene.add(this.IFCManager.scene.ifcModel.mesh)

      this.addPicking()
      this.uploadStatus = ''
      this.$toasted.success('File loaded successfully')
    } catch (error) {
      this.$toasted.error(error)
    }
  }

  private addPicking() {
    this.raycaster = new Raycaster()
    this.raycaster.firstHitOnly = true
    this.mouse = new Vector2()
  }

  private cast(event: MouseEvent) {
    this.bounds = this.threeCanvas.getBoundingClientRect()

    this.x1 = event.clientX - this.bounds.left
    this.x2 = this.bounds.right - this.bounds.left
    this.mouse.x = (this.x1 / this.x2) * 2 - 1

    this.y1 = event.clientY - this.bounds.top
    this.y2 = this.bounds.bottom - this.bounds.top
    this.mouse.y = -(this.y1 / this.y2) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.IFCManager.scene.camera)

    return this.raycaster.intersectObjects(this.IFCManager.scene.ifcModels)
  }

  private pick(event: MouseEvent) {
    this.found = this.cast(event)[0]

    if (this.found && this.found.faceIndex) {
      // @ts-ignore
      this.geometry = this.found.object.geometry

      this.id = this.IFCManager.scene.ifcModel.getExpressId(
        this.geometry,
        this.found.faceIndex
      )

      this.entityData = this.id
    }
  }
}
</script>
