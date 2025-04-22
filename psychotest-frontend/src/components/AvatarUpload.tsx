'use client';

import { useState } from "react";

export default function AvatarUpload({ currentAvatar }: { currentAvatar?: string }) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:3000/users/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ Аватар успешно загружен!");
    } catch (err) {
      console.error(err);
      alert("❌ Ошибка при загрузке");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-700">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-sm">Нет фото</div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-gray-300"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white text-sm"
      >
        Загрузить
      </button>
    </div>
  );
}
