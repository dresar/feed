/**
 * ==============================================================================
 * 🖼️ CLIENT-SIDE GITHUB STORAGE HELPER
 * ==============================================================================
 * Helper function for uploading user images/logos directly to GitHub Storage
 * via the serverless /api/upload-github endpoint.
 */

export interface UploadResponse {
  success: boolean;
  url?: string;
  rawUrl?: string;
  filePath?: string;
  image?: any;
  error?: string;
}

export async function uploadImageToGithub(
  fileOrBase64: File | string,
  fileName?: string,
  category: "studio" | "logos" | "presets" | "history" | "vault" | "promos" | "general" = "general",
  promptId?: string
): Promise<UploadResponse> {
  try {
    let base64String = "";
    let effectiveFileName = fileName;

    if (fileOrBase64 instanceof File) {
      effectiveFileName = effectiveFileName || fileOrBase64.name;
      base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(fileOrBase64);
      });
    } else {
      base64String = fileOrBase64;
    }

    const response = await fetch("/api/upload-github", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileBase64: base64String,
        fileName: effectiveFileName || `img_${Date.now()}.png`,
        category: category,
        promptId: promptId,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Gagal mengunggah gambar ke server.");
    }

    return {
      success: true,
      url: data.url,
      rawUrl: data.rawUrl,
      filePath: data.filePath,
      image: data.image,
    };
  } catch (err: any) {
    console.error("[uploadImageToGithub] Error:", err.message);
    return {
      success: false,
      error: err.message || "Gagal memproses unggahan gambar.",
    };
  }
}
