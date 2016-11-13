export default function preload(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = function () {
            resolve(image);
        }
    });
}