import React, { useContext, useState } from 'react';
import { InvoiceContext } from '../../context/InvoiceContext';
import { ChevronLeft } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import Modal from '../UI/Modal';
import { format } from 'date-fns';
import './InvoiceDetail.css';

interface InvoiceDetailProps {
  id: string;
  onBack: () => void;
  onEdit: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ id, onBack, onEdit }) => {
  const { invoices, updateInvoice, deleteInvoice } = useContext(InvoiceContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const handleMarkAsPaid = () => {
    updateInvoice({ ...invoice, status: 'paid' });
  };

  const handleDelete = () => {
    deleteInvoice(id);
    onBack();
  };

  const formattedDate = format(new Date(invoice.createdAt), 'dd MMM yyyy');
  const formattedPaymentDue = format(new Date(invoice.paymentDue), 'dd MMM yyyy');
  
  const formattedTotal = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(invoice.total);

  const ActionButtons = () => (
    <>
      <button className="btn-secondary" onClick={onEdit}>Edit</button>
      <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
      {invoice.status === 'pending' && (
        <button className="btn-primary" onClick={handleMarkAsPaid}>Mark as Paid</button>
      )}
    </>
  );

  return (
    <div className="detail-container">
      <button className="go-back" onClick={onBack}>
        <ChevronLeft size={16} color="var(--color-primary)" />
        Go back
      </button>

      <div className="detail-header">
        <div className="status-wrapper">
          <span>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="action-buttons">
          <ActionButtons />
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-body-top">
          <div className="id-description">
            <span className="info-value"><span className="hash">#</span>{invoice.id}</span>
            <span className="info-label body-1">{invoice.description}</span>
          </div>
          <div className="sender-address body-2">
            <div>{invoice.senderAddress.street}</div>
            <div>{invoice.senderAddress.city}</div>
            <div>{invoice.senderAddress.postCode}</div>
            <div>{invoice.senderAddress.country}</div>
          </div>
        </div>

        <div className="detail-body-middle">
          <div className="dates-container">
            <div className="info-block">
              <span className="info-label body-1">Invoice Date</span>
              <span className="info-value">{formattedDate}</span>
            </div>
            <div className="info-block">
              <span className="info-label body-1">Payment Due</span>
              <span className="info-value">{formattedPaymentDue}</span>
            </div>
          </div>

          <div className="bill-to-container">
            <div className="info-block">
              <span className="info-label body-1">Bill To</span>
              <span className="info-value">{invoice.clientName}</span>
            </div>
            <div className="client-address body-2">
              <div>{invoice.clientAddress.street}</div>
              <div>{invoice.clientAddress.city}</div>
              <div>{invoice.clientAddress.postCode}</div>
              <div>{invoice.clientAddress.country}</div>
            </div>
          </div>

          <div className="sent-to-container">
            <span className="info-label body-1">Sent to</span>
            <span className="info-value">{invoice.clientEmail}</span>
          </div>
        </div>

        <div className="items-table-container">
          <table className="items-table desktop-item">
            <thead>
              <tr className="body-2">
                <th>Item Name</th>
                <th>QTY.</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td className="item-name">{item.name}</td>
                  <td className="item-qty">{item.quantity}</td>
                  <td className="item-price">£{Number(item.price).toFixed(2)}</td>
                  <td className="item-total">£{Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mobile-item-list">
            {invoice.items.map(item => (
              <div key={item.id} className="mobile-item">
                <div className="mobile-item-left">
                  <span className="item-name" style={{ fontWeight: 700, fontSize: '15px' }}>{item.name}</span>
                  <span className="mobile-item-qty">{item.quantity} x £{Number(item.price).toFixed(2)}</span>
                </div>
                <div className="item-name" style={{ fontWeight: 700, fontSize: '15px' }}>£{Number(item.total).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="items-total-container">
          <span className="amount-due-label body-2">
            <span className="desktop-text">Amount Due</span>
            <span className="mobile-text">Grand Total</span>
          </span>
          <span className="amount-due-value">{formattedTotal}</span>
        </div>
      </div>

      <div className="mobile-action-bar">
        <ActionButtons />
      </div>

      {showDeleteModal && (
        <Modal 
          title="Confirm Deletion"
          description={`Are you sure you want to delete invoice #${invoice.id}? This action cannot be undone.`}
          confirmText="Delete"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default InvoiceDetail;
