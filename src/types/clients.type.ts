export type TClientUpdate = {
  mobile: string,
  productList: string[],
  street: string,
  city: string,
  state: string,
  zip: number,
  documents: string[],
  user: {
    firstName: string,
    lastName: string,
    profileImage: string | null
  }
};
