import { useState, useEffect } from "react";
import { postInvoice, fetchInvoices } from "../lib/ebmsService";
import { auth } from "../lib/firebase";

export default function Invoices() {
  const [invoice, setInvoice] = useState({
    id: "INV001",
    customerName: "Demo Customer",
    amount: 100.00,
    date: new Date().toISOString().slice(0, 10),
  });
  const [message, setMessage] = useState("");
  const [invoicesList, setInvoicesList] = useState([]);

  const handlePostInvoice = async () => {
    if (!auth.currentUser) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      await postInvoice(token, invoice);
      setMessage("Invoice posted successfully");
      fetchInvoicesList();
    } catch (error) {
      setMessage("Failed to post invoice");
    }
  };

  const fetchInvoicesList = async () => {
    if (!auth.currentUser) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const invoices = await fetchInvoices(token);
      setInvoicesList(invoices);
    } catch (error) {
      setMessage("Failed to fetch invoices");
    }
  };

  useEffect(() => {
    fetchInvoicesList();
  }, []);

  return (
    <div>
      <h1>Post Invoice</h1>
      <input
        type="text"
        placeholder="Invoice ID"
        value={invoice.id}
        onChange={(e) => setInvoice({ ...invoice, id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Customer Name"
        value={invoice.customerName}
        onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount"
        value={invoice.amount}
        onChange={(e) => setInvoice({ ...invoice, amount: parseFloat(e.target.value) })}
      />
      <input
        type="date"
        value={invoice.date}
        onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
      />
      <button onClick={handlePostInvoice}>Post Invoice</button>
      <p>{message}</p>

      <h2>Invoices List</h2>
      <ul>
        {invoicesList.map((inv) => (
          <li key={inv.id}>{inv.customerName} - {inv.amount} on {inv.date}</li>
        ))}
      </ul>
    </div>
  );
}
