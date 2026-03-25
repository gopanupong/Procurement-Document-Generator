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
  docNumber: 'ก.3 กปบ.(จฟ.1)                /2569',
  docYear: '/2569',
  date: '22 มีนาคม 2569',
  subjectApproval: 'ขอความเห็นชอบดำเนินการจัดจ้างตัดหญ้าและฉีดยากำจัดวัชพืชในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4 (สถานีไฟฟ้าศาลายา)',
  subjectAssignment: 'มอบหมายผู้จัดทำรายละเอียดคุณลักษณะเฉพาะของพัสดุ และกำหนดราคากลาง สำหรับงานขอจัดจ้างตัดหญ้าและฉีดยากำจัดวัชพืชสถานีไฟฟ้าในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4 (สถานีไฟฟ้าศาลายา) ด้วยวิธีเฉพาะเจาะจง',
  subjectReport: 'รายงานขอจัดจ้างตัดหญ้าและฉีดยากำจัดวัชพืชสถานีไฟฟ้าในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4 (สถานีไฟฟ้าศาลายา) ด้วยวิธีเฉพาะเจาะจง',
  subjectSummary: 'รายงานสรุปผลการพิจารณา ตรวจรับ และอนุมัติจ่ายเงิน',
  recipient: 'กปบ.(ก3)',
  through: 'ชก.ปบ.(ก3)',
  department: 'แผนกจัดการสถานีไฟฟ้า 1',
  phone: '10520-21',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Logo_of_the_Provincial_Electricity_Authority_of_Thailand.svg',
  item: 'จัดจ้าง',
  budgetYear: '2569',
  wbs: 'WBS-123456',
  unitName: 'หน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4 (สถานีไฟฟ้าศาลายา)',
  monthStart: 'ตุลาคม 2568',
  monthEnd: 'กันยายน 2569',
  parentUnit: 'กปบ.(ก3)',
  stationCount: '4 (สถานีไฟฟ้าศาลายา)',
  stationList: 'สถานีไฟฟ้าศาลายา, พุทธมณฑล 2 และพุทธมณฑล 3',
  accountCode: '53034030',
  accountName: 'ค่าจ้างบำรุงรักษาสวน',
  costCenter: 'I301031040',
  signer1Unit: 'ผจฟ.1 กปบ.(ก3)',
  infoSection: {
    requester: 'ผจฟ.1 กปบ.(ก3)',
    approvalRef: 'ก.3 กปบ.(จฟ.1) /2569',
    approvalDate: '22 มีนาคม 2569',
  },
  considerationSection: {
    requester: 'ผจฟ.1 กปบ.(ก3)',
  },
  committee: [
    { name: 'นายพชริศ กรุงกาญจนา', position: 'ประธานกรรมการ' },
    { name: 'นายโชคชัย ชัยมาลา', position: 'กรรมการ' },
    { name: 'นายธนาคาร สว่างเรือง', position: 'กรรมการ' },
  ],
  procurementMethod: 'เฉพาะเจาะจง',
  estimatedPrice: 14744.60,
  reason: 'ตรวจสอบพบว่าบริเวณพื้นที่ภายในบริเวณสถานีไฟฟ้ามีต้นหญ้าและวัชพืชขึ้นเป็นจำนวนมาก หากปล่อยทิ้งไว้อาจเป็นที่อยู่อาศัยของสัตว์เลื้อยคลานต่างๆ ซึ่งอาจส่งผลกระทบต่อระบบการจ่ายกระแสไฟฟ้าได้',
  supplierName: 'บริษัท เอ็นดับเบิ้ลยู วินซ์ จำกัด (สำนักงานใหญ่)',
  contractNumber: 'จซ.123/2569',
  deliveryDate: '30 กันยายน 2569',
  priceBeforeVat: 13780.00,
  vatAmount: 964.60,
  totalAmount: 14744.60,
  totalAmountThai: 'หนึ่งหมื่นสี่พันเจ็ดร้อยสี่สิบสี่บาทหกสิบสตางค์',
  receiver: { name: 'นายกฤษณะ ปอยงาม', position: 'ชผ.จศ.กปบ.(ก3)' },
  signer1: { name: 'นายภาณุพงศ์ เจนสุริยะกุล', position: 'หผ.จฟ.1 กปบ.(ก3)' },
  signer2: { name: 'นายเลอพงศ์ แก่นจันทร์', position: 'อก.ปบ.(ก3)' },
};

