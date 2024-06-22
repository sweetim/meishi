import { getAptosClient } from "@/contract"
import {
  useEffect,
  useState,
} from "react"
import { useAptosAccountInfo } from "./useAptosAccountInfo"

const aptosClient = getAptosClient()

export type CoinsData = {
  name: string
  symbol: string
  decimals: number
  amount: number
  iconUri: string
}

const SYMBOL_ICON_URI: Record<string, string> = {
  APT: "/aptos.svg",
}

export function useCoinsData() {
  const [ coinsData, setCoinsData ] = useState<CoinsData[] | null>()

  const { accountAddress } = useAptosAccountInfo()

  useEffect(() => {
    ;(async () => {
      if (!accountAddress) return

      const coinsData = await aptosClient.account.getAccountCoinsData({
        accountAddress,
      })

      setCoinsData(
        coinsData.map<CoinsData>(item => ({
          decimals: item.metadata?.decimals!,
          iconUri: item.metadata?.icon_uri || SYMBOL_ICON_URI[item.metadata?.symbol!],
          amount: item.amount / Math.pow(10, item.metadata?.decimals!),
          name: item.metadata?.name!,
          symbol: item.metadata?.symbol!,
        })),
      )
    })()
  }, [ accountAddress ])

  return {
    coinsData,
  }
}
