import { getImageUrl } from "@/utils/getImageUrl";

interface ImageItem {
    id: string;
    url: string;
    originalPath?: string;
    file?: File;
}

export async function createImageItemFromUrl(
    id: string,
    url: string
): Promise<ImageItem> {
    // console.log(url);

    const response = await fetch(getImageUrl(url));


    if (!response.ok) {
        throw new Error("Failed to fetch image");
    }

    const blob = await response.blob();

    // Get filename from URL or fallback
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1] || "image.jpg";

    // Detect MIME type
    const mimeType = blob.type || "image/jpeg";
    // console.log(mimeType);
    // Create File object
    const file = new File([blob], filename, { type: mimeType });

    return {
        id,
        url,
        originalPath: url, // or extract relative path if needed
        file,
    };
}