import { Link } from 'wouter';
import { Layout } from '@/components/Layout';

export function Contact() {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-12">
        <Link href="/" className="text-gov-blue underline">Back to home</Link>
        <h1 className="text-4xl font-black mt-6 mb-5">Assistance and contact information</h1>
        <p className="text-xl text-slate-700 mb-8">
          UK Licence Assistance is an independent assistance service, not DVLA or a government agency.
          We cannot issue a licence, change a government record or confirm an official licensing decision.
        </p>
        <section className="border-l-4 border-amber-500 bg-amber-50 p-6 mb-8">
          <h2 className="text-xl font-bold mb-3">Online enquiries are not available yet</h2>
          <p className="text-slate-700">
            A support mailbox and enquiry-delivery service have not been configured.
            No enquiry is submitted or confirmation email sent from this page.
            Do not send identity documents, licence numbers, addresses or payment details.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact DVLA directly</h2>
          <p className="text-slate-700">
            For an official application, licensing decision or change to your personal details,
            use the government service. You do not need to use an independent assistance service.
          </p>
          <a className="inline-block font-bold text-gov-blue underline" href="https://www.gov.uk/contact-the-dvla">
            Open the official DVLA contact page on GOV.UK
          </a>
        </section>
      </div>
    </Layout>
  );
}
