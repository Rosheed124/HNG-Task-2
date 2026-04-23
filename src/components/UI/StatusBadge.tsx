import React from 'react';
import './StatusBadge.css';
import { InvoiceStatus } from '../../types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div className={`status-badge ${status}`}>
      <span className="dot"></span>
      {status}
    </div>
  );
};

export default StatusBadge;
