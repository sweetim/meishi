import {
  Account,
  Secp256k1PrivateKey,
} from "@aptos-labs/ts-sdk"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  useEffect,
  useState,
} from "react"
import { getAptosClient } from "../contract"

const aptosClient = getAptosClient()

export function useAptosAccountInfo() {
  const [ account, setAccount ] = useState<Account | null>()

  const {
    isConnected,
    provider,
  } = useWeb3Auth()

  useEffect(() => {
    ;(async () => {
      if (!provider) return

      const privateKey: any = await provider.request({ method: "private_key" })

      const account = await aptosClient.deriveAccountFromPrivateKey({
        privateKey: new Secp256k1PrivateKey(privateKey),
      })

      setAccount(account)
    })()
  }, [ provider ])

  const accountAddress = account && account.accountAddress

  return {
    isConnected,
    account,
    accountAddress,
  }
}
