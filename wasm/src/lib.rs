use std::{io::BufWriter, num::NonZeroU32};

use fast_image_resize as fr;
use image::codecs::png::PngEncoder;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sum(left: usize, right: usize) -> usize {
    left + right
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub fn resize_image(raw_image_width: u32, raw_image_height: u32, buffer: &[u8]) -> Vec<u8> {
    let src_image = fr::Image::from_vec_u8(
        NonZeroU32::new(raw_image_width).unwrap(),
        NonZeroU32::new(raw_image_height).unwrap(),
        Vec::from(buffer),
        fr::PixelType::U8x3,
    )
    .unwrap();

    // for now, just spits the same image back again. TODO: Implement resizing!

    return src_image.into_vec();
}

// #[wasm_bindgen]
// pub fn process_image(raw_image_width: u32, raw_image_height: u32, buffer: &[u8]) -> Vec<u8> {
//     return Vec::new();
// }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_can_add() {
        let result = sum(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn it_can_greet() {
        let result = greet("Bob");
        assert_eq!(result, "Hello, Bob!");
    }
}
