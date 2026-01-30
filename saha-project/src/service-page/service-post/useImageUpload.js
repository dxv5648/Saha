import { useState } from "react";
import supabase from "../../supabase-client";

export const useImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      return null;
    }

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `service-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, image, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      throw new Error("Failed to upload image: " + err.message);
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
