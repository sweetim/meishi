import {
  getAptosClient,
  MODULE_FN,
} from "@/contract"
import { useAptosAccountInfo } from "@/hooks/useAptosAccountInfo"
import FillButton from "@/modules/common/FillButton"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  Avatar,
  Space,
} from "antd"
import Paragraph from "antd/lib/typography/Paragraph"
import {
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"

const aptosClient = getAptosClient()

export default function Account() {
  const navigate = useNavigate()

  const [ profileImage, setProfileImage ] = useState("")
  const { account } = useAptosAccountInfo()

  const {
    logout,
    userInfo,
  } = useWeb3Auth()

  useEffect(() => {
    ;(async () => {
      if (userInfo && userInfo.profileImage) {
        setProfileImage(userInfo.profileImage)
      }
    })()
  })

  async function logoutClickHandler() {
    await logout()
    navigate("/")
  }

  async function populateClickHandler() {
    if (!account) return

    const { accountAddress } = account

    const transaction = await aptosClient.transaction.build.simple({
      sender: accountAddress,
      data: {
        function: MODULE_FN.register_name_card,
        functionArguments: [
          "tim",
          "founder",
          "tim@timx.co",
          "33F Tokyo Toranomon Hills",
          "https://maps.app.goo.gl/5Fw6ZVNWd3JHQXA56",
          "timx inc",
          "https://timx.co",
          "+81-080-3333-8888",
          "https://plum-deliberate-otter-677.mypinata.cloud/ipfs/QmU8LzZvku5LeK6jjSr9w33vmdhH2716vuq35aAhb5zByC",
          "https://plum-deliberate-otter-677.mypinata.cloud/ipfs/QmYt3kdJ1aXESgFDDd3ZxQp2q99VT3vi5d6vsj1GzRJvXs",
          [
            "instagram",
            "thread",
            "x",
          ],
          [
            "https://www.instagram.com",
            "https://www.threads.net",
            "https://x.com",
          ],
        ],
      },
    })

    const tx = await aptosClient.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptosClient.waitForTransaction({
      transactionHash: tx.hash,
    })

    console.log("done")
  }

  return (
    <div className="w-full text-center mt-20">
      <Space direction="vertical" size="large" align="center">
        <Avatar size={128} src={profileImage} />
        <Paragraph style={{ width: 300, color: "white" }} ellipsis copyable className="font-bold">
          {account?.accountAddress.toString()}
        </Paragraph>
        <FillButton onClick={logoutClickHandler}>
          <p>LOGOUT</p>
        </FillButton>
        <FillButton onClick={populateClickHandler}>
          <p>Populate</p>
        </FillButton>
      </Space>
    </div>
  )
}
