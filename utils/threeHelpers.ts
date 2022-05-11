import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControlsProps } from '@react-three/drei'

import {
  isFishTank,
  processCharacterMesh,
} from './glb-iframe/processor'
import {
  Color,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  WebGLRenderer,
} from 'three'
import { glassMaterial } from './glb-iframe/materials'

const isMesh = (obj: THREE.Object3D | THREE.Mesh): obj is THREE.Mesh => {
  return 'isMesh' in obj
}

const isMaterialArray = (
  material: THREE.Material | THREE.Material[]
): material is THREE.Material[] => {
  return Array.isArray(material)
}

const isMeshStandardMaterial = (
  material: THREE.Material | THREE.MeshStandardMaterial
): material is THREE.MeshStandardMaterial => {
  return material.type === 'MeshStandardMaterial'
}

export const applyTexture = (gltf: GLTF, texture: THREE.Texture) => {
  gltf.scene.traverse(child => {
    if (!isMesh(child)) return

    const material = child.material
    if (isMaterialArray(material)) {
      material.forEach(m => {
        if (isMeshStandardMaterial(m)) {
          if (m.name !== 'Glass') {
            m.map = texture
          }
        }
      })
      return
    }

    if (isMeshStandardMaterial(material)) {
      if (material.name !== 'Glass') {
        material.map = texture
      }
    }
  })
}

export const applyShaderToGroup = (
  gltf: GLTF,
  renderer: WebGLRenderer,
  isHolographic = false
) =>
  gltf.scene.traverse(obj => {
    if (isMesh(obj)) {
      processCharacterMesh(obj as Mesh, renderer, isHolographic)
    }
  })

export const applyTextureToGroup = (
  group: THREE.Group | undefined,
  texture: THREE.Texture,
  accentTexture?: THREE.Texture,
  holoTexture?: THREE.Texture
) => {
  texture.flipY = false
  if (accentTexture) {
    accentTexture.flipY = false
  }

  const applyTexture = (material: THREE.MeshStandardMaterial) => {
    const name = material.name
    console.log(name)

    const isMatte = name.toLowerCase().includes('matte')
    const isMetallic = name.toLowerCase().includes('metallic')
    const isSecondary = name.toLowerCase().includes('secondary')

    const apply = isMatte || isMetallic
    if (!isSecondary && apply) {
      material.map = texture
      return
    }
    if (isSecondary && apply) {
      material.map = accentTexture || texture
    }
  }

  if (group) {
    group.traverse(child => {
      if (!isMesh(child)) return

      if (
        holoTexture &&
        (child.material as Material).name === 'Silver' // This is for Configurator
      ) {
        child.material = new MeshPhysicalMaterial({
          roughness: 0.2,
          metalness: 1,
          envMap: holoTexture,
          sheenColor: new Color(0x666666),
        })
      }

      if (isFishTank(child)) {
        child.material = glassMaterial()
        return
      }

      const material = child.material
      if (isMaterialArray(material)) {
        material.forEach(m => {
          if (isMeshStandardMaterial(m)) {
            applyTexture(m)
          }
        })
        return
      }

      if (isMeshStandardMaterial(material)) {
        applyTexture(material)
      }
    })
  }
}

// TODO: Might need to return a promise instead due to setTimeout
export const cloneScene = (
  group: THREE.Group | undefined,
  gltf: GLTF,
  isHolographic = false
) => {
  if (group && gltf) {
    // TODO: Refactor so timeout is not needed.
    // - Preload the holographic textures here
    // - Pass in preloaded textures to processCharacter() call
    // - Refactor needed in common/glb-iframe etc.
    const cloneAll = () => {
      group.add(gltf.scene.clone())
      group.traverse(child => {
        if (isMesh(child)) {
          if (isMaterialArray(child.material)) {
            child.material.forEach(material => {
              material = material.clone()
            })
          } else {
            child.material = child.material.clone()
          }
        }
      })
    }
    if (isHolographic) {
      window.setTimeout(() => {
        cloneAll()
      }, 500)
    } else {
      cloneAll()
    }
  }
}

export const orbitControlsLerp = (
  source: THREE.Vector3 | undefined,
  target: THREE.Vector3 | null,
  orbitControls: OrbitControlsProps | undefined,
  buffer: number,
  alpha: number,
  cb: () => void
) => {
  if (!(source && target && orbitControls?.object)) {
    return
  }
  const distance = source.distanceTo(target)
  if (distance < buffer) {
    cb()
    return
  }
  source.lerp(target, alpha)
  orbitControls.update && orbitControls.update()
}