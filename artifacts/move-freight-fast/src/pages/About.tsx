import { motion } from "framer-motion";
import { Users, Target, Rocket, Award, Shield, CheckCircle } from "lucide-react";
import heroCargo from "@assets/generated_images/hero-cargo.jpg"; // Reusing for hero banner

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative pt-32 pb-24 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={heroCargo} alt="Background" className="w-full h-full object-cover" />
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
              About Move Freight Fast
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Founded in 2008, we've built our reputation on reliability, technological innovation, and an unwavering commitment to our clients' success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p>
                  Move Freight Fast began with a simple premise: global logistics shouldn't be a black box. Our founders, veterans of the supply chain industry, recognized that businesses were losing millions not just in transit times, but in lack of visibility.
                </p>
                <p>
                  Over the past 15+ years, we have grown from a regional freight forwarder into a global logistics powerhouse. We didn't just expand our fleet; we invested heavily in technology, building proprietary systems that give our clients real-time control over their cargo.
                </p>
                <p>
                  Today, we handle over 25,000 active clients across 38 countries, managing complex supply chains for some of the world's most demanding industries.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl border border-border bg-card p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              <div className="relative z-10 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">2008</div>
                  <div className="text-primary font-medium">Year Founded</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">38</div>
                  <div className="text-primary font-medium">Countries Active</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">2M+</div>
                  <div className="text-primary font-medium">Shipments Handled</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">99.8%</div>
                  <div className="text-primary font-medium">On-Time Delivery</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background border border-border p-10 rounded-2xl hover:border-primary/30 transition-colors">
              <Target className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                To deliver excellence in logistics worldwide by combining deep industry expertise with cutting-edge technology. We aim to make global trade seamless, transparent, and highly efficient for businesses of all sizes.
              </p>
            </div>
            <div className="bg-background border border-border p-10 rounded-2xl hover:border-primary/30 transition-colors">
              <Rocket className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                To be the world's most trusted and innovative freight partner. We envision a future where supply chains are resilient, predictive, and entirely transparent—empowering businesses to grow without borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethos & Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-slate-400 text-lg">The principles that drive our operations and define our culture.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Shield, title: "Uncompromising Reliability", desc: "We understand that in logistics, promises are literal. We deliver on time, securely, every time." },
              { icon: Award, title: "Commitment to Excellence", desc: "We continually optimize our processes, train our people, and upgrade our technology to stay ahead." },
              { icon: Users, title: "Partnership Approach", desc: "We don't just move boxes; we integrate into your operations to become a true extension of your team." }
            ].map((value, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
