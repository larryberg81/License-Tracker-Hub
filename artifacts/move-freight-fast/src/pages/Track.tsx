import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Package, MapPin, Navigation, Map, 
  CheckCircle2, Clock, AlertCircle, Ship, Plane, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Mock Data
type ShipmentStatus = "Delivered" | "In Transit" | "Processing" | "Exception";
type EventType = "accepted" | "customs" | "transit" | "out-for-delivery" | "delivered";

interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  type: EventType;
}

interface TrackingData {
  id: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  eta: string;
  mode: "air" | "sea" | "road";
  events: TrackingEvent[];
}

const mockDatabase: Record<string, TrackingData> = {
  "MFF-2024-001": {
    id: "MFF-2024-001",
    status: "Delivered",
    origin: "London, UK",
    destination: "Dubai, UAE",
    eta: "Arrived 2 days ago",
    mode: "air",
    events: [
      { timestamp: "2024-10-15 14:30", location: "Dubai, UAE", description: "Delivered to consignee", type: "delivered" },
      { timestamp: "2024-10-15 08:15", location: "Dubai, UAE", description: "Out for delivery", type: "out-for-delivery" },
      { timestamp: "2024-10-14 18:45", location: "DXB Airport, UAE", description: "Customs cleared", type: "customs" },
      { timestamp: "2024-10-14 09:20", location: "LHR Airport, UK", description: "Departed origin facility", type: "transit" },
      { timestamp: "2024-10-13 10:00", location: "London, UK", description: "Shipment accepted", type: "accepted" }
    ]
  },
  "MFF-2024-002": {
    id: "MFF-2024-002",
    status: "In Transit",
    origin: "Shanghai, CN",
    destination: "Rotterdam, NL",
    eta: "Expected in 4 days",
    mode: "sea",
    events: [
      { timestamp: "2024-10-18 10:00", location: "Indian Ocean", description: "Vessel in transit", type: "transit" },
      { timestamp: "2024-10-10 16:30", location: "Port of Shanghai, CN", description: "Loaded onto vessel", type: "transit" },
      { timestamp: "2024-10-09 11:45", location: "Shanghai, CN", description: "Export customs cleared", type: "customs" },
      { timestamp: "2024-10-08 09:00", location: "Shanghai, CN", description: "Shipment accepted", type: "accepted" }
    ]
  },
  "MFF-2024-003": {
    id: "MFF-2024-003",
    status: "Processing",
    origin: "New York, USA",
    destination: "Lagos, NG",
    eta: "Expected in 10 days",
    mode: "road",
    events: [
      { timestamp: "2024-10-20 08:30", location: "New York, USA", description: "Shipment accepted and processing", type: "accepted" }
    ]
  }
};

const timelineSteps: { label: string; type: EventType }[] = [
  { label: "Order Placed", type: "accepted" },
  { label: "Processing", type: "customs" },
  { label: "In Transit", type: "transit" },
  { label: "Out for Delivery", type: "out-for-delivery" },
  { label: "Delivered", type: "delivered" },
];

