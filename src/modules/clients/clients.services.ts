import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";
import prisma from "../../db";
import { TClientUpdate } from "../../types/clients.type";

/**
 * Retrieves a list of client data based on the provided query parameters.
 * @param query - An object containing query parameters to filter, sort, and paginate the results.
 * @returns - A promise that resolves to an object containing the result set and metadata.
 */
async function allData(query: Record<string, unknown>) {
  // Create a new PrismaQueryBuilder instance to handle dynamic queries
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.clients.findMany(args), // Method to find many clients records
      count: (args) => prisma.clients.count(args),       // Method to count clients records
    },
    query // Pass the query parameters to the query builder
  );

  // Define searchable fields for full-text search
  const searchTerm = ['user.firstName', 'user.lastName', 'mobile'];

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
 * Retrieves single client data based on the client's ID.
 * @param id - The ID of the client to retrieve data for.
 * @returns - A promise that resolves to the client data.
 */
async function singleData(id: string) {
  // Query the database to find the first client record with the specified ID
  const result = await prisma.clients.findFirstOrThrow({
    // Specify the condition to find the client by ID
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

  // Return the retrieved client data
  return result;
};

/**
 * Updates client data including associated user information.
 * @param id - The ID of the user to update.
 * @param payload - The data to update the user and client records with.
 * @returns - A promise that resolves to the updated client data.
 */
async function updateData(id: string, payload: TClientUpdate) {
  // Destructure the payload to separate user data from client data
  const { user, ...clientData } = payload;

  // Start a database transaction to update the user and client records
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

    // Update the client record associated with the updated user's ID
    const client = await tx.clients.update({
      // Specify the condition to find the client by the user's ID
      where: {
        userId: userUpdate.id
      },
      // Specify the data to update the client with
      data: clientData
    });

    // Return the updated user data along with the updated client data
    return {
      ...userUpdate,
      otherInfo: client
    };
  });

  // Return the result of the transaction, which includes updated user and client data
  return result;
};

// Export the service functions to be used in other parts of the application
export const ClientService = {
  allData,
  singleData,
  updateData
};
