import {
  CubeTextureLoader,
  LoadingManager,
  WebGLRenderer,
  PMREMGenerator,
  CubeTexture,
  REVISION,
  Texture,
  TextureLoader,
  sRGBEncoding,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import holoTexture from './assets/img/shutterstock_752422525.jpg'

const MANAGER = new LoadingManager()

export const loadCubeMap = (images: string[]): CubeTexture =>
  new CubeTextureLoader().load([
    images[0],
    images[1],
    images[2] || images[0],
    images[3] || images[0],
    images[4] || images[1],
    images[5] || images[1],
  ])

let loadingHdr = false
let hdrEnvMap: Texture

const resolveWhenLoadedHdr = (): Promise<Texture> => {
  return new Promise<Texture>(resolve => {
    if (loadingHdr && hdrEnvMap) {
      resolve(hdrEnvMap)
    } else {
      window.setTimeout(() => {
        resolveWhenLoadedHdr().then(resolve).catch(console.error)
      }, 1000)
    }
  })
}

export const doneLoadingHdr = (): Promise<Texture | null> =>
  new Promise<Texture | null>(resolve =>
    !loadingHdr ? resolve(null) : resolveWhenLoadedHdr().then(resolve)
  )

let hdrFile = 'Arean05_Punk_01.hdr'
const texturesPath = '/static/textures/'
export const setHDRFile = (_hdrFile: string): string => (hdrFile = _hdrFile)

let baseUri = ''
export const setBaseUri = (_baseUri: string): string => (baseUri = _baseUri)

export const loadHDREnvMap = (renderer: WebGLRenderer): Promise<Texture> =>
  new Promise<Texture>((resolve, reject) => {
    if (!loadingHdr) {
      loadingHdr = true
      new RGBELoader(MANAGER).setPath(baseUri + texturesPath).load(
        hdrFile,
        hdrmap => {
          hdrEnvMap = new PMREMGenerator(renderer).fromCubemap(
            hdrmap as unknown as CubeTexture
          ).texture
          resolve(hdrEnvMap)
        },
        () => {},
        reject
      )
    } else {
      resolveWhenLoadedHdr().then(resolve).catch(console.error)
    }
  })

let holographicTexture: Texture
let loadingHoloTexture = false

const resolveWhenLoadedHoloTexture = (): Promise<Texture> => {
  return new Promise<Texture>(resolve => {
    if (loadingHoloTexture && holographicTexture) {
      resolve(holographicTexture)
    } else {
      window.setTimeout(() => {
        resolveWhenLoadedHoloTexture().then(resolve).catch(console.error)
      }, 1000)
    }
  })
}

export const doneLoadingHolo = (): Promise<Texture | null> =>
  new Promise<Texture | null>(resolve =>
    !loadingHoloTexture
      ? resolve(null)
      : resolveWhenLoadedHoloTexture().then(resolve).catch(console.error)
  )

export const loadHolographicTexture = (
  pmremGenerator: PMREMGenerator
): Promise<Texture> =>
  new Promise<Texture>((resolve, reject) => {
    if (!loadingHoloTexture) {
      loadingHoloTexture = true
      new TextureLoader(MANAGER).load(
        holoTexture,
        (texture: Texture) => {
          pmremGenerator.compileEquirectangularShader()
          texture.encoding = sRGBEncoding
          holographicTexture = texture
          resolve(texture)
        },
        console.log,
        reject
      )
    } else {
      resolveWhenLoadedHoloTexture().then(resolve).catch(console.error)
    }
  })

