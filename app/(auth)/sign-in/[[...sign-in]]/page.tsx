"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: intro / text */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back to{" "}
              <span className="text-primary">Cloudinary Showcase</span>
            </h1>
            <p className="text-base-content/70">
              Sign in to access your dashboard, manage uploads and generate
              social media ready assets in seconds.
            </p>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Pick up where you left off</li>
              <li>• View and manage your media library</li>
              <li>• Share content effortlessly with your audience</li>
            </ul>
          </div>

          {/* Right: Clerk SignIn inside card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                forceRedirectUrl="/home"
                oauthFlow="auto"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 p-0", // Clerk's inner card
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
