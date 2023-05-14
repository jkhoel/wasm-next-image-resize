export type RawImageData = {
    buffer: ArrayBuffer;
    width: number;
    height: number;
    url: string;
};

export type GetImageDataProps = (
    blob: File | Blob,
    callback: (rawData: RawImageData) => void
) => void;

/**
 * This function generates an arrayBuffer from the blob (an image) and also 
 * tries to retrieve size information about it.
 * @param blob 
 * @param callback 
 * @returns Promise
 */
export const createImageDataObject: GetImageDataProps =
    async (blob, callback) =>
        await blob
            .arrayBuffer()
            .then((buffer) => {
                // Create an Image object that we can use to get data (sizes) about the input image
                var img = new Image();
                var url = URL.createObjectURL(blob);

                // We need to detect the size onLoad():
                img.onload = () =>
                    callback({
                        buffer,
                        url,
                        width: img.width,
                        height: img.height,
                    });
                // Then set the source to trigger it
                img.src = url;
            })
            .catch((err) => console.log(err));