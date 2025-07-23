# Invoice Generator App

A React web application for generating invoices from shipping data CSV/Excel files. This app allows you to upload shipping transaction data, filter by customer (using the "Shippers Name" column), and generate professional PDF invoices.

## Features

- **File Upload**: Drag & drop support for CSV, XLS, and XLSX files
- **Customer Filtering**: Automatically detects customers from "Shippers Name" column
- **Invoice Generation**: Creates professional PDF invoices with transaction details
- **Dark Theme**: Modern UI matching shipping dashboard aesthetics
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

1. **Upload Data File**
   - Drag and drop a CSV or Excel file containing shipping data
   - Ensure your file has a column named "Shippers Name" (or similar)
   - The app will automatically parse and load the data

2. **Select Customer**
   - After uploading, you'll see a list of all customers found in your data
   - Use the search bar to quickly find specific customers
   - Click on a customer to select them and filter the transactions

3. **Generate Invoice**
   - Once a customer is selected, you'll see an invoice preview
   - Review the transaction details and totals
   - Click "Download Invoice PDF" to generate and download the invoice

## File Format Requirements

Your CSV/Excel file should contain:
- **Shippers Name**: Column containing customer names (required for filtering)
- **Amount/Cost/Price columns**: Any columns with pricing information will be automatically detected and summed
- **Transaction details**: Any other columns will be included in the invoice for reference

### Example CSV structure:
```csv
Shippers Name,Date,Service,Amount,Description
John Doe,2024-01-15,Express,25.50,Package delivery
Jane Smith,2024-01-16,Standard,15.00,Document delivery
John Doe,2024-01-17,Express,30.00,Package delivery
```

## Technologies Used

- **React 18**: Frontend framework
- **Tailwind CSS**: Styling and responsive design
- **Papa Parse**: CSV file parsing
- **SheetJS**: Excel file parsing
- **jsPDF**: PDF generation
- **React Dropzone**: File upload functionality
- **Lucide React**: Icons

## Project Structure

```
src/
├── components/
│   ├── FileUpload.js      # File upload and parsing
│   ├── CustomerFilter.js  # Customer selection and filtering
│   └── InvoiceGenerator.js # Invoice display and PDF generation
├── App.js                 # Main application component
├── index.js              # Application entry point
└── index.css             # Global styles and Tailwind imports
```

## Customization

- **Invoice Styling**: Modify the PDF generation code in `InvoiceGenerator.js`
- **Column Detection**: Adjust the column name matching logic in `CustomerFilter.js`
- **UI Theme**: Customize colors and styling in the Tailwind classes
- **Company Branding**: Add your logo and company information to the invoice template

## Troubleshooting

- **File not parsing**: Ensure your CSV/Excel file has headers in the first row
- **No customers found**: Check that your file has a column with "shipper", "customer", or "client" in the name
- **PDF not generating**: Verify that amount columns contain numeric values

## Support

For issues or questions, please check that your data file follows the expected format and contains the required "Shippers Name" column. 