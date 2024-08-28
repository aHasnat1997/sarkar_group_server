import { Products } from "@prisma/client";
import prisma from "../../db";
import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";
import { v4 as uuid } from "uuid";

/**
 * Creates a new product record in the database.
 * @param adminId - The ID of the admin creating the product.
 * @param payload - The product data to be created.
 * @returns The created product record.
 */
async function cerate(adminId: string, payload: Products) {
  // Destructure properties that need to be overridden or excluded
  const { createdAdminId, equipmentId, ...rest } = payload;

  // Construct the product information with overridden properties
  const productInfo = {
    ...rest, // Spread the remaining properties from the payload
    createdAdminId: adminId, // Override the createdAdminId with the provided adminId
    equipmentId: `EQUIP-${uuid()}` // Generate a unique equipment ID using UUID
  };

  // Create a new product record in the database
  const result = await prisma.products.create({
    data: productInfo // Pass the constructed product information
  });

  // Return the created product record
  return result;
};

/**
 * Retrieves all product records based on dynamic query parameters.
 * @param query - The query parameters for filtering, sorting, and pagination.
 * @returns An object containing the result set and metadata.
 */
async function allInfo(query: Record<string, unknown>) {
  // Create a new PrismaQueryBuilder instance to handle dynamic queries
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.products.findMany(args), // Method to find many products records
      count: (args) => prisma.products.count(args),       // Method to count products records
    },
    query // Pass the query parameters to the query builder
  );

  // Define searchable fields for full-text search
  const searchTerm = ['equipmentName', 'brandName', 'model'];

  // Define the relations to include in the query result
  const include = {
    createdAdminInfo: {
      select: {
        id: true,
        mobile: true,
        employeeType: true,
        department: true,
        designation: true,
        officeLocation: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    },
    projects: true, // Include related projects
    crews: true     // Include related crews
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
 * Retrieves a single product record by its ID.
 * @param productId - The ID of the product to retrieve.
 * @returns The product record, including related data.
 */
async function singleInfo(productId: string) {
  // Find a single product record by ID, throwing an error if not found
  const result = await prisma.products.findUniqueOrThrow({
    where: { id: productId }, // Filter by product ID
    include: {
      crews: true, // Include related crews
      projects: true, // Include related projects
      createdAdminInfo: { // Include related admin information
        select: {
          id: true,
          mobile: true,
          employeeType: true,
          department: true,
          designation: true,
          officeLocation: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          }
        }
      }
    }
  });

  // Return the found product record
  return result;
};

/**
 * Updates an existing product record with new data.
 * @param productId - The ID of the product to update.
 * @param payload - The partial product data to update.
 * @returns The updated product record.
 */
async function updateInfo(productId: string, payload: Partial<Products>) {
  // Update the product record by ID with the provided data
  const result = await prisma.products.update({
    where: { id: productId }, // Filter by product ID
    data: payload // The data to update
  });

  // Return the updated product record
  return result;
}

// Export the ProductService object containing all the service methods
export const ProductService = {
  cerate,
  allInfo,
  singleInfo,
  updateInfo
};
