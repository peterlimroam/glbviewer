import { useThree } from '@react-three/fiber'
import { setRoomEnvironment } from '../utils/glb-iframe/environments'
import { useEffect } from 'react'
// import { useTexture} from '@react-three/drei'
// import { PMREMGenerator, sRGBEncoding, Texture } from 'three'
// import holoTextureImage from '../utils/glb-iframe/assets/img/shutterstock_752422525.jpg'

export const useRoomEnvironment = (isHolographic = false) => {
  const { gl, scene } = useThree(state => state)
  useEffect(() => {
    setRoomEnvironment(scene, gl, isHolographic)
    return () => {
      // TODO: onComponentUnmount - should these environment settings be removed?
    }
  }, [gl, scene, isHolographic])
}

// export const useHoloTexture = (isHolographic = false) => {
//   const holoTextureSimple = useTexture(holoTextureImage)
//   const renderer = useThree(s => s.gl)

//   if (isHolographic) {
//     const prem = new PMREMGenerator(renderer)
//     prem.compileEquirectangularShader()
//     (holoTextureSimple as Texture).encoding = sRGBEncoding
//     return prem.fromEquirectangular(holoTextureSimple).texture
//   }
// }