import { Crews } from "@prisma/client";
import prisma from "../../db";
import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";

/**
 * Creates a new crew record in the database.
 * @param payload - The crew data to be created.
 * @returns The created crew record.
 */
async function cerate(payload: Crews) {
  // Create a new crew record in the database
  const result = await prisma.crews.create({
    data: payload // Pass the constructed crew information
  });

  // Return the created crew record
  return result;
};

/**
 * Retrieves all crew records based on dynamic query parameters.
 * @param query - The query parameters for filtering, sorting, and pagination.
 * @returns An object containing the result set and metadata.
 */
async function allInfo(query: Record<string, unknown>) {
  // Create a new PrismaQueryBuilder instance to handle dynamic queries
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.crews.findMany(args), // Method to find many crews records
      count: (args) => prisma.crews.count(args),       // Method to count crews records
    },
    query // Pass the query parameters to the query builder
  );

  // Define searchable fields for full-text search
  const searchTerm = ['fullName', 'phone'];

  // Define the relations to include in the query result
  const include = {
    product: true
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
 * Retrieves a single crew record by its ID.
 * @param crewId - The ID of the crew to retrieve.
 * @returns The crew record, including related data.
 */
async function singleInfo(crewId: string) {
  // Find a single crew record by ID, throwing an error if not found
  const result = await prisma.crews.findUniqueOrThrow({
    where: { id: crewId }, // Filter by crew ID
    include: {
      product: true
    }
  });

  // Return the found crew record
  return result;
};

/**
 * Updates an existing crew record with new data.
 * @param crewId - The ID of the crew to update.
 * @param payload - The partial crew data to update.
 * @returns The updated crew record.
 */
async function updateInfo(crewId: string, payload: Partial<Crews>) {
  // Update the crew record by ID with the provided data
  const result = await prisma.crews.update({
    where: { id: crewId }, // Filter by crew ID
    data: payload // The data to update
  });

  // Return the updated crew record
  return result;
}

// Export the CrewService object containing all the service methods
export const CrewService = {
  cerate,
  allInfo,
  singleInfo,
  updateInfo
};
