import axios from "axios";

export const postInvoice = async (token, invoiceData) => {
  try {
    const response = await axios.post(
      "https://ebms.obr.gov.bi:9443/ebms_api/addInvoice",
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Invoice posted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to post invoice:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch invoices from EBMS API (optional feature)
export const fetchInvoices = async (token) => {
  try {
    const response = await axios.get("https://ebms.obr.gov.bi:9443/ebms_api/invoices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch invoices:", error.response?.data || error.message);
    throw error;
  }
};
