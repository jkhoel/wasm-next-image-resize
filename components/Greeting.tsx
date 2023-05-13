"use client";
import { WASMContext } from "@/contexts/wasm-context";
import { useContext } from "react";

type Props = {
  name: string;
};

export default function Greeting({ name }: Props) {
  const ctx = useContext(WASMContext);

  if (!ctx.wasm) {
    return <></>;
  }

  return <>{ctx.wasm.greet(name)}</>;
}
