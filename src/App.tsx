/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ProcurementDoc, FormType } from './types';
import { Printer, Eye, Edit3, Download, ChevronLeft, FileText, CheckCircle2, ClipboardList, FileCheck, ShoppingCart, Settings } from 'lucide-react';
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
  stationList: 'สถานีไฟฟ้าศาลายา, พุทธมณฑล 2 และพุทธมณฑล 3 ซึ่งมีพื้นที่ทั้งหมดรวม 11 ไร่ 2 งาน 92.2 ตารางวา ปัจจุบันมีหญ้าและวัชพืชขึ้นปกคลุมพื้นที่เป็นจำนวนมากตามบริเวณลานไกไฟฟ้า ลานหิน พื้นที่ว่างเปล่าและบริเวณหน้าสถานีไฟฟ้า พื้นที่ที่จะดำเนินการในครั้งนี้ประมาณ 7.5 ไร่',
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
  signer1: { name: 'นายภานุพงค์ เจนสุริยะกุล', position: 'หผ.จฟ.1 กปบ.(ก3)' },
  signer2: { name: 'นายเลอพงศ์ แก่นจันทร์', position: 'อก.ปบ.(ก3)' },
  procurementType: 'MOWING',

  // Detailed Tables for Report
  grassItems: [
    { station: 'ศาลายา', area: '3', price: 2600, subtotal: 7800, description: 'จ้างตัดหญ้าสถานีไฟฟ้าศาลายา พื้นที่ 3 ไร่', amt: 7800 },
    { station: 'พุทธมณฑล 2', area: '2', price: 2600, subtotal: 5200, description: 'จ้างตัดหญ้าสถานีไฟฟ้าพุทธมณฑล 2 พื้นที่ 2 ไร่', amt: 5200 },
    { station: 'พุทธมณฑล 3', area: '2.5', price: 2600, subtotal: 6500, description: 'จ้างตัดหญ้าสถานีไฟฟ้าพุทธมณฑล 3 พื้นที่ 2.5 ไร่', amt: 6500 },
  ],
  sprayItems: [
    { station: 'ศาลายา', area: '3', price: 1500, subtotal: 4500, description: 'จ้างฉีดยากำจัดวัชพืชสถานีไฟฟ้าศาลายา พื้นที่ 3 ไร่', amt: 4500 },
    { station: 'พุทธมณฑล 2', area: '2', price: 1500, subtotal: 3000, description: 'จ้างฉีดยากำจัดวัชพืชสถานีไฟฟ้าพุทธมณฑล 2 พื้นที่ 2 ไร่', amt: 3000 },
    { station: 'พุทธมณฑล 3', area: '2.5', price: 1500, subtotal: 3750, description: 'จ้างฉีดยากำจัดวัชพืชสถานีไฟฟ้าพุทธมณฑล 3 พื้นที่ 2.5 ไร่', amt: 3750 },
  ],

  // Purchase Order specific
  vendorAddress: 'เลขที่ 68 หมู่ที่ 2 ต.คลองโยง อ.พุทธมณฑล จ.นครปฐม 73170',
  vendorPhone: '080-8545-4545',
  bankAccount: '',
  bankName: 'นางธนภรณ์ เกื้อผล',
  bankBranch: '',
  poItems: [
    { item: 'จ้างตัดหญ้าและฉีดยากำจัดวัชพีช สถานีไฟฟ้าศาลายา', quantity: 1, unit: 'สถานี', price: 2080, subtotal: 2080 },
    { item: 'จ้างตัดหญ้าและฉีดยากำจัดวัชพีช สถานีไฟฟ้าพุทธมณฑล 2', quantity: 1, unit: 'สถานี', price: 1580, subtotal: 1580 },
    { item: 'จ้างตัดหญ้าและฉีดยากำจัดวัชพีช สถานีไฟฟ้าพุทธมณฑล 3', quantity: 1, unit: 'สถานี', price: 1564, subtotal: 1564 },
  ],
  poVat: 0,
  poTotal: 5224,
  warrantyYears: 2,
  penaltyRate: '0.20',
  deliveryPlace: 'สถานีไฟฟ้าศาลายา, สถานีไฟฟ้าพุทธมณฑล 2 และสถานีไฟฟ้าพุทธมณฑล 3',
  poDate: '22 มีนาคม 2569',
};

