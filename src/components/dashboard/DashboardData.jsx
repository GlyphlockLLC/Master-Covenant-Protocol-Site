export const navItems = [
  {
    category: "General",
    items: [
      { id: "Consultation", label: "Consultations", entity: "Consultation" },
      { id: "ServiceUsage", label: "Service Usage Logs", entity: "ServiceUsage" },
    ],
  },
  {
    category: "Point of Sale (POS)",
    items: [
      { id: "POSProduct", label: "Products", entity: "POSProduct" },
      { id: "POSInventoryBatch", label: "Product Batches", entity: "POSInventoryBatch" },
      { id: "POSTransaction", label: "Transactions", entity: "POSTransaction" },
      { id: "POSCustomer", label: "Customers", entity: "POSCustomer" },
      { id: "POSCampaign", label: "Campaigns", entity: "POSCampaign" },
      { id: "POSLocation", label: "Locations", entity: "POSLocation" },
      { id: "POSBatch", label: "Cash Batches", entity: "POSBatch" },
      { id: "POSZReport", label: "End-of-Day Reports (Z)", entity: "POSZReport" },
    ],
  },
  {
    category: "QR Security & Analytics",
    items: [
      { id: "QRGenHistory", label: "QR Generation History", entity: "QRGenHistory" },
      { id: "QRThreatLog", label: "QR Threat Logs", entity: "QRThreatLog" },
      { id: "QRAIScore", label: "QR AI Risk Scores", entity: "QRAIScore" },
    ],
  },
  {
    category: "HSSS Security",
    items: [
      { id: "HotzoneMap", label: "Hotzone Maps", entity: "HotzoneMap" },
      { id: "HotzoneThreat", label: "Hotzone Threats", entity: "HotzoneThreat" },
    ],
  },
  {
    category: "Hospitality",
    items: [
      { id: "Entertainer", label: "Entertainers", entity: "Entertainer" },
      { id: "EntertainerShift", label: "Entertainer Shifts", entity: "EntertainerShift" },
      { id: "VIPRoom", label: "VIP Rooms", entity: "VIPRoom" },
      { id: "VIPGuest", label: "VIP Guests", entity: "VIPGuest" },
    ],
  },
  {
    category: "Products & Services",
    items: [
      { id: "Product", label: "Company Products", entity: "Product" },
    ],
  },
];