/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ProcurementDoc } from './types';
import { Printer, Eye, Edit3, Download, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PEA_LOGO_URL = "https://upload.wikimedia.org/wikipedia/th/thumb/0/05/Provincial_Electricity_Authority_Logo.svg/1200px-Provincial_Electricity_Authority_Logo.svg.png";

const initialData: ProcurementDoc = {
  from: "ผจศ.กปบ.(ก3)",
  to: "กปบ.(ก3)",
  docNumber: "ก.3 กปบ.(จศ) /",
  docYear: "2569",
  date: "16 มี.ค. 2569",
  subject: "ขออนุมัติความเห็นชอบดำเนินการจัดซื้อสว่านโรตารี่ไร้สาย จำนวน 1 เครื่อง",
  recipient: "อก.ปบ.(ก3)",
  through: "รก.ปบ.(ก3)",
  infoSection: {
    requester: "ผจศ.กปบ.(ก3)",
    approvalRef: "ก.3 กบฟ.(งป) 117/2568",
    approvalDate: "16 ม.ค. 2569",
  },
  considerationSection: {
    requester: "ผจศ.กปบ.(ก3)",
    item: "สว่านโรตารี่ไร้สาย",
    budgetYear: "2569",
    wbs: "I-69-I-OPDXX.19.2301",
  },
  signer1: {
    name: "นายภานุพงค์ เจนสุริยะกุล",
    position: "หผ.จศ กปบ.(ก3)",
  },
  signer2: {
    name: "นายเลอพงศ์ แก่นจันทร์",
    position: "อก.ปบ.(ก3)",
  },
  department: "แผนกจัดการงานศูนย์สั่งการ",
  phone: "10500-32",
  logoUrl: "https://upload.wikimedia.org/wikipedia/th/thumb/0/05/Provincial_Electricity_Authority_Logo.svg/512px-Provincial_Electricity_Authority_Logo.svg.png",
};

export default function App() {
  const [data, setData] = useState<ProcurementDoc>(initialData);
  const [isPreview, setIsPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProcurementDoc] as any),
          [child]: value
        }
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Edit3 size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ระบบจัดทำหนังสือขอความเห็นชอบ</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Procurement Document Generator</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isPreview ? (
            <button
              onClick={() => setIsPreview(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 font-medium"
            >
              <Eye size={18} />
              ดูตัวอย่างก่อนพิมพ์
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-slate-700 px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 font-medium"
              >
                <ChevronLeft size={18} />
                กลับไปแก้ไข
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 font-medium"
              >
                <Printer size={18} />
                พิมพ์เอกสาร / บันทึกเป็น PDF
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {!isPreview ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 bg-stone-50/50">
                <h2 className="text-2xl font-bold text-slate-800">รายละเอียดเอกสาร</h2>
                <p className="text-slate-500 mt-1">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อจัดทำหนังสือขอความเห็นชอบ</p>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Header Info */}
                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">ข้อมูลส่วนหัว</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">จาก</label>
                      <input name="from" value={data.from} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ถึง</label>
                      <input name="to" value={data.to} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">เลขที่</label>
                      <input name="docNumber" value={data.docNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ปี (พ.ศ.)</label>
                      <input name="docYear" value={data.docYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">วันที่</label>
                    <input name="date" value={data.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">เรื่อง</label>
                    <textarea name="subject" value={data.subject} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30 resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">URL โลโก้ (หากไม่แสดง)</label>
                    <input name="logoUrl" value={data.logoUrl} onChange={handleChange} placeholder="วางลิงก์รูปภาพโลโก้ที่นี่" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">เรียน</label>
                      <input name="recipient" value={data.recipient} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ผ่าน</label>
                      <input name="through" value={data.through} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                  </div>
                </section>

                {/* Content Sections */}
                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">เนื้อหา 1. ข้อมูล</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ผู้ขอจัดซื้อ</label>
                      <input name="infoSection.requester" value={data.infoSection.requester} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ตามอนุมัติเลขที่</label>
                      <input name="infoSection.approvalRef" value={data.infoSection.approvalRef} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ลงวันที่</label>
                      <input name="infoSection.approvalDate" value={data.infoSection.approvalDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2 mt-8">เนื้อหา 2. ข้อพิจารณา</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">รายการที่จัดซื้อ</label>
                      <input name="considerationSection.item" value={data.considerationSection.item} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ปีงบประมาณ</label>
                        <input name="considerationSection.budgetYear" value={data.considerationSection.budgetYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">รหัส WBS</label>
                        <input name="considerationSection.wbs" value={data.considerationSection.wbs} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Signers */}
                <section className="space-y-6 md:col-span-2">
                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">ผู้ลงนาม</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
                      <p className="text-xs font-bold text-purple-600 uppercase">ผู้เสนอ</p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล</label>
                          <input name="signer1.name" value={data.signer1.name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">ตำแหน่ง</label>
                          <input name="signer1.position" value={data.signer1.position} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
                      <p className="text-xs font-bold text-purple-600 uppercase">ผู้อนุมัติ</p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล</label>
                          <input name="signer2.name" value={data.signer2.name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">ตำแหน่ง</label>
                          <input name="signer2.position" value={data.signer2.position} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer Info */}
                <section className="space-y-6 md:col-span-2">
                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">ข้อมูลส่วนท้าย</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">แผนก/กอง</label>
                      <input name="department" value={data.department} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">เบอร์โทรศัพท์</label>
                      <input name="phone" value={data.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-stone-50/30" />
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div 
                ref={printRef}
                className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[25mm] text-black print:shadow-none print:p-0 print:m-0"
                style={{ 
                  fontFamily: "'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', sans-serif",
                  fontSize: "16pt",
                  lineHeight: "1.1",
                  textRendering: "optimizeLegibility"
                }}
              >
                {/* Document Header with Logo - Left Aligned */}
                <div className="flex flex-col items-start mb-8">
                  <img 
                    src={data.logoUrl} 
                    alt="PEA Logo" 
                    className="w-24 h-24 object-contain" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=PEA+LOGO";
                    }}
                  />
                  <div className="text-left mt-1">
                    <h2 className="text-[16pt] font-bold leading-none">การไฟฟ้าส่วนภูมิภาค</h2>
                    <p className="text-[10pt] font-bold uppercase tracking-tight">PROVINCIAL ELECTRICITY AUTHORITY</p>
                  </div>
                </div>

                {/* Document Metadata - Grid for precise alignment */}
                <div className="grid grid-cols-[80px_1fr_80px_1fr] gap-y-1 mb-8">
                  <span className="font-bold">จาก</span>
                  <span>{data.from}</span>
                  <span className="font-bold">ถึง</span>
                  <span>{data.to}</span>

                  <span className="font-bold">เลขที่</span>
                  <span>{data.docNumber}{data.docYear}</span>
                  <span className="font-bold">วันที่</span>
                  <span>{data.date}</span>

                  <span className="font-bold">เรื่อง</span>
                  <span className="col-span-3">{data.subject}</span>

                  <span className="font-bold">เรียน</span>
                  <span className="col-span-3">{data.recipient} ผ่าน {data.through}</span>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                  <section>
                    <h3 className="font-bold mb-1 ml-[2.5cm]">๑. ข้อมูล</h3>
                    <p className="ml-[3.5cm]">
                      {data.infoSection.requester} จัดซื้อตามอนุมัติที่ {data.infoSection.approvalRef} ลว. {data.infoSection.approvalDate}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold mb-1 ml-[2.5cm]">๒. ข้อพิจารณา</h3>
                    <p className="ml-[3.5cm]">
                      {data.considerationSection.requester} ได้พิจารณาแล้ว เพื่อให้มีความพร้อมในการใช้งาน จึงจำเป็นต้องทำการ
                      จัดซื้อ{data.considerationSection.item} จึงเห็นควรดำเนินการจัดซื้อดังกล่าว โดยใช้ราคากลางอ้างอิงตามพระราชบัญญัติการ
                      จัดซื้อจัดจ้างและบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ จึงขออนุมัติความเห็นชอบดำเนินการจัดซื้ออุปกรณ์ดังกล่าว 
                      โดยให้เบิกจ่ายจากงบทำการประจำปี {data.considerationSection.budgetYear} จากงบลงทุน หมายเลขงาน (WBS) 
                      {data.considerationSection.wbs} ต่อไป
                    </p>
                    <p className="ml-[3.5cm] mt-4">
                      จึงเรียนมาเพื่อโปรดพิจารณาหากเห็นชอบและโปรดลงนามให้ต่อไป
                    </p>
                  </section>
                </div>

                {/* Signatures */}
                <div className="mt-20 flex justify-end pr-20">
                  <div className="text-center w-80 space-y-1">
                    <p className="mb-10">(......................................................)</p>
                    <p>({data.signer1.name})</p>
                    <p>{data.signer1.position}</p>
                  </div>
                </div>

                <div className="mt-16 space-y-12">
                  <div className="ml-[0cm]">
                    <p>-{data.from} เห็นชอบอนุมัติให้ดำเนินการ</p>
                  </div>
                  
                  <div className="flex justify-end pr-20">
                    <div className="text-center w-80 space-y-1">
                      <p className="mb-10">(......................................................)</p>
                      <p>({data.signer2.name})</p>
                      <p>{data.signer2.position}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-10 text-[12pt] text-slate-600">
                  <p>{data.department}</p>
                  <p>เบอร์โทร {data.phone}</p>
                </div>
              </div>

              <div className="mt-8 max-w-[210mm] w-full bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-blue-800 print:hidden">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Printer size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm">คำแนะนำการบันทึกเป็น PDF:</p>
                  <p className="text-sm opacity-90">เมื่อกดปุ่มพิมพ์ ให้เลือก "ปลายทาง" (Destination) เป็น <strong>"บันทึกเป็น PDF" (Save as PDF)</strong> เพื่อดาวน์โหลดไฟล์ลงเครื่องครับ</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
        
        body {
          font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        @media print {
          @page {
            size: A4;
            margin: 2.5cm 2.5cm 2.5cm 2.5cm;
          }
          body {
            background-color: white !important;
            margin: 0;
            padding: 0;
            font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', sans-serif !important;
            line-height: 1.1;
          }
          .min-h-screen {
            min-height: auto;
            background-color: white !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
          }
        }
      `}} />
    </div>
  );
}
