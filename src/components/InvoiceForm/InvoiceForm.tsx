import React, { useState, useContext, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { InvoiceContext } from '../../context/InvoiceContext';
import { Invoice, InvoiceItem } from '../../types';
import { Trash2 } from 'lucide-react';
import './InvoiceForm.css';

interface InvoiceFormProps {
  mode: 'create' | 'edit';
  invoiceId: string | null;
  onClose: (newInvoiceId?: string) => void;
}

const generateId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const getRand = (str: string) => str[Math.floor(Math.random() * str.length)];
  return `${getRand(letters)}${getRand(letters)}${getRand(numbers)}${getRand(numbers)}${getRand(numbers)}${getRand(numbers)}`;
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({ mode, invoiceId, onClose }) => {
  const { invoices, addInvoice, updateInvoice } = useContext(InvoiceContext);
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientName: '',
    clientEmail: '',
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    paymentTerms: 30,
    description: '',
    items: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && invoiceId) {
      const inv = invoices.find(i => i.id === invoiceId);
      if (inv) {
        setFormData(inv);
      }
    }
  }, [mode, invoiceId, invoices]);

  const handleInputChange = (field: string, value: any, nestedGroup?: 'senderAddress' | 'clientAddress') => {
    setFormData(prev => {
      if (nestedGroup) {
        return { ...prev, [nestedGroup]: { ...(prev[nestedGroup] as any), [field]: value } };
      }
      return { ...prev, [field]: value };
    });
    // Clear error
    const errorKey = nestedGroup ? `${nestedGroup}.${field}` : field;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(formData.items || [])];
    const val = (field === 'quantity' || field === 'price') ? Number(value) : value;
    newItems[index] = { ...newItems[index], [field]: val };
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = Number(newItems[index].quantity || 0) * Number(newItems[index].price || 0);
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = { id: crypto.randomUUID(), name: '', quantity: 0, price: 0, total: 0 };
    setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const deleteItem = (index: number) => {
    const newItems = [...(formData.items || [])];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.senderAddress?.street) newErrors['senderAddress.street'] = "can't be empty";
    if (!formData.senderAddress?.city) newErrors['senderAddress.city'] = "can't be empty";
    if (!formData.senderAddress?.postCode) newErrors['senderAddress.postCode'] = "can't be empty";
    if (!formData.senderAddress?.country) newErrors['senderAddress.country'] = "can't be empty";
    
    if (!formData.clientName) newErrors['clientName'] = "can't be empty";
    if (!formData.clientEmail) {
      newErrors['clientEmail'] = "can't be empty";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.clientEmail)) {
      newErrors['clientEmail'] = "invalid format";
    }
    
    if (!formData.clientAddress?.street) newErrors['clientAddress.street'] = "can't be empty";
    if (!formData.clientAddress?.city) newErrors['clientAddress.city'] = "can't be empty";
    if (!formData.clientAddress?.postCode) newErrors['clientAddress.postCode'] = "can't be empty";
    if (!formData.clientAddress?.country) newErrors['clientAddress.country'] = "can't be empty";
    
    if (!formData.description) newErrors['description'] = "can't be empty";
    
    if (!formData.items || formData.items.length === 0) {
      newErrors['items'] = "An item must be added";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.name) newErrors[`item_${index}_name`] = "can't be empty";
        if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = "must be > 0";
        if (item.price <= 0) newErrors[`item_${index}_price`] = "must be > 0";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status: 'pending' | 'draft') => {
    if (status === 'pending' && !validateForm()) {
      return;
    }

    const total = (formData.items || []).reduce((acc, item) => acc + item.total, 0);

    const finalInvoice: Invoice = {
      ...(formData as Invoice),
      id: mode === 'create' ? generateId() : (formData.id as string),
      status: mode === 'edit' && formData.status === 'paid' ? 'paid' : status,
      total,
      paymentDue: format(addDays(new Date(formData.createdAt!), formData.paymentTerms || 30), 'yyyy-MM-dd'),
      items: formData.items || [],
      senderAddress: formData.senderAddress || { street: '', city: '', postCode: '', country: '' },
      clientAddress: formData.clientAddress || { street: '', city: '', postCode: '', country: '' },
      clientName: formData.clientName || '',
      clientEmail: formData.clientEmail || '',
      createdAt: formData.createdAt || '',
      description: formData.description || '',
      paymentTerms: formData.paymentTerms || 30
    };

    if (mode === 'create') {
      addInvoice(finalInvoice);
      onClose(finalInvoice.id);
    } else {
      updateInvoice(finalInvoice);
      onClose();
    }
  };

  const renderInput = (label: string, field: string, value: any, nestedGroup?: 'senderAddress' | 'clientAddress', type = 'text') => {
    const errorKey = nestedGroup ? `${nestedGroup}.${field}` : field;
    const hasError = !!errors[errorKey];

    return (
      <div className={`form-group ${hasError ? 'has-error' : ''}`}>
        <label>
          {label}
          {hasError && <span className="error-msg">{errors[errorKey]}</span>}
        </label>
        <input 
          type={type} 
          value={value} 
          onChange={(e) => handleInputChange(field, e.target.value, nestedGroup)} 
        />
      </div>
    );
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h1>
            {mode === 'create' ? (
              'New Invoice'
            ) : (
              <>Edit <span style={{ color: 'var(--text-secondary)' }}>#{formData.id}</span></>
            )}
          </h1>
        </div>

        <div className="form-content">
          <div className="form-section">
            <h3>Bill From</h3>
            {renderInput('Street Address', 'street', formData.senderAddress?.street, 'senderAddress')}
            <div className="form-row">
              {renderInput('City', 'city', formData.senderAddress?.city, 'senderAddress')}
              {renderInput('Post Code', 'postCode', formData.senderAddress?.postCode, 'senderAddress')}
              {renderInput('Country', 'country', formData.senderAddress?.country, 'senderAddress')}
            </div>
          </div>

          <div className="form-section">
            <h3>Bill To</h3>
            {renderInput('Client\'s Name', 'clientName', formData.clientName)}
            {renderInput('Client\'s Email', 'clientEmail', formData.clientEmail, undefined, 'email')}
            {renderInput('Street Address', 'street', formData.clientAddress?.street, 'clientAddress')}
            <div className="form-row">
              {renderInput('City', 'city', formData.clientAddress?.city, 'clientAddress')}
              {renderInput('Post Code', 'postCode', formData.clientAddress?.postCode, 'clientAddress')}
              {renderInput('Country', 'country', formData.clientAddress?.country, 'clientAddress')}
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              {renderInput('Invoice Date', 'createdAt', formData.createdAt, undefined, 'date')}
              <div className="form-group">
                <label>Payment Terms</label>
                <select value={formData.paymentTerms} onChange={(e) => handleInputChange('paymentTerms', Number(e.target.value))}>
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>
            </div>
            {renderInput('Project Description', 'description', formData.description)}
          </div>

          <div className="form-section">
            <h2 className="item-list-header">Item List</h2>
            {errors['items'] && <p className="error-msg" style={{ marginBottom: '16px' }}>{errors['items']}</p>}
            
            {(formData.items || []).map((item, index) => (
              <div className="item-row" key={item.id}>
                <div className={`form-group ${errors[`item_${index}_name`] ? 'has-error' : ''}`}>
                  {index === 0 && <label>Item Name</label>}
                  <input value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} />
                </div>
                <div className={`form-group ${errors[`item_${index}_quantity`] ? 'has-error' : ''}`}>
                  {index === 0 && <label>Qty.</label>}
                  <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
                </div>
                <div className={`form-group ${errors[`item_${index}_price`] ? 'has-error' : ''}`}>
                  {index === 0 && <label>Price</label>}
                  <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
                </div>
                <div className="form-group">
                  {index === 0 && <label>Total</label>}
                  <div className="item-total">{item.total.toFixed(2)}</div>
                </div>
                <button className="btn-delete-item" onClick={() => deleteItem(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="btn-add-item" onClick={addItem}>+ Add New Item</button>
          </div>
        </div>

        <div className="form-footer">
          <div className="footer-actions">
            {mode === 'edit' && (
               <button className="btn-secondary" onClick={() => onClose()}>Cancel</button>
            )}
            {mode === 'create' && (
               <button className="btn-secondary" style={{ marginRight: 'auto' }} onClick={() => onClose()}>Discard</button>
            )}
            {mode === 'create' && (
              <button className="btn-dark" onClick={() => handleSubmit('draft')}>Save as Draft</button>
            )}
            <button className="btn-primary" onClick={() => handleSubmit('pending')}>
              {mode === 'create' ? 'Save & Send' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
