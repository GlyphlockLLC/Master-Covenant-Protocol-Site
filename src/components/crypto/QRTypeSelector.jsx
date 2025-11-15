import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Link as LinkIcon, Type, Mail, Phone, Wifi, User, MapPin, Calendar } from "lucide-react";

export default function QRTypeSelector({ qrType, setQrType, qrTypes }) {
  const iconMap = {
    url: LinkIcon,
    text: Type,
    email: Mail,
    phone: Phone,
    sms: Phone,
    wifi: Wifi,
    vcard: User,
    location: MapPin,
    event: Calendar
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Select QR Code Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {qrTypes.map(type => {
            const Icon = iconMap[type.id];
            return (
              <button
                key={type.id}
                onClick={() => setQrType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  qrType === type.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-xs font-semibold text-white">{type.name}</div>
                {type.needsSecurity && (
                  <Shield className="w-3 h-3 mx-auto mt-1 text-green-400" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}