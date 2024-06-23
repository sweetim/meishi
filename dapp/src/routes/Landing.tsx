import { GLOBE_ARCS } from "@/data/arcs"
import FillButton from "@/modules/common/FillButton"
import { World } from "@/modules/ui"
import { Swap } from "@phosphor-icons/react"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import { Space } from "antd"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Landing() {
  const {
    isConnected,
    connect,
  } = useWeb3Auth()

  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected) {
      navigate("/app")
    }
  }, [ isConnected ])

  async function startClickHandler() {
    await connect()
    navigate("/app")
  }

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.05,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  }

  return (
    <div className="flex flex-col bg-black h-full w-full">
      <Space className="text-white p-3">
        <img src="/logo.png" className="w-8"></img>
        <h1>meishi</h1>
      </Space>
      <div className="flex flex-col items-center justify-center relative h-full w-full">
        <div className="py-20 mx-auto w-full relative overflow-hidden h-full">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="div"
          >
            <h2 className="text-center text-xl font-bold text-white">
              we connect you to the world
            </h2>
            <div className="text-center text-base font-normal text-neutral-400 max-w-md mt-2 mx-auto">
              <p>
                decentralized business card exchange
              </p>
              <p>
                reimagined how virtual business card to showcase your identity
              </p>
            </div>
          </motion.div>

          <div className="absolute w-full h-1/2 z-10">
            <World data={GLOBE_ARCS} globeConfig={globeConfig} />;
          </div>

          <div className="flex flex-row w-full justify-evenly mt-10 absolute bottom-10">
            <FillButton onClick={startClickHandler}>
              <Swap size={32} color="#ffebeb" weight="fill" />
              <h2>start exchange</h2>
            </FillButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
