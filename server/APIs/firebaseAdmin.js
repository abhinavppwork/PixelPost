const admin = require("firebase-admin");

function loadCredentials() {
  let credentials = null;

  // A) Base64 full JSON
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const json = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString("utf8");
      credentials = JSON.parse(json);
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:", err.message);
    }
  }

  // B) Raw JSON string
  if (!credentials && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err.message);
    }
  }

  // C) Individual env vars (optionally base64 private key)
  if (
    !credentials &&
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64)
  ) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
    
    if (!privateKey && process.env.FIREBASE_PRIVATE_KEY_BASE64) {
      try {
        privateKey = Buffer.from(
          process.env.FIREBASE_PRIVATE_KEY_BASE64,
          "base64"
        ).toString("utf8");
      } catch (err) {
        console.error("Failed to decode FIREBASE_PRIVATE_KEY_BASE64:", err.message);
      }
    }

    // Multiple strategies to fix newlines in private key
    if (privateKey) {
      // Strategy 1: Replace \\n with actual newlines
      privateKey = privateKey.replace(/\\n/g, "\n");
      
      // Strategy 2: Ensure proper PEM format
      if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
        privateKey = "-----BEGIN PRIVATE KEY-----\n" + privateKey;
      }
      if (!privateKey.endsWith("-----END PRIVATE KEY-----")) {
        privateKey = privateKey + "\n-----END PRIVATE KEY-----";
      }
      
      // Strategy 3: Clean up any double newlines or spacing issues
      privateKey = privateKey
        .replace(/-----BEGIN PRIVATE KEY-----\s*\n*/g, "-----BEGIN PRIVATE KEY-----\n")
        .replace(/\s*\n*-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
        .replace(/\n\n+/g, "\n"); // Remove multiple consecutive newlines
    }

    credentials = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: privateKey,
    };
  }

  if (!credentials || !credentials.client_email || !credentials.private_key) {
    throw new Error(
      "Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT(_BASE64) or FIREBASE_* env vars."
    );
  }

  // Debug logging (remove in production)
  console.log("Private key starts with:", credentials.private_key.substring(0, 30));
  console.log("Private key ends with:", credentials.private_key.substring(credentials.private_key.length - 30));

  return credentials;
}

// Add error handling for initialization
try {
  const credentials = loadCredentials();
  
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
  
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Firebase Admin initialization failed:", error.message);
  process.exit(1);
}

module.exports = admin;