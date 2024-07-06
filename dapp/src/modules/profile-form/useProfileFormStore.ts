import { NameCardDescription } from "@/contract"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type ProfileFormState = {
  isEdit: boolean
  nameCardDescription: NameCardDescription
}

type ProfileFormActions = {
  setIsEdit: (isEdit: boolean) => void
  setNameCardDescription: (input: NameCardDescription) => void
}

export const useProfileFormStore = create<ProfileFormState & ProfileFormActions>()(
  immer((set) => ({
    isEdit: false as boolean,
    nameCardDescription: {
      name: "",
      title: "",
      email: "",
      company_address: "",
      company_address_uri: "",
      company_name: "",
      company_uri: "",
      telephone: "",
      logo_uri: "",
      card_uri: "",
    },
    setIsEdit: (isEdit: boolean) =>
      set((state) => {
        state.isEdit = isEdit
      }),
    setNameCardDescription: (input: NameCardDescription) =>
      set((state) => {
        state.nameCardDescription = input
      }),
  })),
)
