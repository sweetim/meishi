import { Organization } from "../typechain-types"
import {
  deployContract,
  getWallet,
} from "./utils"

export default async function() {
  const owner = getWallet()
  const organizationContractArtifactName = "Organization"
  const organization: Organization = await deployContract(
    organizationContractArtifactName,
  ) as any

  const organizationAddress = await organization.getAddress()

  console.log(`Deployed organization contract at ${organizationAddress}`)

  console.log(await organization.getMembers(owner.address))
}
