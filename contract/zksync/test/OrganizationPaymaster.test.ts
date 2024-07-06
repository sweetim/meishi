import {
  utils,
  Wallet,
} from "zksync-ethers"
import {
  deployContract,
  getProvider,
  getWallet,
  LOCAL_RICH_WALLETS,
} from "../deploy/utils"

import { expect } from "chai"
import { ethers } from "ethers"
import {
  Meishi,
  Organization,
} from "../typechain-types"

describe("OrganizationPaymaster", function() {
  const organizationMetadata: Organization.OrganizationMetadataStruct = {
    name: "name",
    iconUri: "iconUri",
  }

  const registerNameCardArgs: Meishi.RegisterNameCardArgsStruct = {
    name: "name",
    title: "title",
    email: "email",
    company_name: "company_name",
    company_uri: "company_uri",
    company_address: "company_address",
    company_address_uri: "company_address_uri",
    telephone: "telephone",
    logo_uri: "logo_uri",
    card_uri: "card_uri",
    links: [
      {
        title: "google",
        uri: "google.com",
      },
    ],
  }

  let organization: Organization
  let organizationPaymasterAddress: string
  let meishi: Meishi
  let owner: Wallet
  let user_1: Wallet
  let user_2: Wallet
  let user_3: Wallet
  let organizationId: string

  before(async () => {
    owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey)
    user_1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey)
    user_2 = getWallet(LOCAL_RICH_WALLETS[2].privateKey)
    user_3 = getWallet(LOCAL_RICH_WALLETS[3].privateKey)

    meishi = await deployContract("Meishi", []) as any
    organization = await deployContract("Organization", []) as any
    organizationId = owner.address

    await (
      await organization.registerOrganization(organizationMetadata)
    ).wait()

    organizationPaymasterAddress = await organization.getPaymasterAddress(owner.address)

    const PAY_MASTER_INITIAL_FUND_ETH = 0.1

    await (
      await owner.sendTransaction({
        to: organizationPaymasterAddress,
        value: ethers.parseEther(`${PAY_MASTER_INITIAL_FUND_ETH}`),
      })
    ).wait()

    await (
      await organization.addMember(organizationId, user_1.address)
    ).wait()
  })

  it("should able to sponsor transaction for member in organization", async function() {
    const provider = getProvider()

    const balance_user_1_before = await provider.getBalance(user_1.address)

    const paymasterParams = utils.getPaymasterParams(
      organizationPaymasterAddress,
      {
        type: "General",
        innerInput: new Uint8Array(),
      },
    )

    await (
      await meishi.connect(user_1)
        .registerNameCard(
          registerNameCardArgs,
          {
            customData: {
              gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
              paymasterParams,
            },
          },
        )
    ).wait()

    const balance_user_1_after = await provider.getBalance(user_1.address)

    expect(balance_user_1_before - balance_user_1_after).to.be.eq(0)
  })

  it("should not sponsor transaction for non member", async function() {
    const paymasterParams = utils.getPaymasterParams(
      organizationPaymasterAddress,
      {
        type: "General",
        innerInput: new Uint8Array(),
      },
    )

    await expect(
      meishi.connect(user_2)
        .registerNameCard(
          registerNameCardArgs,
          {
            customData: {
              gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
              paymasterParams,
            },
          },
        ),
    ).to.be.revertedWithoutReason()

    await expect(
      meishi.connect(user_3)
        .registerNameCard(
          registerNameCardArgs,
          {
            customData: {
              gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
              paymasterParams,
            },
          },
        ),
    ).to.be.revertedWithoutReason()
  })
})
