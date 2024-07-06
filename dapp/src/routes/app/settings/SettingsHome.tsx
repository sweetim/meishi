import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import {
  BuildingOffice,
  SignOut,
  User,
} from "@phosphor-icons/react"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  Avatar,
  List,
  Space,
} from "antd"
import Paragraph from "antd/lib/typography/Paragraph"
import {
  ReactNode,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { match } from "ts-pattern"

type SettingItem = {
  title: string
  icon: ReactNode
}

const settingsItems: SettingItem[] = [
  {
    title: "Profile",
    icon: <User size={20} color="#ffebeb" weight="fill" />,
  },
  {
    title: "Organization",
    icon: <BuildingOffice size={20} color="#ffebeb" weight="fill" />,
  },
  {
    title: "Logout",
    icon: <SignOut size={20} color="#ffebeb" weight="fill" />,
  },
]

export default function SettingsHome() {
  const navigate = useNavigate()

  const [ profileImage, setProfileImage ] = useState("")
  const { account } = useAptosAccountInfo()

  const {
    logout,
    userInfo,
  } = useWeb3Auth()

  useEffect(() => {
    ;(async () => {
      if (userInfo && userInfo.profileImage) {
        setProfileImage(userInfo.profileImage)
      }
    })()
  })

  async function logoutClickHandler() {
    await logout()
    navigate("/")
  }

  async function settingItemClickHandler(item: SettingItem) {
    const handler = match(item.title)
      .with("Logout", () => logoutClickHandler)
      .otherwise(() => () => navigate(`/app/settings/${item.title.toLowerCase()}`))

    handler()
  }

  return (
    <div className="w-full">
      <Space direction="vertical" size="large" align="center" className="w-full text-center mt-10 p-5">
        <Avatar size={128} src={profileImage} />
        <Paragraph style={{ width: 300, color: "white" }} ellipsis copyable className="font-bold">
          {account?.accountAddress.toString()}
        </Paragraph>
      </Space>
      <h1 className="text-white text-base p-2">SETTINGS</h1>
      <List
        size="large"
        dataSource={settingsItems}
        renderItem={(item) => (
          <List.Item
            className="hover:bg-zinc-800"
            key={item.title}
            onClick={() => settingItemClickHandler(item)}
          >
            <List.Item.Meta avatar={item.icon} title={item.title} />
          </List.Item>
        )}
      />
    </div>
  )
}
