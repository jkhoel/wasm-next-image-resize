"use client";
import { WASMContext } from "@/contexts/wasm-context";
import Image from "next/image";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";

const getImageData = async (image: File) => {
  return await image
    .arrayBuffer()
    .then((buffer) => buffer)
    .catch((err) => console.log(err));
};

export default function UploadDialog() {
  const [rawImage, setRawImage] = useState<File>();
  const [rawImageUrl, setRawImageUrl] = useState<string>();
  const [rawImageData, setRawImageData] = useState<ArrayBuffer>();

  const [processedResult, setProcessedResult] = useState<string>();

  const ctx = useContext(WASMContext);

  useEffect(() => {
    if (rawImage) {
      (async () => {
        await rawImage
          .arrayBuffer()
          .then((buffer) => setRawImageData(buffer))
          .catch((err) => console.log(err));
      })();

      setRawImageUrl(URL.createObjectURL(rawImage));
    }
  }, [rawImage]);

  useEffect(() => {
    if (rawImageData) {
      const buffer = new Uint8Array(rawImageData);

      const resArr = ctx.wasm?.resize_image(800, 500, buffer);

      if (resArr) {
        var blob = new Blob([resArr], { type: "image/png" });
        var url = URL.createObjectURL(blob);

        console.log(url);
        setProcessedResult(url);
      }
    }
  }, [rawImageData]);

  const handleFileSelect = (el: HTMLInputElement) => {
    if (el.files && el.files[0]) {
      setRawImage(el.files[0]);
    }
  };

  if (!ctx.wasm) {
    return <></>;
  }

  return (
    <>
      <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
        <label
          htmlFor="arg1"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an image:
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="file"
          name="file-upload"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target)}
        />
      </div>

      {processedResult && (
        // Show the Raw image if we have one
        <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Resized Image:
          </p>
          <img src={processedResult} alt="Resized image" width={600} />
        </div>
      )}

      {rawImageUrl && (
        // Show the Raw image if we have one
        <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Original Image:
          </p>
          <img src={rawImageUrl} alt="Raw image" width={600} />
        </div>
      )}
    </>
  );
}
