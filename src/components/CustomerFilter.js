import React, { useEffect, useState } from 'react';
import { Filter, Users, Search } from 'lucide-react';

const CustomerFilter = ({ data, selectedCustomer, onCustomerSelect, onFilteredData }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Find the 'Shippers Name' column (case insensitive)
      const shipperColumn = Object.keys(data[0]).find(key => 
        key.toLowerCase().includes('shipper') && key.toLowerCase().includes('name')
      ) || Object.keys(data[0]).find(key => 
        key.toLowerCase().includes('customer')
      ) || Object.keys(data[0]).find(key => 
        key.toLowerCase().includes('client')
      );

      if (shipperColumn) {
        // Extract unique customer names
        const uniqueCustomers = [...new Set(
          data
            .map(row => row[shipperColumn])
            .filter(name => name && name.toString().trim() !== '')
            .map(name => name.toString().trim())
        )].sort();
        
        setCustomers(uniqueCustomers);
        setFilteredCustomers(uniqueCustomers);
      }
    }
  }, [data]);

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(customer =>
      customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  useEffect(() => {
    if (selectedCustomer && data) {
      // Find the shipper column again
      const shipperColumn = Object.keys(data[0]).find(key => 
        key.toLowerCase().includes('shipper') && key.toLowerCase().includes('name')
      ) || Object.keys(data[0]).find(key => 
        key.toLowerCase().includes('customer')
      ) || Object.keys(data[0]).find(key => 
        key.toLowerCase().includes('client')
      );

      if (shipperColumn) {
        // Filter data for selected customer
        const filtered = data.filter(row => 
          row[shipperColumn] && 
          row[shipperColumn].toString().trim() === selectedCustomer
        );
        onFilteredData(filtered);
      }
    }
  }, [selectedCustomer, data, onFilteredData]);

  const handleCustomerSelect = (customer) => {
    onCustomerSelect(customer);
  };

  const getTransactionCount = (customer) => {
    if (!data) return 0;
    
    const shipperColumn = Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('shipper') && key.toLowerCase().includes('name')
    ) || Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('customer')
    ) || Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('client')
    );

    if (shipperColumn) {
      return data.filter(row => 
        row[shipperColumn] && 
        row[shipperColumn].toString().trim() === customer
      ).length;
    }
    return 0;
  };

  if (!data || customers.length === 0) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-green-bright/20 hover-lift">
        <h3 className="text-lg font-semibold mb-4 flex items-center gradient-text">
          <Filter className="w-5 h-5 mr-2" />
          Customer Filter
        </h3>
        <p className="text-muted-foreground">
          Upload a file with shipping data to see available customers.
          Make sure your file has a column named "Shippers Name" or similar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-green-bright/20 hover-lift">
      <h3 className="text-lg font-semibold mb-4 flex items-center gradient-text">
        <Filter className="w-5 h-5 mr-2" />
        Select Customer
      </h3>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-green-bright/30 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-green-bright focus:ring-2 focus:ring-green-bright/20 transition-all"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredCustomers.map((customer, index) => {
          const transactionCount = getTransactionCount(customer);
          return (
            <div
              key={index}
              onClick={() => handleCustomerSelect(customer)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border hover-lift ${
                selectedCustomer === customer
                  ? 'bg-green-bright border-green-bright text-dark-bg shadow-lg'
                  : 'bg-dark-bg border-green-bright/30 hover:bg-green-bright/10 hover:border-green-bright/60 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-medium">{customer}</span>
                </div>
                <span className="text-sm opacity-75">
                  {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && searchTerm && (
        <p className="text-muted-foreground text-center py-4">
          No customers found matching "{searchTerm}"
        </p>
      )}

      {selectedCustomer && (
        <div className="mt-4 p-4 bg-green-bright/10 border border-green-bright/20 rounded-lg hover-lift">
          <p className="text-sm text-green-bright">
            ✓ Selected: {selectedCustomer} ({getTransactionCount(selectedCustomer)} transactions)
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerFilter; 