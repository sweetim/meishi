import { NameCardMetadata } from "@/contract"
import { Space } from "antd"
import { FC } from "react"

type NameCardImageSpaceProps = {
  data: NameCardMetadata
}

const NameCardImageSpace: FC<NameCardImageSpaceProps> = ({ data }) => {
  return (
    <Space align="center" direction="vertical" className="w-full">
      <img src={data.card_uri} width={230} height={400} alt="business_card" />
    </Space>
  )
}

export default NameCardImageSpace
