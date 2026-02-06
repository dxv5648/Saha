import { useState } from "react";
import supabase from "../../supabase-client";

const MAX_FILE_SIZE_MB = 5;

export const useImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!image) {
      return null;
    }

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `service-images/${fileName}`;

      // Use the REST API directly to avoid Supabase JS client fetch issues
      // in certain browser environments.
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey =
        import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;

      // Get the current session token if the user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || supabaseKey;

      const uploadUrl = `${supabaseUrl}/storage/v1/object/service-images/${filePath}`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": image.type,
          "x-upsert": "true",
          "Cache-Control": "max-age=3600",
        },
        body: image,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Upload failed (${res.status}): ${errBody}`);
      }

      // Build the public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/service-images/${filePath}`;
      return publicUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("failed to fetch")) {
        throw new Error(
          "Image upload failed due to a network error. Please check your connection and try again."
        );
      }
      throw new Error("Failed to upload image: " + msg);
    }
  };

  const resetImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return {
    image,
    setImage,
    imagePreview,
    setImagePreview,
    handleImageChange,
    uploadImage,
    resetImage,
  };
};
