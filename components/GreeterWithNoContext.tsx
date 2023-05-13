"use client";

import { useEffect, useState } from "react";

type WASMLibType = typeof import("@/wasm/pkg/wasm_image_resize");

export default function GreeterWithNoContext() {
  const [wasm, setWasm] = useState<WASMLibType>();

  useEffect(() => {
    (async () => {
      const wasm = await import("@/wasm/pkg/wasm_image_resize");
      await wasm.default();
      setWasm(wasm);
    })();
  });

  if (!wasm) return <></>;

  return <>{wasm?.greet("from the Otter Side")}</>;
}
