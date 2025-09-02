import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAddresses: 0,
    recentCustomers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await customerAPI.getAll({ limit: 5, page: 1 });
        setStats({
          totalCustomers: response.data.pagination.total,
          totalAddresses: response.data.data.reduce((sum, customer) => sum + customer.address_count, 0),
          recentCustomers: response.data.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Customer Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>{stats.totalAddresses}</h3>
            <p>Total Addresses</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Customers</h2>
        {stats.recentCustomers.length > 0 ? (
          <div className="recent-list">
            {stats.recentCustomers.map((customer) => (
              <div key={customer.id} className="recent-item">
                <div className="recent-info">
                  <h4>{customer.first_name} {customer.last_name}</h4>
                  <p>{customer.phone_number}</p>
                  <span className="address-badge">
                    {customer.address_count} address{customer.address_count !== 1 ? 'es' : ''}
                  </span>
                </div>
                <Link to={`/customers/${customer.id}`} className="btn-view">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-customers">
            <p>No customers yet</p>
            <Link to="/customers/new" className="btn-primary">
              Add Your First Customer
            </Link>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/customers/new" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add Customer</h3>
            <p>Create a new customer profile</p>
          </Link>
          <Link to="/customers" className="action-card">
            <div className="action-icon">👀</div>
            <h3>View All</h3>
            <p>Browse all customers and addresses</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;