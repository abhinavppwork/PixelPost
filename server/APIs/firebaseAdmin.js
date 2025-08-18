const admin = require("firebase-admin");

let credentials = null;

// Preferred: JSON string in env
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err.message);
  }
}

// Fallback: individual env vars
if (!credentials && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  credentials = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

// Last resort: local file (useful for local dev only)
if (!credentials) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const serviceAccount = require("../serviceAccountKey.json");
    credentials = serviceAccount;
  } catch (err) {
    console.warn("serviceAccountKey.json not found; please configure ENV variables.");
  }
}

if (!credentials || !credentials.client_email || !credentials.private_key) {
  throw new Error("Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_* env vars.");
}

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = admin;
