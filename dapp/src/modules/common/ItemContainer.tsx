import {
  FC,
  ReactElement,
} from "react"

type ItemContainerProps = {
  className?: string
  children: ReactElement | ReactElement[]
}

const ItemContainer: FC<ItemContainerProps> = ({ className, children }) => {
  return (
    <div className={`p-2 bg-white rounded-xl ${className}`}>
      {children}
    </div>
  )
}

export default ItemContainer
