import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Blog database table with a "content" field. Try
adding a new "title" field as shown in the commented example below.

Authorization rules can be added to control access. See the authorization
docs for more info: https://docs.amplify.aws/gen2/build-a-backend/data/customize-authz/
=========================================================================*/
const schema = a.schema({
  Blog: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      author: a.string().required(),
      authorId: a.string().required(),
      comments: a.hasMany("Comment", "blogId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create"]),
      allow.ownerDefinedIn("authorId").to(["read", "delete", "update"]),
    ]),

  Comment: a
    .model({
      content: a.string().required(),
      author: a.string().required(),
      authorId: a.string().required(),
      blogId: a.id().required(),
      blog: a.belongsTo("Blog", "blogId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create"]),
      allow.ownerDefinedIn("authorId").to(["read", "delete", "update"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS CODE WILL NEED TO BE GENERATED FROM YOUR APP CODE)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS CODE WILL NEED TO BE GENERATED FROM YOUR APP CODE)
=========================================================================*/

/* For example, in a React component, you can use this frontend code:

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

function BlogList() {
  const [blogs, setBlogs] = useState<Array<Schema["Blog"]["type"]>>([]);

  useEffect(() => {
    client.models.Blog.observeQuery().subscribe({
      next: (data) => setBlogs([...data.items]),
    });
  }, []);

  return (
    <ul>
      {blogs.map((blog) => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
  );
}
*/
