import { supabase } from "./supabase";
import { decryptString, deriveKey, type VaultKey } from "./crypto";

export interface StoredFile {
  id: string;
  name: string;
  mime: string | null;
  size: number;
  cipherSize: number;
  createdAt: string;
  storagePath: string;
}

interface FileRow {
  id: string;
  name_cipher: string;
  name_iv: string;
  mime_cipher: string | null;
  content_iv: string;
  size: number;
  cipher_size: number;
  created_at: string;
  storage_path: string;
}

export async function vaultExists(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from("files")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error comprobando existencia de la bóveda:", error);
      return false;
    }
    return (count ?? 0) > 0;
  } catch (e) {
    console.error("Excepción en vaultExists:", e);
    return false;
  }
}

export async function setupVault(password: string): Promise<VaultKey> {
  try {
    const key = await deriveKey(password);
    return key;
  } catch (e) {
    console.error("Error en setupVault:", e);
    throw e;
  }
}

export async function unlockVault(password: string): Promise<VaultKey> {
  try {
    const key = await deriveKey(password);
    return key;
  } catch (e) {
    console.error("Error en unlockVault:", e);
    throw e;
  }
}

export async function downloadFile(storagePath: string): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from("vault")
    .download(storagePath);

  if (error) {
    console.error("Error descargando el archivo:", error);
    throw error;
  }

  return data;
}

export async function listFiles(key: VaultKey): Promise<StoredFile[]> {
  const { data, error } = await supabase
    .from("files")
    .select("id, name_cipher, name_iv, mime_cipher, content_iv, size, cipher_size, created_at, storage_path")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error consultando la tabla de archivos:", error);
    throw error;
  }

  if (!data) return [];

  const files: StoredFile[] = [];
  for (const row of data as FileRow[]) {
    try {
      const name = await decryptString(key, row.name_cipher, row.name_iv);
      const mime = row.mime_cipher 
        ? await decryptString(key, row.mime_cipher, row.content_iv)
        : null;

      files.push({
        id: row.id,
        name,
        mime,
        size: Number(row.size),
        cipherSize: Number(row.cipher_size),
        createdAt: row.created_at,
        storagePath: row.storage_path,
      });
    } catch (e) {
      console.error("Error al descifrar el archivo ID:", row.id, e);
    }
  }
  return files;
}
