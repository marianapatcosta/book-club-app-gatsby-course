

## 🚀 Quick start

- Install all the required dependencies in **gatsby-book-club** repo

```bash
npm install
# or
yarn install
```

- Add a config.js file at *gatsby-club-book\src\components\Firebase\config.js*
containing the **firebaseConfig** object obtained in Firebase's project settings

- Add the following en vars:
FIREBASE_TYPE
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID
FIREBASE_AUTH_URI
FIREBASE_TOKEN_URI
FIREBASE_AUTH_PROVIDER_X509_CERT_URL
FIREBASE_CLIENT_X509_CERT_URL

- Run the development server:

```bash
npm run dev
# or
yarn dev
```

Your site is now running at `http://localhost:8000`!

_Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.com/tutorial/part-five/#introducing-graphiql)._
