import {
  getAptosClient,
  MODULE_FN,
  NameCardDescription,
  NameCardMetadata,
} from "@/contract"
import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import {
  ConfigProvider,
  Input,
  Space,
} from "antd"
import {
  FC,
  useEffect,
} from "react"
import { useProfileFormStore } from "./useProfileFormStore"

const aptosClient = getAptosClient()

const EditProfileForm: FC = () => {
  const isEdit = useProfileFormStore(state => state.isEdit)
  const nameCardDescription = useProfileFormStore(state => state.nameCardDescription)
  const setNameCardDescription = useProfileFormStore(state => state.setNameCardDescription)

  const { accountAddress } = useAptosAccountInfo()

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

      setNameCardDescription({
        name: nameCardMetadata.name,
        title: nameCardMetadata.title,
        email: nameCardMetadata.email,
        company_address: nameCardMetadata.company_address,
        company_address_uri: nameCardMetadata.company_address_uri,
        company_name: nameCardMetadata.company_name,
        company_uri: nameCardMetadata.company_uri,
        telephone: nameCardMetadata.telephone,
        logo_uri: nameCardMetadata.logo_uri,
        card_uri: nameCardMetadata.card_uri,
      })
    })()
  }, [ accountAddress ])

  const handleInputChange = (field: keyof NameCardMetadata, value: string) => {
    setNameCardDescription({
      ...nameCardDescription,
      [field]: value,
    })
  }

  const renderField = (label: string, field: keyof NameCardDescription) => (
    <Space className="w-full" direction="vertical">
      <p>{label}</p>
      <Input
        disabled={!isEdit}
        size="large"
        value={nameCardDescription[field]}
        onChange={(e) =>
          handleInputChange(field, e.target.value)}
      />
    </Space>
  )

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextDisabled: "#ccc",
        },
      }}
    >
      <Space className="text-slate-400 w-full p-3" size="large" direction="vertical">
        {renderField("Name", "name")}
        {renderField("Title", "title")}
        {renderField("Email", "email")}
        {renderField("Company name", "company_name")}
        {renderField("Company uri", "company_uri")}
        {renderField("Company address", "company_address")}
        {renderField("Company address uri", "company_address_uri")}
        {renderField("Telephone", "telephone")}
        {renderField("Logo uri", "logo_uri")}
        {renderField("Card uri", "card_uri")}
      </Space>
    </ConfigProvider>
  )
}

export default EditProfileForm
