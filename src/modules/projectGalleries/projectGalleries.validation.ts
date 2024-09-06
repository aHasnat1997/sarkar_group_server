import { z } from "zod";

const createSchema = z.object({
  projectId: z.string(),
  title: z.string(),
  image: z.string()
});

const commentSchema = z.object({
  comment: z.string()
});

export const ProjectGalleryValidation = {
  createSchema,
  commentSchema
};
