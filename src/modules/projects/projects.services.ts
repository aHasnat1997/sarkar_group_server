import prisma from "../../db";
import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";
import { Projects } from "@prisma/client";
import { TProjectDetails } from "../../types/project.type";

/**
 * Creates a new project record in the database.
 * @param adminId - The ID of the admin creating the project.
 * @param payload - The project data to be created.
 * @returns The created project record.
 */
async function cerate(adminId: string, payload: Projects) {
  // Destructure properties that need to be overridden or excluded
  const { createdBy, ...rest } = payload;

  // Construct the project information with overridden properties
  const projectInfo = {
    ...rest, // Spread the remaining properties from the payload
    createdBy: adminId, // Override the createdBy with the provided adminId
  };

  // Create a new project record in the database
  const result = await prisma.projects.create({
    data: projectInfo
  });

  // Return the created project record
  return result;
};

/**
 * Retrieves all project records based on dynamic query parameters.
 * @param query - The query parameters for filtering, sorting, and pagination.
 * @returns An object containing the result set and metadata.
 */
async function allInfo(query: Record<string, unknown>) {
  // Create a new PrismaQueryBuilder instance to handle dynamic queries
  const queryBuilder = new PrismaQueryBuilder(
    {
      findMany: (args) => prisma.projects.findMany(args), // Method to find many projects records
      count: (args) => prisma.projects.count(args),       // Method to count projects records
    },
    query // Pass the query parameters to the query builder
  );

  // Define searchable fields for full-text search
  const searchTerm = ['projectName', 'street', 'city'];

  // Define the relations to include in the query result
  const include = {
    projectManager: {
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
    },
    client: {
      select: {
        id: true,
        mobile: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true
          }
        }
      }
    },
    engineers: {
      select: {
        engineers: {
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
    },
    products: {
      select: {
        products: true
      }
    }
  }

  // Build and execute the query dynamically using the query builder methods
  const result: TProjectDetails[] = await queryBuilder
    .search(searchTerm)         // Apply full-text search based on the specified search terms
    .filter()                   // Apply filters based on the query parameters
    .sort()                     // Apply sorting based on the query parameters
    .paginate()                 // Apply pagination based on the query parameters
    .includeRelations(include)  // Include specified relations in the result
    .findMany();                // Execute the query to retrieve the data

  // Retrieve metadata about the query such as total count
  const meta = await queryBuilder.metaData();

  const data = result.map(items => {
    return {
      ...items,
      engineers: items.engineers.map(e => e.engineers),
      products: items.products.map(e => e.products)
    };
  });

  // Return the result set and metadata
  return { data, meta };
};

/**
 * Retrieves a single project record by its ID.
 * @param projectId - The ID of the project to retrieve.
 * @returns The project record, including related data.
 */
async function singleInfo(projectId: string) {
  // Find a single project record by ID, throwing an error if not found
  const result = await prisma.projects.findUniqueOrThrow({
    where: { id: projectId }, // Filter by project ID
    include: {
      projectManager: {
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
      },
      client: {
        select: {
          id: true,
          mobile: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          }
        }
      },
      engineers: {
        select: {
          engineers: {
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
      },
      products: {
        select: {
          products: true
        }
      }
    }
  });

  // Return the found project record
  return {
    ...result,
    engineers: result.engineers.map(e => e.engineers),
    products: result.products.map(p => p.products)
  };
};

/**
 * Updates an existing project record with new data.
 * @param projectId - The ID of the project to update.
 * @param payload - The partial project data to update.
 * @returns The updated project record.
 */
async function updateInfo(projectId: string, payload: Partial<Projects>) {
  // Find the project by its ID and ensure it exists
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });
  // Throw an error if the project is completed
  if (isProjectFinish?.status === 'COMPLETED') throw new Error('Project is Completed. Nothing to Update.');

  // Update the project record by ID with the provided data
  const result = await prisma.projects.update({
    where: { id: isProjectFinish.id }, // Filter by project ID
    data: payload // The data to update
  });

  // Return the updated project record
  return result;
};

/**
 * Adds an engineer to a project.
 * @param projectId - The ID of the project.
 * @param engineerId - The ID of the engineer.
 * @returns The newly created project-engineer relationship.
 */
