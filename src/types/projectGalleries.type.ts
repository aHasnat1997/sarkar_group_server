export type TProjectGalleryCreate = {
  projectId: string,
  title: string,
  image: string
};

export type TProjectGalleryComment = {
  comment: string,
  userId: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  email: string,
  role: string
};
