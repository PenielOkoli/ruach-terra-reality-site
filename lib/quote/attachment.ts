// Basic file-signature checks only. These are not antivirus scanning.
export async function verifyQuoteAttachment(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  switch (file.name.split('.').pop()?.toLowerCase()) {
    case 'pdf': return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
    case 'png': return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case 'jpg': case 'jpeg': return starts(0xff, 0xd8, 0xff);
    case 'doc': return starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
    case 'docx': return starts(0x50, 0x4b, 0x03, 0x04);
    default: return false;
  }
}
