import { useCoinsData } from "@/hooks/useCoinsData"
import {
  Avatar,
  List,
  Space,
} from "antd"

export default function Wallet() {
  const { coinsData } = useCoinsData()

  return (
    <Space direction="vertical" size="large" className="w-full p-2 text-white">
      <Space direction="vertical" className="w-full">
        <h1>
          <strong>Tokens</strong>
        </h1>
        <List
          itemLayout="horizontal"
          dataSource={coinsData || []}
          renderItem={(item) => (
            <List.Item className="!p-2">
              <List.Item.Meta
                avatar={<Avatar className="bg-white" src={item.iconUri} />}
                title={item.symbol}
                description={item.name}
              />
              <h2 className="text-xl font-bold text-white">{item.amount?.toLocaleString()}</h2>
            </List.Item>
          )}
        />
      </Space>
    </Space>
  )
}