export default function App() {
  const [data, setData] = useState<ProcurementDoc>(initialData);
  const [isPreview, setIsPreview] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>('SUMMARY');
  const [procurementType, setProcurementType] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const updateSubjects = (type: string, currentData: ProcurementDoc) => {
    const itemText = type === 'CLEANING' ? 'จ้างทำความสะอาด' : 'จ้างตัดหญ้าและฉีดยากำจัดวัชพืช';
    const actionText = 'จัดจ้าง';
    return {
      ...currentData,
      item: actionText,
      subjectApproval: `ขอความเห็นชอบดำเนินการ${actionText}${itemText}ในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ ${currentData.stationCount}`,
      subjectAssignment: `มอบหมายผู้จัดทำรายละเอียดคุณลักษณะเฉพาะของพัสดุ และกำหนดราคากลาง สำหรับงานขอ${actionText}${itemText}สถานีไฟฟ้าในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ ${currentData.stationCount} ด้วยวิธีเฉพาะเจาะจง`,
      subjectReport: `รายงานขอ${actionText}${itemText}สถานีไฟฟ้าในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ ${currentData.stationCount} ด้วยวิธีเฉพาะเจาะจง`,
      subjectSummary: `รายงานสรุปผลการพิจารณา ตรวจรับ และอนุมัติจ่ายเงิน`,
    };
  };

  const handleSelectProcurement = (type: string) => {
    setProcurementType(type);
    setData(prev => updateSubjects(type, prev));
  };

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
      setData(prev => {
        const newData = { ...prev, [name]: finalValue };
        // Auto-update subjects if key fields change
        if (['unitName', 'monthStart', 'monthEnd', 'item'].includes(name)) {
          return {
            ...newData,
            subjectApproval: `ขอความเห็นชอบดำเนินการ${newData.item} ${newData.unitName} ประจำเดือน ${newData.monthStart} - ${newData.monthEnd}`,
            subjectAssignment: `ขออนุมัติแต่งตั้งคณะกรรมการจัดทำคุณลักษณะและกำหนดราคากลาง ${newData.item} ${newData.unitName} ประจำเดือน ${newData.monthStart} - ${newData.monthEnd}`,
            subjectReport: `รายงานขอ${newData.item} ${newData.unitName} ประจำเดือน ${newData.monthStart} - ${newData.monthEnd} โดยวิธีเฉพาะเจาะจง`,
            subjectSummary: `รายงานผลการพิจารณาและขออนุมัติ${newData.item} ${newData.unitName} ประจำเดือน ${newData.monthStart} - ${newData.monthEnd}`,
          };
        }
        return newData;
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-900">
      <AnimatePresence>
        {!procurementType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-2xl w-full border border-white/20"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-purple-700 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl mb-6 rotate-3">
                  <FileText size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-3">ยินดีต้อนรับสู่ระบบจัดทำเอกสาร</h2>
                <p className="text-slate-500 font-medium">กรุณาเลือกหัวข้อการจัดซื้อจัดจ้างเพื่อเริ่มต้น</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleSelectProcurement('CLEANING')}
                  className="group relative overflow-hidden bg-white border-2 border-stone-100 hover:border-purple-500 p-8 rounded-[2rem] transition-all duration-300 text-left shadow-sm hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">จ้างทำความสะอาด</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">จัดทำเอกสารเกี่ยวกับการจ้างเหมาทำความสะอาดอาคารและสำนักงาน</p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectProcurement('MOWING')}
                  className="group relative overflow-hidden bg-white border-2 border-stone-100 hover:border-emerald-500 p-8 rounded-[2rem] transition-all duration-300 text-left shadow-sm hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <ClipboardList size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">จ้างตัดหญ้า</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">จัดทำเอกสารเกี่ยวกับการจ้างเหมาตัดหญ้าและดูแลสวนบริเวณสถานีไฟฟ้า</p>
                  </div>
                </button>
              </div>
              
              <div className="mt-10 pt-8 border-t border-stone-100 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Provincial Electricity Authority • Procurement System</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          
          html, body {
            width: 210mm;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
          }

          /* Hide UI elements but NOT the main container */
          nav, 
          .form-selector, 
          .instructions-box, 
          button,
          .print\:hidden {
            display: none !important;
          }

          /* Reset background and layout for print */
          .bg-stone-100,
          main,
          .content-container,
          .print-wrapper-outer {
            background: white !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: none !important;
            width: 210mm !important;
            max-width: none !important;
            overflow: visible !important;
          }

          .print-container {
            display: block !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 20mm 15mm 15mm 25mm !important; /* Top 2cm, Right 1.5cm, Bottom 1.5cm, Left 2.5cm */
            background: white !important;
            color: black !important;
            font-family: 'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif !important;
            font-size: 16pt !important;
            line-height: 1.1 !important;
            position: relative !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
            visibility: visible !important;
            overflow: visible !important;
          }

          /* Force all text to black and remove red highlights for official print */
          .print-container * {
            color: black !important;
            border-color: black !important;
            background: transparent !important;
            box-shadow: none !important;
            visibility: visible !important;
          }

          .print-container .text-red-600 {
            color: black !important;
          }

          .print-container table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 10pt !important;
          }
          
          .print-container td, .print-container th {
            border: 1px solid black !important;
            padding: 4pt !important;
          }

          /* Ensure dots are visible but clean */
          .border-dotted {
            border-style: solid !important;
            border-bottom-width: 0.5pt !important;
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
          {procurementType && (
            <button
              onClick={() => setProcurementType(null)}
              className="flex items-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 font-medium mr-2"
            >
              <FileText size={18} />
              เปลี่ยนหัวข้อจัดซื้อ
            </button>
          )}
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
        <div className="flex flex-col gap-2 mb-8 print:hidden form-selector">
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
          {/* Form Editor - Hidden in print, hidden on screen if in preview mode */}
          <div className={`${isPreview ? 'hidden' : 'block'} print:hidden`}>
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
                    {currentForm === 'APPROVAL' ? (
                      <>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-100">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">วันที่</label>
                            <input name="date" value={data.date} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">ปีงบประมาณ</label>
                            <input name="budgetYear" value={data.budgetYear} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">จำนวนสถานีไฟฟ้า (ตัวเลข)</label>
                            <input name="stationCount" value={data.stationCount} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">รายชื่อสถานีไฟฟ้า</label>
                            <input name="stationList" value={data.stationList} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">ชื่อบัญชี</label>
                            <input name="accountName" value={data.accountName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
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
                      </>
                    ) : (
                      <>
                        {/* Header Info */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-100">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">วันที่</label>
                            <input name="date" value={data.date} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">เรื่อง</label>
                            <input 
                              name={
                                currentForm === 'APPROVAL' ? 'subjectApproval' :
                                currentForm === 'ASSIGNMENT' ? 'subjectAssignment' :
                                currentForm === 'REPORT' ? 'subjectReport' :
                                'subjectSummary'
                              } 
                              value={
                                currentForm === 'APPROVAL' ? data.subjectApproval :
                                currentForm === 'ASSIGNMENT' ? data.subjectAssignment :
                                currentForm === 'REPORT' ? data.subjectReport :
                                data.subjectSummary
                              } 
                              onChange={handleChange} 
                              className="w-full px-4 py-2 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none" 
                            />
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
                      </>
                    )}
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
          </div>

          {/* Print Preview - Always visible in print, hidden on screen if not in preview mode */}
          <div className={`print-wrapper-outer p-4 md:p-8 flex justify-center ${isPreview ? 'block' : 'hidden'} print:block`}>
            <div className={`print-container bg-white shadow-2xl border border-stone-200 pt-[0.1in] px-[1.5cm] pb-[1.5cm] min-h-[297mm] w-[210mm] ${currentForm === 'SUMMARY' ? 'text-[14pt]' : 'text-[16pt]'} leading-normal font-serif text-black relative flex flex-col`}>
                {/* Header */}
                <div className="flex items-start mb-4">
                  <div className="flex flex-col items-start w-48 shrink-0">
                    {data.logoUrl ? (
                      <img src={data.logoUrl} alt="PEA Logo" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: PEA_LOGO_SVG }} className="w-20 h-20" />
                    )}
                    <div className="text-left mt-1 leading-tight">
                      <p className="text-[12pt] font-bold">การไฟฟ้าส่วนภูมิภาค</p>
                      <p className="text-[8pt] font-bold">PROVINCIAL ELECTRICITY AUTHORITY</p>
                    </div>
                  </div>
                  {currentForm !== 'SUMMARY' && currentForm !== 'APPROVAL' && (
                    <div className="flex-1 text-center pt-8">
                      <h2 className="text-[29pt] font-bold">บันทึกข้อความ</h2>
                    </div>
                  )}
                  <div className="w-40 shrink-0"></div>
                </div>

                {currentForm === 'APPROVAL' ? (
                  <div className="space-y-1 mb-6">
                    <div className="flex">
                      <div className="w-[8cm] flex gap-2">
                        <span className="font-bold shrink-0 w-[1.2cm]">จาก</span>
                        <span className="px-1">{data.from}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0 w-[1cm]">ถึง</span>
                        <span className="px-1">{data.recipient}</span>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[8cm] flex gap-2">
                        <span className="font-bold shrink-0 w-[1.2cm]">เลขที่</span>
                        <span className="px-1">{data.docNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0 w-[1cm]">วันที่</span>
                        <span className="px-1 text-red-600">{data.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0 w-[1.2cm]">เรื่อง</span>
                        <span className="px-1 font-bold">
                          ขอความเห็นชอบดำเนินการ<span className="text-red-600">{data.item}</span>ตัดหญ้าและฉีดยากำจัดวัชพืชสถานีไฟฟ้าในหน่วยปฏิบัติงาน
                        </span>
                      </div>
                      <div className="ml-[1.2cm] px-1 font-bold">
                        สถานีไฟฟ้าที่ <span className="text-red-600">{data.stationCount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold shrink-0 w-[1.2cm]">เรียน</span>
                      <span className="px-1">
                        {data.to} {data.through && <span className="ml-2">ผ่าน {data.through}</span>}
                      </span>
                    </div>
                  </div>
                ) : currentForm !== 'SUMMARY' ? (
                  <div className="space-y-1 mb-4">
                    <div className="flex gap-2">
                      <span className="font-bold shrink-0">ส่วนราชการ</span>
                      <span className="flex-1 px-2 leading-none">
                        <span>{data.from}</span> <span className="ml-4">โทร</span> <span>{data.phone}</span>
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex gap-2 flex-1">
                        <span className="font-bold shrink-0">ที่</span>
                        <span className="flex-1 px-2 leading-none">{data.docNumber}</span>
                      </div>
                      <div className="flex gap-2 flex-1">
                        <span className="font-bold shrink-0">วันที่</span>
                        <span className="flex-1 px-2 text-red-600 leading-none">{data.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold shrink-0">เรื่อง</span>
                      <span className="flex-1 px-2 text-red-600 font-bold leading-none">
                        {currentForm === 'ASSIGNMENT' ? data.subjectAssignment :
                         currentForm === 'REPORT' ? data.subjectReport :
                         data.subjectSummary}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-x-8 mb-2">
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0">จาก</span>
                        <span className="flex-1 px-1">{data.from}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0">ถึง</span>
                        <span className="flex-1 px-1">{data.recipient}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 mb-2">
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0">เลขที่</span>
                        <span className="flex-1 px-1">{data.docNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0">วันที่</span>
                        <span className="flex-1 px-1 text-red-600">{data.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="font-bold shrink-0">เรื่อง</span>
                      <span className="flex-1 px-1 text-red-600 font-bold">{data.subjectSummary}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold shrink-0">เรียน</span>
                      <span className="flex-1 px-1">
                        {data.to} {data.through && <span className="ml-2">ผ่าน {data.through}</span>}
                      </span>
                    </div>
                  </div>
                )}

                {currentForm !== 'SUMMARY' && (
                  <div className="mb-4">
                    <p><span className="font-bold">เรียน</span> <span className="ml-2">{data.to}</span> {data.through && <span className="ml-2">ผ่าน <span className="text-red-600">{data.through}</span></span>}</p>
                  </div>
                )}

                {/* Main Content */}
                <div className="flex-1">
                  {currentForm === 'APPROVAL' && (
                    <div className="space-y-6 mt-4">
                      <section>
                        <h3 className="font-bold mb-1 ml-[1.2cm]">1. ข้อมูล</h3>
                        <p className="ml-[2.2cm] leading-relaxed">
                          หน่วยปฏิบัติงานสถานีไฟฟ้าที่ <span className="text-red-600">{data.stationCount}</span> สังกัด <span className="text-red-600">{data.signer1Unit}</span> ตรวจสอบพบว่าบริเวณพื้นที่ภายในบริเวณสถานีไฟฟ้ามีต้นหญ้าและวัชพืชขึ้นเป็นจำนวนมาก หากปล่อยทิ้งไว้อาจเป็นที่อยู่อาศัยของสัตว์เลื้อยคลานต่างๆ ซึ่งอาจส่งผลกระทบต่อระบบการจ่ายกระแสไฟฟ้าได้
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 ml-[1.2cm]">2. ข้อพิจารณา</h3>
                        <p className="ml-[2.2cm] leading-relaxed">
                          <span className="text-red-600">{data.signer1Unit}</span> ได้พิจารณาแล้ว เพื่อเป็นการบำรุงรักษาสถานีไฟฟ้าให้มีความสะอาด เรียบร้อย และปลอดภัยต่อการปฏิบัติงาน จึงเห็นควรดำเนินการจัดจ้างตัดหญ้าและฉีดยากำจัดวัชพืชในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ <span className="text-red-600">{data.stationCount}</span> (<span className="text-red-600">{data.stationList}</span>) โดยวิธีเฉพาะเจาะจง ตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 ข้อ 28 (2) (ข) และกฎกระทรวงกำหนดวงเงินการจัดซื้อจัดจ้างพัสดุโดยวิธีเฉพาะเจาะจง วงเงินการจัดซื้อจัดจ้างที่ไม่ทำข้อตกลงเป็นหนังสือ และวงเงินการจัดซื้อจัดจ้างเพื่อแก้ไขปัญหาเร่งด่วน พ.ศ. 2560 ข้อ 1 โดยเบิกจ่ายจากงบทำการ ประจำปี <span className="text-red-600">{data.budgetYear}</span> <span className="text-red-600">{data.accountName}</span> (<span className="text-red-600">{data.accountCode}</span>) ของ <span className="text-red-600">{data.signer1Unit}</span> ศูนย์ต้นทุน <span className="text-red-600">{data.costCenter}</span> ต่อไป
                        </p>
                        <p className="ml-[2.2cm] mt-6">
                          จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบโปรดลงนามในบันทึกที่แนบมาพร้อมนี้
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'ASSIGNMENT' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">1. ข้อมูล</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          ตามที่ <span className="text-red-600">{data.signer1Unit}</span> ได้รับอนุมัติให้ดำเนินการจัดซื้อ <span className="text-red-600">{data.item}</span> ตามบันทึกที่ <span className="text-red-600">{data.docNumber}</span> ลว. <span className="text-red-600">{data.date}</span> นั้น
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">2. ข้อพิจารณา</h3>
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
                    <div className="space-y-6">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">1. ความเป็นมา</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          <span className="text-red-600">{data.reason}</span>
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">2. รายละเอียดการจัดจ้าง</h3>
                        <p className="indent-[2.5cm] leading-relaxed mb-4">
                          ดำเนินการจัดซื้อ <span className="text-red-600">{data.item}</span> โดยวิธี <span className="text-red-600">{data.procurementMethod}</span> 
                          ราคากลางเป็นเงิน <span className="text-red-600">{data.estimatedPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท (รวมภาษีมูลค่าเพิ่ม)
                          โดยใช้เงินงบประมาณปี <span className="text-red-600">{data.budgetYear}</span> หมายเลขงาน <span className="text-red-600">{data.wbs}</span>
                        </p>
                        
                        <div className="ml-[1cm] space-y-6">
                          <div>
                            <p className="font-bold mb-2">2.1 ตารางจัดจ้างตัดหญ้าสถานีไฟฟ้า (ใช้เครื่องมือผู้รับจ้าง)</p>
                            <table className="w-full border-collapse border border-black text-center text-[14pt]">
                              <thead>
                                <tr>
                                  <th className="border border-black p-1 w-12">ที่</th>
                                  <th className="border border-black p-1">รายการ</th>
                                  <th className="border border-black p-1 w-32">จำนวนเงิน (บาท)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-black p-1">1</td>
                                  <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าศาลายา</td>
                                  <td className="border border-black p-1 text-right px-2">1,400.00</td>
                                </tr>
                                <tr>
                                  <td className="border border-black p-1">2</td>
                                  <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าพุทธมณฑล 2</td>
                                  <td className="border border-black p-1 text-right px-2">1,400.00</td>
                                </tr>
                                <tr>
                                  <td className="border border-black p-1">3</td>
                                  <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าพุทธมณฑล 3</td>
                                  <td className="border border-black p-1 text-right px-2">1,400.00</td>
                                </tr>
                                <tr>
                                  <td colSpan={2} className="border border-black p-1 font-bold">รวม</td>
                                  <td className="border border-black p-1 text-right px-2 font-bold">4,200.00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <p className="font-bold mb-2">2.2 ตารางจัดจ้างฉีดยากำจัดวัชพืชสถานีไฟฟ้า (ใช้เครื่องมือผู้รับจ้าง)</p>
                            <table className="w-full border-collapse border border-black text-center text-[14pt]">
                              <thead>
                                <tr>
                                  <th className="border border-black p-1 w-12">ที่</th>
                                  <th className="border border-black p-1">รายการ</th>
                                  <th className="border border-black p-1 w-32">จำนวนเงิน (บาท)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-black p-1">1</td>
                                  <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าศาลายา</td>
                                  <td className="border border-black p-1 text-right px-2">3,193.33</td>
                                </tr>
                                <tr>
                                  <td className="border border-black p-1">2</td>
                                  <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าพุทธมณฑล 2</td>
                                  <td className="border border-black p-1 text-right px-2">3,193.33</td>
                                </tr>
                                <tr>
                                  <td className="border border-black p-1">3</td>
                                  <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าพุทธมณฑล 3</td>
                                  <td className="border border-black p-1 text-right px-2">3,193.34</td>
                                </tr>
                                <tr>
                                  <td colSpan={2} className="border border-black p-1 font-bold">รวม</td>
                                  <td className="border border-black p-1 text-right px-2 font-bold">9,580.00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <p className="indent-[2.5cm] mt-8">
                          จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติรายงานขอซื้อ/จ้างดังกล่าว
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'SUMMARY' && (
                    <div className="space-y-4 leading-tight">
                      <p className="indent-[2.5cm] mb-4">
                        ตามที่ <span className="text-red-600">{data.signer1Unit}</span> ดำเนินการจัดซื้อ/จ้าง <span className="text-red-600">{data.item}</span> โดยวิธีเฉพาะเจาะจง ขอรายงานผลการพิจารณาการจัดซื้อ/จ้าง ดังนี้
                      </p>

                      <table className="w-full border-collapse border border-black mb-4 text-center">
                        <thead>
                          <tr>
                            <th className="border border-black p-1 w-12">ที่</th>
                            <th className="border border-black p-1">รายการ</th>
                            <th className="border border-black p-1">ราคาที่เสนอ</th>
                            <th className="border border-black p-1">ภาษีมูลค่าเพิ่ม</th>
                            <th className="border border-black p-1">ราคาที่ตกลงซื้อ/จ้าง<br/>(รวมภาษีมูลค่าเพิ่ม)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black p-1">1</td>
                            <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าศาลายา</td>
                            <td className="border border-black p-1">4,593.33</td>
                            <td className="border border-black p-1">-</td>
                            <td className="border border-black p-1">4,593.33</td>
                          </tr>
                          <tr>
                            <td className="border border-black p-1">2</td>
                            <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าพุทธมณฑล 2</td>
                            <td className="border border-black p-1">4,593.33</td>
                            <td className="border border-black p-1">-</td>
                            <td className="border border-black p-1">4,593.33</td>
                          </tr>
                          <tr>
                            <td className="border border-black p-1">3</td>
                            <td className="border border-black p-1 text-left px-2">สถานีไฟฟ้าพุทธมณฑล 3</td>
                            <td className="border border-black p-1">4,593.34</td>
                            <td className="border border-black p-1">-</td>
                            <td className="border border-black p-1">4,593.34</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="border border-black p-1 font-bold">รวม</td>
                            <td className="border border-black p-1 font-bold">13,780.00</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">13,780.00</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="border border-black p-1 font-bold">ภาษีมูลค่าเพิ่ม 7%</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">964.60</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="border border-black p-1 font-bold">รวมเงินทั้งสิ้น</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">14,744.60</td>
                          </tr>
                        </tbody>
                      </table>

                      <p className="indent-[1.5cm] mb-2 leading-relaxed">
                        <span className="text-red-600">{data.signer1Unit}</span> พิจารณาแล้ว เห็นสมควรจัดซื้อ/จ้าง จาก <span className="text-red-600">{data.supplierName}</span> จำนวนเงิน <span className="text-red-600">{data.priceBeforeVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท ภาษีมูลค่าเพิ่ม <span className="text-red-600">{data.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท เป็นเงินทั้งสิ้น <span className="text-red-600">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท (<span className="text-red-600">{data.totalAmountThai}</span>) รวมภาษีมูลค่าเพิ่ม
                      </p>

                      <p className="indent-[1.5cm] mb-6">
                        จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบ ขอได้โปรดอนุมัติให้สั่งซื้อ/จ้าง จากผู้เสนอราคาดังกล่าว พร้อมทั้งแจ้งคณะกรรมการตรวจรับ ดำเนินการต่อไป
                      </p>

                      {/* Signature Grid from PDF */}
                      <div className="border border-black">
                        <div className="grid grid-cols-2 border-b border-black">
                          <div className="border-r border-black p-4 min-h-[140px] flex flex-col">
                            <p className="text-center font-bold mb-4 leading-tight">เห็นชอบและอนุมัติสั่งซื้อ/สั่งจ้างดำเนินการได้ โดยปฏิบัติให้ถูกต้องตามระเบียบ</p>
                            <div className="text-center mt-auto">
                              <p className="mb-1">( <span className="text-red-600">{data.signer2.name}</span> )</p>
                              <p><span className="text-red-600">{data.signer2.position}</span></p>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col items-center justify-center">
                            <div className="text-center">
                              <p className="mb-6">ลงชื่อ..............................................................</p>
                              <p>( <span className="text-red-600">{data.signer1.name}</span> )</p>
                              <p>ตำแหน่ง <span className="text-red-600">{data.signer1.position}</span></p>
                              <p>วันที่........./........../..........</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 border-b border-black">
                          <div className="border-r border-black p-4">
                            <p className="mb-2 font-bold">เรียน {data.to}</p>
                            <p className="indent-[0.8cm] mb-4 leading-tight">คณะกรรมการตรวจรับได้ทำการตรวจรับ <span className="text-red-600">{data.item}</span> จำนวน 1 รายการ เมื่อวันที่................................เห็นว่าถูกต้องครบถ้วน เห็นควรรับไว้ใช้งานและเบิกจ่ายเงิน ให้แก่ผู้ขาย/ผู้รับจ้างต่อไป</p>
                            <div className="space-y-4">
                              {data.committee.map((member, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                  <p className="mb-1">ลงชื่อ..............................................................{idx === 0 ? 'ประธานกรรมการ' : 'กรรมการ'}</p>
                                  <p>( <span className="text-red-600">{member.name}</span> )</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 flex flex-col">
                            <p className="mb-4 leading-tight">ข้าพเจ้าได้รับมอบ<span className="text-red-600">{data.item}</span>จำนวน 1 รายการ ดังกล่าว เพื่อนำไปใช้งานแล้วตั้งแต่วันที่............................</p>
                            <div className="text-center mt-auto">
                              <p className="mb-6">ลงชื่อ..............................................................(ผู้รับของ)</p>
                              <p>( <span className="text-red-600">{data.receiver.name}</span> )</p>
                              <p>ตำแหน่ง <span className="text-red-600">{data.receiver.position}</span></p>
                              <p>วันที่........./........../..........</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2">
                          <div className="border-r border-black p-2 text-[10pt] flex items-end">
                            <p>จซ.(ฉ) 001 – ป.60</p>
                          </div>
                          <div className="p-4 text-center">
                             <p className="mb-4 font-bold">อนุมัติจ่ายเงินจำนวน ทั้งสิ้น <span className="text-red-600">{data.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> บาท (<span className="text-red-600">{data.totalAmountThai}</span>) รวมภาษีมูลค่าเพิ่ม</p>
                             <div className="mt-4">
                               <p className="mb-1">( <span className="text-red-600">{data.signer2.name}</span> )</p>
                               <p><span className="text-red-600">{data.signer2.position}</span></p>
                             </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10pt] mt-2 font-bold">**หมายเหตุ กรณีผู้ขาย/ผู้จ้าง ไม่ได้อยู่ในระบบ VAT ให้ระบุจำนวนเงินไม่รวมภาษีมูลค่าเพิ่ม (ปรับปรุงแบบฟอร์ม วันที่ 18 ก.ย.2561)</p>
                    </div>
                  )}

                </div>

                {/* Signatures (Hidden for Form 4 as it has custom grid) */}
                {currentForm !== 'SUMMARY' && (
                  <div className="mt-auto">
                    {currentForm === 'APPROVAL' ? (
                      <div className="mt-12 space-y-12">
                        {/* Signer 1 on the right */}
                        <div className="flex justify-end">
                          <div className="text-center w-80 space-y-1">
                            <p className="mb-10">( <span className="text-red-600">{data.signer1.name}</span> )</p>
                            <p><span className="text-red-600">{data.signer1.position}</span></p>
                          </div>
                        </div>

                        {/* Signer 2 on the left */}
                        <div className="space-y-8">
                          <div className="ml-[1.2cm]">
                            <p>เห็นชอบดำเนินการต่อไป</p>
                          </div>
                          
                          <div className="flex justify-start ml-[1.2cm]">
                            <div className="text-center w-80 space-y-1">
                              <p className="mb-10">( <span className="text-red-600">{data.signer2.name}</span> )</p>
                              <p><span className="text-red-600">{data.signer2.position}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-end pr-10">
                          <div className="text-center w-80 space-y-1">
                            <p className="mb-10">ลงชื่อ..............................................................</p>
                            <p>( <span className="text-red-600">{data.signer1.name}</span> )</p>
                            <p>ตำแหน่ง <span className="text-red-600">{data.signer1.position}</span></p>
                          </div>
                        </div>

                        <div className="mt-12 space-y-8">
                          <div className="ml-[1cm]">
                            <p className="font-bold underline">ความเห็นของ <span className="text-red-600">{data.signer2.position}</span></p>
                            <p className="mt-2">- เห็นชอบและอนุมัติให้ดำเนินการได้</p>
                          </div>
                          
                          <div className="flex justify-end pr-10">
                            <div className="text-center w-80 space-y-1">
                              <p className="mb-10">ลงชื่อ..............................................................</p>
                              <p>( <span className="text-red-600">{data.signer2.name}</span> )</p>
                              <p>ตำแหน่ง <span className="text-red-600">{data.signer2.position}</span></p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 text-black border-t border-black flex justify-between items-end">
                      <div>
                        <p>{data.department}</p>
                        <p>เบอร์โทร {data.phone}</p>
                      </div>
                      {currentForm === 'APPROVAL' && (
                        <table className="border-collapse border border-black text-[10pt] w-48 mb-0">
                          <tbody>
                            <tr>
                              <td className="border border-black px-1 py-0.5 w-10 text-center">ชผ.</td>
                              <td className="border border-black px-1 py-0.5 w-16"></td>
                              <td className="border border-black px-1 py-0.5 w-16"></td>
                            </tr>
                            <tr>
                              <td className="border border-black px-1 py-0.5 text-center">พชง.</td>
                              <td className="border border-black px-1 py-0.5"></td>
                              <td className="border border-black px-1 py-0.5"></td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* Removed NOTICE block */}
              </div>

              <div className="mt-8 max-w-[210mm] w-full bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-blue-800 print:hidden instructions-box">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Printer size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm">คำแนะนำการบันทึกเป็น PDF:</p>
                  <p className="text-sm opacity-90">เมื่อกดปุ่มพิมพ์ ให้เลือก "ปลายทาง" (Destination) เป็น <strong>"บันทึกเป็น PDF" (Save as PDF)</strong> เพื่อดาวน์โหลดไฟล์ลงเครื่องครับ</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}
