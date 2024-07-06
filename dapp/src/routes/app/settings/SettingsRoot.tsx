import { useProfileFormStore } from "@/modules/profile-form/useProfileFormStore"
import {
  ArrowLeft,
  FloppyDisk,
  Pencil,
} from "@phosphor-icons/react"
import {
  Layout,
  Space,
} from "antd"
import { Content } from "antd/lib/layout/layout"
import { FC } from "react"
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom"
import { match } from "ts-pattern"

const SettingsRoot: FC = () => {
  const isEdit = useProfileFormStore(state => state.isEdit)
  const setIsEdit = useProfileFormStore(state => state.setIsEdit)
  const nameCardDescription = useProfileFormStore(state => state.nameCardDescription)

  const location = useLocation()

  const settingRoute = location.pathname.split("/")[3]

  function editProfileClickHandler() {
    setIsEdit(true)
  }

  function saveProfileClickHandler() {
    setIsEdit(false)
    console.log(nameCardDescription)
  }

  const profileButton = match({ isEdit, settingRoute })
    .with(
      { isEdit: false, settingRoute: "profile" },
      () => (
        <button onClick={editProfileClickHandler} className="hover:bg-zinc-700 rounded-full p-2">
          <Pencil size={26} color="#ffebeb" weight="fill" />
        </button>
      ),
    )
    .with(
      { isEdit: true, settingRoute: "profile" },
      () => (
        <button onClick={saveProfileClickHandler} className="hover:bg-zinc-700 rounded-full p-2">
          <FloppyDisk size={26} color="#ffebeb" weight="fill" />
        </button>
      ),
    )
    .otherwise(() => null)

  return (
    <Layout className="h-full bg-zinc-900">
      {!!settingRoute && (
        <div className="p-3 bg-zinc-800 flex flex-row justify-between">
          <Space align="center">
            <Link to={"/app/settings"}>
              <button className="hover:bg-zinc-700 rounded-full p-2">
                <ArrowLeft size={26} color="#ffebeb" weight="fill" />
              </button>
            </Link>
            <h1 className="text-white text-lg capitalize">{settingRoute}</h1>
          </Space>
          <Space align="center">
            {profileButton}
          </Space>
        </div>
      )}
      <Content className="h-full overflow-auto no-scrollbar">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default SettingsRoot
