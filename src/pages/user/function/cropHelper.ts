export const getCroppedImg = (imageSrc: string, pixelCrop: any) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context is null'));
                return;
            }

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob(blob => {
                if (blob) {
                    const croppedImageUrl = URL.createObjectURL(blob);
                    resolve(croppedImageUrl);
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg');
        };

        image.onerror = reject;
    });
};
