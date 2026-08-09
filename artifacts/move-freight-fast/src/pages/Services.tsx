import { motion } from "framer-motion";
import { Link } from "wouter";
import { Truck, Plane, Anchor, Warehouse, FileCheck2, Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";

import cargoPlane from "@assets/generated_images/cargo-plane.jpg";

export function Services() {
  const services = [
    {
      id: "road-freight",
      icon: Truck,
      title: "Worldwide Haulage",
      description: "Comprehensive road freight solutions providing door-to-door delivery across continents.",
      features: [
        "Full Truckload (FTL) & Less Than Truckload (LTL)",
        "Express and time-critical delivery",
        "Specialized fleet for temperature-controlled cargo",
        "Real-time GPS tracking and geofencing"
      ]
    },
    {
      id: "air-freight",
      icon: Plane,
      title: "International Air Freight",
      description: "When speed is paramount, our air freight services ensure your cargo reaches its destination swiftly and safely.",
      features: [
        "Express and standard air cargo",
        "Aircraft chartering for oversized loads",
        "Consolidation services",
        "Airport-to-airport and door-to-door options"
      ]
    },
    {
      id: "sea-freight",
      icon: Anchor,
      title: "International Sea Freight",
      description: "Cost-effective maritime transport for high-volume global commerce, backed by premier carrier partnerships.",
      features: [
        "Full Container Load (FCL) & Less than Container Load (LCL)",
        "Reefer (refrigerated) container options",
        "Break bulk and Roll-on/Roll-off (RoRo)",
        "Port handling and inland distribution"
      ]
    }
  ];

  const additionalServices = [
    {
      icon: Warehouse,
      title: "Warehousing & Distribution",
      desc: "Strategic storage solutions with advanced inventory management systems for seamless order fulfillment."
    },
    {
      icon: FileCheck2,
      title: "Customs Clearance",
      desc: "Expert brokerage to navigate complex international trade regulations and prevent costly delays."
    },
    {
      icon: Lightbulb,
      title: "Supply Chain Consulting",
      desc: "Data-driven analysis to optimize routing, reduce overhead, and increase your operational efficiency."
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative pt-32 pb-24 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={cargoPlane} alt="Cargo plane at night" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Our Services
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              End-to-end logistics solutions engineered for reliability, transparency, and speed. Whatever you need to move, we have the infrastructure to handle it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                <div className="flex-1 w-full lg:w-1/2">
                  <div className="bg-card border border-border p-12 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute -right-10 -top-10 text-primary/5 group-hover:text-primary/10 transition-colors">
                      <service.icon className="w-64 h-64" />
                    </div>
                    <service.icon className="w-12 h-12 text-primary mb-8 relative z-10" />
                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">{service.title}</h2>
                    <p className="text-slate-400 text-lg mb-8 relative z-10 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-4 relative z-10">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                          <span className="text-slate-300 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-1 w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-12">
                  <h3 className="text-2xl font-bold text-white mb-4">Why choose our {service.title.toLowerCase()}?</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    We maintain strict quality control and partner only with vetted carriers. Our dedicated agents manage your shipment from origin to destination, ensuring complete visibility and immediate issue resolution.
                  </p>
                  <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-fit border border-primary/30 text-primary hover:bg-primary/10 h-10 px-4 py-2 rounded-md">
                    Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Solutions */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Integrated Supply Chain Solutions</h2>
            <p className="text-slate-400 text-lg">Beyond transport, we provide the critical infrastructure to keep your business moving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background border border-border p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-6">Need a custom logistics plan?</h2>
          <p className="text-slate-400 text-lg mb-8">Our experts are ready to design a solution tailored specifically to your supply chain requirements.</p>
          <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-lg rounded-md">
            Contact Our Team
          </Link>
        </div>
      </section>
    </div>
  );
}
