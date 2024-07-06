import { Space } from "antd"
import {
  FC,
  MouseEventHandler,
  ReactElement,
} from "react"

type FillButtonProps = {
  children: ReactElement | ReactElement[]
  onClick?: MouseEventHandler<HTMLDivElement>
}

const FillButton: FC<FillButtonProps> = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-3xl p-5 min-w-32 border-none text-white bg-zinc-800 hover:bg-zinc-600"
    >
      <Space
        direction="vertical"
        size="middle"
        align="center"
        className="w-full"
      >
        {children}
      </Space>
    </div>
  )
}

export default FillButton
