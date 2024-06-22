import {
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk"

const MODULE_ADDRESS = "0x8e49e4e20e63b2481cb744b4481be224ec40e17d549387502da559e95e63ff57"

export type NameCard = {
  metadata: NameCardMetadata
  connections: NameCardConnection[]
}

export type NameCardConnection = {
  user: string
  timestamp_us: number
}

export type NameCardMetadata = {
  id: string
  timestamp_us: number
  name: string
  title: string
  email: string
  address: string
  address_uri: string
  company_name: string
  company_uri: string
  telephone: string
  logo_uri: string
  card_uri: string
  links: LinkTree[]
}

export type LinkTree = {
  title: string
  uri: string
}

export const MODULE_FN: Record<string, `${string}::${string}::${string}`> = {
  "register_name_card": `${MODULE_ADDRESS}::contract::register_name_card`,
  "register_connection": `${MODULE_ADDRESS}::contract::register_connection`,
  "get_name_card": `${MODULE_ADDRESS}::contract::get_name_card`,
  "get_name_card_metadata": `${MODULE_ADDRESS}::contract::get_name_card_metadata`,
  "get_name_card_connections": `${MODULE_ADDRESS}::contract::get_name_card_connections`,
}

export function getAptosClient() {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET })
  const aptos = new Aptos(aptosConfig)

  return aptos
}
