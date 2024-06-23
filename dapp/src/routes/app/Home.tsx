import {
  getAptosClient,
  MODULE_FN,
  NameCardMetadata,
} from "@/contract"
import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import FillButton from "@/modules/common/FillButton"
import {
  LinkTreeSpace,
  NameCardImageSpace,
  NameCardSpace,
} from "@/modules/space"
import { BackgroundGradient } from "@/modules/ui"
import {
  QrCode,
  Share,
} from "@phosphor-icons/react"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  Carousel,
  ConfigProvider,
  Modal,
  QRCode,
  Space,
  theme,
} from "antd"
import {
  FC,
  useEffect,
  useState,
} from "react"

const aptosClient = getAptosClient()

const Home: FC = () => {
  const { userInfo } = useWeb3Auth()
  const { accountAddress } = useAptosAccountInfo()

  const [ nameCardMetadata, setNameCardMetadata ] = useState<NameCardMetadata | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!accountAddress) return

      const [ nameCardMetadata ] = await aptosClient.view<NameCardMetadata[]>({
        payload: {
          function: MODULE_FN.get_name_card_metadata,
          functionArguments: [
            accountAddress,
          ],
        },
      })
      setNameCardMetadata(nameCardMetadata)
    })()
  }, [ accountAddress ])

  async function shareClickHandler() {
    if (!nameCardMetadata) return

    await navigator.share({
      text: nameCardMetadata.name,
      url: `${window.location.origin}/app/contacts/${accountAddress}`,
      title: nameCardMetadata.company_name,
      // images: [ reader.result ],
    })
  }

  const [ isModalOpen, setIsModalOpen ] = useState(false)

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  async function qrCodeClickHandler() {
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col p-8 bg-zinc-900 h-full">
      <Modal
        className="p-5"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space className="w-full py-10 mt-10" direction="vertical" align="center" size="large">
          <h2 className="text-xl font-bold">{userInfo?.name}</h2>
          <QRCode size={256} value={`${window.location.origin}/app/contacts/${accountAddress}`} />
          <p className="text-lg text-slate-400">scan this QR code to exchange contact</p>
        </Space>
      </Modal>
      {
        /* <Space direction="vertical" size="middle" align="center" className="text-slate-300 w-full pb-10">
        <img className="w-14 h-14" src="/exchange.svg"></img>
        <p>touch to exchange</p>
      </Space> */
      }
      {nameCardMetadata && (
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <BackgroundGradient className="rounded-3xl w-full p-6 bg-zinc-900">
            <Carousel className="pb-3">
              <NameCardSpace data={nameCardMetadata} />
              <LinkTreeSpace data={nameCardMetadata} />
              <NameCardImageSpace data={nameCardMetadata} />
            </Carousel>
          </BackgroundGradient>
        </ConfigProvider>
      )}
      <div className="h-full"></div>
      <div className="flex flex-row w-full justify-evenly mt-10 pb-3">
        <FillButton onClick={qrCodeClickHandler}>
          <QrCode size={32} color="#ffebeb" weight="fill" />
          <h1>QR code</h1>
        </FillButton>
        <FillButton onClick={shareClickHandler}>
          <Space direction="vertical" size="large" align="center" className="w-full">
            <Share size={32} color="#ffebeb" weight="fill" />
            <h1>Share</h1>
          </Space>
        </FillButton>
      </div>
    </div>
  )
}

export default Home
