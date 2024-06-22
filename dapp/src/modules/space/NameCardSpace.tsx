import { NameCardMetadata } from "@/contract"
import {
  Building,
  EnvelopeSimple,
  Globe,
  Phone,
} from "@phosphor-icons/react"
import { Space } from "antd"
import { FC } from "react"

type NameCardSpaceProps = {
  data: NameCardMetadata
}

const NameCardSpace: FC<NameCardSpaceProps> = ({ data }) => {
  return (
    <div className="flex flex-col text-white py-3">
      <Space className="p-2" direction="vertical" align="center">
        <img
          className=" w-28 h-28 rounded-full p-2"
          src={data.logo_uri}
          alt="company logo"
        />
        <h1 className="text-lg">{data.company_name}</h1>
      </Space>
      <div className="leading-4">
        <h2 className="text-3xl">tim</h2>
        <p className="text-lg text-slate-400">founder</p>
      </div>
      <Space className="mt-10 text-blue-300" direction="vertical" size="small">
        <Space>
          <Phone size={24} color="#fff" weight="fill" />
          <p>{data.telephone}</p>
        </Space>
        <Space>
          <EnvelopeSimple size={24} color="#fff" weight="fill" />
          <p>{data.email}</p>
        </Space>
        <Space>
          <Globe size={24} color="#fff" weight="fill" />
          <a href={data.company_uri} target="_blank">
            <p>{data.company_uri}</p>
          </a>
        </Space>
        <Space>
          <Building size={24} color="#fff" weight="fill" />
          <a href={data.address_uri} target="_blank">
            <p>{data.address}</p>
          </a>
        </Space>
      </Space>
    </div>
  )
}

export default NameCardSpace
