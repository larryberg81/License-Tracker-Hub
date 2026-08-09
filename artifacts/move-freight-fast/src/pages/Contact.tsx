import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Clock, Building2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import warehouseTech from "@assets/generated_images/warehouse-tech.jpg";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please provide more details about your inquiry"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    // In a real app, send data to backend. 
    console.log("Form submitted:", data);
    setIsSubmitted(true);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative pt-32 pb-24 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={warehouseTech} alt="Modern warehouse" className="w-full h-full object-cover" />
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
              Contact Us
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Get in touch with our logistics experts. Whether you need a quote, have a question about our services, or want to discuss a custom solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            
            {/* Contact Info Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Global Headquarters</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Our central operations team is available around the clock to ensure your supply chain never stops.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Address</h3>
                      <p className="text-slate-400 text-sm">100 Logistics Way<br/>Enterprise Zone<br/>London, E16 2QX<br/>United Kingdom</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Phone</h3>
                      <p className="text-slate-400 text-sm mb-1">+44 (0) 20 7123 4567</p>
                      <p className="text-slate-500 text-xs">24/7 Support Line</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <p className="text-slate-400 text-sm mb-1">info@movefreightfast.com</p>
                      <p className="text-slate-400 text-sm">quotes@movefreightfast.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Office Hours</h3>
                      <p className="text-slate-400 text-sm">Monday - Friday: 08:00 - 18:00 (GMT)</p>
                      <p className="text-slate-500 text-xs mt-1">Operations team available 24/7</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Form Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl">
                {isSubmitted ? (
                  <div className="text-center py-16" data-testid="contact-success">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Request Received</h3>
                    <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                      Thank you for reaching out. One of our logistics specialists will contact you within 2 business hours.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      variant="outline"
                      className="border-border text-foreground hover:bg-background"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-8">Request a Quote</h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" className="bg-background border-border text-white h-12" {...field} data-testid="input-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Acme Logistics" className="bg-background border-border text-white h-12" {...field} data-testid="input-company" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" type="email" className="bg-background border-border text-white h-12" {...field} data-testid="input-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 000-0000" className="bg-background border-border text-white h-12" {...field} data-testid="input-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="service"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">Service Required</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background border-border text-white h-12" data-testid="select-service">
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-card border-border">
                                  <SelectItem value="road">Worldwide Haulage (Road)</SelectItem>
                                  <SelectItem value="air">International Air Freight</SelectItem>
                                  <SelectItem value="sea">International Sea Freight</SelectItem>
                                  <SelectItem value="warehousing">Warehousing & Distribution</SelectItem>
                                  <SelectItem value="consulting">Supply Chain Consulting</SelectItem>
                                  <SelectItem value="other">Other / Not Sure</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">Project Details</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide origin, destination, estimated volume, and timeframe if known..." 
                                  className="bg-background border-border text-white min-h-[150px] resize-none" 
                                  {...field} 
                                  data-testid="input-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg mt-4" data-testid="button-submit">
                          Submit Request
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
