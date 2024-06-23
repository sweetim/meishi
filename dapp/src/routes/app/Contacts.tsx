import {
  getAptosClient,
  MODULE_FN,
  NameCardConnection,
  NameCardMetadata,
} from "@/contract"
import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import { MagnifyingGlass } from "@phosphor-icons/react"
import {
  Input,
  List,
  Space,
  Tag,
} from "antd"
import { format } from "date-fns"
import {
  ChangeEvent,
  FC,
  useEffect,
  useState,
} from "react"
import { Link } from "react-router-dom"

const aptosClient = getAptosClient()

const Contacts: FC = () => {
  const [ connectionNameCardMetadata, setConnectionNameCardMetadata ] = useState<NameCardMetadata[]>([])

  const { accountAddress } = useAptosAccountInfo()

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
      setQueryData(output)
    })()
  }, [ accountAddress ])

  const [ queryData, setQueryData ] = useState(connectionNameCardMetadata)

  async function searchInputChangeHandler(ev: ChangeEvent<HTMLInputElement>) {
    const query = ev.target.value

    if (query.length === 0) {
      setQueryData(connectionNameCardMetadata)
      return
    }

    setQueryData(connectionNameCardMetadata.filter(item =>
      item.name.includes(query)
      || item.company_name.includes(query)
    ))
  }

  return (
    <Space direction="vertical" className="py-2 w-full">
      <div className="p-2">
        <Input
          onChange={searchInputChangeHandler}
          addonBefore={<MagnifyingGlass size={16} color="#ffebeb" weight="fill" />}
          size="large"
          placeholder="name or company"
        />
      </div>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={queryData}
        renderItem={(item) => (
          <Link to={`/app/contacts/${item.id}`}>
            <List.Item
              key={item.id}
              extra={
                <img
                  className="max-h-16"
                  width={100}
                  height={75}
                  alt="logo"
                  src={item.card_uri}
                />
              }
            >
              <List.Item.Meta
                title={item.company_name}
                description={
                  <Space direction="vertical">
                    <p>{item.title}</p>
                    <Tag color="default">{format(new Date(item.timestamp_us / 1_000_000), "MM/dd/yyyy")}</Tag>
                  </Space>
                }
              />
            </List.Item>
          </Link>
        )}
      />
    </Space>
  )
}

export default Contacts
