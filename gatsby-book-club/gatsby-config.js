require("dotenv").config({
  path: ".env",
})

module.exports = {
  siteMetadata: {
    title: `Gatsby Book Club`,
    description: `App developed during a course to learn more about gatsby and Firebase`,
    author: `@marianacosta`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-remote-images`, // allows to have a local image based on the provided url
      options: {
        nodeType: "Book", // Book references the field in graphql query
        imagePath: "imageUrl",
      },
    },
    {
      resolve: "gatsby-firesource",
      options: {
        credential: {
          type: process.env.FIREBASE_TYPE,
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI,
          token_uri: process.env.FIREBASE_TOKEN_URI,
          auth_provider_x509_cert_url:
            process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        },
        // structure of firebase collection
        types: [
          {
            type: "Book", // type to be used in graphql query
            collection: "books", // the exact name of our firebase collection
            // maps firebase documents (books in this case) and prepare it to be query by graphql
            map: book => ({
              title: book.title,
              summary: book.summary,
              imageUrl: book.imageUrl,
              author___NODE: book.author.id,
            }),
          },
          {
            type: "Author",
            collection: "authors",
            map: author => ({
              name: author.name,
              /*    books___NODE: author.books.map(book => book.id), */
            }),
          },
        ],
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
