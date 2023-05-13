"use client";
import { WASMContext } from "@/contexts/wasm-context";
import { useContext, useState } from "react";

type SumProps = {
  arg1: number;
  arg2: number;
};

export default function Add() {
  const [args, setArgs] = useState<SumProps>({ arg1: 3, arg2: 7 });

  const ctx = useContext(WASMContext);

  const handleInputUpdate = (el: HTMLInputElement) => {
    if (!isNaN(+el.value))
      setArgs((prev) => ({ ...prev, [el.name]: +el.value }));
  };

  if (!ctx.wasm) {
    return <></>;
  }

  return (
    <div className="my-6 p-6 border-2 border-white w-full rounded-lg">
      <h1 className="uppercase my-4">Sum numbers:</h1>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="arg1"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            First Number
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={args.arg1}
            name="arg1"
            onChange={(el) => handleInputUpdate(el.target)}
          />
        </div>
        <div>
          <label
            htmlFor="arg1"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Second Number
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={args.arg2}
            name="arg2"
            onChange={(el) => handleInputUpdate(el.target)}
          />
        </div>
      </div>
      <p className="text-yellow-400 my-4 uppercase">
        The sum is {ctx.wasm.sum(args.arg1, args.arg2)}!
      </p>
    </div>
  );
}
