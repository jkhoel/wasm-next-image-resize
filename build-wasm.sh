# Build the module, with Web as target in release mode
wasm-pack build ./wasm --target web

# Build the module, but with Node as target. See
# https://rustwasm.github.io/wasm-pack/book/commands/build.html#target for more options
# wasm-pack build --target nodejs

