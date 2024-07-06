import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  FC,
  ReactElement,
} from "react"
import { Navigate } from "react-router-dom"

type ProtectedRouteProps = {
  children: ReactElement | ReactElement[]
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected } = useWeb3Auth()

  if (!isConnected) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
