import React from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, CheckCircle2, User, CreditCard } from 'lucide-react';

export function HowToApply() {
  return (
    <Layout>
      <div className="bg-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          
          <div className="mb-8">
            <Link href="/" className="text-gov-blue hover:underline text-sm font-medium mb-4 inline-block">
              ← Back
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Apply for your first provisional driving licence
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed">
              Find out what you need, how much it costs, and how to apply for a provisional UK driving licence.
            </p>
          </div>

          <div className="bg-slate-50 border-y sm:border border-slate-200 -mx-4 sm:mx-0 p-6 sm:rounded-lg mb-12 shadow-sm">
            <h2 className="font-bold text-lg mb-3">Cost and timeline</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-2">
                <CreditCard className="h-5 w-5 text-slate-500 shrink-0" />
                <span><strong className="block text-slate-900 text-base">£34.00</strong> when applying online</span>
              </div>
              <div className="flex gap-2">
                <FileText className="h-5 w-5 text-slate-500 shrink-0" />
                <span><strong className="block text-slate-900 text-base">1 week</strong> usual processing time</span>
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What you need</h2>
            <p className="text-slate-700 mb-6 text-lg">
              To apply online you need:
            </p>
            <ul className="space-y-4 mb-10 pl-2">
              {[
                "an identity document unless you have a valid UK biometric passport",
                "addresses where you've lived over the last 3 years",
                "your National Insurance number if you know it"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-lg items-start">
                  <CheckCircle2 className="h-6 w-6 text-gov-green shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 mb-10 shadow-sm rounded-r">
              <h3 className="font-bold text-lg text-slate-900 mt-0 mb-2">Eyesight rules</h3>
              <p className="text-slate-700 mb-0">
                You must be able to read (with glasses or contact lenses, if necessary) a car number plate made after 1 September 2001 from 20 metres.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">When you can apply</h2>
            <p className="text-slate-700 mb-4">
              You can get your provisional licence and then start driving a car when you're 17. 
            </p>
            <p className="text-slate-700 mb-10">
              You can apply for your provisional licence when you're 15 years and 9 months old. You can drive a car when you are 16 if you get, or have applied for, the enhanced rate of the mobility component of Personal Independence Payment (PIP).
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Apply online</h2>
            <p className="text-slate-700 mb-8">
              It's faster and cheaper to apply online. Have your documents and payment card ready.
            </p>

            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "inline-flex mt-4 mb-12 bg-gov-green hover:bg-green-700 text-white font-bold text-lg px-8 shadow-md")}>
              Start application
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>

            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-t border-slate-200 pt-10">Apply by post</h2>
            <p className="text-slate-700 mb-4">
              You can apply by post by completing a D1 form 'Application for a driving licence'.
            </p>
            <p className="text-slate-700 mb-4">
              You can get a form from most Post Offices or order one online from the DVLA. It costs £43 to apply by post and takes longer.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
