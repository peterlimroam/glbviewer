import { Color, Material, MeshPhysicalMaterial, WebGLRenderer } from 'three'
import { loadCubeMap, loadHDREnvMap } from './loaders'

import { IridescentMaterial } from './lib/IridescentMaterial'
import { ThinFilmFresnelMap } from './lib/ThinFilmFresnelMap'

import radImgX from './assets/img/radiance/negX.jpg'
import radImgY from './assets/img/radiance/negY.jpg'
import irNegX from './assets/img/irradiance/negX.jpg'
import irNegY from './assets/img/irradiance/negY.jpg'
import irNegZ from './assets/img/irradiance/negZ.jpg'
import irPosX from './assets/img/irradiance/posX.jpg'
import irPosY from './assets/img/irradiance/posY.jpg'
import irPosZ from './assets/img/irradiance/posZ.jpg'

let material: Material | undefined

// Depreciated
export const holographicMaterial = (): Material => {
  if (!material) {
    const irradienceCubeMap = loadCubeMap([
      irPosX,
      irNegX,
      irPosY,
      irNegY,
      irPosZ,
      irNegZ,
    ])
    const radienceCubeMap = loadCubeMap([radImgX, radImgY])
    material = new IridescentMaterial(
      irradienceCubeMap,
      radienceCubeMap,
      new ThinFilmFresnelMap() // 150, 2.5, 2.5, 1
    )
  }
  material.transparent = true
  // material.uniforms.roughness = 0.5
  return material
}

// Depreciated
export const chromaticMaterial = async (
  renderer: WebGLRenderer,
  color?: Color
): Promise<Material> =>
  new MeshPhysicalMaterial({
    color: color || 0xff00ff,
    roughness: 0.25,
    metalness: 0.9,
    // reflectivity: 0.2,
    // roughness: 0.5,
    // metalness: 0.7,
    // reflectivity: 1,
    envMap: await loadHDREnvMap(renderer),
  })

export const glassMaterial = (
  color?: Color,
  opacity = 0.2
): MeshPhysicalMaterial =>
  new MeshPhysicalMaterial({
    color: color || 0xffffff,
    roughness: 0.01,
    metalness: 0.9,
    reflectivity: 0.2,
    opacity,
    transparent: true,
  })

export const glassMaterialWithEnvMap = async (
  renderer: WebGLRenderer,
  color?: Color,
  opacity = 0.2
): Promise<MeshPhysicalMaterial> => {
  const material = glassMaterial(color, opacity)
  material.envMap = await loadHDREnvMap(renderer)
  return material
}
