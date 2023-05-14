import UploadDialog from "@/components/upload-dialog";
import { WASMContextProvider } from "@/contexts/wasm-context";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1>Welcome!</h1>
      <WASMContextProvider>
        <UploadDialog />
      </WASMContextProvider>
    </main>
  );
}
