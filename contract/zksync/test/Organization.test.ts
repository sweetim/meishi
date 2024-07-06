import { Wallet } from "zksync-ethers"
import {
  deployContract,
  getWallet,
  LOCAL_RICH_WALLETS,
} from "../deploy/utils"

import { expect } from "chai"
import { Organization } from "../typechain-types"

describe("Organization", function() {
  const organizationMetadata: Organization.OrganizationMetadataStruct = {
    name: "name",
    iconUri: "iconUri",
  }

  let organization: Organization
  let user_1: Wallet
  let user_2: Wallet
  let user_3: Wallet
  let organizationId: string

  before(async () => {
    user_1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey)
    user_2 = getWallet(LOCAL_RICH_WALLETS[2].privateKey)
    user_3 = getWallet(LOCAL_RICH_WALLETS[3].privateKey)
    organization = await deployContract("Organization", []) as any
    organizationId = user_1.address
  })

  it("should able to register organization", async function() {
    await expect(
      organization.connect(user_1)
        .registerOrganization(organizationMetadata),
    )
      .to.emit(organization, "OrganizationCreated")
      .withArgs(user_1.address, organizationMetadata.name)
  })

  it("should able to add member by admin", async function() {
    await expect(
      organization.connect(user_1)
        .addMember(organizationId, user_2.address),
    )
      .to.emit(organization, "OrganizationMemberUpdate")
      .withArgs(user_1.address, user_2.address, BigInt(1))
  })

  it("should not allow to add member if not admin", async function() {
    await expect(
      organization.connect(user_2)
        .addMember(organizationId, user_1.address),
    ).to.be.revertedWith("only admin allowed")
  })

  it("should able return isMember true when is a member in organization", async function() {
    expect(await organization.isMember(organizationId, user_1.address)).to.be.true
    expect(await organization.isMember(organizationId, user_2.address)).to.be.true
  })

  it("should able return isMember false when not a member in organization", async function() {
    expect(await organization.isMember(organizationId, user_3.address)).to.be.false
  })

  it("should able to get organization", async function() {
    const [ name, iconUri ] = await organization.getOrganization(organizationId)

    expect({ name, iconUri }).to.be.deep.eq(organizationMetadata)
  })

  it("should able to get getPaymasterAddress", async function() {
    const paymasterAddress = await organization.getPaymasterAddress(organizationId)

    expect(paymasterAddress).to.be.not.eq(0)
  })

  it("should able to return list of members", async function() {
    const membersList = await organization.getMembers(organizationId)

    expect(membersList).to.be.deep.eq([
      user_1.address,
      user_2.address,
    ])
  })
})
