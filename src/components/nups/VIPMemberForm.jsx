import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, MapPin, Phone, Mail, Shield, CreditCard, 
  Upload, Camera, AlertTriangle, Save, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function VIPMemberForm({ guest, onSave, onCancel }) {
  const [form, setForm] = useState({
    guest_name: guest?.guest_name || '',
    display_name: guest?.display_name || '',
    phone: guest?.phone || '',
    email: guest?.email || '',
    address_line1: guest?.address_line1 || '',
    address_line2: guest?.address_line2 || '',
    city: guest?.city || '',
    state: guest?.state || '',
    zip_code: guest?.zip_code || '',
    country: guest?.country || 'USA',
    date_of_birth: guest?.date_of_birth || '',
    government_id_type: guest?.government_id_type || '',
    government_id_number: guest?.government_id_number || '',
    government_id_expiry: guest?.government_id_expiry || '',
    emergency_contact_name: guest?.emergency_contact_name || '',
    emergency_contact_phone: guest?.emergency_contact_phone || '',
    emergency_contact_relationship: guest?.emergency_contact_relationship || '',
    vip_tier: guest?.vip_tier || 'Standard',
    preferences: guest?.preferences || '',
    allergies: guest?.allergies || '',
    notes: guest?.notes || '',
    membership_number: guest?.membership_number || ''
  });
  const [idPhotoFile, setIdPhotoFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return null;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return file_url;
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.guest_name) {
      toast.error('Full legal name is required');
      return;
    }
    if (!form.date_of_birth) {
      toast.error('Date of birth is required for age verification');
      return;
    }

    setSaving(true);
    try {
      let idUrl = guest?.id_photo_url;
      let profileUrl = guest?.profile_photo_url;

      if (idPhotoFile) {
        idUrl = await handleFileUpload(idPhotoFile, 'ID photo');
      }
      if (profilePhotoFile) {
        profileUrl = await handleFileUpload(profilePhotoFile, 'profile photo');
      }

      const memberNumber = form.membership_number || `VIP-${Date.now().toString(36).toUpperCase()}`;

      const data = {
        ...form,
        membership_number: memberNumber,
        id_photo_url: idUrl,
        profile_photo_url: profileUrl
      };

      if (guest?.id) {
        await base44.entities.VIPGuest.update(guest.id, data);
        toast.success('Member profile updated');
      } else {
        await base44.entities.VIPGuest.create(data);
        toast.success('New VIP member created');
      }

      onSave?.();
    } catch (err) {
      toast.error('Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="identity">ID & Verification</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-cyan-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Full Legal Name *</Label>
                  <Input
                    value={form.guest_name}
                    onChange={(e) => handleChange('guest_name', e.target.value)}
                    placeholder="As shown on ID"
                    className="bg-slate-900 border-slate-600"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Display Name / Alias</Label>
                  <Input
                    value={form.display_name}
                    onChange={(e) => handleChange('display_name', e.target.value)}
                    placeholder="Preferred name"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Date of Birth *</Label>
                  <Input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(555) 555-5555"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-slate-700">
                <Label className="text-amber-400 text-sm flex items-center gap-1 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Contact
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300 text-xs">Name</Label>
                    <Input
                      value={form.emergency_contact_name}
                      onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Phone</Label>
                    <Input
                      value={form.emergency_contact_phone}
                      onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Relationship</Label>
                    <Input
                      value={form.emergency_contact_relationship}
                      onChange={(e) => handleChange('emergency_contact_relationship', e.target.value)}
                      placeholder="Spouse, Parent, etc."
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address */}
        <TabsContent value="address">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-green-400" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Street Address</Label>
                <Input
                  value={form.address_line1}
                  onChange={(e) => handleChange('address_line1', e.target.value)}
                  placeholder="123 Main Street"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-300">Apt / Suite / Unit</Label>
                <Input
                  value={form.address_line2}
                  onChange={(e) => handleChange('address_line2', e.target.value)}
                  placeholder="Apt 4B"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label className="text-slate-300">City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">State</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="NV"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">ZIP</Label>
                  <Input
                    value={form.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="bg-slate-900 border-slate-600"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity & Verification */}
        <TabsContent value="identity">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Shield className="w-4 h-4 text-purple-400" />
                Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-300">ID Type</Label>
                  <Select value={form.government_id_type} onValueChange={(v) => handleChange('government_id_type', v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="Drivers License">Driver's License</SelectItem>
                      <SelectItem value="State ID">State ID</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Military ID">Military ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">ID Number (Last 4)</Label>
                  <Input
                    value={form.government_id_number}
                    onChange={(e) => handleChange('government_id_number', e.target.value.slice(-4))}
                    placeholder="XXXX"
                    maxLength={4}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">ID Expiry Date</Label>
                  <Input
                    type="date"
                    value={form.government_id_expiry}
                    onChange={(e) => handleChange('government_id_expiry', e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
              </div>

              {/* Photo Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <Label className="text-slate-300 mb-2 block">ID Photo Upload</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setIdPhotoFile(e.target.files[0])}
                      className="hidden"
                      id="id-upload"
                    />
                    <label htmlFor="id-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {idPhotoFile ? idPhotoFile.name : (guest?.id_photo_url ? 'ID on file ✓' : 'Click to upload ID')}
                      </p>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300 mb-2 block">Profile Photo</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-cyan-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setProfilePhotoFile(e.target.files[0])}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {profilePhotoFile ? profilePhotoFile.name : (guest?.profile_photo_url ? 'Photo on file ✓' : 'Click to upload photo')}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Membership Details */}
        <TabsContent value="membership">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Membership Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Member ID</Label>
                  <Input
                    value={form.membership_number}
                    onChange={(e) => handleChange('membership_number', e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">VIP Tier</Label>
                  <Select value={form.vip_tier} onValueChange={(v) => handleChange('vip_tier', v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Preferences (Drinks, Music, Seating)</Label>
                <Textarea
                  value={form.preferences}
                  onChange={(e) => handleChange('preferences', e.target.value)}
                  placeholder="Top-shelf whiskey, jazz music, booth seating..."
                  className="bg-slate-900 border-slate-600"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-slate-300">Allergies / Dietary Restrictions</Label>
                <Input
                  value={form.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  placeholder="None, peanuts, shellfish, etc."
                  className="bg-slate-900 border-slate-600"
                />
              </div>

              <div>
                <Label className="text-slate-300">Staff Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Internal notes about this member..."
                  className="bg-slate-900 border-slate-600"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {guest?.id ? 'Update Member' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
}