#!/bin/bash

# Project setup variables
PROJECT_NAME="aenzbi-business"
FIREBASE_PROJECT_ID="sokoni-44ef1"

# Step 1: Ensure Firebase CLI is installed and authenticated
echo "Checking Firebase CLI installation..."
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "Firebase CLI is installed."
fi

echo "Authenticating with Firebase..."
firebase login || { echo "Firebase login failed"; exit 1; }

# Step 2: Build the Next.js project
echo "Building the Next.js project..."
cd $PROJECT_NAME || { echo "Project directory not found"; exit 1; }
npm install
npm run build || { echo "Next.js build failed"; exit 1; }

# Step 3: Initialize Firebase Hosting and Functions if not already initialized
echo "Initializing Firebase Hosting and Functions..."
firebase init hosting functions --project $FIREBASE_PROJECT_ID --only hosting,functions || { echo "Firebase initialization failed"; exit 1; }

# Step 4: Create a Firebase Functions entry file to handle SSR
echo "Setting up Firebase Functions for SSR..."
cat <<EOL > functions/index.js
const functions = require("firebase-functions");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: "./next" } });
const handle = app.getRequestHandler();

exports.nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
EOL

# Step 5: Update Firebase functions package.json to include dependencies
echo "Updating Firebase functions package.json with Next.js dependencies..."
cat <<EOL > functions/package.json
{
  "name": "functions",
  "engines": {
    "node": "16"
  },
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0",
    "next": "^13.0.0"
  }
}
EOL

# Step 6: Copy Next.js build to Firebase Functions
echo "Copying Next.js build to Firebase Functions directory..."
rm -rf functions/next
cp -r .next functions/next

# Step 7: Deploy to Firebase
echo "Deploying to Firebase Hosting and Functions..."
firebase deploy --only hosting,functions --project $FIREBASE_PROJECT_ID || { echo "Firebase deployment failed"; exit 1; }

# Step 8: Confirm deployment success
echo "Deployment complete! Your Next.js app is live on Firebase Hosting."