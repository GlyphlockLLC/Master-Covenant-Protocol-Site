import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Lock, Eye, EyeOff, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Steganography() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Image className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Steganography</span> Tool
            </h1>
            <p className="text-xl text-gray-400">
              Hide encrypted data within images using LSB encoding
            </p>
          </div>

          <Tabs defaultValue="encode" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger value="encode">Encode Message</TabsTrigger>
              <TabsTrigger value="decode">Decode Message</TabsTrigger>
            </TabsList>

            <TabsContent value="encode">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Hide Message in Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="encode-image">Select Image</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-500/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="encode-image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="encode-image" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                          {imageFile ? imageFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Secret Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter the message you want to hide..."
                      rows={5}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Encryption Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to encrypt message"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <Button
                    disabled={!imageFile || !message}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Encode Message
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Extract Hidden Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="decode-image">Select Image</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-500/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="decode-image"
                        accept="image/*"
                        className="hidden"
                      />
                      <label htmlFor="decode-image" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Click to upload image with hidden message</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="decode-password">Decryption Password</Label>
                    <Input
                      id="decode-password"
                      type="password"
                      placeholder="Enter password to decrypt message"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Decode Message
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <Lock className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">AES Encryption</h3>
                <p className="text-sm text-gray-400">Military-grade encryption</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <EyeOff className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">LSB Encoding</h3>
                <p className="text-sm text-gray-400">Invisible to the eye</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <Image className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Lossless</h3>
                <p className="text-sm text-gray-400">No quality degradation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}