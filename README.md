# Imtihani

# ChadLearnHub: Accessible Learning Solutions
# Introduction
This repository contains the source code for ChadLearnHub, an educational software application designed to provide accessible learning solutions for Chadian students. The project aims to democratize access to educational materials, address the challenges of fragmented resources, and enhance the learning experience for students in Chad.


# Getting Started
# Prerequisites
- Node.js installed
- Firebase account and project set up
- Docker installed

# Installation
- Clone the repository: `git clone https://github.com/Kakaymi10/Imtihani.git`
- Navigate to the project directory: `cd Imtihani`
- Install dependencies: `npm install`
  
# Configuration
- Create a .env file in the project root and add your Firebase credentials:


Copy code
`\n
FIREBASE_API_KEY=your_api_key\n
FIREBASE_AUTH_DOMAIN=your_auth_domain\n
FIREBASE_PROJECT_ID=your_project_id\n
FIREBASE_STORAGE_BUCKET=your_storage_bucket\n
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id\n
FIREBASE_APP_ID=your_app_id\n
`
# Running the App
- Run the application: `npm start`
- Access the app at `http://localhost:3000`
  
# Running with Docker
- Build the Docker image: `docker build -t chadlearnhub .`
- Run the Docker container: `docker run -p 3000:3000 chadlearnhub`
  
# Contributors
Moussa Moussa
