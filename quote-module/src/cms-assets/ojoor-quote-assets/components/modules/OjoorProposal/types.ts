export type CrmRecord = Record<string, any>;

export interface FieldValues {
  fallbackServiceName: string;
  proposalValidityDaysLabel: string;
  companyPhone: string;
  companyWebsite: string;
  companyAddress: string;
  styles?: {
    primaryColor?: { css: string };
    secondaryColor?: { css: string };
    accentColor?: { css: string };
  };
}

export interface HublData {
  quote: CrmRecord;
  deal: CrmRecord;
  lineItems: CrmRecord[];
  buyerContacts: CrmRecord[];
  buyerCompany: CrmRecord;
  signers: CrmRecord[];
  dealDetails?: CrmRecord;
  companyDetails?: CrmRecord;
  isQuoteBlueprint: boolean;
}

export interface ModuleProps {
  fieldValues: FieldValues;
  hublData: HublData;
}

export interface PricingRow {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  net: number;
  tax: number;
  total: number;
}

export interface ProposalModel {
  quote: CrmRecord;
  contact: CrmRecord;
  signer?: CrmRecord;
  companyName: string;
  contactName: string;
  issueDate: string;
  expirationDate: string;
  currency: string;
  crNumber: string;
  vatNumber: string;
  customerAddress: string;
  pricingRows: PricingRow[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  quoteTerms: string;
}
