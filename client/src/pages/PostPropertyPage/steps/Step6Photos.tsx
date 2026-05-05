import { useRef, useState } from 'react';
import { PostPropertyForm } from '../types';

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
}

const API_BASE = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_URL
  ?? 'http://localhost:5000/api';

async function uploadFiles(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json() as { urls: string[] };
  return data.urls;
}

const Step6Photos = ({ form, onChange }: Props) => {
  const [urlInput, setUrlInput]   = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileRef                   = useRef<HTMLInputElement>(null);

  const addUrls = (urls: string[]) => {
    const valid = urls.map((u) => u.trim()).filter((u) => u.startsWith('http'));
    if (!valid.length) return;
    const next = [...new Set([...form.imageUrls, ...valid])].slice(0, 15);
    onChange({ imageUrls: next });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    setUploading(true);
    setUploadErr('');
    try {
      const urls = await uploadFiles(imageFiles);
      const next = [...new Set([...form.imageUrls, ...urls])].slice(0, 15);
      onChange({ imageUrls: next });
    } catch {
      setUploadErr('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = (url: string) =>
    onChange({ imageUrls: form.imageUrls.filter((u) => u !== url) });

  const handleUrlAdd = () => {
    addUrls([urlInput]);
    setUrlInput('');
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && fileRef.current?.click()}
        className={[
          'border-2 border-dashed rounded-2xl p-10 text-center transition-colors',
          uploading ? 'cursor-wait opacity-60' : 'cursor-pointer',
          dragOver
            ? 'border-primary bg-primary-fixed'
            : 'border-outline-variant hover:border-primary hover:bg-surface-container-low',
        ].join(' ')}
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined text-4xl text-primary mb-3 block animate-spin">
              progress_activity
            </span>
            <p className="text-sm font-semibold text-on-surface">Uploading photos…</p>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-outline mb-3 block">
              cloud_upload
            </span>
            <p className="text-sm font-semibold text-on-surface">
              Drag & drop photos here, or click to browse
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Up to 15 photos · JPG, PNG, WEBP · Max 10 MB each
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploadErr && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {uploadErr}
        </p>
      )}

      {/* URL input fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
          placeholder="Or paste an image URL and press Enter"
          className="flex-1 border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleUrlAdd}
          disabled={!urlInput.trim()}
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {/* Thumbnail grid */}
      {form.imageUrls.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            {form.imageUrls.length} / 15 photos
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {form.imageUrls.map((url, i) => (
              <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-container">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step6Photos;
