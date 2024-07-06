import { PlusCircle } from "@phosphor-icons/react"
import {
  Input,
  Modal,
  Space,
} from "antd"
import {
  FC,
  useEffect,
  useState,
} from "react"
import { FillButton } from "../common"

type AddNewMemberModalProps = {
  open: number
}

const AddNewMemberModal: FC<AddNewMemberModalProps> = ({ open }) => {
  const [ isNewMemberModalOpen, setIsNewMemberModalOpen ] = useState(false)

  useEffect(() => {
    setIsNewMemberModalOpen(open !== 0)
  }, [ open ])

  function addNewMemberModalClickHandler() {
    setIsNewMemberModalOpen(false)
  }

  const handleCancel = () => {
    setIsNewMemberModalOpen(false)
  }

  return (
    <Modal
      className="p-5"
      title="Add new member"
      centered
      open={isNewMemberModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <Space className="w-full py-5" direction="vertical">
        <p>Address</p>
        <Input size="large" />
      </Space>
      <FillButton onClick={addNewMemberModalClickHandler}>
        <PlusCircle size={32} color="#ffebeb" weight="fill" />
        <h2 className="capitalize">add</h2>
      </FillButton>
    </Modal>
  )
}

export default AddNewMemberModal
