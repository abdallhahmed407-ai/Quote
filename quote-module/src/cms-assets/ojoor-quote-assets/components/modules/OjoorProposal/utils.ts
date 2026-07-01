import type { FieldValues, HublData, ProposalModel, PricingRow } from './types';

export const asText = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

export const asNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const firstValue = (...values: unknown[]): string => {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
};

export const formatDate = (value: unknown, fallback = ''): string => {
  const raw = asText(value);
  if (!raw) return fallback;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return fallback || raw;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Riyadh',
  }).format(date);
};

export const formatMoney = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency || 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency || 'SAR'}`;
  }
};

export function buildProposalModel(fieldValues: FieldValues, hublData: HublData): ProposalModel {
  const {
    quote = {}, deal = {}, lineItems = [], buyerContacts = [], buyerCompany = {},
    signers = [], dealDetails = {}, companyDetails = {}, isQuoteBlueprint,
  } = hublData;

  const companyName = isQuoteBlueprint
    ? 'اسم العميل'
    : firstValue(
        companyDetails.name,
        dealDetails.legal_name_arabic,
        dealDetails.legal_name_english,
        buyerCompany.name,
        deal.dealname,
        'اسم العميل',
      );

  const contact = buyerContacts[0] || {};
  const contactName = isQuoteBlueprint
    ? 'اسم ممثل العميل'
    : firstValue(`${asText(contact.firstname)} ${asText(contact.lastname)}`, companyName);
  const issueDate = isQuoteBlueprint
    ? '22/04/2026'
    : formatDate(quote.hs_last_published_date || quote.hs_createdate, formatDate(new Date().toISOString()));
  const expirationDate = formatDate(quote.hs_expiration_date, '—');
  const currency = firstValue(quote.hs_currency, dealDetails.deal_currency_code, 'SAR');
  const crNumber = isQuoteBlueprint ? 'رقم السجل التجاري' : firstValue(companyDetails.cr_number, dealDetails.cr_number, '—');
  const vatNumber = isQuoteBlueprint ? 'الرقم الضريبي' : firstValue(companyDetails.vat_number, dealDetails.vat_number, '—');
  const customerAddress = isQuoteBlueprint
    ? 'عنوان المنشأة'
    : firstValue(
        companyDetails.billing_address,
        dealDetails.billing_address,
        [companyDetails.address, companyDetails.city, companyDetails.country, companyDetails.zip]
          .map(asText).filter(Boolean).join('، '),
        buyerCompany.address,
        '—',
      );

  const visibleItems = lineItems.length ? lineItems : [{
    name: fieldValues.fallbackServiceName,
    quantity: 1,
    price: asNumber(dealDetails.amount || deal.amount),
    amount: asNumber(dealDetails.amount || deal.amount),
    hs_line_item_currency_code: currency,
  }];

  const pricingRows: PricingRow[] = visibleItems.map((item, index) => {
    const quantity = Math.max(asNumber(item.quantity), 1);
    const unitPrice = asNumber(item.price || item.hs_effective_unit_price);
    const gross = asNumber(item.hs_pre_discount_amount) || unitPrice * quantity;
    const discount = asNumber(item.hs_total_discount || item.discount) || gross * (asNumber(item.hs_discount_percentage) / 100);
    const net = asNumber(item.amount) || Math.max(gross - discount, 0);
    const tax = asNumber(item.hs_tax_amount);
    return {
      id: asText(item.hs_object_id || item.id || index),
      name: firstValue(item.name, fieldValues.fallbackServiceName),
      description: asText(item.description),
      quantity,
      unitPrice,
      discount,
      net,
      tax,
      total: asNumber(item.hs_post_tax_amount) || net + tax,
    };
  });

  const subtotal = pricingRows.reduce((sum, row) => sum + row.net, 0);
  const totalDiscount = asNumber(quote.hs_total_discount) || pricingRows.reduce((sum, row) => sum + row.discount, 0);
  const totalTax = asNumber(quote.hs_tax_total) || pricingRows.reduce((sum, row) => sum + row.tax, 0);
  const grandTotal = asNumber(quote.hs_quote_amount) || pricingRows.reduce((sum, row) => sum + row.total, 0) || subtotal + totalTax;

  return {
    quote,
    contact,
    signer: signers[0],
    companyName,
    contactName,
    issueDate,
    expirationDate,
    currency,
    crNumber,
    vatNumber,
    customerAddress,
    pricingRows,
    subtotal,
    totalDiscount,
    totalTax,
    grandTotal,
    quoteTerms: asText(quote.hs_terms),
  };
}
