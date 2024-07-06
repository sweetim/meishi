import AddNewMemberModal from "@/modules/modal/AddNewMemberModal"
import {
  PlusCircle,
  Trash,
} from "@phosphor-icons/react"
import {
  Avatar,
  List,
  Space,
} from "antd"
import Paragraph from "antd/lib/typography/Paragraph"
import {
  FC,
  useState,
} from "react"
import { Link } from "react-router-dom"

type Organization = {
  name: string
  uri: string
}

type OrganizationMember = {
  address: string
}

const organizationMembers: OrganizationMember[] = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
]

const OrganizationHome: FC = () => {
  const [ openAddNewMemberModal, setOpenAddNewMemberModal ] = useState(0)

  async function deleteMemberClickHandler(item: OrganizationMember) {
  }

  function addNewMemberClickHandler() {
    setOpenAddNewMemberModal(Date.now())
  }

  return (
    <Space direction="vertical" className="flex flex-col">
      <AddNewMemberModal open={openAddNewMemberModal} />
      <Space
        direction="vertical"
        size="large"
        align="center"
        className="w-full text-center px-5 mt-5"
      >
        <Avatar
          size={128}
          src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
        />
        <Paragraph
          style={{ width: 300, color: "white" }}
          ellipsis
          className="font-bold text-base"
        >
          simple inc
        </Paragraph>
      </Space>
      <div className="flex flex-row justify-between bg-zinc-600 p-5 my-3 mx-5 text-white text-base rounded-full">
        <p className="text-slate-300">paymaster balance</p>
        <p className="font-bold">1 ETH</p>
      </div>
      <div className="flex flex-row justify-between align-middle">
        <h1 className="text-white text-base p-2">Members</h1>
        <button
          onClick={addNewMemberClickHandler}
          className="p-1 bg-zinc-800 hover:bg-zinc-600 rounded-full mx-3 flex flex-row align-middle"
        >
          <PlusCircle size={32} color="#ffebeb" weight="fill" />
        </button>
      </div>
      <List
        size="small"
        dataSource={organizationMembers}
        renderItem={(item) => (
          <Link to={`/app/contacts/${item.address}`}>
            <List.Item
              className="!text-blue-600"
              key={item.address}
              actions={[
                <button onClick={() => deleteMemberClickHandler(item)} className="hover:bg-zinc-700 rounded-full">
                  <Trash size={20} color="#ffebeb" weight="fill" />
                </button>,
              ]}
            >
              {item.address}
            </List.Item>
          </Link>
        )}
      />
    </Space>
  )
}

export default OrganizationHome
