import { v4 as uuidv4 } from 'uuid';
import type { Customer, Quotation, QuotationLineItem } from '@/types';

export function generateSeedCustomers(userId: string): Customer[] {
  const now = new Date().toISOString();
  return [
    {
      id: uuidv4(),
      userId,
      fullName: 'Lars Jensen',
      address: 'Vesterbrogade 42',
      zipCode: '1620',
      city: 'Copenhagen',
      phone: '+45 20 34 56 78',
      email: 'lars.jensen@email.dk',
      notes: 'Referred by existing customer',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId,
      fullName: 'Maria Nielsen',
      address: 'Nørregade 15',
      zipCode: '8000',
      city: 'Aarhus',
      phone: '+45 31 45 67 89',
      email: 'maria.nielsen@email.dk',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId,
      fullName: 'Peter Andersen',
      address: 'Algade 7',
      zipCode: '4000',
      city: 'Roskilde',
      phone: '+45 42 56 78 90',
      email: 'peter.andersen@email.dk',
      notes: 'Large renovation project',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId,
      fullName: 'Sophie Møller',
      address: 'Strandvejen 88',
      zipCode: '2900',
      city: 'Hellerup',
      phone: '+45 53 67 89 01',
      email: 'sophie.moller@email.dk',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId,
      fullName: 'Henrik Christensen',
      address: 'Havnegade 23',
      zipCode: '5000',
      city: 'Odense',
      phone: '+45 64 78 90 12',
      email: 'henrik.c@email.dk',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function generateSeedQuotations(userId: string, customers: Customer[]): Quotation[] {
  const now = new Date();

  const makeItems = (items: { desc: string; qty: number; unit: string; price: number }[]): QuotationLineItem[] =>
    items.map(i => ({
      id: uuidv4(),
      description: i.desc,
      quantity: i.qty,
      unit: i.unit,
      unitPrice: i.price,
      total: i.qty * i.price,
    }));

  const quotations: Quotation[] = [];

  if (customers.length >= 1) {
    const items = makeItems([
      { desc: 'Kitchen demolition and removal', qty: 1, unit: 'lot', price: 2500 },
      { desc: 'New kitchen cabinet installation', qty: 8, unit: 'pcs', price: 750 },
      { desc: 'Countertop - granite', qty: 4.5, unit: 'm²', price: 450 },
      { desc: 'Plumbing work', qty: 16, unit: 'hrs', price: 85 },
      { desc: 'Electrical work', qty: 12, unit: 'hrs', price: 95 },
      { desc: 'Tiling - floor and backsplash', qty: 18, unit: 'm²', price: 120 },
    ]);
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const vatAmount = subtotal * 0.25;
    quotations.push({
      id: uuidv4(),
      userId,
      customerId: customers[0].id,
      quotationNumber: `QT-${now.getFullYear()}-0001`,
      title: 'Complete Kitchen Renovation',
      description: 'Full kitchen renovation including demolition, new cabinets, countertops, plumbing, electrical, and tiling.',
      lineItems: items,
      subtotal,
      vatRate: 25,
      vatAmount,
      total: subtotal + vatAmount,
      status: 'accepted',
      validUntil: new Date(now.getTime() + 30 * 86400000).toISOString().split('T')[0],
      notes: 'Work to commence within 2 weeks of acceptance.',
      termsAndConditions: 'Payment is due within 14 days of invoice date. All prices are in EUR.',
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    });
  }

  if (customers.length >= 2) {
    const items = makeItems([
      { desc: 'Bathroom demolition', qty: 1, unit: 'lot', price: 1800 },
      { desc: 'Waterproofing membrane', qty: 12, unit: 'm²', price: 65 },
      { desc: 'Floor tiling', qty: 8, unit: 'm²', price: 140 },
      { desc: 'Wall tiling', qty: 24, unit: 'm²', price: 120 },
      { desc: 'Shower cabin installation', qty: 1, unit: 'pcs', price: 3200 },
      { desc: 'Toilet & sink installation', qty: 1, unit: 'set', price: 1500 },
      { desc: 'Plumbing labor', qty: 24, unit: 'hrs', price: 85 },
    ]);
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const vatAmount = subtotal * 0.25;
    quotations.push({
      id: uuidv4(),
      userId,
      customerId: customers[1].id,
      quotationNumber: `QT-${now.getFullYear()}-0002`,
      title: 'Bathroom Renovation - Master Bath',
      description: 'Complete master bathroom renovation with new shower, tiling, and fixtures.',
      lineItems: items,
      subtotal,
      vatRate: 25,
      vatAmount,
      total: subtotal + vatAmount,
      status: 'sent',
      validUntil: new Date(now.getTime() + 21 * 86400000).toISOString().split('T')[0],
      notes: 'Materials can be sourced within 1 week.',
      termsAndConditions: 'Payment is due within 14 days of invoice date. All prices are in EUR.',
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    });
  }

  if (customers.length >= 3) {
    const items = makeItems([
      { desc: 'Roof inspection and assessment', qty: 1, unit: 'lot', price: 500 },
      { desc: 'Remove old roof tiles', qty: 120, unit: 'm²', price: 15 },
      { desc: 'New roof tiles - premium', qty: 120, unit: 'm²', price: 65 },
      { desc: 'Insulation upgrade', qty: 120, unit: 'm²', price: 45 },
      { desc: 'Scaffolding rental', qty: 1, unit: 'lot', price: 2800 },
      { desc: 'Labor - roofing team', qty: 80, unit: 'hrs', price: 75 },
    ]);
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const vatAmount = subtotal * 0.25;
    quotations.push({
      id: uuidv4(),
      userId,
      customerId: customers[2].id,
      quotationNumber: `QT-${now.getFullYear()}-0003`,
      title: 'Full Roof Replacement',
      description: 'Complete roof replacement including removal of old tiles, new insulation, and premium roof tiles.',
      lineItems: items,
      subtotal,
      vatRate: 25,
      vatAmount,
      total: subtotal + vatAmount,
      status: 'draft',
      validUntil: new Date(now.getTime() + 45 * 86400000).toISOString().split('T')[0],
      termsAndConditions: 'Payment is due within 14 days of invoice date. All prices are in EUR. Weather delays may apply.',
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    });
  }

  if (customers.length >= 4) {
    const items = makeItems([
      { desc: 'Interior painting - living room', qty: 45, unit: 'm²', price: 28 },
      { desc: 'Interior painting - bedroom 1', qty: 32, unit: 'm²', price: 28 },
      { desc: 'Interior painting - bedroom 2', qty: 28, unit: 'm²', price: 28 },
      { desc: 'Ceiling painting', qty: 55, unit: 'm²', price: 22 },
      { desc: 'Surface preparation & primer', qty: 1, unit: 'lot', price: 800 },
      { desc: 'Premium paint materials', qty: 1, unit: 'lot', price: 1200 },
    ]);
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const vatAmount = subtotal * 0.25;
    quotations.push({
      id: uuidv4(),
      userId,
      customerId: customers[3].id,
      quotationNumber: `QT-${now.getFullYear()}-0004`,
      title: 'Interior Painting - Full Apartment',
      description: 'Complete interior painting of 3-bedroom apartment including surface preparation.',
      lineItems: items,
      subtotal,
      vatRate: 25,
      vatAmount,
      total: subtotal + vatAmount,
      status: 'rejected',
      validUntil: new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0],
      notes: 'Customer requested a revised quote with budget options.',
      termsAndConditions: 'Payment is due within 14 days of invoice date. All prices are in EUR.',
      createdAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    });
  }

  return quotations;
}
