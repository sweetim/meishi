import { Space } from "antd"
import { clsx } from "clsx"
import {
  FC,
  MouseEventHandler,
  ReactNode,
} from "react"
import { match } from "ts-pattern"

type PrimaryButtonProps = {
  children: string | ReactNode
  dark?: boolean
  rounded?: boolean
  icon?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  iconPosition?: "start" | "end"
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  dark,
  rounded,
  children,
  icon,
  iconPosition,
  onClick,
}) => {
  const items = [
    icon,
    children,
  ]

  const className = clsx(
    `bg-purple-300
    text-black
    rounded-lg
    border-none
    px-5
    py-2.5
    hover:bg-purple-200`,
    {
      "text-white": dark,
      "bg-zinc-700": dark,
      "hover:bg-zinc-600": dark,
      "rounded-3xl": rounded,
    },
  )

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      <Space size="middle">
        {match(iconPosition)
          .with("end", () => items.reverse())
          .otherwise(() => items)}
      </Space>
    </button>
  )
}

export default PrimaryButton
