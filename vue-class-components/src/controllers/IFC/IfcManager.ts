import { IfcScene } from '@/controllers/IFC/IfcScene'
import { IFCLoader } from 'web-ifc-three/IFCLoader'
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree
} from 'three-mesh-bvh'
import { Raycaster, Vector2 } from 'three'

export default class IfcManager {
  private scene!: IfcScene
  private ifcLoader!: IFCLoader
  private raycaster!: Raycaster
  private mouse!: Vector2

  constructor(canvasId: string) {
    this.scene = new IfcScene(canvasId)
    this.ifcLoader = new IFCLoader()

    this.setupIfcLoader()
      .then()
      .catch(err => console.error(err))

    this.raycaster = new Raycaster()

    // @ts-ignore
    this.raycaster.firstHitOnly = true
    this.mouse = new Vector2()
  }

  private async setupIfcLoader() {
    await this.ifcLoader.ifcManager.useWebWorkers(true, '../IFCjs/IFCWorker.js')

    await this.ifcLoader.ifcManager.applyWebIfcConfig({
      COORDINATE_TO_ORIGIN: true,
      USE_FAST_BOOLS: false
    })

    this.setupThreeMeshBVH()
  }

  private setupThreeMeshBVH() {
    this.ifcLoader.ifcManager.setupThreeMeshBVH(
      computeBoundsTree,
      disposeBoundsTree,
      acceleratedRaycast
    )
  }
}
