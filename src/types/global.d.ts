declare global {
  interface Window {
    showDirectoryPicker(
      options?: FilePickerOptions,
    ): Promise<FileSystemDirectoryHandle>;

    dompdf: any;
  }
}

interface FilePickerOptions {
  multiple?: boolean;
  mode?: "read" | "readwrite";
}

export {};
