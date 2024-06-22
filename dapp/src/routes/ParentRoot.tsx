import { FC } from "react"
import { Outlet } from "react-router-dom"

const ParentRoot: FC = () => {
  return (
    <div className="w-full h-screen bg-zinc-800">
      <Outlet />
    </div>
  )
}

export default ParentRoot
