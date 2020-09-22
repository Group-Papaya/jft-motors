import { Quotation } from "@/models";
import firebase from "firebase";
import store from "../store";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const easyInvoice = require("easyinvoice");

let pdfData: any;

function getDocumentType(quotation: Quotation) {
  return quotation.completed ? "Invoice" : "Quotation";
}

function updateQuotation(quotation: Quotation) {
  return store.dispatch("SET_RECORD", {
    record: { ...quotation },
    path: "quotations",
    ref: quotation.id
  });
}

function getPdfData(quotation: Quotation) {
  const products = quotation.items.map(
    ({ quantity, details, cost, discountAmount }) => {
      return {
        quantity,
        description: details,
        tax: 0,
        price: discountAmount ? cost - discountAmount : cost
      };
    }
  );

  return {
    documentTitle: getDocumentType(quotation),
    currency: "ZAR",
    taxNotation: "vat", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo:
      "https://firebasestorage.googleapis.com/v0/b/jft-motors.appspot.com/o/logo.png?alt=media&token=f29da7d9-c265-438a-8f53-f3c728666bb6",
    sender: {
      company: "JFT Motors",
      address: "373 Imam Haron Rd, Lansdowne",
      zip: "7780",
      city: "Cape Town",
      country: "South Africa",
      "phone number": "021 696 2600"
    },
    client: {
      company: quotation.client,
      address: quotation.meta.client.email,
      zip: "7700",
      city: "Cape Town",
      country: "South Africa"
    },
    invoiceNumber: quotation.id,
    invoiceDate: quotation.updated,
    products: products,
    bottomNotice: quotation.completed
      ? "Kindly pay your invoice within 15 days."
      : "Please note: this is quotation is valid for 15 days"
  };
}

async function uploadPDF(quotation: Quotation, file: any) {
  const documentType = getDocumentType(quotation);
  const filename = `${documentType}s/${quotation.id}.pdf`;

  const storageRef = firebase.storage().ref(filename);

  const uploadTaskSnapshot = await storageRef.putString(file, "base64");

  const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

  console.log(`${documentType} PDF url: ${downloadURL}`);

  if (!quotation.meta["pdf"]) {
    quotation.meta["pdf"] = {};
  }

  quotation.completed
    ? (quotation.meta["pdf"]["invoice"] = downloadURL)
    : (quotation.meta["pdf"]["quotation"] = downloadURL);

  await updateQuotation(quotation);
}

async function generatePDF(quotation) {
  // generate pdf
  const result = await easyInvoice.createInvoice(getPdfData(quotation));
  pdfData = result.pdf;
}

async function emailInvoice(quotation: Quotation) {
  // upload pdf
  await uploadPDF(quotation, pdfData);

  // populate email content
  const email = quotation.meta.client.email;
  const subject = `${getDocumentType(quotation)} from JFT Motors`;
  let downloadURL = quotation.completed
    ? quotation.meta["pdf"]["invoice"]
    : quotation.meta["pdf"]["quotation"];
  downloadURL = encodeURIComponent(downloadURL);
  const body = `Hi, ${quotation.meta.client.firstname} ${
    quotation.meta.client.lastname
  }. Please visit the link to view ${getDocumentType(
    quotation
  )}: ${downloadURL}`;

  // open email client
  window.open(`mailto:${email}?subject=${subject}&body=${body}`);
}

async function downloadInvoice(quotation: Quotation) {
  // download pdf
  await easyInvoice.download(
    `${Date.now()}-${getDocumentType(quotation)}.pdf`,
    pdfData
  );
}

export { getPdfData, uploadPDF, downloadInvoice, emailInvoice, generatePDF };
