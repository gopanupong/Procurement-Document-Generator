export interface ProcurementDoc {
  from: string;
  to: string;
  docNumber: string;
  docYear: string;
  date: string;
  subject: string;
  recipient: string;
  through: string;
  infoSection: {
    requester: string;
    approvalRef: string;
    approvalDate: string;
  };
  considerationSection: {
    requester: string;
    item: string;
    budgetYear: string;
    wbs: string;
  };
  signer1: {
    name: string;
    position: string;
  };
  signer2: {
    name: string;
    position: string;
  };
  department: string;
  phone: string;
  logoUrl: string;
}