async function addEngineer(projectId: string, engineerId: string) {
  // Find the project by its ID and ensure it exists
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  // Throw an error if the project is completed
  if (isProjectFinish?.status === 'COMPLETED')
    throw new Error('Project is Completed. Nothing to Update.');

  // Find the engineer by their ID and check if they are active and not deleted
  const isEngineerIdValid = await prisma.engineers.findUnique({
    where: { id: engineerId },
    include: {
      user: {
        select: {
          isActive: true,  // Check if the engineer is active
          isDeleted: true  // Check if the engineer is deleted
        }
      }
    }
  });

  // Throw an error if the engineer is invalid (non-existent, inactive, or deleted)
  if (
    !isEngineerIdValid ||
    isEngineerIdValid.user.isActive === false ||
    isEngineerIdValid.user.isDeleted === true
  ) throw new Error('Engineer not valid.');

  // Create a new record in the projectsEngineers table to link the engineer with the project
  const result = await prisma.projectsEngineers.create({
    data: {
      engineerId: isEngineerIdValid.id, // Set the engineer ID
      projectId: isProjectFinish?.id    // Set the project ID
    },
    select: {
      engineers: {
        include: {
          user: {
            select: {
              firstName: true,  // Include the engineer's first name
              lastName: true,   // Include the engineer's last name
              email: true,      // Include the engineer's email
              profileImage: true // Include the engineer's profile image
            }
          }
        }
      },
      projects: true // Include the project details
    }
  });

  return result; // Return the result of the operation
};

/**
 * Removes an engineer from a project.
 * @param projectId - The ID of the project.
 * @param engineerId - The ID of the engineer.
 * @returns The deleted project-engineer relationship.
 */
async function removeEngineer(projectId: string, engineerId: string) {
  // Find the project by its ID and ensure it exists
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  // Throw an error if the project is completed
  if (isProjectFinish?.status === 'COMPLETED')
    throw new Error('Project is Completed. Nothing to Update.');

  // Find the relationship between the project and engineer
  const deletedRelations = await prisma.projectsEngineers.findFirstOrThrow({
    where: {
      engineerId,
      projectId
    }
  });

  // Delete the relationship record from the projectsEngineers table
  const result = await prisma.projectsEngineers.delete({
    where: { id: deletedRelations.id }
  });

  return result; // Return the result of the operation
};

/**
 * Adds a product to a project.
 * @param projectId - The ID of the project.
 * @param productId - The ID of the product.
 * @returns The newly created project-product relationship.
 */
async function addProduct(projectId: string, productId: string) {
  // Find the project by its ID and ensure it exists
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  // Throw an error if the project is completed
  if (isProjectFinish?.status === 'COMPLETED')
    throw new Error('Project is Completed. Nothing to Update.');

  // Find the product by its ID and check if it is in standby status
  const isProductStandBy = await prisma.products.findUniqueOrThrow({
    where: {
      id: productId
    }
  });

  // Throw an error if the product is not in standby status
  if (isProductStandBy.status !== 'STAND_BY')
    throw new Error('Equipment is not stand by.');

  // Create a new record in the productsProjects table to link the product with the project
  const result = await prisma.productsProjects.create({
    data: {
      projectId: isProjectFinish.id, // Set the project ID
      productId: isProductStandBy.id // Set the product ID
    },
    select: {
      products: true, // Include the product details
      projects: true  // Include the project details
    }
  });

  return result; // Return the result of the operation
};

/**
 * Removes a product from a project.
 * @param projectId - The ID of the project.
 * @param productId - The ID of the product.
 * @returns The deleted project-product relationship.
 */
async function removeProduct(projectId: string, productId: string) {
  // Find the project by its ID and ensure it exists
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  // Throw an error if the project is completed
  if (isProjectFinish?.status === 'COMPLETED')
    throw new Error('Project is Completed. Nothing to Update.');

  // Find the relationship between the project and product
  const deletedRelations = await prisma.productsProjects.findFirstOrThrow({
    where: {
      productId,
      projectId
    }
  });

  // Delete the relationship record from the productsProjects table
  const result = await prisma.productsProjects.delete({
    where: {
      id: deletedRelations.id
    }
  });

  return result; // Return the result of the operation
};

// Export the Project Service object containing all the service methods
export const ProjectService = {
  cerate,
  allInfo,
  singleInfo,
  updateInfo,
  addEngineer,
  removeEngineer,
  addProduct,
  removeProduct
};
