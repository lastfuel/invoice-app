import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import CustomerFilter from './components/CustomerFilter';
import InvoiceGenerator from './components/InvoiceGenerator';
import { Package, Bell, User } from 'lucide-react';

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="bg-dark-card border-b border-green-bright/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-bright p-2 rounded-lg animate-pulse-green">
              <Package className="w-6 h-6 text-dark-bg" />
            </div>
            <h1 className="text-xl font-semibold gradient-text">ShippingSorted Invoice</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-muted-foreground hover:text-green-bright cursor-pointer transition-colors" />
            <div className="bg-green-bright p-2 rounded-full">
              <User className="w-4 h-4 text-dark-bg" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-8">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-8 gradient-text">Invoice Generator</h2>
          
          {/* File Upload Section */}
          <div className="mb-8">
            <FileUpload onDataUploaded={setUploadedData} />
          </div>

          {/* Customer Filter Section */}
          {uploadedData && (
            <div className="mb-8">
              <CustomerFilter 
                data={uploadedData}
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
                onFilteredData={setFilteredData}
              />
            </div>
          )}

          {/* Invoice Generator Section */}
          {filteredData.length > 0 && (
            <div className="mb-8">
              <InvoiceGenerator 
                customerName={selectedCustomer}
                transactions={filteredData}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 