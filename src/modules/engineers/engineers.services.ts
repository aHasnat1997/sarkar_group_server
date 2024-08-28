import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";
import prisma from "../../db";
import { TEngineerUpdate } from "../../types/engineers.type";

/**
 * Retrieves a list of engineers data based on the provided query parameters.
 * @param query - An object containing query parameters to filter, sort, and paginate the results.
 * @returns - A promise that resolves to an object containing the result set and metadata.
 */
async function allData(query: Record<string, unknown>) {
  // Create a new PrismaQueryBuilder instance to handle dynamic queries
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.engineers.findMany(args), // Method to find many engineers records
      count: (args) => prisma.engineers.count(args),       // Method to count engineers records
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
};

/**
 * Retrieves single engineers data based on the engineers's ID.
 * @param id - The ID of the engineers to retrieve data for.
 * @returns - A promise that resolves to the engineers data.
 */
async function singleData(id: string) {
  // Query the database to find the first engineers record with the specified ID
  const result = await prisma.engineers.findFirstOrThrow({
    // Specify the condition to find the engineers by ID
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

  // Return the retrieved engineers data
  return result;
};

/**
 * Updates engineer data including associated user information.
 * @param id - The ID of the user to update.
 * @param payload - The data to update the user and engineer records with.
 * @returns - A promise that resolves to the updated engineer data.
 */
async function updateData(id: string, payload: TEngineerUpdate) {
  // Destructure the payload to separate user data from engineer data
  const { user, ...engineerData } = payload;

  // Start a database transaction to update the user and engineer records
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

    // Update the engineer record associated with the updated user's ID
    const engineer = await tx.engineers.update({
      // Specify the condition to find the engineer by the user's ID
      where: {
        userId: userUpdate.id
      },
      // Specify the data to update the engineer with
      data: engineerData
    });

    // Return the updated user data along with the updated engineer data
    return {
      ...userUpdate,
      otherInfo: engineer
    };
  });

  // Return the result of the transaction, which includes updated user and engineer data
  return result;
};

// Export the service functions to be used in other parts of the application
export const EngineerService = {
  allData,
  singleData,
  updateData
};
