"use client";

import { useCallback, useRef, useState } from "react";
import { uploadImage as uploadOriginalImage } from "./image-upload";

/** Track every image upload, including images in nested teacher editors. */
export function useImageUpload() {
  const pending = useRef(0);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = useCallback(async (file: File) => {
    pending.current += 1;
    setIsUploading(true);
    try { return await uploadOriginalImage(file); }
    finally {
      pending.current -= 1;
      setIsUploading(pending.current > 0);
    }
  }, []);
  const hasPendingUploads = useCallback(() => pending.current > 0, []);
  return { uploadImage, isUploading, hasPendingUploads };
}
