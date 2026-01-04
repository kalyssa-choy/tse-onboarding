import { get, handleAPIError } from "src/api/requests";

import type { APIResult } from "src/api/requests";

/**
 * Defines the "shape" of a User object for frontend components to use.
 * This will be the return type of most functions in this file.
 */
export type User = {
  _id: string;
  name: string;
  profilePictureURL?: string;
};

type UserJSON = {
  _id: string;
  name: string;
  profilePictureURL?: string;
};

/**
 * Converts a User from JSON that only contains primitive types to our custom
 * User interface.
 *
 * @param user The JSON representation of the user
 * @returns The parsed User object
 */
function parseUser(user: UserJSON): User {
  return {
    _id: user._id,
    name: user.name,
    profilePictureURL: user.profilePictureURL,
  };
}

/**
 * The expected inputs when we want to create a new User object.
 */
export type CreateUserRequest = {
  name: string;
  profilePictureURL?: string;
};

export async function getUser(id: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/api/user/${id}`);
    const json = (await response.json()) as UserJSON;
    return { success: true, data: parseUser(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
