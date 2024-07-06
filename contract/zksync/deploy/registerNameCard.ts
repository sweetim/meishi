import { ethers } from "ethers"
import * as hre from "hardhat"
import { Meishi } from "../typechain-types"
import { getWallet } from "./utils"

const MEISHI_ADDRESS = process.env.MEISHI_ADDRESS

if (!MEISHI_ADDRESS) throw "⛔️ Provide address of the contract to interact with!"

export default async function() {
  console.log(`Running script to interact with contract ${MEISHI_ADDRESS}`)

  const owner = getWallet()

  const meishiContractArtifact = await hre.artifacts.readArtifact(
    "Meishi",
  )

  const meishi: Meishi = new ethers.Contract(
    MEISHI_ADDRESS!,
    meishiContractArtifact.abi,
    owner,
  ) as any

  const registerNameCardArgs: Meishi.RegisterNameCardArgsStruct = {
    name: "Morgan Maxwell",
    title: "Operations Director",
    email: "hello@reallygreatsite.com",
    company_name: "Ingoude Company",
    company_uri: "www.reallygreatsite.com",
    company_address: "123 Lombard St, California",
    company_address_uri: "https://maps.app.goo.gl/5Fw6ZVNWd3JHQXA56",
    telephone: "123-456-7890",
    logo_uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxSTK_JDKztjxtWMQslkaFjnrdttYiKk8rwA&s",
    card_uri: "https://plum-deliberate-otter-677.mypinata.cloud/ipfs/QmVy1eMxbkzfX6HrxYwVmrqBrzdDchBa4p7Rb973MSwkye",
    links: [
      {
        title: "QQQ",
        uri: "https://www.invesco.com/qqq-etf/en/home.html",
      },
      {
        title: "iShares Rusell",
        uri: "https://www.ishares.com/us/products/239710/ishares-russell-2000-etf",
      },
    ],
  }

  await (
    await meishi.registerNameCard(
      registerNameCardArgs,
    )
  ).wait()

  console.log(`register name card done (${owner.address})`)
  console.log(await meishi.getNameCardMetadata(owner.address))
}
