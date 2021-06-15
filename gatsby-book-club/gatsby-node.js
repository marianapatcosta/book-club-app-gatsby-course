const path = require("path")
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const bookTemplate = path.resolve("src/templates/BookTemplate.js")

  return graphql(`
    {
      allBook {
        nodes {
          id
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }

    result.data.allBook.nodes.forEach(book => {
      createPage({
        path: `/book/${book.id}`,
        component: bookTemplate,
        context: { bookId: book.id },
      })
    })
  })
}
