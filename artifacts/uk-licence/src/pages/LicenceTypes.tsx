import React from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { ShieldCheck, Truck, Car, Bike, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from 'framer-motion';

export function LicenceTypes() {
  return (
    <Layout>
      {/* Hero image banner */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden">
        <img
          src="/img/roundabout.jpg"
          alt="UK roundabout aerial view"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/20 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow">
              Driving licence categories
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          <div className="mb-8">
            <Link href="/" className="text-gov-blue hover:underline text-sm font-medium mb-4 inline-block">
              ← Back
            </Link>
            <p className="text-xl text-slate-700 leading-relaxed mb-8">
              Find out what vehicles you can drive and what the different categories on your driving licence mean.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="p-6 bg-blue-50 border-l-4 border-gov-blue mb-10 shadow-sm rounded-r">
              <div className="flex gap-3">
                <Info className="h-6 w-6 text-gov-blue shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mt-0 mb-2">Check your own licence</h3>
                  <p className="text-slate-700 mb-0">
                    You can check your driving record online to see what vehicles you can drive and if you have any penalty points.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3">
              <Car className="h-8 w-8 text-gov-blue" />
              Cars and light vehicles
            </h2>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[120px] font-bold text-slate-900">Category</TableHead>
                    <TableHead className="font-bold text-slate-900">What you can drive</TableHead>
                    <TableHead className="w-[120px] font-bold text-slate-900">Minimum age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-lg">B</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Cars</p>
                      <p className="text-sm text-slate-600">You can drive vehicles up to 3,500kg Maximum Authorised Mass (MAM) with up to 8 passenger seats.</p>
                      <p className="text-sm text-slate-600 mt-2">You can also tow a trailer up to 750kg MAM.</p>
                    </TableCell>
                    <TableCell>17</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-lg">B auto</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Automatic cars</p>
                      <p className="text-sm text-slate-600">You can drive a category B vehicle - but only an automatic one.</p>
                    </TableCell>
                    <TableCell>17</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-lg">BE</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Cars with trailers</p>
                      <p className="text-sm text-slate-600">You can drive a vehicle with a MAM of 3,500kg with a trailer.</p>
                      <p className="text-sm text-slate-600 mt-2">The size of the trailer depends on the BE 'valid from' date shown on your licence.</p>
                    </TableCell>
                    <TableCell>17</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6 flex items-center gap-3">
              <Bike className="h-8 w-8 text-gov-blue" />
              Motorcycles and mopeds
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[120px] font-bold text-slate-900">Category</TableHead>
                    <TableHead className="font-bold text-slate-900">What you can drive</TableHead>
                    <TableHead className="w-[120px] font-bold text-slate-900">Minimum age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-lg">AM</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Mopeds</p>
                      <p className="text-sm text-slate-600">You can drive 2-wheeled or 3-wheeled vehicles with a maximum design speed of over 25km/h but not more than 45km/h.</p>
                    </TableCell>
                    <TableCell>16</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-lg">A1</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Light motorcycles</p>
                      <p className="text-sm text-slate-600">You can drive light motor tricycles with a power output up to 15kW, and motorcycles with an engine size up to 125cc.</p>
                    </TableCell>
                    <TableCell>17</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-lg">A2</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Standard motorcycles</p>
                      <p className="text-sm text-slate-600">You can drive motorcycles with a power output up to 35kW.</p>
                    </TableCell>
                    <TableCell>19</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-lg">A</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Heavy motorcycles</p>
                      <p className="text-sm text-slate-600">You can drive motorcycles with a power output more than 35kW or a power to weight ratio more than 0.2kW/kg.</p>
                    </TableCell>
                    <TableCell>24</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6 flex items-center gap-3">
              <Truck className="h-8 w-8 text-gov-blue" />
              Medium and large vehicles
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[120px] font-bold text-slate-900">Category</TableHead>
                    <TableHead className="font-bold text-slate-900">What you can drive</TableHead>
                    <TableHead className="w-[120px] font-bold text-slate-900">Minimum age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-lg">C1</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Medium-sized vehicles</p>
                      <p className="text-sm text-slate-600">You can drive vehicles between 3,500 and 7,500kg MAM (with a trailer up to 750kg).</p>
                    </TableCell>
                    <TableCell>18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-lg">C</TableCell>
                    <TableCell>
                      <p className="mb-2 font-medium">Large vehicles</p>
                      <p className="text-sm text-slate-600">You can drive vehicles over 3,500kg with a trailer up to 750kg MAM.</p>
                    </TableCell>
                    <TableCell>21</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
