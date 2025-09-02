import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const handleSuccess = () => {
    if (isEdit) {
      navigate(`/customers/${id}`);
    } else {
      navigate('/customers');
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      navigate(`/customers/${id}`);
    } else {
      navigate('/customers');
    }
  };

  return (
    <div className="page-container">
      <CustomerForm
        customerId={id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CustomerFormPage;