import React, { useState } from 'react';

const ReportsManagement = () => {
  const [ordersReports,setOrdersReports] = useState([])
  const [usersReports,setUsersReports] = useState([])
  const [inventoryReports,setInventoryReports] = useState([])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports Management</h1>
      <p>Reports dashboard will be displayed here.</p>
    </div>
  );
};

export default ReportsManagement;