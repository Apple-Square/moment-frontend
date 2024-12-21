export const getCroppedImg = (imageSrc: string, pixelCrop: any) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise<Blob | Error>((resolve, reject) => {
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

            // Blob으로 생성 후 resolve
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob); // Blob 객체를 resolve
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg'); // 이미지의 MIME 타입
        };

        image.onerror = reject;
    });
};
