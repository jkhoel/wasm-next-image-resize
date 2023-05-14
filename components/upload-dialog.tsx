"use client";
import {
  RawImageData,
  createImageDataObject,
  GetImageDataProps,
} from "@utils/image-data-props";
import { WASMContext } from "@contexts/wasm-context";
import { byteValueNumberFormatter } from "@utils/formatter";
import NextImage from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";

export default function UploadDialog() {
  const [inputImageFile, setInputImageFile] = useState<File>();
  const [inputImageData, setInputImageData] = useState<RawImageData>();
  const [outputImageData, setOutputImageData] = useState<RawImageData>();

  // Get our WASM module from context
  const ctx = useContext(WASMContext);

  // We use this function to prep our images into an arrayBuffer and to get image data like size etc.
  const setImageDataObject: GetImageDataProps = useCallback(
    async (blob, callback) => createImageDataObject(blob, callback),
    []
  );

  // Generate buffers and data when a new picture file is selected
  useEffect(() => {
    if (inputImageFile) {
      ((async) => setImageDataObject(inputImageFile, setInputImageData))();
    }
  }, [inputImageFile]);

  // Generate Resized images with the WASM Module if the input data changes
  useEffect(() => {
    if (inputImageData?.buffer) {
      // Make our input-image into an array if u8's that we can pass to Rust
      const buffer = new Uint8Array(inputImageData.buffer);

      // Call our resizing function from the WASM module!
      const resArr = ctx.wasm?.resize_image(800, 500, buffer);

      // Set an output RawImageData object if we have a resulting image
      if (resArr) {
        var blob = new Blob([resArr], { type: "image/png" });
        var url = URL.createObjectURL(blob);

        ((async) => setImageDataObject(blob, setOutputImageData))();
      }
    }
  }, [inputImageData]);

  const handleFileSelect = (el: HTMLInputElement) => {
    if (el.files && el.files[0]) {
      setInputImageFile(el.files[0]);
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

      {outputImageData && (
        // Show the Raw image if we have one
        <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {`Resized Image (${outputImageData?.width} x ${
              outputImageData?.height
            } ${byteValueNumberFormatter.format(
              outputImageData?.buffer.byteLength
            )})`}
          </p>
          <img
            src={outputImageData.url}
            alt="Output image"
            width={outputImageData.width}
            height={outputImageData.height}
          />
        </div>
      )}

      {inputImageData && (
        // Show the Raw image if we have one
        <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {`Original Image (${inputImageData?.width} x ${
              inputImageData?.height
            } ${byteValueNumberFormatter.format(
              inputImageData?.buffer.byteLength
            )})`}
          </p>
          <NextImage
            src={inputImageData.url}
            alt="Input image"
            width={inputImageData.width}
            height={inputImageData.height}
          />
        </div>
      )}
    </>
  );
}
