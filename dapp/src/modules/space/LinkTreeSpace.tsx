import { NameCardMetadata } from "@/contract"
import { Space } from "antd"
import { FC } from "react"
import FillButton from "../common/FillButton"

export type LinkTreeSpaceProps = {
  data: NameCardMetadata
}

const LinkTreeSpace: FC<LinkTreeSpaceProps> = ({ data }) => {
  return (
    <Space direction="vertical" size="middle" className="p-2 w-full">
      {data.links.map(item => (
        <FillButton key={item.title}>
          <a href={item.uri} target="_blank">
            <p>{item.title}</p>
          </a>
        </FillButton>
      ))}
    </Space>
  )
}

export default LinkTreeSpace
