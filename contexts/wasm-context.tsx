"use client";
import { ReactNode, createContext, useEffect, useState } from "react";

interface IWASMContext {
  wasm?: typeof import("@/wasm/pkg/wasm_image_resize");
}

interface WASMContextProviderProps {
  children: ReactNode;
}

const initial: IWASMContext = {};

export const WASMContext = createContext(initial);

export const WASMContextProvider: React.FC<WASMContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<IWASMContext>(initial);

  useEffect(() => {
    (async () => {
      const wasm = await import("@/wasm/pkg/wasm_image_resize");
      await wasm.default();
      setState({ wasm });
    })();
  });

  return <WASMContext.Provider value={state}>{children}</WASMContext.Provider>;
};
