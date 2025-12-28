"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Cloudinary upload response type
interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  duration: number;
  format: string;
  bytes: number;
}

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "saving" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Max file size 200MB (can now handle larger files with direct upload)
  const MAX_FILE_SIZE = 200 * 1024 * 1024;

  // Direct upload to Cloudinary
  const uploadToCloudinary = (
    file: File
  ): Promise<CloudinaryUploadResponse> => {
    return new Promise((resolve, reject) => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        reject(new Error("Cloudinary cloud name not configured"));
        return;
      }

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cloudclip_videos");
      // Note: For compression, configure eager transformations in your Cloudinary upload preset settings
      // Unsigned uploads don't allow eager params - they must be set in the preset

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error("Failed to parse Cloudinary response"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.error?.message || "Upload failed"));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      xhr.open("POST", url);
      xhr.send(formData);
    });
  };

  // Save metadata to our API
  const saveMetadata = async (
    cloudinaryData: CloudinaryUploadResponse,
    title: string,
    description: string,
    originalSize: number
  ) => {
    // Note: For actual compression stats, configure eager transformations in your Cloudinary upload preset
    // The bytes here is the uploaded file size; compression happens via preset settings
    const compressedSize = cloudinaryData.bytes;

    const response = await fetch("/api/video-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
        duration: cloudinaryData.duration,
        format: cloudinaryData.format,
        compressedSize,
        title,
        description,
        originalSize,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save video metadata");
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setErrorMessage("");
    setUploadProgress(0);

    if (!file) {
      setErrorMessage("Please select a file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size exceeds the 200MB limit");
      return;
    }

    setIsUploading(true);
    setUploadStatus("uploading");

    try {
      // Step 1: Upload directly to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(file);

      // Step 2: Save metadata to our API
      setUploadStatus("saving");
      await saveMetadata(cloudinaryResponse, title, description, file.size);

      // Success
      setUploadStatus("success");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
            disabled={isUploading}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            disabled={isUploading}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File (max 200MB)</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
            disabled={isUploading}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {uploadStatus === "uploading" && "Uploading to cloud..."}
                {uploadStatus === "saving" && "Saving metadata..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={uploadProgress}
              max="100"
            />
          </div>
        )}

        {/* Success Message */}
        {uploadStatus === "success" && (
          <div className="alert alert-success">
            <span>Video uploaded successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}

export default VideoUpload;
