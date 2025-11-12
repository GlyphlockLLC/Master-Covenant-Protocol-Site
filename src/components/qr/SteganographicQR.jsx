import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Eye, EyeOff, Image as ImageIcon, Scan, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SteganographicQR({ qrPayload, qrGenerated }) {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [coverImageLoaded, setCoverImageLoaded] = useState(false);
  const [stegoImage, setStegoImage] = useState(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState(null);
  const [extractedImage, setExtractedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const decodeInputRef = useRef(null);
  const coverImgRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    setError(null);
    setCoverImage(file);
    setCoverImageLoaded(false);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImageUrl(event.target.result);
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleImageLoad = () => {
    setCoverImageLoaded(true);
    setError(null);
  };

  const handleImageError = () => {
    setError('Failed to load image. Please try a different image.');
    setCoverImageLoaded(false);
  };

  const stringToBinary = (str) => {
    return str.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  };

  const binaryToString = (binary) => {
    const bytes = binary.match(/.{8}/g);
    if (!bytes) return '';
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const encodeQRInImage = async () => {
    if (!coverImage || !qrPayload || !coverImageUrl || !coverImageLoaded) {
      setError('Please wait for the image to fully load before encoding');
      return;
    }

    setIsEncoding(true);
    setError(null);

    try {
      // Use the already loaded image from the DOM
      const img = coverImgRef.current;
      if (!img || !img.complete) {
        throw new Error('Image not properly loaded');
      }

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Invalid image dimensions');
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Prepare data: QR payload + delimiter
      const delimiter = '<<<END>>>';
      const dataToHide = qrPayload + delimiter;
      const binaryData = stringToBinary(dataToHide);
      
      // Check if image has enough capacity
      const maxCapacity = (pixels.length / 4) * 3; // 3 bits per pixel (RGB only)
      if (binaryData.length > maxCapacity) {
        throw new Error(`Image is too small. Need ${Math.ceil(binaryData.length / 3)} pixels but only have ${Math.floor(maxCapacity / 3)}`);
      }

      // Encode binary data into LSB of RGB channels
      let dataIndex = 0;
      for (let i = 0; i < pixels.length && dataIndex < binaryData.length; i += 4) {
        // Red channel
        if (dataIndex < binaryData.length) {
          pixels[i] = (pixels[i] & 0xFE) | parseInt(binaryData[dataIndex]);
          dataIndex++;
        }
        // Green channel
        if (dataIndex < binaryData.length) {
          pixels[i + 1] = (pixels[i + 1] & 0xFE) | parseInt(binaryData[dataIndex]);
          dataIndex++;
        }
        // Blue channel
        if (dataIndex < binaryData.length) {
          pixels[i + 2] = (pixels[i + 2] & 0xFE) | parseInt(binaryData[dataIndex]);
          dataIndex++;
        }
        // Skip alpha channel (i + 3)
      }

      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob and create download URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setStegoImage(url);
        } else {
          setError('Failed to create steganographic image');
        }
        setIsEncoding(false);
      }, 'image/png');

    } catch (err) {
      console.error('Encoding error:', err);
      setError(err.message || 'Failed to encode QR code into image');
      setIsEncoding(false);
    }
  };

  const decodeQRFromImage = async (file) => {
    setIsDecoding(true);
    setDecodedData(null);
    setError(null);

    try {
      const reader = new FileReader();
      
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Extract binary data from LSB
      let binaryData = '';
      for (let i = 0; i < pixels.length; i += 4) {
        binaryData += (pixels[i] & 1).toString();
        binaryData += (pixels[i + 1] & 1).toString();
        binaryData += (pixels[i + 2] & 1).toString();
      }

      // Convert binary to string
      const extractedText = binaryToString(binaryData);
      
      // Find delimiter
      const delimiter = '<<<END>>>';
      const delimiterIndex = extractedText.indexOf(delimiter);
      
      if (delimiterIndex === -1) {
        throw new Error('No hidden QR data found in this image');
      }

      const hiddenData = extractedText.substring(0, delimiterIndex);
      setDecodedData(hiddenData);
      setExtractedImage(dataUrl);
      setIsDecoding(false);
      
    } catch (err) {
      console.error('Decoding error:', err);
      setError(err.message || 'Failed to decode image');
      setIsDecoding(false);
    }
  };

  const handleDecodeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    decodeQRFromImage(file);
  };

  const downloadStegoImage = () => {
    if (!stegoImage) return;
    
    const link = document.createElement('a');
    link.href = stegoImage;
    link.download = 'steganographic-qr.png';
    link.click();
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (stegoImage) URL.revokeObjectURL(stegoImage);
    };
  }, [stegoImage]);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <EyeOff className="w-5 h-5" />
          Steganographic QR (Hidden in Image)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="encode">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="encode" className="text-white data-[state=active]:text-blue-400">
              Encode (Hide)
            </TabsTrigger>
            <TabsTrigger value="decode" className="text-white data-[state=active]:text-blue-400">
              Decode (Extract)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-6">
            {!qrGenerated && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertDescription className="text-white">
                  Generate a QR code first to enable steganographic encoding
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-white ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {qrGenerated && (
              <>
                <div>
                  <Label className="text-white mb-2 block">Step 1: Upload Cover Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {coverImageUrl ? (
                    <div className="space-y-3">
                      <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800">
                        <img 
                          ref={coverImgRef}
                          src={coverImageUrl} 
                          alt="Cover" 
                          className="max-w-full max-h-48 mx-auto rounded"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                        {!coverImageLoaded && (
                          <p className="text-center text-gray-400 text-sm mt-2">Loading image...</p>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setStegoImage(null);
                        }}
                        variant="outline"
                        className="w-full border-blue-500/50 hover:bg-blue-500/10 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-blue-500/50 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-white">Click to upload cover image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG or JPG - Larger images recommended (min 500x500px)</p>
                    </button>
                  )}
                </div>

                <Button
                  onClick={encodeQRInImage}
                  disabled={!coverImage || !coverImageLoaded || isEncoding}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50"
                >
                  {isEncoding ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2 animate-pulse" />
                      Hiding QR in Image...
                    </>
                  ) : !coverImageLoaded && coverImage ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Waiting for image to load...
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide QR Code in Image (LSB Encoding)
                    </>
                  )}
                </Button>

                {stegoImage && (
                  <div className="space-y-3">
                    <Alert className="bg-green-500/10 border-green-500/30">
                      <AlertDescription className="text-white">
                        <strong>✓ QR Code Hidden Successfully!</strong>
                        <p className="text-xs text-gray-400 mt-1">
                          The image looks identical but contains your QR data in the least significant bits
                        </p>
                      </AlertDescription>
                    </Alert>

                    <div className="border-2 border-green-500/30 rounded-lg p-4 bg-gray-800">
                      <Label className="text-white text-sm mb-2 block">Steganographic Image</Label>
                      <img 
                        src={stegoImage} 
                        alt="Steganographic" 
                        className="max-w-full max-h-48 mx-auto rounded mb-3"
                      />
                      <p className="text-xs text-gray-400 text-center">
                        Looks normal, but contains hidden QR data
                      </p>
                    </div>

                    <Button
                      onClick={downloadStegoImage}
                      variant="outline"
                      className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Steganographic Image
                    </Button>
                  </div>
                )}

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <AlertDescription className="text-xs text-white">
                    <strong>How it works:</strong> LSB (Least Significant Bit) encoding hides data by modifying the last bit of each RGB pixel. Changes are invisible to human eyes but can be extracted programmatically.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </TabsContent>

          <TabsContent value="decode" className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-white ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label className="text-white mb-2 block">Upload Image to Extract Hidden QR</Label>
              <input
                ref={decodeInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleDecodeUpload}
                className="hidden"
              />
              
              <button
                onClick={() => decodeInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-blue-500/50 transition-colors disabled:opacity-50"
                disabled={isDecoding}
              >
                {isDecoding ? (
                  <>
                    <Scan className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-pulse" />
                    <p className="text-white">Extracting hidden data...</p>
                  </>
                ) : (
                  <>
                    <Scan className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-white">Click to upload steganographic image</p>
                    <p className="text-xs text-gray-500 mt-1">Must be a PNG/JPG with hidden QR data</p>
                  </>
                )}
              </button>
            </div>

            {decodedData && (
              <div className="space-y-3">
                <Alert className="bg-green-500/10 border-green-500/30">
                  <AlertDescription className="text-white">
                    <strong>✓ Hidden QR Data Extracted!</strong>
                  </AlertDescription>
                </Alert>

                {extractedImage && (
                  <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800">
                    <Label className="text-white text-sm mb-2 block">Original Image</Label>
                    <img 
                      src={extractedImage} 
                      alt="Extracted" 
                      className="max-w-full max-h-32 mx-auto rounded"
                    />
                  </div>
                )}

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Label className="text-white text-sm mb-2 block">Extracted QR Payload</Label>
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-white text-sm font-mono break-all">{decodedData}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(decodedData)}`}
                    alt="Extracted QR"
                    className="max-w-full"
                  />
                </div>
              </div>
            )}

            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertDescription className="text-xs text-white">
                <strong>Security Note:</strong> This extraction only works on images created with LSB encoding. Regular images won't contain hidden data.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}