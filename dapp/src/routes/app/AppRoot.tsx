import BottomNavBar from "@/modules/BottomNavBar"
import { Layout } from "antd"
import {
  Content,
  Footer,
} from "antd/lib/layout/layout"
import { Outlet } from "react-router-dom"

export default function AppRoot() {
  return (
    <Layout className="h-full bg-zinc-900">
      <Content className="h-full overflow-auto no-scrollbar">
        <Outlet />
      </Content>
      <Footer className="!p-0">
        <BottomNavBar />
      </Footer>
    </Layout>
  )
}