export default function App() {
  const [data, setData] = useState<ProcurementDoc>(initialData);
  const [isPreview, setIsPreview] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>('SUMMARY');
  const [procurementType, setProcurementType] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0); // 0: Type, 1: Common, 2: Specific
  const printRef = useRef<HTMLDivElement>(null);

  const updateSubjects = (type: string, currentData: ProcurementDoc) => {
    let itemText = '';
    
    if (type === 'CLEANING') {
      itemText = 'จ้างทำความสะอาดอาคารและสำนักงาน';
    } else if (type === 'MOWING') {
      itemText = 'จ้างตัดหญ้าและฉีดยากำจัดวัชพืช';
    } else if (type === 'PURCHASE_OTHER') {
      itemText = 'จัดซื้อพัสดุและอุปกรณ์อื่นๆ';
    } else if (type === 'SERVICE_OTHER') {
      itemText = 'จัดจ้างบริการและงานซ่อมแซมอื่นๆ';
    }

    return {
      ...currentData,
      item: itemText,
      subjectApproval: `ขอความเห็นชอบดำเนินการ${itemText}ในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ ${currentData.stationCount}`,
      subjectAssignment: `มอบหมายผู้จัดทำรายละเอียดคุณลักษณะเฉพาะของพัสดุ และกำหนดราคากลาง สำหรับงานขอ${itemText}สถานีไฟฟ้าในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ ${currentData.stationCount} ด้วยวิธีเฉพาะเจาะจง`,
      subjectReport: `รายงานขอ${itemText}สถานีไฟฟ้าในหน่วยปฏิบัติงานสถานีไฟฟ้าที่ ${currentData.stationCount} ด้วยวิธีเฉพาะเจาะจง`,
      subjectSummary: `รายงานสรุปผลการพิจารณา ตรวจรับ และอนุมัติจ่ายเงิน`,
    };
  };

  const handleSelectProcurement = (type: string) => {
    setProcurementType(type);
    setData(prev => updateSubjects(type, prev));
    setActiveStep(1);
  };

  const handleCommitteeChange = (index: number, field: 'name' | 'position', value: string) => {
    setData(prev => {
      const newCommittee = [...prev.committee];
      newCommittee[index] = { ...newCommittee[index], [field]: value };
      return { ...prev, committee: newCommittee };
    });
  };

  const thaiToArabic = (str: string) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[๐-๙]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 2400 + 48));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const arabicValue = thaiToArabic(value);
    const finalValue = type === 'number' ? parseFloat(arabicValue) || 0 : arabicValue;

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

  const numberToThaiText = (num: number) => {
    if (num === 0) return 'ศูนย์บาทถ้วน';
    const thaiNumbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    
    const [baht, satang] = num.toFixed(2).split('.');
    
    const convert = (n: string) => {
      let res = '';
      const len = n.length;
      for (let i = 0; i < len; i++) {
        const digit = parseInt(n[i]);
        if (digit !== 0) {
          if (i === len - 1 && digit === 1 && len > 1) {
            res += 'เอ็ด';
          } else if (i === len - 2 && digit === 2) {
            res += 'ยี่';
          } else if (i === len - 2 && digit === 1) {
            res += '';
          } else {
            res += thaiNumbers[digit];
          }
          res += thaiUnits[len - i - 1];
        }
      }
      return res;
    };

    let result = convert(baht) + 'บาท';
    if (satang === '00') {
      result += 'ถ้วน';
    } else {
      result += convert(satang) + 'สตางค์';
    }
    return result;
  };

  const updateGrassItem = (index: number, field: string, value: any) => {
    setData(prev => {
      const newItems = [...prev.grassItems];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'price') {
        newItems[index].subtotal = value;
      }
      return { ...prev, grassItems: newItems };
    });
  };

  const updateSprayItem = (index: number, field: string, value: any) => {
    setData(prev => {
      const newItems = [...prev.sprayItems];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'price') {
        newItems[index].subtotal = value;
      }
      return { ...prev, sprayItems: newItems };
    });
  };

  const updatePOItem = (index: number, field: string, value: any) => {
    setData(prev => {
      const newItems = [...prev.poItems];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'price' || field === 'quantity') {
        newItems[index].subtotal = newItems[index].price * newItems[index].quantity;
      }
      const newSubtotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      return { ...prev, poItems: newItems, poTotal: newSubtotal + prev.poVat };
    });
  };

  const grassTotalArea = data.grassItems.reduce((sum, item) => sum + parseFloat(item.area || '0'), 0);
  const grassTotalAmt = data.grassItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const sprayTotalArea = data.sprayItems.reduce((sum, item) => sum + parseFloat(item.area || '0'), 0);
  const sprayTotalAmt = data.sprayItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const poSubtotal = data.poItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Derived values for Summary and Report
  const summaryPriceBeforeVat = procurementType === 'MOWING' ? (grassTotalAmt + sprayTotalAmt) : data.priceBeforeVat;
  const summaryVatAmount = procurementType === 'MOWING' ? (summaryPriceBeforeVat * 0.07) : data.vatAmount;
  const summaryTotalAmount = procurementType === 'MOWING' ? (summaryPriceBeforeVat + summaryVatAmount) : data.totalAmount;

  const fillSampleData = () => {
    setData(prev => ({
      ...prev,
      unitName: 'หน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4 (สถานีไฟฟ้าศาลายา)',
      budgetYear: '2569',
      date: '22 มีนาคม 2569',
      docNumber: 'ก.3 กปบ.(จฟ.1)                /2569',
      department: 'แผนกจัดการสถานีไฟฟ้า 1',
      phone: '10520-21',
      signer1: { name: 'นายภานุพงค์ เจนสุริยะกุล', position: 'หผ.จฟ.1 กปบ.(ก3)' },
      signer2: { name: 'นายเลอพงศ์ แก่นจันทร์', position: 'อก.ปบ.(ก3)' },
    }));
  };

  return (
    <div className="min-h-screen bg-[#e8edf2] font-sans text-[#1a1a2e]">
      {/* App Header */}
      <header className="bg-gradient-to-br from-[#003087] via-[#0052cc] to-[#0073e6] text-white px-8 py-4 flex items-center gap-4 shadow-lg sticky top-0 z-[100] print:hidden">
        <div className="w-12 h-12 bg-white/15 border-2 border-white/50 rounded-full flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">การไฟฟ้าส่วนภูมิภาค</h1>
          <p className="text-sm opacity-80">ระบบแบบฟอร์มจัดจ้าง — หน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4 (สถานีไฟฟ้าศาลายา)</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b-[3px] border-[#003087] flex overflow-x-auto px-6 gap-0.5 shadow-md sticky top-[80px] z-[90] print:hidden">
        {[
          { id: 'APPROVAL', label: 'บันทึกขอความเห็นชอบ', num: 1 },
          { id: 'ASSIGNMENT', label: 'มอบหมายจัดทำคุณลักษณะ', num: 2 },
          { id: 'REPORT', label: 'รายงานขอจัดจ้าง', num: 3 },
          { id: 'PURCHASE_ORDER', label: 'ใบสั่งจ้าง', num: 4 },
          { id: 'SUMMARY', label: 'สรุปผลพิจารณาและตรวจรับ', num: 5 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentForm(tab.id as FormType)}
            className={`px-5 py-3 border-b-[3px] transition-all whitespace-nowrap font-medium text-sm flex items-center gap-1.5 ${
              currentForm === tab.id
                ? 'text-[#003087] border-[#003087] font-bold bg-[#f0f4ff]'
                : 'text-[#555] border-transparent hover:text-[#003087] hover:bg-[#f0f4ff]'
            }`}
          >
            <span className={`w-[22px] h-[22px] rounded-full text-[12px] flex items-center justify-center ${
              currentForm === tab.id ? 'bg-[#0052cc] text-white' : 'bg-[#003087] text-white'
            }`}>
              {tab.num}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Progress Stepper */}
      {!isPreview && (
        <div className="max-w-[960px] mx-auto px-7 pt-8 print:hidden">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
            {[
              { step: 0, label: 'เลือกประเภทงาน', icon: ClipboardList },
              { step: 1, label: 'ข้อมูลส่วนกลาง', icon: ClipboardList },
              { step: 2, label: 'ข้อมูลเฉพาะฟอร์ม', icon: FileText },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    activeStep === s.step 
                      ? 'bg-[#003087] border-[#003087] text-white shadow-lg scale-110' 
                      : activeStep > s.step 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {activeStep > s.step ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  activeStep === s.step ? 'text-[#003087]' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-[960px] mx-auto p-7">
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl p-10 border border-white/20"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#003087] to-[#0052cc] rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl mb-6 rotate-3">
                <FileText size={40} />
              </div>
              <h2 className="text-3xl font-black text-[#1a1a2e] mb-3">ยินดีต้อนรับสู่ระบบจัดทำเอกสารอัจฉริยะ</h2>
              <p className="text-slate-500 font-medium">กรุณาเลือกหัวข้อการจัดซื้อจัดจ้างเพื่อเริ่มต้น</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'CLEANING', label: 'จ้างทำความสะอาด', icon: CheckCircle2, color: 'blue', desc: 'จัดทำเอกสารเกี่ยวกับการจ้างเหมาทำความสะอาดอาคารและสำนักงาน' },
                { id: 'MOWING', label: 'จ้างตัดหญ้า', icon: ClipboardList, color: 'emerald', desc: 'จัดทำเอกสารเกี่ยวกับการจ้างเหมาตัดหญ้าและดูแลสวนบริเวณสถานีไฟฟ้า' },
                { id: 'PURCHASE_OTHER', label: 'จัดซื้ออื่นๆ', icon: ShoppingCart, color: 'purple', desc: 'จัดทำเอกสารเกี่ยวกับการจัดซื้อพัสดุและอุปกรณ์อื่นๆ' },
                { id: 'SERVICE_OTHER', label: 'จัดจ้างอื่นๆ', icon: Settings, color: 'orange', desc: 'จัดทำเอกสารเกี่ยวกับการจัดจ้างบริการและงานซ่อมแซมอื่นๆ' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectProcurement(item.id as any)}
                  className="group relative overflow-hidden bg-white border-2 border-slate-100 hover:border-[#003087] p-8 rounded-3xl transition-all duration-300 text-left shadow-sm hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003087] mb-6 group-hover:bg-[#003087] group-hover:text-white transition-colors duration-300">
                      <item.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">{item.label}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Provincial Electricity Authority • Smart Procurement System</p>
            </div>
          </motion.div>
        )}

        {activeStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 bg-[#003087]/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#003087]">ข้อมูลส่วนกลาง (Common Data)</h2>
                <p className="text-slate-500 mt-1">กรอกข้อมูลที่ใช้ร่วมกันในทุกฟอร์มเพียงครั้งเดียว</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fillSampleData}
                  className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all text-sm font-bold flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  เติมข้อมูลตัวอย่าง
                </button>
                <button
                  onClick={() => setActiveStep(0)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white transition-all text-sm font-medium flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  ย้อนกลับ
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ชื่อหน่วยงาน</label>
                  <input name="unitName" value={data.unitName} onChange={handleChange} placeholder="เช่น หน่วยปฏิบัติงานสถานีไฟฟ้าที่ 4" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ปีงบประมาณ</label>
                  <input name="budgetYear" value={data.budgetYear} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">วันที่ในเอกสาร</label>
                  <input name="date" value={data.date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">เลขที่หนังสือ (ส่วนหน้า)</label>
                  <input name="docNumber" value={data.docNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">แผนก</label>
                  <input name="department" value={data.department} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">เบอร์โทรศัพท์</label>
                  <input name="phone" value={data.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ผู้ลงนาม 1 (หผ.)</label>
                  <input name="signer1.name" value={data.signer1.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ตำแหน่งผู้ลงนาม 1</label>
                  <input name="signer1.position" value={data.signer1.position} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ผู้ลงนาม 2 (อก.)</label>
                  <input name="signer2.name" value={data.signer2.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ตำแหน่งผู้ลงนาม 2</label>
                  <input name="signer2.position" value={data.signer2.position} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-10 py-3 rounded-xl bg-[#003087] text-white hover:bg-[#0052cc] shadow-lg font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  ถัดไป: กรอกข้อมูลเฉพาะฟอร์ม
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 2 && !isPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e]">
                  {currentForm === 'APPROVAL' && '1. บันทึกขอความเห็นชอบดำเนินการ'}
                  {currentForm === 'ASSIGNMENT' && '2. มอบหมายจัดทำคุณลักษณะ'}
                  {currentForm === 'REPORT' && '3. รายงานขอจัดจ้าง'}
                  {currentForm === 'PURCHASE_ORDER' && '4. ใบสั่งจ้าง (Purchase Order)'}
                  {currentForm === 'SUMMARY' && '5. สรุปผลพิจารณาและตรวจรับ'}
                </h2>
                <p className="text-slate-500 mt-1">กรอกเฉพาะข้อมูลที่แตกต่างในฟอร์มนี้</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white transition-all text-sm font-medium flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  แก้ไขข้อมูลส่วนกลาง
                </button>
                <button
                  onClick={() => setIsPreview(true)}
                  className="px-6 py-2 rounded-xl bg-[#003087] text-white hover:bg-[#0052cc] shadow-lg transition-all text-sm font-bold flex items-center gap-2"
                >
                  <Eye size={16} />
                  ดูตัวอย่าง & พิมพ์
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Common Fields Summary (Read Only) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-400 uppercase tracking-wider mb-1">หน่วยงาน</span>
                  <span className="text-slate-700 font-medium">{data.unitName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-400 uppercase tracking-wider mb-1">วันที่</span>
                  <span className="text-slate-700 font-medium">{data.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-400 uppercase tracking-wider mb-1">ปีงบประมาณ</span>
                  <span className="text-slate-700 font-medium">{data.budgetYear}</span>
                </div>
              </div>

              {/* Form Specific Fields */}
              {currentForm === 'APPROVAL' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">จำนวนสถานีไฟฟ้า</label>
                    <input name="stationCount" value={data.stationCount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">รายชื่อสถานี</label>
                    <input name="stationList" value={data.stationList} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ชื่อบัญชี</label>
                    <input name="accountName" value={data.accountName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">รหัสบัญชี</label>
                    <input name="accountCode" value={data.accountCode} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                </div>
              )}

              {currentForm === 'ASSIGNMENT' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-sm text-[#003087] border-b pb-2">คณะกรรมการจัดทำคุณลักษณะและกำหนดราคากลาง</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {data.committee.map((member, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                          <input 
                            value={member.name} 
                            onChange={(e) => handleCommitteeChange(idx, 'name', e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ตำแหน่งในคณะกรรมการ</label>
                          <input 
                            value={member.position} 
                            onChange={(e) => handleCommitteeChange(idx, 'position', e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentForm === 'SUMMARY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">เลขที่สัญญา/ใบสั่งจ้าง</label>
                    <input name="contractNumber" value={data.contractNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">กำหนดส่งมอบ</label>
                    <input name="deliveryDate" value={data.deliveryDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ผู้ตรวจรับ (ชื่อ)</label>
                    <input name="receiver.name" value={data.receiver.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ผู้ตรวจรับ (ตำแหน่ง)</label>
                    <input name="receiver.position" value={data.receiver.position} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                  </div>
                </div>
              )}

              {currentForm === 'REPORT' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">เหตุผลความจำเป็น</label>
                      <textarea name="reason" value={data.reason} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">วิธีจัดจ้าง</label>
                      <input name="procurementMethod" value={data.procurementMethod} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                    </div>
                  </div>
                  
                  {procurementType === 'MOWING' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-sm text-[#003087] border-b pb-2">ตารางรายละเอียดพื้นที่ (หญ้า)</h3>
                      <div className="overflow-x-auto border rounded-xl">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="p-3 text-left">ลำดับ</th>
                              <th className="p-3 text-left">สถานีไฟฟ้า</th>
                              <th className="p-3 text-left">พื้นที่ (ตร.ม.)</th>
                              <th className="p-3 text-left">จำนวนเงิน</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.grassItems.map((item, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3"><input value={item.station} onChange={(e) => updateGrassItem(idx, 'station', e.target.value)} className="w-full bg-transparent outline-none" /></td>
                                <td className="p-3"><input value={item.area} onChange={(e) => updateGrassItem(idx, 'area', e.target.value)} className="w-full bg-transparent outline-none" /></td>
                                <td className="p-3"><input type="number" value={item.price} onChange={(e) => updateGrassItem(idx, 'price', parseFloat(e.target.value))} className="w-full bg-transparent outline-none" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentForm === 'PURCHASE_ORDER' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ชื่อผู้รับจ้าง</label>
                      <input name="supplierName" value={data.supplierName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ที่อยู่ผู้รับจ้าง</label>
                      <input name="vendorAddress" value={data.vendorAddress} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003087] outline-none text-sm" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-bold text-sm text-[#003087] border-b pb-2">รายการสั่งจ้าง</h3>
                    <div className="overflow-x-auto border rounded-xl">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-3 text-left">รายการ</th>
                            <th className="p-3 text-right">จำนวน</th>
                            <th className="p-3 text-left">หน่วย</th>
                            <th className="p-3 text-right">ราคา/หน่วย</th>
                            <th className="p-3 text-right">รวม</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.poItems.map((item, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="p-3"><input value={item.description} onChange={(e) => updatePOItem(idx, 'description', e.target.value)} className="w-full bg-transparent outline-none" /></td>
                              <td className="p-3 text-right"><input type="number" value={item.quantity} onChange={(e) => updatePOItem(idx, 'quantity', parseFloat(e.target.value))} className="w-16 text-right bg-transparent outline-none" /></td>
                              <td className="p-3"><input value={item.unit} onChange={(e) => updatePOItem(idx, 'unit', e.target.value)} className="w-16 bg-transparent outline-none" /></td>
                              <td className="p-3 text-right"><input type="number" value={item.price} onChange={(e) => updatePOItem(idx, 'price', parseFloat(e.target.value))} className="w-24 text-right bg-transparent outline-none" /></td>
                              <td className="p-3 text-right">{item.subtotal.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold">
                          <tr>
                            <td colSpan={4} className="p-3 text-right">รวมเงิน</td>
                            <td className="p-3 text-right">{poSubtotal.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td colSpan={4} className="p-3 text-right">ภาษีมูลค่าเพิ่ม (7%)</td>
                            <td className="p-3 text-right"><input type="number" value={data.poVat} onChange={(e) => setData(prev => ({ ...prev, poVat: parseFloat(e.target.value), poTotal: poSubtotal + parseFloat(e.target.value) }))} className="w-24 text-right bg-transparent outline-none" /></td>
                          </tr>
                          <tr className="text-[#003087]">
                            <td colSpan={4} className="p-3 text-right">รวมเป็นเงินทั้งสิ้น</td>
                            <td className="p-3 text-right">{data.poTotal.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <button
                  disabled={currentForm === 'APPROVAL'}
                  onClick={() => {
                    const forms: FormType[] = ['APPROVAL', 'ASSIGNMENT', 'REPORT', 'PURCHASE_ORDER', 'SUMMARY'];
                    const idx = forms.indexOf(currentForm);
                    setCurrentForm(forms[idx - 1]);
                  }}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 font-medium"
                >
                  ย้อนกลับ
                </button>
                <button
                  disabled={currentForm === 'SUMMARY'}
                  onClick={() => {
                    const forms: FormType[] = ['APPROVAL', 'ASSIGNMENT', 'REPORT', 'PURCHASE_ORDER', 'SUMMARY'];
                    const idx = forms.indexOf(currentForm);
                    setCurrentForm(forms[idx + 1]);
                  }}
                  className="px-8 py-2.5 rounded-xl bg-[#003087] text-white hover:bg-[#0052cc] shadow-lg font-bold flex items-center gap-2"
                >
                  ถัดไป
                  <ChevronLeft size={18} className="rotate-180" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        
        {isPreview && (
          <>
            <div className={`print-container bg-white shadow-2xl border border-stone-200 pt-[0.25cm] px-[1.5cm] pb-[0.2cm] min-h-[297mm] w-[210mm] ${currentForm === 'SUMMARY' ? 'text-[14pt]' : 'text-[16pt]'} leading-normal font-serif text-black relative flex flex-col`}>
                {/* Header */}
                {currentForm !== 'PURCHASE_ORDER' && (
                  <div className="flex flex-col items-start mb-4">
                    {data.logoUrl ? (
                      <img src={data.logoUrl} alt="PEA Logo" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: PEA_LOGO_SVG }} className="w-20 h-20" />
                    )}
                    <div className="text-left mt-1 leading-tight">
                      <p className="text-[14pt] font-bold">การไฟฟ้าส่วนภูมิภาค</p>
                      <p className="text-[10pt] font-bold">PROVINCIAL ELECTRICITY AUTHORITY</p>
                    </div>
                  </div>
                )}

                {currentForm === 'PURCHASE_ORDER' && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      {data.logoUrl ? (
                        <img src={data.logoUrl} alt="PEA Logo" className="w-24 h-24 object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: PEA_LOGO_SVG }} className="w-24 h-24" />
                      )}
                      <div className="text-right">
                        <h2 className="text-[24pt] font-bold text-[#003087]">ใบสั่งจ้าง</h2>
                        <p className="text-[16pt] font-bold">Purchase Order</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-6 text-[14pt]">
                      <div className="border border-black p-4 rounded-lg">
                        <p className="font-bold border-b border-black mb-2 pb-1">ผู้รับจ้าง / Vendor:</p>
                        <p className="font-bold text-[16pt]">{data.supplierName}</p>
                        <p className="mt-1">{data.vendorAddress}</p>
                      </div>
                      <div className="border border-black p-4 rounded-lg space-y-2">
                        <div className="flex justify-between border-b border-dotted border-black pb-1">
                          <span className="font-bold">เลขที่ / PO No.:</span>
                          <span>{data.docNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-black pb-1">
                          <span className="font-bold">วันที่ / Date:</span>
                          <span>{data.date}</span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-black pb-1">
                          <span className="font-bold">หน่วยงาน / Unit:</span>
                          <span>{data.unitName}</span>
                        </div>
                      </div>
                    </div>

                    <table className="w-full border-collapse border border-black mb-6 text-[14pt]">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="border border-black p-2 text-center w-12">ลำดับ</th>
                          <th className="border border-black p-2 text-center">รายการ / Description</th>
                          <th className="border border-black p-2 text-center w-20">จำนวน</th>
                          <th className="border border-black p-2 text-center w-20">หน่วย</th>
                          <th className="border border-black p-2 text-center w-28">ราคา/หน่วย</th>
                          <th className="border border-black p-2 text-center w-32">จำนวนเงิน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.poItems.map((item, idx) => (
                          <tr key={idx} className="h-10">
                            <td className="border border-black p-2 text-center">{idx + 1}</td>
                            <td className="border border-black p-2">{item.description}</td>
                            <td className="border border-black p-2 text-center">{item.quantity}</td>
                            <td className="border border-black p-2 text-center">{item.unit}</td>
                            <td className="border border-black p-2 text-right">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="border border-black p-2 text-right">{item.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                        {[...Array(Math.max(0, 10 - data.poItems.length))].map((_, i) => (
                          <tr key={`empty-${i}`} className="h-10">
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="font-bold">
                        <tr>
                          <td colSpan={4} rowSpan={3} className="border border-black p-3 align-top italic text-[12pt]">
                            <p className="font-bold not-italic underline mb-1">เงื่อนไขการจ้าง:</p>
                            <p>1. ผู้รับจ้างต้องดำเนินการให้แล้วเสร็จภายในกำหนดเวลาที่ระบุไว้</p>
                            <p>2. การจ่ายเงินจะกระทำเมื่อคณะกรรมการตรวจรับพัสดุได้ตรวจรับงานงวดนั้นๆ เรียบร้อยแล้ว</p>
                            <p>3. หากส่งมอบงานเกินกำหนด จะต้องชำระค่าปรับตามระเบียบของ กฟภ.</p>
                          </td>
                          <td className="border border-black p-2 text-right">รวมเงิน / Subtotal</td>
                          <td className="border border-black p-2 text-right">{poSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-right">ภาษีมูลค่าเพิ่ม / VAT 7%</td>
                          <td className="border border-black p-2 text-right">{data.poVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-black p-2 text-right text-[16pt]">รวมทั้งสิ้น / Total</td>
                          <td className="border border-black p-2 text-right text-[16pt]">{data.poTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="mt-auto grid grid-cols-2 gap-12 pt-12 text-[14pt]">
                      <div className="text-center space-y-20">
                        <p>ลงชื่อ..........................................................ผู้สั่งจ้าง</p>
                        <div className="leading-tight">
                          <p className="font-bold m-0">( {data.signer2.name} )</p>
                          <p className="m-0">{data.signer2.position}</p>
                        </div>
                      </div>
                      <div className="text-center space-y-20">
                        <p>ลงชื่อ..........................................................ผู้รับใบสั่งจ้าง</p>
                        <div className="leading-tight">
                          <p className="m-0">(..........................................................)</p>
                          <p className="m-0">วันที่........./........./.........</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentForm !== 'PURCHASE_ORDER' && (
                  <React.Fragment>
                    {currentForm !== 'SUMMARY' && currentForm !== 'APPROVAL' && (
                      <div className="text-center mb-4 h-8">
                        {/* Removed บันทึกข้อความ */}
                      </div>
                    )}

                    {currentForm === 'APPROVAL' ? (
                  <div className="space-y-1 mb-4">
                    <div className="flex">
                      <div className="w-[9cm] flex gap-2">
                        <span className="font-bold shrink-0 w-[1.2cm]">จาก</span>
                        <span className="px-1">{data.from}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0 w-[1cm]">ถึง</span>
                        <span className="px-1">{data.recipient}</span>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[9cm] flex gap-2">
                        <span className="font-bold shrink-0 w-[1.2cm]">เลขที่</span>
                        <span className="px-1">{data.docNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0 w-[1cm]">วันที่</span>
                        <span className="px-1">{data.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0 w-[1.2cm]">เรื่อง</span>
                        <span className="px-1 font-bold">
                          {data.subjectApproval}
                        </span>
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
                    <div className="flex gap-4">
                      <div className="flex gap-2 flex-1">
                        <span className="font-bold shrink-0">ที่</span>
                        <span className="flex-1 px-2 leading-none">{data.docNumber}</span>
                      </div>
                      <div className="flex gap-2 flex-1">
                        <span className="font-bold shrink-0">วันที่</span>
                        <span className="flex-1 px-2 leading-none">{data.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold shrink-0">เรื่อง</span>
                      <span className="flex-1 px-2 font-bold leading-none">
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
                        <span className="flex-1 px-1">{data.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="font-bold shrink-0">เรื่อง</span>
                      <span className="flex-1 px-1 font-bold">{data.subjectSummary}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold shrink-0">เรียน</span>
                      <span className="flex-1 px-1">
                        {data.to} {data.through && <span className="ml-2">ผ่าน {data.through}</span>}
                      </span>
                    </div>
                  </div>
                )}

                {currentForm !== 'SUMMARY' && currentForm !== 'APPROVAL' && (
                  <div className="mb-4">
                    <p><span className="font-bold">เรียน</span> <span className="ml-2">{data.to}</span> {data.through && <span className="ml-2">ผ่าน <span>{data.through}</span></span>}</p>
                  </div>
                )}

                {/* Main Content */}
                <div className="flex-1">
                  {currentForm === 'APPROVAL' && (
                    <div className="space-y-4 mt-4">
                      <section>
                        <h3 className="font-bold mb-1 ml-[1.5cm]">1. ข้อมูล</h3>
                        <p className="ml-0 indent-[2.5cm] leading-relaxed">
                          หน่วยปฏิบัติงานสถานีไฟฟ้าที่ <span>{data.stationCount}</span> สังกัด <span>{data.signer1Unit}</span> มีความประสงค์จัดจ้างตัดหญ้าและฉีดยากำจัดวัชพืชที่ <span>{data.stationList}</span>
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 ml-[1.5cm]">2. ข้อพิจารณา</h3>
                        <p className="ml-0 indent-[2.5cm] leading-relaxed">
                          <span>{data.signer1Unit}</span> ได้พิจารณาแล้วเพื่อความเรียบร้อยและปรับปรุงภูมิทัศน์ของสถานีไฟฟ้าให้เป็นระเบียบ เป็นการสร้างภาพลักษณ์ที่ดีต่อองค์กร โดยใช้ราคากลางอ้างอิงตามพระราชบัญญัติการจัดซื้อจัดจ้างและบริหารพัสดุภาครัฐ พ.ศ. 2560 และขออนุมัติความเห็นชอบดำเนินการ<span>{data.item}</span>ดังกล่าว โดยให้เบิกจ่ายจากงบทำการ ประจำปี <span>{data.budgetYear}</span> <span>{data.accountName}</span> รหัสบัญชี <span>{data.accountCode}</span> ของ <span>{data.signer1Unit}</span> ศูนย์ต้นทุน <span>{data.costCenter}</span> ต่อไป
                        </p>
                        <p className="ml-0 indent-[4cm] mt-6">
                          จึงเรียนมาเพื่อโปรดพิจารณาหากเห็นชอบและโปรดลงนามให้ต่อไป
                        </p>
                      </section>
                    </div>
                  )}

                  {currentForm === 'ASSIGNMENT' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">1. ข้อมูล</h3>
                        <p className="indent-[2.5cm] leading-relaxed">
                          ตามที่ <span>{data.signer1Unit}</span> ได้รับอนุมัติให้ดำเนินการ<span>{data.item}</span> ตามบันทึกที่ <span>{data.docNumber}</span> ลว. <span>{data.date}</span> นั้น
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
                            <p key={index}>{index + 1}. <span>{member.name}</span> ตำแหน่ง <span>{member.position}</span></p>
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
                          <span>{data.reason}</span>
                        </p>
                      </section>

                      <section>
                        <h3 className="font-bold mb-1 indent-[2.5cm]">2. รายละเอียดการจัดจ้าง</h3>
                        <p className="indent-[2.5cm] leading-relaxed mb-4">
                          ดำเนินการ<span>{data.item}</span> โดยวิธี <span>{data.procurementMethod}</span> 
                          ราคากลางเป็นเงิน <span>{summaryTotalAmount.toLocaleString('th-TH-u-nu-latn', {minimumFractionDigits: 2})}</span> บาท (รวมภาษีมูลค่าเพิ่ม)
                          โดยใช้เงินงบประมาณปี <span>{data.budgetYear}</span> หมายเลขงาน <span>{data.wbs}</span>
                        </p>
                        
                        <div className="ml-[1cm] space-y-6">
                          {procurementType === 'MOWING' && (
                            <>
                              <div>
                                <p className="font-bold mb-2">2.1 ตารางจัดจ้างตัดหญ้าสถานีไฟฟ้า (ใช้เครื่องมือผู้รับจ้าง)</p>
                                <table className="w-[12cm] ml-auto border-collapse border border-black text-center text-[14pt]">
                                  <thead>
                                    <tr>
                                      <th className="border border-black p-1 w-12">ที่</th>
                                      <th className="border border-black p-1">รายการ</th>
                                      <th className="border border-black p-1 w-32">จำนวนเงิน (บาท)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data.grassItems.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="border border-black p-1">{idx + 1}</td>
                                        <td className="border border-black p-1 text-left px-2">{item.description}</td>
                                        <td className="border border-black p-1 text-right px-2">{item.amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                    ))}
                                    <tr>
                                      <td colSpan={2} className="border border-black p-1 font-bold">รวม</td>
                                      <td className="border border-black p-1 text-right px-2 font-bold">{grassTotalAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <div>
                                <p className="font-bold mb-2">2.2 ตารางจัดจ้างฉีดยากำจัดวัชพืชสถานีไฟฟ้า (ใช้เครื่องมือผู้รับจ้าง)</p>
                                <table className="w-[12cm] ml-auto border-collapse border border-black text-center text-[14pt]">
                                  <thead>
                                    <tr>
                                      <th className="border border-black p-1 w-12">ที่</th>
                                      <th className="border border-black p-1">รายการ</th>
                                      <th className="border border-black p-1 w-32">จำนวนเงิน (บาท)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data.sprayItems.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="border border-black p-1">{idx + 1}</td>
                                        <td className="border border-black p-1 text-left px-2">{item.description}</td>
                                        <td className="border border-black p-1 text-right px-2">{item.amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                    ))}
                                    <tr>
                                      <td colSpan={2} className="border border-black p-1 font-bold">รวม</td>
                                      <td className="border border-black p-1 text-right px-2 font-bold">{sprayTotalAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}
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
                        ตามที่ <span>{data.signer1Unit}</span> ดำเนินการ<span>{data.item}</span> โดยวิธีเฉพาะเจาะจง ขอรายงานผลการพิจารณาการจัดซื้อ/จ้าง ดังนี้
                      </p>

                      <table className="w-[14cm] ml-auto border-collapse border border-black mb-4 text-center">
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
                          {procurementType === 'MOWING' ? (
                            <>
                              {data.grassItems.map((item, idx) => (
                                <tr key={`grass-${idx}`}>
                                  <td className="border border-black p-1">{idx + 1}</td>
                                  <td className="border border-black p-1 text-left px-2">{item.description || `จ้างตัดหญ้าสถานีไฟฟ้า${item.station}`}</td>
                                  <td className="border border-black p-1 text-right px-2">{(item.amt || item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                  <td className="border border-black p-1">-</td>
                                  <td className="border border-black p-1 text-right px-2">{(item.amt || item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                              ))}
                              {data.sprayItems.map((item, idx) => (
                                <tr key={`spray-${idx}`}>
                                  <td className="border border-black p-1">{data.grassItems.length + idx + 1}</td>
                                  <td className="border border-black p-1 text-left px-2">{item.description || `จ้างฉีดยากำจัดวัชพืชสถานีไฟฟ้า${item.station}`}</td>
                                  <td className="border border-black p-1 text-right px-2">{(item.amt || item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                  <td className="border border-black p-1">-</td>
                                  <td className="border border-black p-1 text-right px-2">{(item.amt || item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2} className="border border-black p-1 font-bold">รวม</td>
                                <td className="border border-black p-1 text-right px-2 font-bold">{(grassTotalAmt + sprayTotalAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="border border-black p-1 font-bold">-</td>
                                <td className="border border-black p-1 text-right px-2 font-bold">{(grassTotalAmt + sprayTotalAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td className="border border-black p-1">1</td>
                              <td className="border border-black p-1 text-left px-2">{data.item}</td>
                              <td className="border border-black p-1 text-right px-2">{data.priceBeforeVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="border border-black p-1 text-right px-2">{data.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="border border-black p-1 text-right px-2">{data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={2} className="border border-black p-1 font-bold">ภาษีมูลค่าเพิ่ม 7%</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 text-right px-2 font-bold">{summaryVatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td colSpan={2} className="border border-black p-1 font-bold">รวมเงินทั้งสิ้น</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 font-bold">-</td>
                            <td className="border border-black p-1 text-right px-2 font-bold">{summaryTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        </tbody>
                      </table>

                      <p className="indent-[1.5cm] mb-2 leading-relaxed">
                        <span>{data.signer1Unit}</span> พิจารณาแล้ว เห็นสมควรดำเนินการ จาก <span>{data.supplierName}</span> จำนวนเงิน <span>{summaryPriceBeforeVat.toLocaleString('th-TH-u-nu-latn', {minimumFractionDigits: 2})}</span> บาท ภาษีมูลค่าเพิ่ม <span>{summaryVatAmount.toLocaleString('th-TH-u-nu-latn', {minimumFractionDigits: 2})}</span> บาท เป็นเงินทั้งสิ้น <span>{summaryTotalAmount.toLocaleString('th-TH-u-nu-latn', {minimumFractionDigits: 2})}</span> บาท (<span>{numberToThaiText(summaryTotalAmount)}</span>) รวมภาษีมูลค่าเพิ่ม
                      </p>

                      <p className="indent-[1.5cm] mb-6">
                        จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบ ขอได้โปรดอนุมัติให้สั่งซื้อ/จ้าง จากผู้เสนอราคาดังกล่าว พร้อมทั้งแจ้งคณะกรรมการตรวจรับ ดำเนินการต่อไป
                      </p>

                      {/* Signature Grid from PDF */}
                      <div className="border border-black">
                        <div className="grid grid-cols-2 border-b border-black">
                          <div className="border-r border-black p-4 min-h-[140px] flex flex-col">
                            <p className="text-center font-bold mb-4 leading-tight">เห็นชอบและอนุมัติสั่งซื้อ/สั่งจ้างดำเนินการได้ โดยปฏิบัติให้ถูกต้องตามระเบียบ</p>
                            <div className="text-center mt-auto leading-tight">
                              <p className="m-0">( <span>{data.signer2.name}</span> )</p>
                              <p className="m-0"><span>{data.signer2.position}</span></p>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col items-center justify-center">
                            <div className="text-center leading-tight">
                              <p className="mb-6">ลงชื่อ..............................................................</p>
                              <p className="m-0">( <span>{data.signer1.name}</span> )</p>
                              <p className="m-0">ตำแหน่ง <span>{data.signer1.position}</span></p>
                              <p className="mt-4">วันที่........./........../..........</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 border-b border-black">
                          <div className="border-r border-black p-4">
                            <p className="mb-2 font-bold">เรียน {data.to}</p>
                            <p className="indent-[0.8cm] mb-4 leading-tight">คณะกรรมการตรวจรับได้ทำการตรวจรับ <span>{data.item}</span> จำนวน 1 รายการ เมื่อวันที่................................เห็นว่าถูกต้องครบถ้วน เห็นควรรับไว้ใช้งานและเบิกจ่ายเงิน ให้แก่ผู้ขาย/ผู้รับจ้างต่อไป</p>
                            <div className="space-y-4">
                              {data.committee.map((member, idx) => (
                                <div key={idx} className="flex flex-col items-center leading-tight">
                                  <p className="mb-1">ลงชื่อ..............................................................{idx === 0 ? 'ประธานกรรมการ' : 'กรรมการ'}</p>
                                  <p className="m-0">( <span>{member.name}</span> )</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 flex flex-col">
                            <p className="mb-4 leading-tight">ข้าพเจ้าได้รับมอบ<span>{data.item}</span>จำนวน 1 รายการ ดังกล่าว เพื่อนำไปใช้งานแล้วตั้งแต่วันที่............................</p>
                            <div className="text-center mt-auto leading-tight">
                              <p className="mb-6">ลงชื่อ..............................................................(ผู้รับของ)</p>
                              <p className="m-0">( <span>{data.receiver.name}</span> )</p>
                              <p className="m-0">ตำแหน่ง <span>{data.receiver.position}</span></p>
                              <p className="mt-4">วันที่........./........../..........</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2">
                          <div className="border-r border-black p-2 text-[10pt] flex items-end">
                            <p>จซ.(ฉ) 001 – ป.60</p>
                          </div>
                          <div className="p-4 text-center">
                             <p className="mb-4 font-bold">อนุมัติจ่ายเงินจำนวน ทั้งสิ้น <span>{summaryTotalAmount.toLocaleString('th-TH-u-nu-latn', {minimumFractionDigits: 2})}</span> บาท (<span>{numberToThaiText(summaryTotalAmount)}</span>) รวมภาษีมูลค่าเพิ่ม</p>
                             <div className="mt-4 leading-tight">
                               <p className="m-0">( <span>{data.signer2.name}</span> )</p>
                               <p className="m-0"><span>{data.signer2.position}</span></p>
                             </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10pt] mt-2 font-bold">**หมายเหตุ กรณีผู้ขาย/ผู้จ้าง ไม่ได้อยู่ในระบบ VAT ให้ระบุจำนวนเงินไม่รวมภาษีมูลค่าเพิ่ม (ปรับปรุงแบบฟอร์ม วันที่ 18 ก.ย.2561)</p>
                    </div>
                  )}
                </div>
              </React.Fragment>
            )}

                {/* Signatures (Hidden for Form 4 as it has custom grid) */}
                {currentForm !== 'SUMMARY' && currentForm !== 'PURCHASE_ORDER' && (
                  <div className="mt-auto">
                    {currentForm === 'APPROVAL' ? (
                      <div className="mt-12 space-y-12">
                        {/* Signer 1 on the right */}
                        <div className="flex justify-end pr-10">
                          <div className="text-center w-[8cm] leading-tight">
                            <p className="mb-10">( <span>{data.signer1.name}</span> )</p>
                            <p className="m-0"><span>{data.signer1.position}</span></p>
                          </div>
                        </div>

                        {/* Signer 2 on the left */}
                        <div className="space-y-12">
                          <div className="ml-[2.5cm]">
                            <p>เห็นชอบดำเนินการต่อไป</p>
                          </div>
                          
                          <div className="flex justify-start ml-[2.5cm]">
                            <div className="text-center w-[8cm] leading-tight">
                              <p className="mb-10">( <span>{data.signer2.name}</span> )</p>
                              <p className="m-0"><span>{data.signer2.position}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-end pr-10">
                          <div className="text-center w-80 leading-tight">
                            <p className="mb-10">ลงชื่อ..............................................................</p>
                            <p className="m-0">( <span>{data.signer1.name}</span> )</p>
                            <p className="m-0">ตำแหน่ง <span>{data.signer1.position}</span></p>
                          </div>
                        </div>

                        <div className="mt-12 space-y-8">
                          <div className="ml-[1cm]">
                            <p className="font-bold underline">ความเห็นของ <span>{data.signer2.position}</span></p>
                            <p className="mt-2">- เห็นชอบและอนุมัติให้ดำเนินการได้</p>
                          </div>
                          
                          <div className="flex justify-end pr-10">
                            <div className="text-center w-80 leading-tight">
                              <p className="mb-10">ลงชื่อ..............................................................</p>
                              <p className="m-0">( <span>{data.signer2.name}</span> )</p>
                              <p className="m-0">ตำแหน่ง <span>{data.signer2.position}</span></p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-1 text-black border-t border-black flex justify-between items-end w-full flex-nowrap">
                      <div className="leading-tight text-[11pt] flex-shrink-0">
                        <p>แผนกจัดการงานสถานีไฟฟ้า 1</p>
                        <p>เบอร์โทร 10520-21</p>
                      </div>
                      {currentForm === 'APPROVAL' && (
                        <div className="flex justify-end flex-1">
                          <table className="border-collapse border border-black text-[9pt] w-[4.5cm] mb-0">
                            <tbody>
                              <tr className="h-6">
                                <td className="border border-black px-1 py-0 w-[1.2cm] text-center">หผ./ชผ.</td>
                                <td className="border border-black px-1 py-0 w-[1.65cm]"></td>
                                <td className="border border-black px-1 py-0 w-[1.65cm]"></td>
                              </tr>
                              <tr className="h-6">
                                <td className="border border-black px-1 py-0 text-center">พชง.</td>
                                <td className="border border-black px-1 py-0"></td>
                                <td className="border border-black px-1 py-0"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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
            </>
          )}
        </main>
      </div>
    );
}
