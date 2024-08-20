import prisma from "../../db"
import { TAdminUpdate } from "../../types/admins.type";

/**
 * Retrieves all admin data including associated user information, products, and projects.
 * @returns - A promise that resolves to an array of all admin data.
 */
async function allAdminData() {
  // Query the database to find all admin records
  const result = await prisma.admins.findMany({
    // Include related user data, selecting specific fields
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
      products: true,
      projects: true
    }
  });

  // Return the retrieved admin data
  return result;
};

/**
 * Retrieves single admin data based on the admin's ID.
 * @param id - The ID of the admin to retrieve data for.
 * @returns - A promise that resolves to the admin data.
 */
async function singleAdminData(id: string) {
  // Query the database to find the first admin record with the specified ID
  const result = await prisma.admins.findFirstOrThrow({
    // Specify the condition to find the admin by ID
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
      products: true,
      projects: true
    }
  });

  // Return the retrieved admin data
  return result;
};

/**
 * Updates admin data including associated user information.
 * @param id - The ID of the user to update.
 * @param payload - The data to update the user and admin records with.
 * @returns - A promise that resolves to the updated admin data.
 */
async function updateData(id: string, payload: TAdminUpdate) {
  // Destructure the payload to separate user data from admin data
  const { user, ...adminData } = payload;

  // Start a database transaction to update the user and admin records
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

    // Update the admin record associated with the updated user's ID
    const admin = await tx.admins.update({
      // Specify the condition to find the admin by the user's ID
      where: {
        userId: userUpdate.id
      },
      // Specify the data to update the admin with
      data: adminData
    });

    // Return the updated user data along with the updated admin data
    return {
      ...userUpdate,
      otherInfo: admin
    };
  });

  // Return the result of the transaction, which includes updated user and admin data
  return result;
};

// Export the service functions to be used in other parts of the application
export const AdminService = {
  allAdminData,
  singleAdminData,
  updateData
};
