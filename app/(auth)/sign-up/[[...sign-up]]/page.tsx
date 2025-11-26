"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: marketing side */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Join <span className="text-primary">Cloudinary Showcase</span>
            </h1>
            <p className="text-base-content/70">
              Create an account to upload, manage and share your media with an
              elegant dashboard powered by Cloudinary.
            </p>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Upload and manage videos effortlessly</li>
              <li>• Generate social share assets in seconds</li>
              <li>• Access your personalized dashboard anywhere</li>
            </ul>
          </div>

          {/* Right: Clerk SignUp inside card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                forceRedirectUrl="/home"
                oauthFlow="auto"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 p-0", // remove extra Clerk card styling
                    headerTitle: "text-xl font-semibold",
                    headerSubtitle: "text-sm text-base-content/70",
                    formButtonPrimary: "btn btn-primary w-full",
                    socialButtonsBlockButton:
                      "btn btn-outline w-full mb-2 normal-case",
                    footerActionText: "text-sm",
                    footerActionLink: "link link-primary text-sm",
                    formFieldInput:
                      "input input-bordered w-full bg-transparent",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
