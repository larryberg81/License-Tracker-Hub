import React from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { LicenceCard } from '@/components/LicenceCard';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, ArrowRight, ShieldCheck, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-white pb-12 pt-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                Apply for, renew or replace a UK driving licence
              </h1>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed">
                Check what you need to do to get a provisional or full driving licence, track your application, and manage your driving records online.
              </p>
              
              <div className="p-6 bg-slate-100 border-l-4 border-gov-blue rounded-r-md mb-8 shadow-sm">
                <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gov-blue" />
                  Quick and secure
                </h2>
                <p className="text-slate-700">
                  Applying online is the fastest way to get your driving licence. You'll usually receive your licence within one week if you apply online.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/how-to-apply" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto bg-gov-green hover:bg-green-700 text-white font-bold text-lg px-8 shadow-md inline-flex")}>
                  Start now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/track" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto border-2 border-gov-blue text-gov-blue font-bold text-lg hover:bg-slate-50 inline-flex")}>
                  Track application
                </Link>
              </div>
            </motion.div>

            <div className="flex justify-center lg:justify-end items-center relative py-12 hidden md:flex">
              <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-3xl transform scale-150 -z-10"></div>
              <LicenceCard className="rotate-3 lg:rotate-6 transform hover:rotate-0 transition-transform duration-500 z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Popular services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Apply for your first provisional driving licence',
                desc: 'You can apply for a provisional driving licence when you\'re 15 years and 9 months old.',
                link: '/how-to-apply'
              },
              {
                title: 'Renew your driving licence',
                desc: 'You must renew your photocard licence every 10 years - you\'ll receive a reminder before your current licence ends.',
                link: '/how-to-apply'
              },
              {
                title: 'Replace a lost, stolen, damaged or destroyed driving licence',
                desc: 'Get a replacement driving licence online if yours gets lost, stolen, damaged or destroyed.',
                link: '/how-to-apply'
              },
              {
                title: 'Track your driving licence application',
                desc: 'Check the status of your driving licence application, whether you applied online or by post.',
                link: '/track'
              },
              {
                title: 'Check what vehicles you can drive',
                desc: 'Find out what vehicles you can drive using the categories on your driving licence.',
                link: '/licence-types'
              },
              {
                title: 'Change the address on your driving licence',
                desc: 'You must update your driving licence, vehicle log book (V5C), Direct Debit for vehicle tax and other details when you move.',
                link: '/how-to-apply'
              }
            ].map((service, idx) => (
              <Link key={idx} href={service.link} className="block group">
                <div className="h-full p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-gov-blue cursor-pointer">
                  <h3 className="text-xl font-bold text-gov-blue mb-3 group-hover:underline underline-offset-2 flex items-start gap-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-4">{service.desc}</p>
                  <span className="text-gov-blue font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Find out more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
