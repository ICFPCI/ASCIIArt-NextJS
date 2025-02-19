

const getTileIndex = (gray: number): number => {
    const normalized = gray / 255.0;
    return Math.floor(normalized * 9);
};

const loadTexture = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
};

const ASCIIArt = async (file: File): Promise<File> => {
    const fileName = file.name.replace(/\.[^/.]+$/, ".png");
    let img = await loadImage(file);
    img = await resizeImageElement(img, img.width / 8, img.height / 8);
    const texture = await loadTexture("/chars.png");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Error al obtener el contexto del canvas.");
    }

    const tileSize = 8;
    canvas.width = img.width * tileSize;
    canvas.height = img.height * tileSize;


    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) throw new Error("Error al obtener el contexto del canvas temporal.");

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;


    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const tileIndex = getTileIndex(gray);


            ctx.drawImage(
                texture,
                tileIndex * tileSize, 0,
                tileSize, tileSize,
                x * tileSize, y * tileSize,
                tileSize, tileSize
            );
        }
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(new File([blob], fileName, { type: 'image/png' }));
            } else {
                reject(new Error("Error al convertir el canvas a Blob."));
            }
        }, 'image/png');
    });
};

const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result as string;
            } else {
                reject(new Error('Failed to load image data.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const resizeImageElement = (img: HTMLImageElement, maxWidth: number, maxHeight: number): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Error al obtener contexto de canvas.");
        }

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = new Image();
        resizedImage.src = canvas.toDataURL();
        resizedImage.onload = () => resolve(resizedImage);
    });
};

const BWFilter = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                img.src = e.target.result as string;
            } else {
                reject(new Error('Failed to load image data.'));
            }
        };

        reader.onerror = (err) => reject(err);

        reader.readAsDataURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject("Error al obtener contexto de canvas.");
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;


            ctx.filter = "grayscale(100%)";
            ctx.drawImage(img, 0, 0, img.width, img.height);


            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], file.name, { type: file.type }));
                } else {
                    reject("Error al convertir el canvas a blob.");
                }
            }, file.type);
        };
    });
};

export { ASCIIArt, BWFilter };
