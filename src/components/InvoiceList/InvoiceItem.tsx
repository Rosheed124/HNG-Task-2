import React from 'react';
import { Invoice } from '../../types';
import StatusBadge from '../UI/StatusBadge';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface InvoiceItemProps {
  invoice: Invoice;
  onClick: () => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice, onClick }) => {
  const formattedDate = format(new Date(invoice.paymentDue), 'dd MMM yyyy');
  const formattedTotal = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(invoice.total);

  return (
    <div className="invoice-item" onClick={onClick} tabIndex={0} role="button" onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="invoice-item-left">
        <span className="invoice-id">
          <span className="hash">#</span>{invoice.id}
        </span>
        <span className="invoice-date body-1">Due {formattedDate}</span>
        <span className="invoice-name body-1">{invoice.clientName}</span>
      </div>
      
      <div className="invoice-item-right">
        <span className="invoice-total">{formattedTotal}</span>
        <StatusBadge status={invoice.status} />
        <ChevronRight size={16} className="chevron" />
      </div>

      {/* Mobile Layout Structure inside CSS uses grid/flex to rearrange these elements */}
    </div>
  );
};

export default InvoiceItem;
