import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a User and Bet database table. The User table 
includes fields like name, email, and balance, while the Bet table includes
fields for type, amount, and a userID that references the User table.
=========================================================================*/
const schema = a.schema({
	User: a
		.model({
			userID: a.id(),
			name: a.string(),
			email: a.string(),
			balance: a.float(),
		})
		.authorization((allow) => [allow.guest()]),

	Bet: a
		.model({
			type: a.string(),
			amount: a.float(),
			userID: a.belongsTo('User', 'userID'),
		})
		.authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'iam',
	},
});


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your tables. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

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
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: users } = await client.models.User.list()
// const { data: bets } = await client.models.Bet.list()

// return (
//   <div>
//     <h1>Users</h1>
//     <ul>{users.map(user => <li key={user.id}>{user.name} - ${user.balance}</li>)}</ul>
//     <h1>Bets</h1>
//     <ul>{bets.map(bet => <li key={bet.id}>{bet.type} - ${bet.amount}</li>)}</ul>
//   </div>
// );
