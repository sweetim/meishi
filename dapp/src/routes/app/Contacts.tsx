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
    })()
  }, [ accountAddress ])

  // const connectionNameCardMetadata: NameCardMetadata[] = [
  //   {
  //     timestamp_us: 1719120970485,
  //     id: "1",
  //     address: "33F Tokyo Toranomon Hills",
  //     address_uri: "https://maps.app.goo.gl/5Fw6ZVNWd3JHQXA56",
  //     company_name: "timx",
  //     email: "tim@timx.co",
  //     company_uri: "https://timx.co",
  //     name: "tim",
  //     telephone: "080-3333-8888",
  //     title: "founder",
  //     logo_uri: "https://plum-deliberate-otter-677.mypinata.cloud/ipfs/QmU8LzZvku5LeK6jjSr9w33vmdhH2716vuq35aAhb5zByC",
  //     links: [],
  //     card_uri: "/card_3.png",
  //   },
  //   {
  //     timestamp_us: 1719120970485,
  //     id: "2",
  //     address: "123 Anywhere St, Any City, ST 12345",
  //     address_uri: "https://maps.app.goo.gl/5Fw6ZVNWd3JHQXA56",
  //     company_name: "Liceria Company",
  //     email: "hello@reallygreatsite.com",
  //     company_uri: "www.reallygreatsite.com",
  //     name: "Dani Martinez",
  //     telephone: "123-456-7890",
  //     title: "Finance Manager",
  //     logo_uri: "/card_1.webp",
  //     links: [],
  //     card_uri: "/card_1.webp",
  //   },
  //   {
  //     timestamp_us: 1719120970485,
  //     id: "3",
  //     address: "123 Lombard St, California",
  //     address_uri: "https://maps.app.goo.gl/5Fw6ZVNWd3JHQXA56",
  //     company_name: "Ingoude Company",
  //     email: "hello@reallygreatsite.com",
  //     company_uri: "https://www.reallygreatesite.com",
  //     name: "Morgan Maxwell",
  //     telephone: "123-456-7890",
  //     title: "Operations Director",
  //     logo_uri: "/card_2.webp",
  //     links: [],
  //     card_uri: "/card_2.webp",
  //   },
  // ]

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
          <List.Item
            key={item.id}
            extra={
              <img
                className="max-h-16"
                width={128}
                height={75}
                alt="logo"
                src={item.card_uri}
              />
            }
          >
            <List.Item.Meta
              title={<a href={item.company_uri}>{item.company_name}</a>}
              description={
                <Space direction="vertical">
                  <p>{item.title}</p>
                  <Tag color="default">{format(new Date(item.timestamp_us), "MM/dd/yyyy")}</Tag>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Space>
  )
}

export default Contacts
