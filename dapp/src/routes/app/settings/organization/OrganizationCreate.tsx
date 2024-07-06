import {
  CenterDiv,
  FillButton,
} from "@/modules/common"
import {
  BuildingOffice,
  PlusCircle,
} from "@phosphor-icons/react"
import { FC } from "react"

const OrganizationCreate: FC = () => {
  function createOrganizationClickHandler() {
  }

  return (
    <CenterDiv className="text-white">
      <BuildingOffice size={128} color="#ccc" weight="fill" />
      <h1>create an organization</h1>
      <p>and start sponsoring your member</p>
      <p>to create new card</p>
      <div className="mt-10">
        <FillButton onClick={createOrganizationClickHandler}>
          <PlusCircle size={32} color="#ffebeb" weight="fill" />
          <h2 className="capitalize">create</h2>
        </FillButton>
      </div>
    </CenterDiv>
  )
}

export default OrganizationCreate
