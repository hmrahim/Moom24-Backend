const Quotation = require("../models/Quotation");
const QuotProducts = require("../models/QuotProducts");
// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");


exports.quotationPostController = (req, res, next) => {
  const quotation = req.body;
  // console.log(quotation);
  try {
    const result = new Quotation(quotation);
    console.log(result);

    result.save();
    res.status(200).json(result);
  } catch (error) { }
};

exports.quotationGetController = async (req, res, next) => {
  const quotation = await Quotation.find().sort({ _id: -1 });
  res.status(200).json(quotation);
};

exports.getQuotationByid = async (req, res, next) => {
  const id = req.params.id;
  const data = await Quotation.findById({ _id: id });
  console.log(data);
  res.status(200).json(data);
};
exports.getQuotationByEmail = async (req, res, next) => {
  const id = req.params.email;
  const data = await Quotation.findOne({ email: email });
  console.log(data);
  res.status(200).json(data);
};

exports.quotationPutController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const products = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        message: "Products array is required",
      });
    }

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    quotation.products = products;
    quotation.status = "Approved";

    await quotation.save();

    res.status(200).json({
      message: "All products updated successfully",
      updatedProducts: quotation.products,
    });

    console.log(quotation);

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


exports.getAllQuotationByEmail = async (req, res, next) => {
  const email = req.params.email;
  console.log(email);
  try {
    const data = await Quotation.find({ email: email });
    console.log(data);
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });


  }

}


exports.getAllQuotProduct = async (req, res, next) => {
  try {
    const quotProduct = await QuotProducts.find()
    res.status(200).json(quotProduct);

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });


  }

}


// exports.getInvoicePdf = async (req, res, next) => {
//   const id = req.params.id;
//   try {
//   const browser = await puppeteer.launch({
//     headless: "new",
//   });

//     const page = await browser.newPage();
//       await page.setViewport({
//     width: 1920,
//     height: 1080,
//     deviceScaleFactor: 2, // Important for high quality
//   });
// const htmlContent = `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial; padding: 40px; }
//           h1 { color: #111; font-size: 32px; }
//         </style>
//       </head>
//       <body>
//         <h1>Invoice PDF</h1>
//         <p>This is high quality PDF from backend</p>
//       </body>
//     </html>
//   `;

//    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     preferCSSPageSize: true,
//     scale: 1,
//   })

//     await browser.close();

//   res.set({
//     "Content-Type": "application/pdf",
//     "Content-Length": pdfBuffer.length,
//   });

//   res.send(pdfBuffer);

//   }
//     catch (error) {
//       res.status(500).json({
//         message: "Something went wrong",
//         error: error.message,
//       });
//     }
// };
