import {
  Color,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  WebGLRenderer,
} from 'three'
import { loadHolographicTexture } from './loaders'
import { glassMaterialWithEnvMap } from './materials'

const assignChromaticMaterialIfNeeded = async (
  mesh: Mesh,
  pmremGenerator: PMREMGenerator,
  isHolographic = false
) => {
  const materialName = (mesh.material as Material)?.name
  if (
    materialName === 'Holographic' ||
    (isHolographic && materialName === 'Silver') // This is for Configurator
  ) {
    // pmrem will definitely be available as called from
    const texture = await loadHolographicTexture(pmremGenerator)
    mesh.material = new MeshPhysicalMaterial({
      roughness: 0.2,
      metalness: 1,
      envMap: pmremGenerator.fromEquirectangular(texture).texture,
      sheenColor: new Color(0x666666),
    })
  }
}

export const isFishTank = (mesh: Mesh): boolean => {
  return (
    mesh.name.toLowerCase() === 'cube503' ||
    (mesh.material as Material).name?.toLowerCase().includes('material.032')
  )
}

const assignGlassMaterialIfNeeded = async (
  mesh: Mesh,
  renderer: WebGLRenderer
) => {
  const materialName = !Array.isArray(mesh.material)
    ? (mesh.material as Material)?.name
    : ''

  const isGlass = materialName?.toLowerCase().includes('glass')
  const isTint = materialName?.toLowerCase().includes('tint')

  if (isGlass && !isTint) {
    mesh.material = await glassMaterialWithEnvMap(renderer)
  }
  if (isGlass && isTint) {
    const prevMaterial = mesh.material
    const material = await glassMaterialWithEnvMap(renderer, undefined, 0.5)
    material.map = (prevMaterial as MeshPhysicalMaterial).map
    // UNCOMMENT IF: you want to use GLB-embedded envMap
    // material.envMap = (prevMaterial as MeshPhysicalMaterial).envMap
    mesh.material = material
  }
}

let pmremGenerator: PMREMGenerator | undefined

export const processCharacterMesh = (
  mesh: Mesh,
  renderer: WebGLRenderer,
  isHolographic = false
): void => {
  if (!pmremGenerator) {
    pmremGenerator = new PMREMGenerator(renderer)
  }
  assignChromaticMaterialIfNeeded(mesh, pmremGenerator, isHolographic).catch(
    console.error
  )
  assignGlassMaterialIfNeeded(mesh, renderer).catch(console.error)
}

export const processBrainMesh = (mesh: Mesh, renderer: WebGLRenderer): void => {
  if (['OrbOuter', 'axisMk2'].includes(mesh.name)) {
    glassMaterialWithEnvMap(renderer, undefined, 0.1)
      .then(glassMaterial => {
        mesh.material = glassMaterial
      })
      .catch(console.error)
  } else if (mesh.name === 'BrainCore') {
    mesh.material = new MeshStandardMaterial({ color: 0x000000 })
  } else if (mesh.name === 'Brain') {
    const material = mesh.material as MeshStandardMaterial
    material.roughness = 1
    material.metalness = 0.1
    material.flatShading = false
    mesh.material = material
  }
}
