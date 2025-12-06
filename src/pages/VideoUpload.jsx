import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'video/mp4') {
      setFile(selectedFile);
      setVideoUrl('');
    } else {
      toast.error('Please select an MP4 file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const response = await base44.functions.invoke('uploadVideo', { file });
      
      if (response.data?.file_url) {
        setVideoUrl(response.data.file_url);
        toast.success('Video uploaded successfully!');
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(videoUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Video Upload
        </h1>

        <div className="bg-slate-800/50 border-2 border-blue-500/30 rounded-xl p-8 space-y-6">
          {/* File Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Select MP4 File
            </label>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                file:cursor-pointer cursor-pointer"
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 
              text-white font-semibold hover:from-cyan-500 hover:to-blue-500 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 transition-all"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Video
              </>
            )}
          </button>

          {/* Video URL Result */}
          {videoUrl && (
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Upload Successful!</span>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Video URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono text-slate-300"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Preview */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Preview
                </label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg border border-slate-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-blue-400 mb-1">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select your MP4 video file</li>
                <li>Click "Upload Video" and wait for completion</li>
                <li>Copy the generated URL</li>
                <li>Use this URL in your hero video source</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}