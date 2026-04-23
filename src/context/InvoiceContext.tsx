// @refresh reset
import React, { createContext, useState, useEffect } from 'react';
import { Invoice } from '../types';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
}

export const InvoiceContext = createContext<InvoiceContextType>({
  invoices: [],
  addInvoice: () => {},
  updateInvoice: () => {},
  deleteInvoice: () => {},
});

const STORAGE_KEY = 'invoices_v2';

const initialInvoices: Invoice[] = [
  {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { id: '2', name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 }
    ],
    total: 556.00
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-01',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 30,
    clientName: 'John Morrison',
    clientEmail: 'jmorrison@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }
    ],
    total: 14002.33
  },
  {
    id: 'RT2080',
    createdAt: '2021-09-12',
    paymentDue: '2021-10-12',
    description: 'Logo Refresh',
    paymentTerms: 30,
    clientName: 'Alysa Werner',
    clientEmail: 'alysaw@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '63 Warwick Road', city: 'Carlisle', postCode: 'CA1 1DP', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Logo Sketches', quantity: 1, price: 102.04, total: 102.04 }
    ],
    total: 102.04
  },
  {
    id: 'AA1449',
    createdAt: '2021-09-14',
    paymentDue: '2021-10-14',
    description: 'UI Kit',
    paymentTerms: 30,
    clientName: 'Mellisa Clarke',
    clientEmail: 'mellisac@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '46 Abbey Row', city: 'Cambridge', postCode: 'CB5 6EG', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Motion Graphics', quantity: 1, price: 2500.00, total: 2500.00 },
      { id: '2', name: 'UI Kit', quantity: 1, price: 1532.33, total: 1532.33 }
    ],
    total: 4032.33
  },
  {
    id: 'TY9141',
    createdAt: '2021-10-01',
    paymentDue: '2021-10-31',
    description: 'Monthly Retainer',
    paymentTerms: 30,
    clientName: 'Thomas Wayne',
    clientEmail: 'thomasw@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '3 Gotham Ave', city: 'Gotham', postCode: 'GT1 1BW', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Design Retainer', quantity: 1, price: 3455.91, total: 3455.91 },
      { id: '2', name: 'Development Support', quantity: 1, price: 2700.00, total: 2700.00 }
    ],
    total: 6155.91
  },
  {
    id: 'FV2353',
    createdAt: '2021-11-12',
    paymentDue: '2021-12-12',
    description: 'Logo & Brand Identity',
    paymentTerms: 30,
    clientName: 'Anita Wainwright',
    clientEmail: 'anitaw@mail.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [
      { id: '1', name: 'Logo Design', quantity: 1, price: 1532.33, total: 1532.33 },
      { id: '2', name: 'Brand Book', quantity: 1, price: 1569.71, total: 1569.71 }
    ],
    total: 3102.04
  },
  {
    id: 'BN9012',
    createdAt: '2021-11-18',
    paymentDue: '2021-12-18',
    description: 'Social Media Kit',
    paymentTerms: 30,
    clientName: 'Carmen Lopez',
    clientEmail: 'carmenl@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '2 Hillside Road', city: 'Coventry', postCode: 'CV1 2AB', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Instagram Templates', quantity: 5, price: 200.00, total: 1000.00 },
      { id: '2', name: 'Twitter Banner', quantity: 1, price: 150.00, total: 150.00 }
    ],
    total: 1150.00
  },
  {
    id: 'WD4321',
    createdAt: '2021-12-01',
    paymentDue: '2021-12-31',
    description: 'E-commerce Development',
    paymentTerms: 30,
    clientName: 'Oliver Bennett',
    clientEmail: 'oliverb@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '14 Park Lane', city: 'Manchester', postCode: 'M1 4BT', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'Frontend Development', quantity: 1, price: 4500.00, total: 4500.00 },
      { id: '2', name: 'Backend API', quantity: 1, price: 3200.00, total: 3200.00 }
    ],
    total: 7700.00
  },
  {
    id: 'KP5567',
    createdAt: '2022-01-05',
    paymentDue: '2022-02-05',
    description: 'SEO Audit & Strategy',
    paymentTerms: 30,
    clientName: 'Rachel Nguyen',
    clientEmail: 'racheln@mail.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '99 Victoria Street', city: 'Bristol', postCode: 'BS1 6DY', country: 'United Kingdom' },
    items: [
      { id: '1', name: 'SEO Audit', quantity: 1, price: 800.00, total: 800.00 },
      { id: '2', name: 'Content Strategy', quantity: 1, price: 1200.00, total: 1200.00 }
    ],
    total: 2000.00
  },
];

export const InvoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};