export function Track() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackingData | null | "not-found" | "empty">("empty");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingNumber.trim().toUpperCase();
    if (!query) {
      setResult("empty" as any);
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    
    // Simulate network delay
    setTimeout(() => {
      const data = mockDatabase[query];
      if (data) {
        setResult(data);
      } else {
        setResult("not-found");
      }
      setIsSearching(false);
    }, 800);
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case "Delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Transit": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Processing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getModeIcon = (mode: "air" | "sea" | "road") => {
    switch (mode) {
      case "air": return <Plane className="w-5 h-5" />;
      case "sea": return <Ship className="w-5 h-5" />;
      case "road": return <Truck className="w-5 h-5" />;
    }
  };

  const currentStepIndex = (result: TrackingData) => {
    if (result.status === "Delivered") return 4;
    if (result.events.some(e => e.type === "out-for-delivery")) return 3;
    if (result.status === "In Transit" || result.events.some(e => e.type === "transit")) return 2;
    if (result.events.some(e => e.type === "customs")) return 1;
    return 0;
  };

  return (
    <div className="flex flex-col w-full min-h-[80vh]">
      {/* Tracking Header */}
      <section className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Track Your Shipment</h1>
          <p className="text-slate-400 text-lg mb-8">Enter your tracking number to get real-time updates on your cargo.</p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Tracking ID (e.g., MFF-2024-001)"
                className="w-full h-14 pl-12 pr-4 bg-background border-border text-white text-lg rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                data-testid="input-tracking"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching}
              className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              data-testid="button-track"
            >
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </form>
          
          <div className="mt-4 text-sm text-slate-500">
            Try these: <button type="button" onClick={() => setTrackingNumber("MFF-2024-001")} className="text-primary hover:underline mx-1">MFF-2024-001</button> | 
            <button type="button" onClick={() => setTrackingNumber("MFF-2024-002")} className="text-primary hover:underline mx-1">MFF-2024-002</button> | 
            <button type="button" onClick={() => setTrackingNumber("MFF-2024-003")} className="text-primary hover:underline mx-1">MFF-2024-003</button>
          </div>
        </div>
      </section>

      {/* Results Area */}
      <section className="flex-1 bg-background py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Empty State */}
            {result === "empty" && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-card border border-border rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Ready to track</h3>
                <p className="text-slate-400">Enter a valid tracking ID above to see shipment progress.</p>
              </motion.div>
            )}

            {/* Not Found State */}
            {result === "not-found" && (
              <motion.div 
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
                data-testid="tracking-not-found"
              >
                <div className="w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Tracking number not found</h3>
                <p className="text-slate-400 mb-6">We couldn't find any information for "{searchQuery}". Please check the number and try again.</p>
                <Button variant="outline" onClick={() => {setResult("empty" as any); setTrackingNumber("");}} className="border-border hover:bg-card">
                  Clear Search
                </Button>
              </motion.div>
            )}

            {/* Result State */}
            {result && typeof result !== "string" && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
                data-testid="tracking-result"
              >
                {/* Header Card */}
                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Tracking ID</div>
                        <div className="text-2xl font-bold text-white font-mono">{result.id}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          {getModeIcon(result.mode)}
                        </div>
                        <div className={`px-4 py-2 rounded-full border text-sm font-semibold tracking-wide ${getStatusColor(result.status)}`}>
                          {result.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 bg-background/50 flex flex-col md:flex-row justify-between items-center gap-8 relative">
                      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 w-full">
                        <div className="text-sm text-slate-400 mb-1">Origin</div>
                        <div className="text-lg font-semibold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" /> {result.origin}
                        </div>
                      </div>
                      
                      {/* Connection Line */}
                      <div className="hidden md:flex flex-1 items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-dashed border-border"></div>
                        </div>
                        <div className="bg-card px-3 text-slate-400 z-10">
                          <Navigation className="w-5 h-5 rotate-90" />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right z-10 w-full">
                        <div className="text-sm text-slate-400 mb-1">Destination</div>
                        <div className="text-lg font-semibold text-white flex items-center gap-2">
                          {result.destination} <MapPin className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border-t border-border flex justify-center items-center gap-2 text-primary font-medium text-sm">
                      <Clock className="w-4 h-4" /> ETA: {result.eta}
                    </div>
                  </CardContent>
                </Card>

                {/* Visual Timeline */}
                <div className="bg-card border border-border rounded-xl p-8">
                  <h3 className="font-semibold text-white mb-8">Shipment Progress</h3>
                  <div className="relative">
                    {/* Background track line */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-background rounded"></div>
                    {/* Active track line */}
                    <div 
                      className="absolute top-5 left-0 h-1 bg-primary rounded transition-all duration-1000"
                      style={{ width: `${(currentStepIndex(result) / (timelineSteps.length - 1)) * 100}%` }}
                    ></div>
                    
                    <div className="relative flex justify-between w-full">
                      {timelineSteps.map((step, index) => {
                        const isActive = index <= currentStepIndex(result);
                        const isCurrent = index === currentStepIndex(result);
                        return (
                          <div key={index} className="flex flex-col items-center relative group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-card transition-colors duration-300 ${
                              isActive ? "bg-primary text-white" : "bg-slate-700 text-slate-400"
                            } ${isCurrent ? "shadow-[0_0_0_4px_rgba(8,145,178,0.2)]" : ""}`}>
                              {isActive ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 bg-current rounded-full" />}
                            </div>
                            <div className={`mt-3 text-xs md:text-sm font-medium absolute top-full w-24 text-center ${
                              isActive ? "text-white" : "text-slate-500"
                            }`}>
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="h-12"></div> {/* Spacer for absolute text */}
                </div>

                {/* Detailed History */}
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h3 className="font-semibold text-white mb-6">Detailed History</h3>
                  <div className="space-y-6">
                    {result.events.map((event, index) => (
                      <div key={index} className="flex gap-4 relative">
                        {/* Vertical line connecting events */}
                        {index !== result.events.length - 1 && (
                          <div className="absolute top-8 left-[11px] bottom-[-24px] w-0.5 bg-border z-0"></div>
                        )}
                        
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 mt-1 ${
                          index === 0 ? "bg-primary text-white shadow-[0_0_10px_rgba(8,145,178,0.5)]" : "bg-slate-800 border border-slate-600 text-slate-400"
                        }`}>
                          {index === 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                        </div>
                        
                        <div className="flex-1 pb-2">
                          <div className={`font-medium ${index === 0 ? "text-white" : "text-slate-300"}`}>
                            {event.description}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Map className="w-3 h-3" /> {event.location}</span>
                            <span className="hidden md:inline text-slate-700">•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
