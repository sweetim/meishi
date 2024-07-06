import { FC } from "react"
import { Outlet } from "react-router-dom"

const OrganizationRoot: FC = () => {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  )
}

export default OrganizationRoot
