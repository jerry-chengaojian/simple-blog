import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

/**
 * Creates an Amplify Data client for public read operations
 * Uses apiKey authorization mode with publicApiKey() authorization
 * Allows anyone (authenticated or not) to read public data
 * Suitable for: fetching blog lists, blog details, comments, etc.
 *
 * @returns Amplify Data client instance (apiKey mode)
 */
export function getAmplifyClient() {
  return generateClient<Schema>({
    authMode: "apiKey",
  });
}

/**
 * Creates an Amplify Data client for operations requiring user authentication
 * Uses userPool authorization mode, requires user to be logged in
 * Suitable for: creating blogs, deleting blogs, creating comments, deleting comments, etc.
 *
 * @returns Amplify Data client instance (userPool mode)
 */
export function getAuthenticatedClient() {
  return generateClient<Schema>({
    authMode: "userPool",
  });
}
