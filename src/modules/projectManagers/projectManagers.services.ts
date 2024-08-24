import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";
import prisma from "../../db";
import { TProjectManagerUpdate } from "../../types/projectManagers.type";

/**
 * Retrieves a list of project manager data based on the provided query parameters.
 * @param query - An object containing query parameters to filter, sort, and paginate the results.
 * @returns - A promise that resolves to an object containing the result set and metadata.
 */
async function allData(query: Record<string, unknown>) {
  // Create a new PrismaQueryBuilder instance to handle dynamic queries
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.projectManagers.findMany(args), // Method to find many project manager records
      count: (args) => prisma.projectManagers.count(args),       // Method to count project manager records
    },
    query // Pass the query parameters to the query builder
  );

  // Define searchable fields for full-text search
  const searchTerm = ['user.firstName', 'user.lastName', 'mobile', 'userName'];

  // Define the relations to include in the query result
  const include = {
    user: {
      select: {
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        role: true,
        isActive: true,
        isDeleted: true
      }
    },
    projects: true
  };

  // Build and execute the query dynamically using the query builder methods
  const result = await queryBuilder
    .search(searchTerm)         // Apply full-text search based on the specified search terms
    .filter()                   // Apply filters based on the query parameters
    .sort()                     // Apply sorting based on the query parameters
    .paginate()                 // Apply pagination based on the query parameters
    .includeRelations(include)  // Include specified relations in the result
    .findMany();                // Execute the query to retrieve the data

  // Retrieve metadata about the query such as total count
  const meta = await queryBuilder.metaData();

  // Return the result set and metadata
  return { result, meta };
}

/**
 * Retrieves single project manager data based on the project manager's ID.
 * @param id - The ID of the project manager to retrieve data for.
 * @returns - A promise that resolves to the project manager data.
 */
async function singleData(id: string) {
  // Query the database to find the first project manager record with the specified ID
  const result = await prisma.projectManagers.findFirstOrThrow({
    // Specify the condition to find the project manager by ID
    where: { id },
    // Include related user data and related projects and products
    include: {
      user: {
        // Select specific fields from the related user record
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
          role: true,
          isActive: true,
          isDeleted: true
        }
      },
      projects: true,
    }
  });

  // Return the retrieved project manager data
  return result;
};

/**
 * Updates project manager data including associated user information.
 * @param id - The ID of the user to update.
 * @param payload - The data to update the user and project manager records with.
 * @returns - A promise that resolves to the updated project manager data.
 */
async function updateData(id: string, payload: TProjectManagerUpdate) {
  // Destructure the payload to separate user data from project manager data
  const { user, ...projectManagerData } = payload;

  // Start a database transaction to update the user and project manager records
  const result = await prisma.$transaction(async (tx) => {
    // Update the user record with the specified ID, ensuring the user is active and not deleted
    const userUpdate = await tx.users.update({
      // Specify the condition to find the user by ID and ensure they are active and not deleted
      where: {
        id: id,
        isActive: true,
        isDeleted: false
      },
      // Specify the data to update the user with
      data: user,
      // Select specific fields from the updated user record
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        isDeleted: true
      }
    });

    // Update the project manager record associated with the updated user's ID
    const projectManager = await tx.projectManagers.update({
      // Specify the condition to find the project manager by the user's ID
      where: {
        userId: userUpdate.id
      },
      // Specify the data to update the projectManager with
      data: projectManagerData
    });

    // Return the updated user data along with the updated projectManager data
    return {
      ...userUpdate,
      otherInfo: projectManager
    };
  });

  // Return the result of the transaction, which includes updated user and project manager data
  return result;
};

// Export the service functions to be used in other parts of the application
export const ProjectManagerService = {
  allData,
  singleData,
  updateData
};
