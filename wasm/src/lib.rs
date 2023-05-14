use std::num::NonZeroU32;

use fast_image_resize as fr;
use wasm_bindgen::prelude::*;

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

    src_image.into_vec()
}
