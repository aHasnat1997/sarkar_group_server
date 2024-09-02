import prisma from "../../db";
import PrismaQueryBuilder from "../../builder/PrismaQueryBuilder";
import { Projects } from "@prisma/client";

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
    engineers: {
      include: {
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
      include: {
        products: true
      }
    }
  }

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
      engineers: {
        include: {
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
        include: {
          products: true
        }
      }
    }
  });

  // Return the found project record
  return result;
};

/**
 * Updates an existing project record with new data.
 * @param projectId - The ID of the project to update.
 * @param payload - The partial project data to update.
 * @returns The updated project record.
 */
async function updateInfo(projectId: string, payload: Partial<Projects>) {
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });
  if (isProjectFinish?.status === 'COMPLETED') throw new Error('Project is Completed. Nothing to Update.');

  // Update the project record by ID with the provided data
  const result = await prisma.projects.update({
    where: { id: isProjectFinish.id }, // Filter by project ID
    data: payload // The data to update
  });

  // Return the updated project record
  return result;
};

async function addEngineer(projectId: string, engineerId: string) {
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });
  if (isProjectFinish?.status === 'COMPLETED') throw new Error('Project is Completed. Nothing to Update.');

  const isEngineerIdValid = await prisma.engineers.findUnique({
    where: { id: engineerId },
    include: {
      user: {
        select: {
          isActive: true,
          isDeleted: true
        }
      }
    }
  });

  if (
    !isEngineerIdValid ||
    isEngineerIdValid.user.isActive === false ||
    isEngineerIdValid.user.isDeleted === true
  ) throw new Error('Engineer not valid.');

  const result = await prisma.projectsEngineers.create({
    data: {
      engineerId: isEngineerIdValid.id,
      projectId: isProjectFinish?.id
    },
    select: {
      engineers: {
        include: {
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
      projects: true
    }
  });

  return result;
};

async function removeEngineer(projectId: string, engineerId: string) {
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });
  if (isProjectFinish?.status === 'COMPLETED') throw new Error('Project is Completed. Nothing to Update.');

  const deletedRelations = await prisma.projectsEngineers.findMany({
    where: {
      engineerId,
      projectId
    }
  });

  deletedRelations.forEach(async (deletedRelation) => {
    await prisma.projectsEngineers.delete({
      where: {
        id: deletedRelation.id
      }
    });
  });
};

async function addProduct(projectId: string, productId: string) {
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });
  if (isProjectFinish?.status === 'COMPLETED') throw new Error('Project is Completed. Nothing to Update.');

  const isProductStandBy = await prisma.products.findUniqueOrThrow({
    where: {
      id: productId
    }
  });
  if (isProductStandBy.status !== 'STAND_BY') throw new Error('Equipment is not stand by.');

  const result = await prisma.productsProjects.create({
    data: {
      projectId: isProjectFinish.id,
      productId: isProductStandBy.id
    },
    select: {
      products: true,
      projects: true
    }
  });

  return result;
};

async function removeProduct(projectId: string, productId: string) {
  const isProjectFinish = await prisma.projects.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });
  if (isProjectFinish?.status === 'COMPLETED') throw new Error('Project is Completed. Nothing to Update.');

  const deletedRelations = await prisma.productsProjects.findMany({
    where: {
      productId,
      projectId
    }
  });

  deletedRelations.forEach(async (deletedRelation) => {
    await prisma.productsProjects.delete({
      where: {
        id: deletedRelation.id
      }
    });
  });
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
