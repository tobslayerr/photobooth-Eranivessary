export async function base64ToFile(
  dataurl: string,
  filename: string
): Promise<File> {
  const arr = dataurl.split(',');
  if (arr.length < 2) {
    throw new Error('Invalid base64 string');
  }
  
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) {
    throw new Error('Invalid mime type');
  }
  
  const mime = mimeMatch[1];
  const res = await fetch(dataurl);
  const blob = await res.blob();
  
  // LOGIC BARU: Deteksi ekstensi otomatis jika filename tidak punya ekstensi yang benar
  let finalFilename = filename;
  if (mime === 'image/gif' && !filename.endsWith('.gif')) {
      finalFilename = filename.replace(/\.[^/.]+$/, "") + ".gif";
  } else if (mime === 'image/jpeg' && !filename.endsWith('.jpg')) {
      finalFilename = filename.replace(/\.[^/.]+$/, "") + ".jpg";
  }

  return new File([blob], finalFilename, { type: mime });
}

// Helper baru untuk mendapatkan ekstensi dari base64 string
export function getExtensionFromBase64(dataurl: string): string {
    const mimeMatch = dataurl.match(/:(.*?);/);
    if (!mimeMatch) return '.jpg';
    if (mimeMatch[1] === 'image/gif') return '.gif';
    return '.jpg';
}