"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base-100 flex flex-col">

      {/* Top Bar */}
      <header className="flex justify-between items-center p-4 md:px-10 h-16 border-b border-base-300">
        <Link href="/" className="text-2xl font-bold">
          CloudClip
        </Link>

        <div className="flex items-center gap-4">

          {/* If user is NOT logged in */}
          <SignedOut>
            <SignInButton>
              <button className="btn btn-ghost rounded-full px-4">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="bg-primary text-white rounded-full font-medium text-sm px-5 h-10 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          {/* If user IS logged in */}
          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary rounded-full px-6">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 md:px-12 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Supercharge Your Media with <br />
          <span className="text-primary">AI + Cloudinary</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-base md:text-lg text-base-content/70 max-w-xl"
        >
          Upload, compress, optimize & transform videos effortlessly.
          Enjoy a smooth dashboard and secure user-specific storage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8"
        >
          <SignedOut>
            <SignUpButton>
              <button className="btn btn-primary px-8 rounded-full">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary px-8 rounded-full">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </SignedIn>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-24 px-6 md:px-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "Cloudinary Uploads",
            desc: "Fast, secure, highly optimized cloud uploads.",
          },
          {
            title: "AI Compression",
            desc: "Auto-optimize videos without losing clarity.",
          },
          {
            title: "User-Specific Dashboard",
            desc: "Every user gets isolated secure video storage.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="p-6 border border-base-300 rounded-2xl shadow-sm bg-base-200"
          >
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-base-content/70">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-base-content/60 text-sm">
        © {new Date().getFullYear()} CloudSaaS. Built with ❤️ for developers.
      </footer>
    </main>
  );
}
