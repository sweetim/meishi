import {
  CustomChainConfig,
  WEB3AUTH_NETWORK,
} from "@web3auth/base"
import { CommonPrivateKeyProvider } from "@web3auth/base-provider"
import { Web3AuthOptions } from "@web3auth/modal"
import {
  Web3AuthContextConfig,
  Web3AuthProvider,
} from "@web3auth/modal-react-hooks"
import {
  ConfigProvider,
  theme,
} from "antd"
import React from "react"
import ReactDOM from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import "./index.css"
import ProtectedRoute from "./modules/common/ProtectedRoute.tsx"
import Landing from "./routes/Landing.tsx"
import ParentRoot from "./routes/ParentRoot.tsx"
import Account from "./routes/app/Account.tsx"
import Contacts from "./routes/app/Contacts.tsx"
import Home from "./routes/app/Home.tsx"
import Root from "./routes/app/Root.tsx"
import Scan from "./routes/app/Scan.tsx"
import Wallet from "./routes/app/Wallet.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ParentRoot />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "contacts",
            element: <Contacts />,
          },
          {
            path: "scan",
            element: <Scan />,
          },
          {
            path: "wallet",
            element: <Wallet />,
          },
          {
            path: "account",
            element: <Account />,
          },
        ],
      },
    ],
  },
])

const chainConfig: CustomChainConfig = {
  chainNamespace: "other",
  chainId: "0x2", //
  rpcTarget: "https://grpc.testnet.aptoslabs.com",
  displayName: "Aptos Testnet",
  blockExplorerUrl: "https://explorer.aptoslabs.com/?network=testnet",
  ticker: "APT",
  tickerName: "Aptos",
}

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: { chainConfig },
})

const web3AuthOptions: Web3AuthOptions = {
  clientId: import.meta.env.VITE_WEB3_AUTH_CLIENT_ID,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName: "meishi",
    mode: "dark",
  },
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
  // adapters: [ openloginAdapter ],
  // plugins: [ walletServicesPlugin ],
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3AuthProvider config={web3AuthContextConfig}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Web3AuthProvider>
  </React.StrictMode>,
)
