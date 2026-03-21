/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ProcurementDoc, FormType } from './types';
import { Printer, Eye, Edit3, Download, ChevronLeft, FileText, CheckCircle2, ClipboardList, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PEA_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100" height="100">
  <circle cx="150" cy="150" r="140" fill="none" stroke="#7B2CBF" stroke-width="12"/>
  <path d="M100 80 H200 V140 H140 V220 H100 Z" fill="#7B2CBF"/>
  <path d="M160 140 H220 L160 220 Z" fill="#7B2CBF"/>
  <path d="M130 140 L150 170 L170 140 Z" fill="#7B2CBF"/>
</svg>
`;

const initialData: ProcurementDoc = {
  from: "ผจศ.ปบ.(ก3)",
  to: "กปบ.(ก3)",
  docNumber: "ก.3 กปบ.(จศ) /",
  docYear: "2569",
  date: "16 มี.ค. 2569",
  subject: "รายงานสรุปผลการพิจารณาตรวจรับ และอนุมัติจ่ายเงินซื้อสว่านโรตารี่ไร้สาย",
  recipient: "อก.ปบ.(ก3)",
  through: "รก.ปบ.(ก3)",
  department: "แผนกจัดการงานศูนย์สั่งการ",
  phone: "10500-32",
  logoUrl: "",
  item: "สว่านโรตารี่ไร้สาย",
  budgetYear: "2569",
  wbs: "I-69-I-OPDXX.19.2301",
  
  infoSection: {
    requester: "ผจศ.ปบ.(ก3)",
    approvalRef: "ก.3 กบฟ.(งป) 117/2568",
    approvalDate: "16 ม.ค. 2569",
  },
  considerationSection: {
    requester: "ผจศ.ปบ.(ก3)",
  },
  committee: [
    { name: "นายพชริศ กรุงกาญจนา", position: "ประธานกรรมการ" },
    { name: "นายโชคชัย ชัยมาลา", position: "กรรมการ" },
    { name: "นายธนาคาร สว่างเรือง", position: "กรรมการ" },
  ],
  procurementMethod: "โดยวิธีเฉพาะเจาะจง",
  estimatedPrice: 15000,
  reason: "เพื่อใช้ในการปฏิบัติงานซ่อมบำรุงอุปกรณ์ในศูนย์สั่งการ",
  supplierName: "บริษัท เอ็นดับเบิ้ลยู วินซ์ จำกัด (สำนักงานใหญ่)",
  contractNumber: "PO-69-001",
  deliveryDate: "30 มี.ค. 2569",
  priceBeforeVat: 13780,
  vatAmount: 964.60,
  totalAmount: 14744.60,
  totalAmountThai: "หนึ่งหมื่นสี่พันเจ็ดร้อยสี่สิบสี่บาทหกสิบสตางค์",
  receiver: { name: "นายกฤษณะ ปอยงาม", position: "ชผ.จศ.กปบ.(ก3)" },
  signer1: {
    name: "นายภานุพงศ์ เจนสุริยะกุล",
    position: "หผ.จศ.กปบ.(ก3)",
  },
  signer2: {
    name: "นายเลอพงศ์ แก่นจันทร์",
    position: "อก.ปบ.(ก3)",
  },
};

export default function App() {
  const [data, setData] = useState<ProcurementDoc>(initialData);
  const [isPreview, setIsPreview] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>('APPROVAL');
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
          font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', sans-serif;
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
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            font-family: 'TH Sarabun New', 'TH Sarabun PSK', 'Sarabun', sans-serif !important;
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
        {!isPreview && (
          <div className="flex flex-wrap gap-2 mb-8">
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
        )}

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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">รายการหลัก</label>
                      <input name="item" value={data.item} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">รหัส WBS</label>
                      <input name="wbs" value={data.wbs} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                    </div>
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
                  {currentForm === 'APPROVAL' && (
                    <>
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
                    </>
                  )}

                  {currentForm === 'ASSIGNMENT' && (
                    <>
                      <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">คณะกรรมการกำหนดคุณลักษณะ</h3>
                      <div className="space-y-4">
                        {data.committee.map((member, index) => (
                          <div key={index} className="p-4 rounded-xl border border-stone-100 bg-stone-50/30 space-y-3">
                            <p className="text-xs font-bold text-purple-600 uppercase">ลำดับที่ {index + 1}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล</label>
                                <input 
                                  value={member.name} 
                                  onChange={(e) => handleCommitteeChange(index, 'name', e.target.value)} 
                                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" 
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">ตำแหน่งในคณะกรรมการ</label>
                                <input 
                                  value={member.position} 
                                  onChange={(e) => handleCommitteeChange(index, 'position', e.target.value)} 
                                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {currentForm === 'REPORT' && (
                    <>
                      <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">รายละเอียดการจัดซื้อจัดจ้าง</h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">วิธีการจัดหา</label>
                          <input name="procurementMethod" value={data.procurementMethod} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">ราคากลาง (บาท)</label>
                          <input type="number" name="estimatedPrice" value={data.estimatedPrice} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">เหตุผลความจำเป็น</label>
                          <textarea name="reason" value={data.reason} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30 resize-none" />
                        </div>
                      </div>
                    </>
                  )}

                  {currentForm === 'SUMMARY' && (
                    <>
                      <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2">สรุปผลและตรวจรับ</h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">ชื่อผู้ขาย/ผู้รับจ้าง</label>
                          <input name="supplierName" value={data.supplierName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">ราคาไม่รวม VAT (บาท)</label>
                            <input type="number" name="priceBeforeVat" value={data.priceBeforeVat} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">ภาษีมูลค่าเพิ่ม (บาท)</label>
                            <input type="number" name="vatAmount" value={data.vatAmount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">จำนวนเงินรวมสุทธิ (บาท)</label>
                            <input type="number" name="totalAmount" value={data.totalAmount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">จำนวนเงินตัวอักษร</label>
                            <input name="totalAmountThai" value={data.totalAmountThai} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">เลขที่สัญญา/ใบสั่งซื้อ</label>
                            <input name="contractNumber" value={data.contractNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">กำหนดส่งมอบ</label>
                            <input name="deliveryDate" value={data.deliveryDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest border-b border-purple-100 pb-2 mt-4">ผู้รับของ</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">ชื่อผู้รับของ</label>
                            <input name="receiver.name" value={data.receiver.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">ตำแหน่ง</label>
                            <input name="receiver.position" value={data.receiver.position} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-stone-50/30" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
              <div className="print-container bg-white shadow-2xl border border-stone-200 p-[1.5cm] min-h-[297mm] w-[210mm] text-[15pt] leading-normal font-serif text-black relative flex flex-col">
                {/* Header */}
                <div className="flex items-start mb-4">
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
                    <h2 className="text-4xl font-bold font-serif">บันทึกข้อความ</h2>
                  </div>
                  <div className="w-40 shrink-0"></div> {/* Spacer for symmetry */}
                </div>

                <div className="space-y-1 mb-6 text-[15pt]">
                  <div className="flex gap-8">
                    <div className="flex flex-1">
                      <span className="font-bold w-14 shrink-0">จาก</span>
                      <span className="flex-1 border-b border-dotted border-black/40 pb-0.5">{data.from}</span>
                    </div>
                    <div className="flex flex-1">
                      <span className="font-bold w-14 shrink-0">ถึง</span>
                      <span className="flex-1 border-b border-dotted border-black/40 pb-0.5">{data.to}</span>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="flex flex-1">
                      <span className="font-bold w-14 shrink-0">เลขที่</span>
                      <span className="flex-1 border-b border-dotted border-black/40 pb-0.5">{data.docNumber} {data.docYear}</span>
                    </div>
                    <div className="flex flex-1">
                      <span className="font-bold w-14 shrink-0">วันที่</span>
                      <span className="flex-1 border-b border-dotted border-black/40 pb-0.5">{data.date}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-14 shrink-0">เรื่อง</span>
                    <span className="flex-1 border-b border-dotted border-black/40 pb-0.5">{data.subject}</span>
                  </div>
                </div>

                <div className="mb-6 text-[15pt]">
                  <span className="font-bold">เรียน</span> {data.recipient} {data.through && <span className="ml-2">ผ่าน {data.through}</span>}
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {currentForm === 'APPROVAL' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๑. ข้อมูล</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          {data.infoSection.requester} จัดซื้อตามอนุมัติที่ {data.infoSection.approvalRef} ลว. {data.infoSection.approvalDate}
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๒. ข้อพิจารณา</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          {data.from} ได้พิจารณาแล้ว เพื่อให้มีความพร้อมในการใช้งาน จึงจำเป็นต้องทำการ
                          จัดซื้อ{data.item} จึงเห็นควรดำเนินการจัดซื้อดังกล่าว โดยใช้ราคากลางอ้างอิงตามพระราชบัญญัติการ
                          จัดซื้อจัดจ้างและบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ จึงขออนุมัติความเห็นชอบดำเนินการจัดซื้ออุปกรณ์ดังกล่าว 
                          โดยให้เบิกจ่ายจากงบทำการประจำปี {data.budgetYear} จากงบลงทุน หมายเลขงาน (WBS) 
                          {data.wbs} ต่อไป
                        </p>
                        <p className="indent-[2.5cm] mt-6">
                          จึงเรียนมาเพื่อโปรดพิจารณาหากเห็นชอบและโปรดลงนามให้ต่อไป
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'ASSIGNMENT' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๑. ข้อมูล</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          ตามที่ {data.from} ได้รับอนุมัติให้ดำเนินการจัดซื้อ {data.item} ตามบันทึกที่ {data.docNumber}{data.docYear} ลว. {data.date} นั้น
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
                            <p key={index}>{index + 1}. {member.name} ตำแหน่ง {member.position}</p>
                          ))}
                        </div>
                        <p className="indent-[2.5cm] mt-8">
                          จึงเรียนมาเพื่อโปรดพิจารณาแต่งตั้งคณะกรรมการดังกล่าวต่อไป
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'REPORT' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๑. ความเป็นมา</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          {data.reason}
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">๒. รายละเอียดการจัดซื้อ</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          ดำเนินการจัดซื้อ {data.item} โดยวิธี {data.procurementMethod} 
                          ราคากลางเป็นเงิน {data.estimatedPrice.toLocaleString()} บาท (รวมภาษีมูลค่าเพิ่ม)
                          โดยใช้เงินงบประมาณปี {data.budgetYear} หมายเลขงาน {data.wbs}
                        </p>
                        <p className="indent-[2.5cm] mt-8">
                          จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติรายงานขอซื้อ/จ้างดังกล่าว
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'SUMMARY' && (
                    <div className="space-y-4">
                      <section className="mt-1">
                        <p className="indent-[2.5cm] leading-relaxed">
                          ตามที่ {data.from} ดำเนินการซื้อ{data.item}โดยวิธี{data.procurementMethod} ขอรายงานผลการพิจารณาการจัดซื้อ ดังนี้
                        </p>
                        
                        <table className="w-full mt-4 border-collapse border border-black text-[14pt]">
                          <thead>
                            <tr className="bg-stone-50 font-bold">
                              <th className="border border-black p-2 w-12 text-center font-bold">ที่</th>
                              <th className="border border-black p-2 text-center font-bold">รายการ</th>
                              <th className="border border-black p-2 text-center w-32 font-bold">ราคาที่เสนอ</th>
                              <th className="border border-black p-2 text-center w-32 font-bold">ภาษีมูลค่าเพิ่ม</th>
                              <th className="border border-black p-2 text-center w-40 font-bold">ราคาที่ตกลงซื้อ<br/>(รวมภาษีมูลค่าเพิ่ม)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-black p-2 text-center">๑</td>
                              <td className="border border-black p-2">{data.item}</td>
                              <td className="border border-black p-2 text-right">{data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-2 text-right">{data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-2 text-right">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                            <tr className="font-bold">
                              <td colSpan={2} className="border border-black p-2 text-center">รวม</td>
                              <td className="border border-black p-2 text-right">{data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-2 text-right">{data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-2 text-right">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="mt-4 indent-[2.5cm] leading-relaxed">
                          {data.from} พิจารณาแล้ว เห็นสมควรจัดซื้อ จาก {data.supplierName} จำนวนเงิน {data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท 
                          ภาษีมูลค่าเพิ่ม {data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท เป็นเงินทั้งสิ้น {data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท ({data.totalAmountThai}) รวมภาษีมูลค่าเพิ่ม
                        </p>
                        <p className="mt-2 indent-[2.5cm] leading-relaxed">
                          จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบ ขอได้โปรดอนุมัติให้สั่งซื้อ จากผู้เสนอราคาดังกล่าว พร้อมทั้งแจ้งคณะกรรมการตรวจรับ 
                          ดำเนินการต่อไป
                        </p>
                      </section>

                      {/* Signature Grid for Form 4 */}
                      <table className="w-full mt-4 border-collapse border-t-2 border-black text-[13pt] [page-break-inside:avoid]">
                        <tbody>
                          <tr>
                            {/* Top Left: Approval Box */}
                            <td className="w-1/2 border-r-2 border-black p-1 align-top">
                              <div className="p-3 text-left flex flex-col justify-between min-h-[160px]">
                                <p className="font-bold text-[14pt] leading-tight">เห็นชอบและอนุมัติสั่งซื้อ/สั่งจ้างดำเนินการได้ โดยปฏิบัติให้ถูกต้องตามระเบียบ</p>
                                <div className="mt-12 text-center">
                                  <p>( {data.signer2.name} )</p>
                                  <p>{data.signer2.position}</p>
                                </div>
                              </div>
                            </td>

                            {/* Top Right: Proposer */}
                            <td className="w-1/2 p-1 align-top">
                              <div className="p-3 text-right flex flex-col justify-end min-h-[160px]">
                                <div className="inline-block text-left space-y-1">
                                  <p>ลงชื่อ..............................................................</p>
                                  <div className="pl-4">
                                    <p>( {data.signer1.name} )</p>
                                    <p>ตำแหน่ง {data.signer1.position}</p>
                                    <p>วันที่................................</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            {/* Bottom Left: Committee */}
                            <td className="w-1/2 border-t-2 border-r-2 border-black p-3 align-top">
                              <div className="space-y-3">
                                <p className="font-bold underline">เรียน อก.ปบ.(ก3)</p>
                                <p className="indent-8 leading-snug text-[12pt]">คณะกรรมการตรวจรับได้ทำการตรวจรับ {data.item} จำนวน ๑ รายการ เมื่อวันที่................................เห็นว่าถูกต้องครบถ้วน เห็นควรรับไว้ใช้งานและเบิกจ่ายเงิน ให้แก่ผู้ขาย/ผู้รับจ้างต่อไป</p>
                                <div className="space-y-6 pt-2">
                                  {data.committee.map((member, idx) => (
                                    <div key={idx} className="text-left pl-2">
                                      <p className="whitespace-nowrap">ลงชื่อ.......................................................................{idx === 0 ? 'ประธานกรรมการ' : 'กรรมการ'}</p>
                                      <p className="pl-12">( {member.name} )</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>

                            {/* Bottom Right: Receiver & Final Approval */}
                            <td className="w-1/2 border-t-2 border-black p-0 align-top">
                              <div className="p-3 space-y-3 border-b-2 border-black min-h-[180px]">
                                <p className="indent-8 leading-snug text-[12pt]">ข้าพเจ้าได้รับมอบ{data.item}จำนวน ๑ รายการ ดังกล่าว เพื่อนำไปใช้งานแล้วตั้งแต่วันที่............................</p>
                                <div className="pt-4 text-left pl-6">
                                  <p>ลงชื่อ..............................................................(ผู้รับของ)</p>
                                  <div className="pl-12">
                                    <p>( {data.receiver.name} )</p>
                                    <p>ตำแหน่ง {data.receiver.position}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 text-center flex flex-col justify-between min-h-[140px]">
                                <p className="font-bold text-[13pt] leading-tight">อนุมัติจ่ายเงินจำนวน ทั้งสิ้น {data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท ({data.totalAmountThai}) รวมภาษีมูลค่าเพิ่ม</p>
                                <div className="mt-8">
                                  <p>( {data.signer2.name} )</p>
                                  <p>{data.signer2.position}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-auto pt-4 text-[11pt]">
                        <p>จซ.(ฉ) ๐๐๑ – ป.๖๐</p>
                        <p className="mt-1 text-[9pt]">**หมายเหตุ กรณีผู้ขาย/ผู้จ้าง ไม่ได้อยู่ในระบบ VAT ให้ระบุจำนวนเงินไม่รวมภาษีมูลค่าเพิ่ม (ปรับปรุงแบบฟอร์ม วันที่ ๑๘ ก.ย.๒๕๖๑)</p>
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
                    <div className="mt-10 pt-10 text-[12pt] text-slate-600 border-t border-stone-100">
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
