import admin from "firebase-admin";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();
console.log("FIREBASE_KEY_PATH:", process.env.FIREBASE_KEY_PATH);

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.FIREBASE_KEY_PATH!, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
