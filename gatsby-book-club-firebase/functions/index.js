const functions = require("firebase-functions")
const admin = require("firebase-admin")
const mimetypes = require("mimetypes")

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp()

exports.createAuthor = functions.https.onCall(async (data, context) => {
  // context where the function is called; has accessed to the logged in user
  checkAuthentication(context, true)
  dataValidator(data, {
    authorName: "string",
  })

  const author = await admin
    .firestore()
    .collection("authors")
    .where("name", "==", data.authorName)

  if (!author.empty) {
    throw new functions.https.HttpsError(
      "already-exists",
      "This author already exists"
    )
  }

  const db = admin.firestore()
  return db.collection("authors").add({ name: data.authorName })
})

exports.createBook = functions.https.onCall(async (data, context) => {
  checkAuthentication(context, true)
  dataValidator(data, {
    bookName: "string",
    authorId: "string",
    bookCover: "string",
    bookSummary: "string"
  })

  const mimeType = data.bookCover.match(
    /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
  )[1]
  const base64EncodedImageString = data.bookCover.replace(
    /^data:image\/\w+;base64,/,
    ""
  )
  const imageBuffer = new Buffer(base64EncodedImageString, "base64")

  const filename = `bookCovers/${data.bookName}.${mimeTypes.detectExtension(
    mimeType
  )}`
  const file = admin.storage().bucket().file(filename)
  await file.save(imageBuffer, { contentType: "image/jpeg" })
  const fileUrl = await file
    .getSignedUrl({ action: "read", expires: "03-09-2491" })
    .then(urls => urls[0])

  return admin
    .firestore()
    .collection("books")
    .add({
      title: data.bookName,
      imageUrl: fileUrl,
      summary: data.bookSummary,
      author: admin.firestore().collection("authors").doc(data.authorId),
    })
})

exports.createPublicProfile = functions.https.onCall(async (data, context) => {
  checkAuthentication(context)
  dataValidator(data, {
    username: "string",
  })

  const userProfile = await admin
    .firestore()
    .collection("publicProfiles")
    .where("userId", "==", context.auth.uid)
    .limit(1)
    .get()
  if (!userProfile.empty) {
    throw new functions.https.HttpsError(
      "already-exists",
      "This username already has a public profile"
    )
  }

  const publicProfile = await admin
    .firestore()
    .collection("publicProfiles")
    .doc(data.username)
    .get()

  if (publicProfile.exists) {
    throw new functions.https.HttpsError(
      "already-exists",
      "This username already belongs to an existing user"
    )
  }

  const user = await admin.auth().getUser(context.auth.uid)
  if (user.email === functions.config().accounts.admin) {
    await admin.auth().setCustomUserClaims(context.auth.uid, { admin: true })
  }

  return admin
    .firestore()
    .collection("publicProfiles")
    .doc(data.username)
    .set({ userId: context.auth.uid }) // here we do not look for a reference because uid is a string as it came from firebase authentication and not fro other collection
})

// allows us to use admin package in firebase cloud functions
exports.postComment = functions.https.onCall((data, context) => {
  // context where the function is called; has accessed to the logged in user
  checkAuthentication(context)
  dataValidator(data, {
    bookId: "string",
    text: "string",
  })
  const db = admin.firestore()
  return db
    .collection("publicProfiles")
    .where("userId", "==", context.auth.id)
    .limit(1)
    .get()
    .then(snapshot => {
      return db.collection("comments").add({
        text: data.text,
        username: snapshot.docs[0].id,
        dateCreated: new Date(),
        book: db.collection("books").doc(data.bookId),
      })
    })
})

// invalid-arguments and unauthenticated are HTTpsError codes described in documentation
function dataValidator(data, validKeys) {
  if (Object.keys(data).length !== Object.keys(validKeys).length) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Data object contains invalid number of properties"
    )
  }

  for (const key in data) {
    if (!validKeys[key] || typeof data[key] !== validKeys[key]) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Data object contains invalid types"
      )
    }
  }
}

function checkAuthentication(context, isAdmin) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be signed in to use this feature"
    )
  }

  if (!context.auth.token.admin && isAdmin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin to use this feature!"
    )
  }
}
