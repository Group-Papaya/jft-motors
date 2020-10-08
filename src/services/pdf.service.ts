import { Quotation } from "@/models";
import { storage } from "@/firebase";
import store from "@/store";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import easyInvoice from "easyinvoice";
import moment from "moment";

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
  const currentDate = moment().format("lll");

  const products = quotation.items.map((item, index) => {
    return {
      quantity: item.quantity,
      description: `${item.name} - ${item.details}`,
      tax: 0,
      rate: 0.5,
      price: item.cost
    };
  });

  const details = store.state.details;
  const { street, suburb, city, zipcode, country } = details.address;

  return {
    documentTitle: getDocumentType(quotation),
    currency: "ZAR",
    taxNotation: "vat", //or gst
    marginTop: 25,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 25,
    logo: details.logo,
    sender: {
      city: city,
      zip: zipcode,
      country: country,
      company: details.company,
      "phone number": details.telephone,
      address: street + (suburb.trim() !== "" ? `, ${suburb}` : "")
    },
    client: {
      company: quotation.client,
      address: quotation.meta.client.email,
      zip: "7700",
      city: "Cape Town",
      country: "South Africa"
    },
    products: products,
    invoiceNumber: quotation.id,
    invoiceDate: currentDate,
    bottomNotice: quotation.completed
      ? "Kindly pay your invoice within 30 days."
      : `This is quotation was generated on ${currentDate} valid until ${moment(
          currentDate
        )
          .add(15, "days")
          .format("lll")}`
  };
}

async function uploadPDF(quotation: Quotation, file: any) {
  const documentType = getDocumentType(quotation);
  const filename = `${documentType}s/${quotation.id}.pdf`;

  const storageRef = storage.ref(filename);

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

async function renderPDFViewer() {
  await easyInvoice.render("pdf", pdfData);
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

export {
  getPdfData,
  uploadPDF,
  downloadInvoice,
  emailInvoice,
  generatePDF,
  renderPDFViewer
};
