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
import AddContactId from "./routes/AddContactId.tsx"
import Landing from "./routes/Landing.tsx"
import ParentRoot from "./routes/ParentRoot.tsx"
import AppRoot from "./routes/app/AppRoot.tsx"
import Contacts from "./routes/app/Contacts.tsx"
import Home from "./routes/app/Home.tsx"
import Scan from "./routes/app/Scan.tsx"
import Wallet from "./routes/app/Wallet.tsx"
import Profile from "./routes/app/settings/Profile.tsx"
import SettingsHome from "./routes/app/settings/SettingsHome.tsx"
import SettingsRoot from "./routes/app/settings/SettingsRoot.tsx"
import OrganizationCreate from "./routes/app/settings/organization/OrganizationCreate.tsx"
import OrganizationHome from "./routes/app/settings/organization/OrganizationHome.tsx"
import OrganizationRoot from "./routes/app/settings/organization/OrganizationRoot.tsx"

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
        path: "/:id",
        element: <AddContactId />,
      },
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <AppRoot />
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
            path: "contacts/:id",
            element: <AddContactId />,
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
            path: "settings",
            element: <SettingsRoot />,
            children: [
              {
                path: "",
                element: <SettingsHome />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "organization",
                element: <OrganizationRoot />,
                children: [
                  {
                    path: "",
                    element: <OrganizationHome />,
                  },
                  {
                    path: "create",
                    element: <OrganizationCreate />,
                  },
                ],
              },
            ],
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
