export async function listFiles(key: CryptoKey): Promise<StoredFile[]> {
  const { data, error } = await supabase
    .from("files")
    .select(
      "id, name_cipher, name_iv, mime_cipher, content_iv, size, cipher_size, storage_path, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error consultando la tabla files:", error);
    throw error;
  }
  if (!data) return [];

  const files: StoredFile[] = [];
  for (const row of data as FileRow[]) {
    try {
      const name = await decryptString(key, row.name_cipher, row.name_iv);
      const mime = row.mime_cipher
        ? await decryptString(key, row.mime_cipher, row.name_iv)
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
      console.error("Error al descifrar archivo ID:", row.id, e);
    }
  }

  return files;
}
