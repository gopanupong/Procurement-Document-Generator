export type FormType = 'APPROVAL' | 'ASSIGNMENT' | 'REPORT' | 'SUMMARY';

export interface Signer {
  name: string;
  position: string;
}

export interface ProcurementDoc {
  // Shared Fields
  from: string;
  to: string;
  docNumber: string;
  docYear: string;
  date: string;
  subject: string;
  recipient: string;
  through: string;
  department: string;
  phone: string;
  logoUrl: string;
  item: string;
  budgetYear: string;
  wbs: string;

  // Form 1: Approval specific
  infoSection: {
    requester: string;
    approvalRef: string;
    approvalDate: string;
  };
  considerationSection: {
    requester: string;
  };

  // Form 2: Assignment specific
  committee: Signer[];

  // Form 3: Procurement Report specific
  procurementMethod: string;
  estimatedPrice: number;
  reason: string;

  // Form 4: Summary specific
  supplierName: string;
  contractNumber: string;
  deliveryDate: string;
  priceBeforeVat: number;
  vatAmount: number;
  totalAmount: number;
  totalAmountThai: string;
  receiver: Signer;

  // Signers
  signer1: Signer;
  signer2: Signer;
  signer3?: Signer;

  // New fields for specific template
  unitName: string;
  monthStart: string;
  monthEnd: string;
  parentUnit: string;
  stationCount: string;
  stationList: string;
  accountCode: string;
  costCenter: string;
  signer1Unit: string;
}
