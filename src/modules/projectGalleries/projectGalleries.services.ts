import { TProjectGalleryComment, TProjectGalleryCreate } from "../../types/projectGalleries.type";
import prisma from "../../db";
import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";

/**
 * Create a new project gallery.
 * @param uploaderId - The ID of the uploader.
 * @param payload - The data to create the project gallery.
 * @returns The created project gallery with related project and uploader details.
 */
async function create(uploaderId: string, payload: TProjectGalleryCreate) {
  // Combine the payload with the uploader's ID
  const uploaderData = {
    ...payload,
    uploaderId
  };

  // Create the project gallery and include related project and uploader user details
  const result = await prisma.projectGallery.create({
    data: uploaderData,
    include: {
      project: true,
      uploaderUser: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          role: true
        }
      }
    }
  });

  return result;
}

/**
 * Get all project galleries with optional filters, sorting, and pagination.
 * @param query - The query parameters for filtering, sorting, and pagination.
 * @returns The list of project galleries and metadata.
 */
async function all(query: Record<string, unknown>) {
  // Initialize PrismaQueryBuilder to handle dynamic query construction
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.projectGallery.findMany(args), // Method for retrieving multiple records
      count: (args) => prisma.projectGallery.count(args),       // Method for counting records
    },
    query // Pass the query object containing filter, sort, and pagination parameters
  );

  // Define the fields that will be used for searching
  const searchTerm = ['title'];

  // Define the relationships to include in the result set
  const include = {
    project: true,
    uploaderUser: {
      select: {
        firstName: true,
        lastName: true,
        profileImage: true,
        email: true,
        role: true
      }
    }
  };

  // Build and execute the query dynamically
  const result = await queryBuilder
    .search(searchTerm)         // Apply search filtering
    .sort()                     // Apply sorting
    .paginate()                 // Apply pagination
    .includeRelations(include)  // Include relations in the result set
    .findMany();                // Execute the query

  // Fetch additional metadata such as total record count
  const meta = await queryBuilder.metaData();

  return { result, meta };
}

/**
 * Get a single project gallery by its ID.
 * @param id - The ID of the project gallery.
 * @returns The project gallery with related project and uploader details.
 */
async function single(id: string) {
  // Find a single project gallery by ID, including related project and uploader details
  const result = await prisma.projectGallery.findUniqueOrThrow({
    where: { id },
    include: {
      project: true,
      uploaderUser: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          role: true
        }
      }
    }
  });

  return result;
}

/**
 * Add a comment to a project gallery.
 * @param galleryId - The ID of the project gallery.
 * @param payload - The comment data to add to the gallery.
 * @returns The updated project gallery with the new comment.
 */
async function addComment(galleryId: string, payload: TProjectGalleryComment) {
  // Fetch the project gallery by its ID
  const galleryInfo = await prisma.projectGallery.findUniqueOrThrow({
    where: { id: galleryId }
  });

  // Filter out null comments to avoid invalid data
  const cleanComments = galleryInfo.comments.filter((comment) => comment !== null);

  // Append the new comment to the existing comments
  const newCommentList = [...cleanComments, payload];

  // Update the project gallery with the new comments list
  const result = await prisma.projectGallery.update({
    where: { id: galleryInfo.id },
    data: {
      comments: newCommentList
    }
  });

  return result;
}

/**
 * Delete a project gallery by its ID.
 * @param id - The ID of the project gallery to delete.
 * @returns The deleted project gallery with related project and uploader details.
 */
async function deleteGallery(id: string) {
  // Delete the project gallery by its ID and include related project and uploader details
  const result = await prisma.projectGallery.delete({
    where: { id },
    include: {
      project: true,
      uploaderUser: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          role: true
        }
      }
    }
  });

  return result;
}

// Export the service functions for use in other parts of the application
export const ProjectGalleryService = {
  create,
  all,
  single,
  addComment,
  deleteGallery
};
