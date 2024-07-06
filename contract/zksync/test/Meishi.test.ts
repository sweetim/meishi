import { Wallet } from "zksync-ethers"
import {
  deployContract,
  getWallet,
  LOCAL_RICH_WALLETS,
} from "../deploy/utils"

import { expect } from "chai"
import { Meishi } from "../typechain-types"

describe("Meishi", function() {
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

  let meishi: Meishi
  let user_1: Wallet
  let user_2: Wallet

  before(async () => {
    user_1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey)
    user_2 = getWallet(LOCAL_RICH_WALLETS[2].privateKey)
    meishi = await deployContract("Meishi", []) as any
  })

  it("should able to register name card", async function() {
    await expect(
      meishi.connect(user_1)
        .registerNameCard(registerNameCardArgs),
    )
      .to.emit(meishi, "NameCardCreated")
      .withArgs(user_1.address, true)
  })

  it("should able to update name card", async function() {
    await expect(
      meishi.connect(user_1)
        .registerNameCard({
          ...registerNameCardArgs,
          name: "abc",
        }),
    )
      .to.emit(meishi, "NameCardCreated")
      .withArgs(user_1.address, false)
  })

  it("should able to getNameCard", async function() {
    const [ [ id ], connections ] = await meishi.getNameCard(user_1.address)

    expect(id)
      .to.be.eq(user_1.address)

    expect(connections.length).to.be.eq(0)
  })

  it("should able to getNameCardMetadata", async function() {
    const [ id ] = await meishi.getNameCardMetadata(user_1.address)

    expect(id)
      .to.be.eq(user_1.address)
  })

  it("should able to getNameCardConnections", async function() {
    const actual = await meishi.getNameCardConnections(user_1.address)
    expect(actual.length)
      .to.be.eq(0)
  })

  it("should able to registerConnection", async function() {
    await expect(
      meishi.connect(user_1)
        .registerConnection(user_2.address),
    )
      .to.emit(meishi, "NameCardConnectionUpdated")
      .withArgs(user_1.address, user_2.address)

    const actual = await meishi.getNameCardConnections(user_1.address)

    expect(actual.length)
      .to.be.eq(1)

    const [ [ actualId ] ] = actual

    expect(actualId).to.be.eq(user_2.address)
  })
})
