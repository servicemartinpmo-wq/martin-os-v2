import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const ImageAnalyzer = () => {
  const [result, setResult] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    try {
      setLoading(true);
      const payload = {
        image: image.split(',')[1],
        mimeType: image.split(',')[0].split(':')[1].split(';')[0]
      };
      const res = await fetch('/api/pmo/analyze_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data.result || 'Analysis complete.');
      toast.success('Image analyzed successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-blue-600" />
        Analyze Image
      </h3>
      <div className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
        <label htmlFor="image-upload" className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
          {image ? <img src={image} className="max-h-48 mx-auto" /> : <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />}
          <span className="text-sm text-slate-500">{image ? 'Click to change' : 'Upload an image'}</span>
        </label>
        <button 
          onClick={handleAnalyze}
          disabled={!image || loading}
          className="bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
        </button>
        {result && <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-700">{result}</div>}
      </div>
    </div>
  );
};
