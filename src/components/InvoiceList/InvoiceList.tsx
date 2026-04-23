import React, { useContext, useState } from 'react';
import { InvoiceContext } from '../../context/InvoiceContext';
import { InvoiceStatus } from '../../types';
import InvoiceItem from './InvoiceItem';
import Filter from './Filter';
import EmptyState from './EmptyState';
import './InvoiceList.css';
import { Plus } from 'lucide-react';

interface InvoiceListProps {
  onOpenDetail: (id: string) => void;
  onOpenForm: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onOpenDetail, onOpenForm }) => {
  const { invoices } = useContext(InvoiceContext);
  const [selectedFilters, setSelectedFilters] = useState<InvoiceStatus[]>([]);

  const filteredInvoices = invoices.filter(inv => 
    selectedFilters.length === 0 || selectedFilters.includes(inv.status)
  );

  return (
    <div>
      <div className="invoice-list-header">
        <div className="invoice-list-header-left">
          <h1>Invoices</h1>
          <p className="body-1 hide-mobile">
            {filteredInvoices.length === 0 ? 'No invoices' : `There are ${filteredInvoices.length} total invoices`}
          </p>
          <p className="body-1 show-mobile">
            {filteredInvoices.length === 0 ? 'No invoices' : `${filteredInvoices.length} invoices`}
          </p>
        </div>
        <div className="invoice-list-header-right">
          <Filter selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
          <button className="btn-primary btn-new" onClick={onOpenForm}>
            <div className="btn-new-icon">
              <Plus size={16} strokeWidth={4} />
            </div>
            New <span className="hide-mobile">Invoice</span>
          </button>
        </div>
      </div>

      <div className="invoices-container">
        {filteredInvoices.length === 0 ? (
          <EmptyState />
        ) : (
          filteredInvoices.map(invoice => (
            <InvoiceItem 
              key={invoice.id} 
              invoice={invoice} 
              onClick={() => onOpenDetail(invoice.id)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
