import type { CSSProperties } from 'react';
import { ModuleFields, TextField, FieldGroup, ColorField } from '@hubspot/cms-components/fields';
import styles from './styles.module.css';
import type { ModuleProps } from './types';
import { buildProposalModel } from './utils';
import { CoverPage } from './pages/CoverPage';
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { PricingPage } from './pages/PricingPage';
import { ActivationPage } from './pages/ActivationPage';
import { TermsPage } from './pages/TermsPage';
import { LegalPage } from './pages/LegalPage';
import { SignaturePage } from './pages/SignaturePage';

export function Component({ fieldValues, hublData }: ModuleProps) {
  const model = buildProposalModel(fieldValues, hublData);
  const primary = fieldValues.styles?.primaryColor?.css || '#1d347d';
  const secondary = fieldValues.styles?.secondaryColor?.css || '#7856a7';
  const accent = fieldValues.styles?.accentColor?.css || '#e8b86d';
  const cssVariables = {
    '--ojoor-primary': primary,
    '--ojoor-secondary': secondary,
    '--ojoor-accent': accent,
  } as CSSProperties;

  return (
    <main className={styles.proposal} dir="rtl" style={cssVariables}>
      <CoverPage fieldValues={fieldValues} model={model} />
      <ExecutiveSummaryPage fieldValues={fieldValues} />
      <IntegrationsPage fieldValues={fieldValues} />
      <PricingPage fieldValues={fieldValues} model={model} />
      <ActivationPage fieldValues={fieldValues} />
      <TermsPage fieldValues={fieldValues} model={model} />
      <LegalPage fieldValues={fieldValues} model={model} />
      <SignaturePage fieldValues={fieldValues} model={model} />
    </main>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="fallbackServiceName" label="Fallback service name" default="اشتراك منصة أجور للموارد البشرية والرواتب" />
    <TextField name="proposalValidityDaysLabel" label="Validity date label" default="صالح حتى" />
    <TextField name="companyPhone" label="Ojoor phone" default="+966 56 443 2194" />
    <TextField name="companyWebsite" label="Ojoor website" default="www.ojoor.net" />
    <TextField name="companyAddress" label="Ojoor address" default="مبنى 8758 حي العليا، مكتب 309، الرمز البريدي 12214" />
    <FieldGroup name="styles" label="Styles" tab="STYLE">
      <ColorField name="primaryColor" label="Primary color" default={{ color: '#1d347d', opacity: 100 }} />
      <ColorField name="secondaryColor" label="Secondary color" default={{ color: '#7856a7', opacity: 100 }} />
      <ColorField name="accentColor" label="Accent color" default={{ color: '#e8b86d', opacity: 100 }} />
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Ojoor Arabic Proposal',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% if quoteTemplateContext.deal.hs_object_id %}
    {% set dealDetails = crm_object(
      "deal",
      quoteTemplateContext.deal.hs_object_id,
      "dealname,amount,deal_currency_code,billing_address,cr_number,vat_number,legal_name_arabic,legal_name_english"
    ) %}
  {% endif %}

  {% if quoteTemplateContext.buyerCompany.hs_object_id %}
    {% set companyDetails = crm_object(
      "company",
      quoteTemplateContext.buyerCompany.hs_object_id,
      "name,cr_number,vat_number,billing_address,address,city,country,zip,numberofemployees,phone,website"
    ) %}
  {% endif %}

  {% set hublData = {
    "quote": quoteTemplateContext.quote,
    "deal": quoteTemplateContext.deal,
    "lineItems": quoteTemplateContext.lineItems,
    "buyerContacts": quoteTemplateContext.buyerContacts,
    "buyerCompany": quoteTemplateContext.buyerCompany,
    "signers": quoteTemplateContext.signers,
    "dealDetails": dealDetails if dealDetails else {},
    "companyDetails": companyDetails if companyDetails else {},
    "isQuoteBlueprint": isQuoteBlueprint
  } %}
`;
