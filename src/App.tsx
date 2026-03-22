/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ProcurementDoc, FormType } from './types';
import { Printer, Eye, Edit3, Download, ChevronLeft, FileText, CheckCircle2, ClipboardList, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PEA_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <circle cx="150" cy="150" r="140" fill="#7B2CBF"/>
  <circle cx="150" cy="150" r="110" fill="white"/>
  <path d="M150 70 C105 70 70 105 70 150 C70 195 105 230 150 230 C195 230 230 195 230 150 C230 105 195 70 150 70 Z M150 90 C183 90 210 117 210 150 C210 183 183 210 150 210 C117 210 90 183 90 150 C90 117 117 90 150 90 Z" fill="#7B2CBF"/>
</svg>
`;

const initialData: ProcurementDoc = {
  from: 'ผจฟ.1',
  to: 'อก.ปบ.(ก3)',
  docNumber: 'ก.3-001/2567',
  docYear: '',
  date: '22 มีนาคม 2567',
  subject: 'รายงานผลการพิจารณาและขออนุมัติจ้างเหมาทำความสะอาด ผจฟ.1 ประจำเดือน เมษายน - กันยายน 2567',
  recipient: 'อก.ปบ.(ก3)',
  through: '',
  department: 'แผนกปฏิบัติการและบำรุงรักษา',
  phone: '0-4351-1234',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Logo_of_the_Provincial_Electricity_Authority_of_Thailand.svg',
  item: 'จ้างเหมาทำความสะอาด',
  budgetYear: '2567',
  wbs: 'WBS-123456',
  unitName: 'กฟส.บางละมุง',
  monthStart: 'ตุลาคม 2566',
  monthEnd: 'กันยายน 2567',
  parentUnit: 'กฟภ.จ.ชลบุรี',
  stationCount: '1',
  stationList: 'กฟส.บางละมุง',
  accountCode: '5301010',
  costCenter: '1234567',
  signer1Unit: 'กฟส.บางละมุง',
  infoSection: {
    requester: 'แผนกปฏิบัติการและบำรุงรักษา',
    approvalRef: 'ก.3-001/2567',
    approvalDate: '22 มีนาคม 2567',
  },
  considerationSection: {
    requester: 'แผนกปฏิบัติการและบำรุงรักษา',
  },
  committee: [
    { name: 'นายสมชาย ใจดี', position: 'ประธานกรรมการ' },
    { name: 'นายสมหญิง รักดี', position: 'กรรมการ' },
    { name: 'นายสมพร มีชัย', position: 'กรรมการ' },
  ],
  procurementMethod: 'เฉพาะเจาะจง',
  estimatedPrice: 10700,
  reason: 'เนื่องจากมีความจำเป็นต้องจ้างเหมาทำความสะอาด เพื่อความเป็นระเบียบเรียบร้อยและถูกสุขลักษณะ',
  supplierName: 'ห้างหุ้นส่วนจำกัด สะอาดใส',
  contractNumber: 'จซ.123/2567',
  deliveryDate: '30 กันยายน 2567',
  priceBeforeVat: 10000,
  vatAmount: 700,
  totalAmount: 10700,
  totalAmountThai: 'หนึ่งหมื่นเจ็ดร้อยบาทถ้วน',
  receiver: { name: 'นายสมชาย ใจดี', position: 'ผจก.กฟส.บางละมุง' },
  signer1: { name: 'นายสมชาย ใจดี', position: 'ผจก.กฟส.บางละมุง' },
  signer2: { name: 'นายสมหมาย มั่นคง', position: 'ผจก.กฟภ.จ.ชลบุรี' },
};

export default function App() {
  const [data, setData] = useState<ProcurementDoc>(initialData);
  const [isPreview, setIsPreview] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>('SUMMARY');
  const printRef = useRef<HTMLDivElement>(null);

  const handleCommitteeChange = (index: number, field: 'name' | 'position', value: string) => {
    setData(prev => {
      const newCommittee = [...prev.committee];
      newCommittee[index] = { ...newCommittee[index], [field]: value };
      return { ...prev, committee: newCommittee };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProcurementDoc] as any),
          [child]: finalValue
        }
      }));
    } else {
      setData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-900">
      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
        
        body {
          font-family: 'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          /* Hide everything by default */
          body * {
            visibility: hidden !important;
            display: none !important;
          }
          
          /* Show only the print container and its contents */
          html, body, #root, #root > div, main, .content-container, .print-wrapper-outer, .print-container, .print-container * {
            visibility: visible !important;
            display: block !important;
          }

          /* Special handling for tables to keep their layout */
          .print-container table {
            display: table !important;
          }
          .print-container tr {
            display: table-row !important;
          }
          .print-container td, .print-container th {
            display: table-cell !important;
          }
          .print-container thead {
            display: table-header-group !important;
          }
          .print-container tbody {
            display: table-row-group !important;
          }

          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-wrapper-outer {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-container {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 20mm 15mm 15mm 25mm !important; /* Standard Thai Gov margins: Top 2cm, Right 1.5cm, Bottom 1.5cm, Left 2.5cm */
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            font-family: 'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif !important;
            font-size: 14pt !important;
          }
          
          /* Ensure images show up */
          img {
            -webkit-print-color-adjust: exact;
          }
        }
      `}} />
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
        {/* Form Selector */}
        <div className="flex flex-col gap-2 mb-8 print:hidden">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">เลือกหัวข้อที่ต้องการพิมพ์:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'APPROVAL', label: '1. ขอความเห็นชอบ', icon: FileText },
              { id: 'ASSIGNMENT', label: '2. มอบหมายคุณลักษณะ', icon: ClipboardList },
              { id: 'REPORT', label: '3. รายงานขอซื้อ/จ้าง', icon: FileCheck },
              { id: 'SUMMARY', label: '4. สรุปผล/ตรวจรับ', icon: CheckCircle2 },
            ].map((form) => (
              <button
                key={form.id}
                onClick={() => setCurrentForm(form.id as FormType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  currentForm === form.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <form.icon size={16} />
                {form.label}
              </button>
            ))}
          </div>
        </div>

        <div className="content-container">
          {!isPreview ? (
            <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
              <div className="p-8 border-b border-stone-100 bg-stone-50/50">
                <h2 className="text-2xl font-bold text-slate-800">
                  {currentForm === 'APPROVAL' && '1. บันทึกขอความเห็นชอบดำเนินการ'}
                  {currentForm === 'ASSIGNMENT' && '2. มอบหมายจัดทำคุณลักษณะ'}
                  {currentForm === 'REPORT' && '3. รายงานขอจัดซื้อหรือจัดจ้าง'}
                  {currentForm === 'SUMMARY' && '4. รายงานสรุปผลพิจารณาและตรวจรับ'}
                </h2>
                <p className="text-slate-500 mt-1">กรุณากรอกข้อมูลที่เปลี่ยนแปลงในส่วนนี้ ข้อมูลพื้นฐานจะถูกเชื่อมโยงกันอัตโนมัติ</p>
              </div>

              <div className="p-8 space-y-10">
                {/* Editable Red Fields */}
                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest border-b border-red-100 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    ส่วนที่แก้ไขได้ (ตัวอักษรสีแดงในแบบฟอร์ม)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Header Info */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-100">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ส่วนราชการ</label>
                        <input name="from" value={data.from} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">โทร</label>
                        <input name="phone" value={data.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ที่ (เลขที่หนังสือ)</label>
                        <input name="docNumber" value={data.docNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">วันที่</label>
                        <input name="date" value={data.date} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">เรื่อง</label>
                        <input name="subject" value={data.subject} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">เรียน</label>
                        <input name="to" value={data.to} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ชื่อหน่วยปฏิบัติงาน / สถานีไฟฟ้า</label>
                      <input name="unitName" value={data.unitName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none font-medium" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">เดือนเริ่มต้น</label>
                      <input name="monthStart" value={data.monthStart} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">เดือนสิ้นสุด</label>
                      <input name="monthEnd" value={data.monthEnd} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">จำนวนสถานีไฟฟ้า (ตัวเลข)</label>
                      <input name="stationCount" value={data.stationCount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">รายชื่อสถานีไฟฟ้าที่รับผิดชอบ</label>
                      <input name="stationList" value={data.stationList} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                    </div>

                    {/* Financial Info */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-100">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ชื่อผู้รับจ้าง (Supplier)</label>
                        <input name="supplierName" value={data.supplierName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ราคาไม่รวม VAT</label>
                        <input type="number" name="priceBeforeVat" value={data.priceBeforeVat} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ภาษีมูลค่าเพิ่ม (VAT)</label>
                        <input type="number" name="vatAmount" value={data.vatAmount} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ราคาสุทธิ (รวม VAT)</label>
                        <input type="number" name="totalAmount" value={data.totalAmount} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ราคาสุทธิ (ตัวอักษร)</label>
                        <input name="totalAmountThai" value={data.totalAmountThai} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">รหัสบัญชี</label>
                        <input name="accountCode" value={data.accountCode} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">รหัสศูนย์ต้นทุน</label>
                        <input name="costCenter" value={data.costCenter} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                    </div>

                    {/* Signers */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
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
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">หน่วยงาน</label>
                            <input name="signer1Unit" value={data.signer1Unit} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
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
                  </div>
                </section>

                <div className="md:col-span-2 flex justify-between items-center pt-8 border-t border-stone-100">
                  <div className="text-sm text-slate-500 italic">
                    * ข้อมูลจะถูกบันทึกและเชื่อมโยงไปยังฟอร์มถัดไปโดยอัตโนมัติ
                  </div>
                  <div className="flex gap-3">
                    {currentForm !== 'APPROVAL' && (
                      <button
                        onClick={() => {
                          const forms: FormType[] = ['APPROVAL', 'ASSIGNMENT', 'REPORT', 'SUMMARY'];
                          const idx = forms.indexOf(currentForm);
                          setCurrentForm(forms[idx - 1]);
                        }}
                        className="px-6 py-2.5 rounded-xl border border-stone-200 text-slate-600 hover:bg-stone-50 transition-all font-medium"
                      >
                        ย้อนกลับ
                      </button>
                    )}
                    {currentForm !== 'SUMMARY' && (
                      <button
                        onClick={() => {
                          const forms: FormType[] = ['APPROVAL', 'ASSIGNMENT', 'REPORT', 'SUMMARY'];
                          const idx = forms.indexOf(currentForm);
                          setCurrentForm(forms[idx + 1]);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-8 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all font-medium flex items-center gap-2"
                      >
                        ถัดไป
                        <ChevronLeft size={18} className="rotate-180" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="print-wrapper-outer p-4 md:p-8 flex justify-center">
              <div className="print-container bg-white shadow-2xl border border-stone-200 p-[1.5cm] min-h-[297mm] w-[210mm] text-[14pt] leading-normal font-serif text-black relative flex flex-col">
                {/* Header */}
                <div className="flex items-start mb-2">
                  <div className="flex flex-col items-center w-40 shrink-0">
                    {data.logoUrl ? (
                      <img src={data.logoUrl} alt="PEA Logo" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: PEA_LOGO_SVG }} className="w-16 h-16" />
                    )}
                    <div className="text-center mt-1 leading-tight">
                      <p className="text-[11pt] font-bold">การไฟฟ้าส่วนภูมิภาค</p>
                      <p className="text-[7pt]">PROVINCIAL ELECTRICITY AUTHORITY</p>
                    </div>
                  </div>
                  <div className="flex-1 text-center pt-8">
                    <h2 className="text-[29pt] font-bold">บันทึกข้อความ</h2>
                  </div>
                  <div className="w-40 shrink-0"></div> {/* Spacer for symmetry */}
                </div>

                <div className="space-y-1 mb-4 text-[14pt]">
                  <div className="flex gap-2">
                    <span className="font-bold shrink-0">ส่วนราชการ</span>
                    <span className="border-b border-dotted border-black flex-1 px-2">
                      <span className="text-red-600">{data.from}</span> โทร <span className="text-red-600">{data.phone}</span>
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 flex-1">
                      <span className="font-bold shrink-0">ที่</span>
                      <span className="border-b border-dotted border-black flex-1 px-2 text-red-600">{data.docNumber}</span>
                    </div>
                    <div className="flex gap-2 flex-1">
                      <span className="font-bold shrink-0">วันที่</span>
                      <span className="border-b border-dotted border-black flex-1 px-2 text-red-600">{data.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold shrink-0">เรื่อง</span>
                    <span className="border-b border-dotted border-black flex-1 px-2 text-red-600 font-bold">{data.subject}</span>
                  </div>
                </div>

                <div className="text-[14pt] mb-4">
                  <p><span className="font-bold">เรียน</span> <span className="text-red-600">{data.to}</span></p>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {currentForm === 'APPROVAL' && (
                    <div className="space-y-6 text-[14pt]">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๑. ข้อมูล</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          <span className="text-red-600">{data.infoSection.requester}</span> จัดซื้อตามอนุมัติที่ <span className="text-red-600">{data.infoSection.approvalRef}</span> ลว. <span className="text-red-600">{data.infoSection.approvalDate}</span>
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๒. ข้อพิจารณา</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          <span className="text-red-600">{data.from}</span> ได้พิจารณาแล้ว เพื่อให้มีความพร้อมในการใช้งาน จึงจำเป็นต้องทำการ
                          จัดซื้อ<span className="text-red-600">{data.item}</span> จึงเห็นควรดำเนินการจัดซื้อดังกล่าว โดยใช้ราคากลางอ้างอิงตามพระราชบัญญัติการ
                          จัดซื้อจัดจ้างและบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ จึงขออนุมัติความเห็นชอบดำเนินการจัดซื้ออุปกรณ์ดังกล่าว 
                          โดยให้เบิกจ่ายจากงบทำการประจำปี <span className="text-red-600">{data.budgetYear}</span> จากงบลงทุน หมายเลขงาน (WBS) 
                          <span className="text-red-600">{data.wbs}</span> ต่อไป
                        </p>
                        <p className="indent-[2.5cm] mt-6">
                          จึงเรียนมาเพื่อโปรดพิจารณาหากเห็นชอบและโปรดลงนามให้ต่อไป
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'ASSIGNMENT' && (
                    <div className="space-y-6 text-[14pt]">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๑. ข้อมูล</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          ตามที่ <span className="text-red-600">{data.from}</span> ได้รับอนุมัติให้ดำเนินการจัดซื้อ <span className="text-red-600">{data.item}</span> ตามบันทึกที่ <span className="text-red-600">{data.docNumber}</span><span className="text-red-600">{data.docYear}</span> ลว. <span className="text-red-600">{data.date}</span> นั้น
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๒. ข้อพิจารณา</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          เพื่อให้การดำเนินการจัดทำคุณลักษณะของพัสดุเป็นไปด้วยความเรียบร้อยและถูกต้องตามระเบียบ 
                          จึงขอแต่งตั้งคณะกรรมการจัดทำคุณลักษณะและกำหนดราคากลาง ดังนี้
                        </p>
                        <div className="ml-[3.5cm] mt-4 space-y-2">
                          {data.committee.map((member, index) => (
                            <p key={index}>{index + 1}. <span className="text-red-600">{member.name}</span> ตำแหน่ง <span className="text-red-600">{member.position}</span></p>
                          ))}
                        </div>
                        <p className="indent-[2.5cm] mt-8">
                          จึงเรียนมาเพื่อโปรดพิจารณาแต่งตั้งคณะกรรมการดังกล่าวต่อไป
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'REPORT' && (
                    <div className="space-y-6 text-[14pt]">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๑. ความเป็นมา</h3>
                        <p className="indent-[2.5cm] leading-relaxed text-red-600">
                          {data.reason}
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๒. รายละเอียดการจัดซื้อ</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          ดำเนินการจัดซื้อ <span className="text-red-600">{data.item}</span> โดยวิธี <span className="text-red-600">{data.procurementMethod}</span> 
                          ราคากลางเป็นเงิน <span className="text-red-600">{data.estimatedPrice.toLocaleString()}</span> บาท (รวมภาษีมูลค่าเพิ่ม)
                          โดยใช้เงินงบประมาณปี <span className="text-red-600">{data.budgetYear}</span> หมายเลขงาน <span className="text-red-600">{data.wbs}</span>
                        </p>
                        <p className="indent-[2.5cm] mt-8">
                          จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติรายงานขอซื้อ/จ้างดังกล่าว
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'SUMMARY' && (
                    <div className="space-y-4 text-[14pt] leading-[1.2]">
                      <section className="mt-1">
                        <p className="indent-[2.5cm] leading-relaxed">
                          ตามที่ <span className="text-red-600">{data.from}</span> ได้ดำเนินการจ้างเหมาทำความสะอาด <span className="text-red-600">{data.unitName}</span> ประจำเดือน <span className="text-red-600">{data.monthStart}</span> - <span className="text-red-600">{data.monthEnd}</span> โดยวิธีเฉพาะเจาะจง นั้น
                        </p>
                        
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="font-bold">๑. ข้อมูล</p>
                            <p className="indent-[1.5cm]">
                              <span className="text-red-600">{data.from}</span> มีความประสงค์จะจ้างเหมาทำความสะอาด <span className="text-red-600">{data.unitName}</span> จำนวน <span className="text-red-600">{data.stationCount}</span> สถานี ได้แก่ <span className="text-red-600">{data.stationList}</span> ประจำเดือน <span className="text-red-600">{data.monthStart}</span> - <span className="text-red-600">{data.monthEnd}</span>
                            </p>
                          </div>

                          <div>
                            <p className="font-bold">๒. ข้อพิจารณา</p>
                            <p className="indent-[1.5cm]">
                              คณะกรรมการกำหนดราคากลาง ได้กำหนดราคากลางเป็นเงิน <span className="text-red-600">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท (รวมภาษีมูลค่าเพิ่ม) และ <span className="text-red-600">{data.from}</span> ได้เจรจาตกลงจ้างกับ <span className="text-red-600">{data.supplierName}</span> เป็นเงิน <span className="text-red-600">{data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท ภาษีมูลค่าเพิ่ม <span className="text-red-600">{data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท รวมเป็นเงินทั้งสิ้น <span className="text-red-600">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท (<span className="text-red-600">{data.totalAmountThai}</span>) ซึ่งเป็นราคาที่รวมภาษีมูลค่าเพิ่มแล้ว
                            </p>
                          </div>

                          <div>
                            <p className="font-bold">๓. ข้อเสนอ</p>
                            <p className="indent-[1.5cm]">
                              <span className="text-red-600">{data.from}</span> พิจารณาแล้ว เห็นสมควรจ้างเหมาทำความสะอาด จาก <span className="text-red-600">{data.supplierName}</span> เป็นเงินทั้งสิ้น <span className="text-red-600">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท (<span className="text-red-600">{data.totalAmountThai}</span>) รวมภาษีมูลค่าเพิ่ม
                            </p>
                          </div>
                        </div>

                        <p className="mt-6 indent-[1.5cm] leading-relaxed">
                          จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบขอได้โปรดอนุมัติให้สั่งจ้างจากผู้เสนอราคาดังกล่าว พร้อมทั้งแจ้งคณะกรรมการตรวจรับดำเนินการต่อไปด้วย จะเป็นพระคุณ
                        </p>
                      </section>

                      {/* Signature Section */}
                      <div className="mt-8 grid grid-cols-2 gap-8">
                        <div className="border border-black p-4 min-h-[150px]">
                          <p className="font-bold text-center mb-4">คำสั่ง</p>
                          <p className="mb-8">- อนุมัติ</p>
                          <div className="text-center mt-auto">
                            <p className="mb-1">ลงชื่อ...........................................................</p>
                            <p>( <span className="text-red-600">{data.signer2.name}</span> )</p>
                            <p><span className="text-red-600">{data.signer2.position}</span></p>
                            <p>........./........../..........</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-end pb-4">
                          <div className="text-center space-y-1">
                            <p className="mb-8">ลงชื่อ...........................................................</p>
                            <p>( <span className="text-red-600">{data.signer1.name}</span> )</p>
                            <p><span className="text-red-600">{data.signer1.position}</span></p>
                            <p><span className="text-red-600">{data.signer1Unit}</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Footer Table */}
                      <div className="mt-8">
                        <table className="w-full border-collapse border border-black text-[10pt]">
                          <thead>
                            <tr>
                              <th className="border border-black p-1 text-center">รหัสบัญชี</th>
                              <th className="border border-black p-1 text-center">ศูนย์ต้นทุน</th>
                              <th className="border border-black p-1 text-center">งานหลัก</th>
                              <th className="border border-black p-1 text-center">งานรอง</th>
                              <th className="border border-black p-1 text-center">งบประมาณ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-black p-1 text-center font-mono"><span className="text-red-600">{data.accountCode}</span></td>
                              <td className="border border-black p-1 text-center font-mono"><span className="text-red-600">{data.costCenter}</span></td>
                              <td className="border border-black p-1 text-center"></td>
                              <td className="border border-black p-1 text-center"></td>
                              <td className="border border-black p-1 text-center"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>

                {/* Signatures (Hidden for Form 4 as it has custom grid) */}
                {currentForm !== 'SUMMARY' && (
                  <div className="mt-auto">
                    <div className="flex justify-end pr-10">
                      <div className="text-center w-80 space-y-1">
                        <p className="mb-10">ลงชื่อ..............................................................</p>
                        <p>( {data.signer1.name} )</p>
                        <p>ตำแหน่ง {data.signer1.position}</p>
                      </div>
                    </div>

                    <div className="mt-12 space-y-8">
                      <div className="ml-[1cm]">
                        <p className="font-bold underline">ความเห็นของ {data.signer2.position}</p>
                        <p className="mt-2">- เห็นชอบและอนุมัติให้ดำเนินการได้</p>
                      </div>
                      
                      <div className="flex justify-end pr-10">
                        <div className="text-center w-80 space-y-1">
                          <p className="mb-10">ลงชื่อ..............................................................</p>
                          <p>( {data.signer2.name} )</p>
                          <p>ตำแหน่ง {data.signer2.position}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-10 text-[14pt] text-slate-600 border-t border-stone-100">
                      <p>{data.department}</p>
                      <p>เบอร์โทร {data.phone}</p>
                    </div>
                  </div>
                )}
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
            </div>
          )}
        </div>
      </main>

      {/* Print Styles */}
    </div>
  );
}
