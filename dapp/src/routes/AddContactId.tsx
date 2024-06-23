import {
  getAptosClient,
  MODULE_FN,
  NameCardConnection,
  NameCardMetadata,
} from "@/contract"
import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import { FillButton } from "@/modules/common"
import {
  LinkTreeSpace,
  NameCardImageSpace,
  NameCardSpace,
} from "@/modules/space"
import { BackgroundGradient } from "@/modules/ui"
import { UserPlus } from "@phosphor-icons/react"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  Carousel,
  ConfigProvider,
  Layout,
  Space,
  theme,
} from "antd"
import {
  Content,
  Header,
} from "antd/lib/layout/layout"
import {
  FC,
  useEffect,
  useState,
} from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

const aptosClient = getAptosClient()

const ContactId: FC = () => {
  const navigate = useNavigate()

  const { connect } = useWeb3Auth()
  const { isConnected } = useAptosAccountInfo()
  const { id } = useParams()

  const [ nameCardMetadata, setNameCardMetadata ] = useState<NameCardMetadata | null>(null)
  const [ connectionNameCardMetadata, setConnectionNameCardMetadata ] = useState<NameCardMetadata[]>([])

  const { accountAddress, account } = useAptosAccountInfo()

  useEffect(() => {
    ;(async () => {
      if (!accountAddress) return

      const [ connections ] = await aptosClient.view<NameCardConnection[][]>({
        payload: {
          function: MODULE_FN.get_name_card_connections,
          functionArguments: [
            accountAddress,
          ],
        },
      })

      const output = await Promise.all(connections.map(async item => {
        const [ metadata ] = await aptosClient.view<NameCardMetadata[]>({
          payload: {
            function: MODULE_FN.get_name_card_metadata,
            functionArguments: [
              item.user,
            ],
          },
        })

        return metadata
      }))

      console.log(output)
      setConnectionNameCardMetadata(output)
    })()
  }, [ accountAddress ])

  useEffect(() => {
    ;(async () => {
      if (!id) return

      const [ nameCardMetadata ] = await aptosClient.view<NameCardMetadata[]>({
        payload: {
          function: MODULE_FN.get_name_card_metadata,
          functionArguments: [
            id,
          ],
        },
      })
      setNameCardMetadata(nameCardMetadata)
    })()
  }, [ id ])

  const isUserConnectionNotExist = connectionNameCardMetadata
    .filter(item => item.id === id).length === 0

  async function addContactClickHandler() {
    if (!isConnected) {
      await connect()
      navigate("/app")
      return
    }

    if (!account) return
    console.log("start")
    const { accountAddress } = account

    const transaction = await aptosClient.transaction.build.simple({
      sender: accountAddress,
      data: {
        function: MODULE_FN.register_connection,
        functionArguments: [
          id,
        ],
      },
    })

    const tx = await aptosClient.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptosClient.waitForTransaction({
      transactionHash: tx.hash,
    })

    console.log("done")

    navigate("/app/contacts")
  }

  return (
    <Layout className="h-full bg-zinc-900">
      {!isConnected && (
        <Header className="!bg-zinc-900 !p-0">
          <Space className="text-white px-3">
            <img src="/logo.png" className="w-8"></img>
            <h1>meishi</h1>
          </Space>
        </Header>
      )}
      <Content className="h-full overflow-auto">
        <div className="flex flex-col p-8 bg-zinc-900 justify-evenly align-middle h-full">
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
          {isUserConnectionNotExist && (
            <FillButton onClick={addContactClickHandler}>
              <UserPlus size={32} color="#ffebeb" weight="fill" />
              <p>Add Contact</p>
            </FillButton>
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default ContactId
