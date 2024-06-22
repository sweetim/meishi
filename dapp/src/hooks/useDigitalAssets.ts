import { getAptosClient } from "@/contract"
import { GetOwnedTokensResponse } from "@aptos-labs/ts-sdk"
import {
  useEffect,
  useState,
} from "react"
import { useAptosAccountInfo } from "./useAptosAccountInfo"

const aptosClient = getAptosClient()

export function useCoinsData() {
  const [ digitalAssetsData, setDigitalAssetsData ] = useState<GetOwnedTokensResponse | null>()

  const { accountAddress } = useAptosAccountInfo()

  useEffect(() => {
    ;(async () => {
      if (!accountAddress) return

      const digitalAssets = await aptosClient.account.getAccountOwnedTokens({
        accountAddress,
      })

      setDigitalAssetsData(digitalAssets)
    })()
  }, [ accountAddress ])

  return {
    digitalAssetsData,
  }
}
