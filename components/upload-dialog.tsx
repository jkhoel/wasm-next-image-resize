"use client";
import { WASMContext } from "@contexts/wasm-context";
import { byteValueNumberFormatter } from "@utils/formatter";
import NextImage from "next/image";
import { useContext, useEffect, useState } from "react";

const getImageData = async (image: File) => {
  return await image
    .arrayBuffer()
    .then((buffer) => buffer)
    .catch((err) => console.log(err));
};

type RawImageData = {
  buffer: ArrayBuffer;
  width: number;
  height: number;
  url: string;
};

export default function UploadDialog() {
  const [inputImageFile, setInputImageFile] = useState<File>();
  const [inputImageData, setInputImageData] = useState<RawImageData>();

  const [outputImageUrl, setOutputImageUrl] = useState<string>();

  const ctx = useContext(WASMContext);

  // Generate buffers and data when a new picture file is selected
  useEffect(() => {
    if (inputImageFile) {
      (async () => {
        await inputImageFile
          .arrayBuffer()
          .then((buffer) => {
            // Create an Image object that we can use to get data about the input image
            var inputImg = new Image();
            var url = URL.createObjectURL(inputImageFile);

            // We need to detect the size onLoad():
            inputImg.onload = () =>
              setInputImageData({
                buffer: buffer,
                width: inputImg.width,
                height: inputImg.height,
                url,
              });

            // Then set the source to trigger it
            inputImg.src = url;
          })
          .catch((err) => console.log(err));
      })();
    }
  }, [inputImageFile]);

  // Generate Resized images with the WASM Module if the input data changes
  useEffect(() => {
    if (inputImageData) {
      // Make our input-image into an array if u8's that we can pass to Rust
      const buffer = new Uint8Array(inputImageData.buffer);

      // Call our resizing function from the WASM module!
      const resArr = ctx.wasm?.resize_image(800, 500, buffer);

      // Set the output URL if we got a resulting image back
      if (resArr) {
        var blob = new Blob([resArr], { type: "image/png" });
        var url = URL.createObjectURL(blob);

        console.log(url);
        setOutputImageUrl(url);
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

      {outputImageUrl && (
        // Show the Raw image if we have one
        <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Resized Image:
          </p>
          <img src={outputImageUrl} alt="Resized image" width={600} />
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
