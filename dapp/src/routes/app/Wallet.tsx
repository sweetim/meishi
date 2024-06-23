import { getAptosClient } from "@/contract"
import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import { useCoinsData } from "@/hooks/useCoinsData"
import {
  Avatar,
  List,
  Space,
} from "antd"
import { useEffect } from "react"

const aptosClient = getAptosClient()

export default function Wallet() {
  const { accountAddress } = useAptosAccountInfo()
  const { coinsData } = useCoinsData()

  useEffect(() => {
    ;(async () => {
      if (!accountAddress) return

      const amount = coinsData?.filter(item => item.symbol === "APT")[0] || 0

      if (amount === 0) {
        await aptosClient.fundAccount({
          accountAddress,
          amount: Math.pow(10, 8),
        })
        console.log("funded")
      }
    })()
  }, [ coinsData ])

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
