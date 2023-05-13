import Add from "@/components/Add";
import Greeting from "@/components/Greeting";
import GreeterWithNoContext from "@/components/GreeterWithNoContext";
import { WASMContextProvider } from "@/contexts/wasm-context";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1>Welcome!</h1>
      <WASMContextProvider>
        <p>
          <Greeting name="NextJS and WebAssembly" />
        </p>
        <Add />
      </WASMContextProvider>
      <div className="my-4">
        <GreeterWithNoContext />
      </div>
    </main>
  );
}
