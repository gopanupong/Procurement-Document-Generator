/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ProcurementDoc, FormType } from './types';
import { Printer, Eye, Edit3, Download, ChevronLeft, FileText, CheckCircle2, ClipboardList, FileCheck } from 'lucide-react';
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
  department: "แผนกจัดการงานศูนย์สั่งการ",
  phone: "10500-32",
  logoUrl: "https://upload.wikimedia.org/wikipedia/th/thumb/0/05/Provincial_Electricity_Authority_Logo.svg/512px-Provincial_Electricity_Authority_Logo.svg.png",
  item: "สว่านโรตารี่ไร้สาย",
  budgetYear: "2569",
  wbs: "I-69-I-OPDXX.19.2301",
  
  infoSection: {
    requester: "ผจศ.กปบ.(ก3)",
    approvalRef: "ก.3 กบฟ.(งป) 117/2568",
    approvalDate: "16 ม.ค. 2569",
  },
  considerationSection: {
    requester: "ผจศ.กปบ.(ก3)",
  },
  committee: [
    { name: "นายภานุพงค์ เจนสุริยะกุล", position: "ประธานกรรมการ" },
    { name: "นายสมชาย ใจดี", position: "กรรมการ" },
    { name: "นายวิชัย รักชาติ", position: "กรรมการ" },
  ],
  procurementMethod: "เฉพาะเจาะจง",
  estimatedPrice: 15000,
  reason: "เพื่อใช้ในการปฏิบัติงานซ่อมบำรุงอุปกรณ์ในศูนย์สั่งการ",
  supplierName: "บริษัท เอ็นดับเบิ้ลยู วินซ์ จำกัด (สำนักงานใหญ่)",
  contractNumber: "PO-69-001",
  deliveryDate: "30 มี.ค. 2569",
  priceBeforeVat: 13780,
  vatAmount: 964.60,
  totalAmount: 14744.60,
  totalAmountThai: "หนึ่งหมื่นสี่พันเจ็ดร้อยสี่สิบสี่บาทหกสิบสตางค์",
  receiver: { name: "นายกฤษณะ ปอยงาม", position: "ชผ.จศ กปบ.(ก3)" },
  signer1: {
    name: "นายภานุพงค์ เจนสุริยะกุล",
    position: "หผ.จศ กปบ.(ก3)",
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
                  {currentForm === 'APPROVAL' && (
                    <>
                      <section>
                        <h3 className="font-bold mb-1 ml-[2.5cm]">๑. ข้อมูล</h3>
                        <p className="ml-[3.5cm]">
                          {data.infoSection.requester} จัดซื้อตามอนุมัติที่ {data.infoSection.approvalRef} ลว. {data.infoSection.approvalDate}
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 ml-[2.5cm]">๒. ข้อพิจารณา</h3>
                        <p className="ml-[3.5cm]">
                          {data.from} ได้พิจารณาแล้ว เพื่อให้มีความพร้อมในการใช้งาน จึงจำเป็นต้องทำการ
                          จัดซื้อ{data.item} จึงเห็นควรดำเนินการจัดซื้อดังกล่าว โดยใช้ราคากลางอ้างอิงตามพระราชบัญญัติการ
                          จัดซื้อจัดจ้างและบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ จึงขออนุมัติความเห็นชอบดำเนินการจัดซื้ออุปกรณ์ดังกล่าว 
                          โดยให้เบิกจ่ายจากงบทำการประจำปี {data.budgetYear} จากงบลงทุน หมายเลขงาน (WBS) 
                          {data.wbs} ต่อไป
                        </p>
                        <p className="ml-[3.5cm] mt-4">
                          จึงเรียนมาเพื่อโปรดพิจารณาหากเห็นชอบและโปรดลงนามให้ต่อไป
                        </p>
                      </section>
                    </>
                  )}

                  {currentForm === 'ASSIGNMENT' && (
                    <>
                      <section>
                        <h3 className="font-bold mb-1 ml-[2.5cm]">๑. ข้อมูล</h3>
                        <p className="ml-[3.5cm]">
                          ตามที่ {data.from} ได้รับอนุมัติให้ดำเนินการจัดซื้อ {data.item} ตามบันทึกที่ {data.docNumber}{data.docYear} ลว. {data.date} นั้น
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 ml-[2.5cm]">๒. ข้อพิจารณา</h3>
                        <p className="ml-[3.5cm]">
                          เพื่อให้การดำเนินการจัดทำคุณลักษณะของพัสดุเป็นไปด้วยความเรียบร้อยและถูกต้องตามระเบียบ 
                          จึงขอแต่งตั้งคณะกรรมการจัดทำคุณลักษณะและกำหนดราคากลาง ดังนี้
                        </p>
                        <div className="ml-[4.5cm] mt-2 space-y-1">
                          {data.committee.map((member, index) => (
                            <p key={index}>{index + 1}. {member.name} ตำแหน่ง {member.position}</p>
                          ))}
                        </div>
                        <p className="ml-[3.5cm] mt-4">
                          จึงเรียนมาเพื่อโปรดพิจารณาแต่งตั้งคณะกรรมการดังกล่าวต่อไป
                        </p>
                      </section>
                    </>
                  )}

                  {currentForm === 'REPORT' && (
                    <>
                      <section>
                        <h3 className="font-bold mb-1 ml-[2.5cm]">๑. ความเป็นมา</h3>
                        <p className="ml-[3.5cm]">
                          {data.reason}
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 ml-[2.5cm]">๒. รายละเอียดการจัดซื้อ</h3>
                        <p className="ml-[3.5cm]">
                          ดำเนินการจัดซื้อ {data.item} โดยวิธี {data.procurementMethod} 
                          ราคากลางเป็นเงิน {data.estimatedPrice.toLocaleString()} บาท (รวมภาษีมูลค่าเพิ่ม)
                          โดยใช้เงินงบประมาณปี {data.budgetYear} หมายเลขงาน {data.wbs}
                        </p>
                        <p className="ml-[3.5cm] mt-4">
                          จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติรายงานขอซื้อ/จ้างดังกล่าว
                        </p>
                      </section>
                    </>
                  )}

                  {currentForm === 'SUMMARY' && (
                    <>
                      <section className="mt-4">
                        <p className="indent-[2.5cm]">
                          ตามที่ {data.from} ดำเนินการซื้อ{data.item}โดยวิธี{data.procurementMethod} ขอรายงานผลการพิจารณาการจัดซื้อ ดังนี้
                        </p>
                        
                        <table className="w-full mt-4 border-collapse border border-black text-[14pt]">
                          <thead>
                            <tr className="bg-stone-50">
                              <th className="border border-black p-1 w-12 text-center">ที่</th>
                              <th className="border border-black p-1 text-center">รายการ</th>
                              <th className="border border-black p-1 text-center w-32">ราคาที่เสนอ</th>
                              <th className="border border-black p-1 text-center w-32">ภาษีมูลค่าเพิ่ม</th>
                              <th className="border border-black p-1 text-center w-40">ราคาที่ตกลงซื้อ<br/>(รวมภาษีมูลค่าเพิ่ม)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-black p-1 text-center">๑</td>
                              <td className="border border-black p-1">{data.item}</td>
                              <td className="border border-black p-1 text-right">{data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-1 text-right">{data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-1 text-right">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                            <tr className="font-bold">
                              <td colSpan={2} className="border border-black p-1 text-center">รวม</td>
                              <td className="border border-black p-1 text-right">{data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-1 text-right">{data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="border border-black p-1 text-right">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="mt-4 indent-[2.5cm]">
                          {data.from} พิจารณาแล้ว เห็นสมควรจัดซื้อ จาก {data.supplierName} จำนวนเงิน {data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท 
                          ภาษีมูลค่าเพิ่ม {data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท เป็นเงินทั้งสิ้น {data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท ({data.totalAmountThai}) รวมภาษีมูลค่าเพิ่ม
                        </p>
                        <p className="mt-2 indent-[2.5cm]">
                          จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบ ขอได้โปรดอนุมัติให้สั่งซื้อ จากผู้เสนอราคาดังกล่าว พร้อมทั้งแจ้งคณะกรรมการตรวจรับ 
                          ดำเนินการต่อไป
                        </p>
                      </section>

                      {/* Signature Grid for Form 4 */}
                      <div className="mt-8 border-t-2 border-black pt-4 grid grid-cols-2 gap-0 relative">
                        {/* Vertical Divider */}
                        <div className="absolute left-1/2 top-4 bottom-0 w-0.5 bg-black"></div>

                        {/* Top Left: Approval Box */}
                        <div className="border-2 border-black m-2 p-4 text-center flex flex-col justify-between min-h-[180px]">
                          <p className="font-bold text-[15pt] leading-tight">เห็นชอบและอนุมัติสั่งซื้อ/สั่งจ้างดำเนินการได้ โดยปฏิบัติให้ถูกต้องตามระเบียบ</p>
                          <div className="mt-auto">
                            <p>( {data.signer2.name} )</p>
                            <p>{data.signer2.position}</p>
                          </div>
                        </div>

                        {/* Top Right: Proposer */}
                        <div className="p-4 text-left flex flex-col justify-end min-h-[180px]">
                          <div className="ml-auto w-full max-w-[280px] space-y-1">
                            <p>ลงชื่อ..............................................................</p>
                            <div className="pl-4">
                              <p>( {data.signer1.name} )</p>
                              <p>ตำแหน่ง {data.signer1.position}</p>
                              <p>วันที่................................</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Left: Committee */}
                        <div className="p-4 border-t-2 border-black space-y-4">
                          <p className="font-bold underline">เรียน อก.ปบ.(ก3)</p>
                          <p className="indent-8 leading-snug">คณะกรรมการตรวจรับได้ทำการตรวจรับ {data.item} จำนวน ๑ รายการ เมื่อวันที่................................เห็นว่าถูกต้องครบถ้วน เห็นควรรับไว้ใช้งานและเบิกจ่ายเงิน ให้แก่ผู้ขาย/ผู้รับจ้างต่อไป</p>
                          <div className="space-y-6 pt-2">
                            {data.committee.map((member, idx) => (
                              <div key={idx} className="text-left pl-4">
                                <p>ลงชื่อ.......................................................................{idx === 0 ? 'ประธานกรรมการ' : 'กรรมการ'}</p>
                                <p className="pl-12">( {member.name} )</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Right: Receiver & Final Approval */}
                        <div className="border-t-2 border-black">
                          <div className="p-4 space-y-4 border-b-2 border-black min-h-[180px]">
                            <p className="indent-8 leading-snug">ข้าพเจ้าได้รับมอบ{data.item}จำนวน ๑ รายการ ดังกล่าว เพื่อนำไปใช้งานแล้วตั้งแต่วันที่............................</p>
                            <div className="pt-2 text-left pl-8">
                              <p>ลงชื่อ..............................................................(ผู้รับของ)</p>
                              <p className="pl-12">( {data.receiver.name} )</p>
                              <p className="pl-12">ตำแหน่ง {data.receiver.position}</p>
                            </div>
                          </div>

                          <div className="p-4 text-center flex flex-col justify-between min-h-[150px]">
                            <p className="font-bold text-[15pt] leading-tight">อนุมัติจ่ายเงินจำนวน ทั้งสิ้น {data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท ({data.totalAmountThai}) รวมภาษีมูลค่าเพิ่ม</p>
                            <div className="mt-auto">
                              <p>( {data.signer2.name} )</p>
                              <p>{data.signer2.position}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 text-[12pt]">
                        <p>จซ.(ฉ) ๐๐๑ – ป.๖๐</p>
                        <p className="mt-2 text-[10pt]">**หมายเหตุ กรณีผู้ขาย/ผู้จ้าง ไม่ได้อยู่ในระบบ VAT ให้ระบุจำนวนเงินไม่รวมภาษีมูลค่าเพิ่ม (ปรับปรุงแบบฟอร์ม วันที่ ๑๘ ก.ย.๒๕๖๑)</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Signatures (Hidden for Form 4 as it has custom grid) */}
                {currentForm !== 'SUMMARY' && (
                  <>
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
                  </>
                )}

                {/* Footer (Hidden for Form 4 as it has custom footer) */}
                {currentForm !== 'SUMMARY' && (
                  <div className="mt-auto pt-10 text-[12pt] text-slate-600">
                    <p>{data.department}</p>
                    <p>เบอร์โทร {data.phone}</p>
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
