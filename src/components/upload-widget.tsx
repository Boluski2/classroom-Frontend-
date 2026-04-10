import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { Trash, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";

function UploadWidget({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  // Always keep latest onChange
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external value → internal preview
  useEffect(() => {
    setPreview(value);
    if (!value) {
      setDeleteToken(null);
    }
  }, [value]);

  // Initialize Cloudinary widget (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const MAX_RETRIES = 20; // 20 retries × 500ms = 10 seconds max
    let retryCount = 0;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5_000_000,
          clientAllowedFormats: ["png", "jpg", "jpeg"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        }
      );

      return true;
    };

    if (initializeWidget()) {
      setWidgetReady(true);
      setWidgetError(null);
      return;
    }

    const intervalId = window.setInterval(() => {
      retryCount++;

      if (initializeWidget()) {
        setWidgetReady(true);
        setWidgetError(null);
        window.clearInterval(intervalId);
      } else if (retryCount >= MAX_RETRIES) {
        setWidgetError("Failed to load upload widget. Please refresh the page.");
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled && widgetReady) {
      widgetRef.current?.open();
    }
  };

  const removeFromCloudinary = async () => {
    if (!preview) return;

    setIsRemoving(true);
      let removed = !deleteToken;

    try {
      if (deleteToken) {
        const params = new URLSearchParams();
        params.append("token", deleteToken);

       
          const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: "POST",
            body: params,
          }
        );
               if (!response.ok) {
          throw new Error("Cloudinary delete failed");
        }
        removed = true;
       }
    } catch (error) {
      console.error("Failed to remove image from Cloudinary", error);
    } finally {
      if (removed) {
       setPreview(null);
        setDeleteToken(null);
       onChangeRef.current?.(null);
      }
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {widgetError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
          {widgetError}
        </div>
      )}
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeFromCloudinary}
            disabled={isRemoving || disabled || !widgetReady}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadWidget;