CloudClip- A Cloudinary Media Management & Optimization System

A full-stack media management platform built with Next.js (TypeScript) and Cloudinary (AI-Integration), enabling secure uploads, real-time transformations, and advanced asset management. This project demonstrates production-grade cloud storage integration, dashboard UI, and automated media workflows.

🚀 Features
🔐 Secure Uploads

Client & server-side validation

Environment-based Cloudinary configuration

Signed upload presets for secure file handling

🖼 Real-Time Media Optimization

Auto-quality & auto-format

Resize, crop, rotate, compress

Smart cropping using face detection

Watermarks & overlays

URL-based transformations

📁 Asset Management Dashboard

Live preview of images & videos

Image Transformation and Video Compression using Cloudinary AI

Display metadata (size, format, resolution, tags)

Delete or update assets

Copy CDN links instantly

🔎 Search & Tagging

Tag-based asset organization

Search via Cloudinary Search API

👤 Authentication

Login / Signup integrated with Clerk

Protected routes

User sessions for personalized management

🧩 Tech Stack
Layer	Tech Used
Frontend	Next.js 14, React, TypeScript, Tailwind CSS
Backend	Next.js API Routes
Cloud Storage	Cloudinary (Upload API, Admin API)
Authentication	Clerk
UI Components	DaisyUI / Shadcn UI


⚙️ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/cloudinary-project.git
cd cloudinary-project

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env.local file:

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_preset
CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

4️⃣ Run Locally
npm run dev


Your app starts at:
http://localhost:3000

🧪 Available APIs
Video- Upload API

Handles secure uploads with signed presets.

Image- Upload API

Handles secure image uploads.

📈 Future Enhancements

Drag & drop multi-upload

Private assets with signed URLs

Asset folders & collections

Detailed analytics (views, bandwidth, transformations)


📜 License

MIT License © 2025
