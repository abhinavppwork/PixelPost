const admin = require("../APIs/firebaseAdmin");

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Now you can use req.user.uid, req.user.email
    next();
  } catch (err) {
    return res.status(403).send({ message: "Unauthorized" });
  }
}

module.exports = verifyFirebaseToken;
