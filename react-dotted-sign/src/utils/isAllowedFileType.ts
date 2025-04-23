export function isAllowedFileType(filename: string): boolean {
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf'];
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return allowedExtensions.includes(extension);
}