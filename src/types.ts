export interface BrowserRunBinding {
  quickAction(action: string, payload: Record<string, unknown>): Promise<Response>;
}

export interface Env {
  HUBSPOT_ACCESS_TOKEN: string;
  PROPOSAL_SIGNING_SECRET: string;
  ADMIN_KEY?: string;
  PUBLIC_BASE_URL?: string;
  BROWSER: BrowserRunBinding;
}

export type JsonObject = Record<string, any>;

export interface ProposalSnapshot {
  schemaVersion: 1;
  dealId: string;
  noteId?: string;
  version: number;
  createdAt: string;
  deal: JsonObject;
  company: JsonObject;
  contact: JsonObject;
  owner: JsonObject;
  lineItems: JsonObject[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
    currency: string;
  };
}
