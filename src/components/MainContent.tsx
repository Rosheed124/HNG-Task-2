import React, { useState } from 'react';
import './MainContent.css';
import InvoiceList from './InvoiceList/InvoiceList';
import InvoiceDetail from './InvoiceDetail/InvoiceDetail';
import InvoiceForm from './InvoiceForm/InvoiceForm';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const openDetail = (id: string) => {
    setSelectedInvoiceId(id);
    setCurrentView('detail');
  };

  const goBack = () => {
    setSelectedInvoiceId(null);
    setCurrentView('list');
  };

  const openForm = (mode: 'create' | 'edit') => {
    setFormMode(mode);
    setIsFormOpen(true);
  };

  const handleFormClose = (newInvoiceId?: string) => {
    setIsFormOpen(false);
    if (newInvoiceId) {
      setSelectedInvoiceId(newInvoiceId);
      setCurrentView('detail');
    }
  };

  return (
    <main className="main-content">
      <div className="main-wrapper">
        {currentView === 'list' && (
          <InvoiceList onOpenDetail={openDetail} onOpenForm={() => openForm('create')} />
        )}
        {currentView === 'detail' && selectedInvoiceId && (
          <InvoiceDetail 
            id={selectedInvoiceId} 
            onBack={goBack} 
            onEdit={() => openForm('edit')} 
          />
        )}
      </div>

      {isFormOpen && (
        <InvoiceForm 
          mode={formMode} 
          invoiceId={formMode === 'edit' ? selectedInvoiceId : null}
          onClose={handleFormClose} 
        />
      )}
    </main>
  );
};

export default MainContent;
