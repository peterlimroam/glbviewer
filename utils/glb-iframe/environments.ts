import {
  ACESFilmicToneMapping,
  LinearEncoding,
  PMREMGenerator,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'

export const setRoomEnvironment = (
  scene: Scene,
  renderer: WebGLRenderer,
  holographic = false,
  exposure = 0.37
): void => {
  const environment = new RoomEnvironment()
  const pmremGenerator = new PMREMGenerator(renderer)
  scene.environment = pmremGenerator.fromScene(environment).texture
  renderer.toneMapping = ACESFilmicToneMapping
  if (holographic) {
    renderer.toneMappingExposure = 1
    renderer.outputEncoding = LinearEncoding
  } else {
    renderer.toneMappingExposure = exposure
    renderer.outputEncoding = sRGBEncoding
  }
}
