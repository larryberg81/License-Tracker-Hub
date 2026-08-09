import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, Map, Anchor, Plane, 
  Warehouse, Zap, Globe2, BarChart4, CheckCircle2 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import heroCargo from "@assets/generated_images/hero-cargo.jpg";
import truckFleet from "@assets/generated_images/truck-fleet.jpg";

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroCargo} 
            alt="Cargo ship at sea" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 max-w-7xl mx-auto pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Global Logistics Partner
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Your Trusted Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">Logistics Partner</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Delivering excellence across the globe with cutting-edge technology, unparalleled reliability, and intelligent supply chain solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/track" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-auto h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(8,145,178,0.4)] rounded-md">
                Track Shipment
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-auto h-14 px-8 text-base border border-primary/30 hover:bg-primary/10 bg-transparent text-white rounded-md">
                Get a Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-6 max-w-7xl py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "38", label: "Countries Reached" },
              { value: "25,000+", label: "Satisfied Clients" },
              { value: "24/7", label: "Global Support" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</span>
                <span className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Move Freight Fast?</h2>
            <p className="text-slate-400 text-lg">We provide end-to-end supply chain solutions tailored to your business needs, ensuring maximum efficiency and transparency.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Map, title: "Global Reach", desc: "Extensive network covering 38 countries with localized expertise." },
              { icon: Zap, title: "Technology Driven", desc: "Real-time tracking, predictive analytics, and automated reporting." },
              { icon: ShieldCheck, title: "Secure Infrastructure", desc: "Top-tier security protocols for high-value and sensitive cargo." },
              { icon: BarChart4, title: "Supply Chain Opt", desc: "Data-backed route optimization to reduce lead times and costs." },
              { icon: Warehouse, title: "Smart Distribution", desc: "Strategic warehousing facilities ensuring rapid regional deployment." },
              { icon: Globe2, title: "Fleet Management", desc: "Modern, eco-friendly fleet maintained to the highest standards." },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CORE SERVICES PREVIEW */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Logistics Services</h2>
              <p className="text-slate-400 text-lg">Comprehensive transport solutions designed for speed, scale, and certainty.</p>
            </div>
            <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-2 group text-primary hover:text-primary-foreground hover:bg-primary border border-primary/30 bg-transparent h-10 px-4 py-2 rounded-md">
              View All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Anchor, title: "Sea Freight", desc: "FCL and LCL shipping solutions for high-volume global commerce." },
              { icon: Plane, title: "Air Freight", desc: "Express delivery for time-critical cargo via premier carriers." },
              { icon: Warehouse, title: "Contract Logistics", desc: "Scalable warehousing and integrated distribution networks." },
            ].map((service, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden border border-border bg-background p-8 hover:border-primary/50 transition-colors">
                <div className="relative z-10">
                  <service.icon className="w-10 h-10 text-primary mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 mb-6">{service.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {[1, 2, 3].map((_, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> Feature {j + 1}
                      </li>
                    ))}
                  </ul>
                  <Link href="/services" className="inline-flex items-center text-primary font-medium group-hover:underline">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={truckFleet} 
            alt="Trucks on highway at night" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to move your freight?</h2>
            <p className="text-xl text-slate-300 mb-10">Partner with Move Freight Fast and experience logistics engineered for the modern supply chain. Fast, transparent, and built to scale.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                Request a Quote
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-14 px-8 text-base border border-white/20 text-white hover:bg-white/10 rounded-md">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
