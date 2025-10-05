const mongoose = require("mongoose");

const invoiceDetailSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    partId: { type: mongoose.Schema.Types.ObjectId, ref: "Part" },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const InvoiceDetail = mongoose.model("InvoiceDetail", invoiceDetailSchema);
module.exports = InvoiceDetail;
