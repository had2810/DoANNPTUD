import baseService from "../baseService.js";
import RepairStatus from "../../models/repairScheduling/repairStatus.model.js";
import { sendMail } from "../emailService.js";

const base = baseService(RepairStatus, {
  populateFields: [
    {
      path: "appointmentId",
      populate: [
        { path: "userId" },
        { path: "deviceTemplateId" },
        { path: "employeeId" },
        { path: "serviceId" },
      ],
    },
  ],
});

const repairStatusService = {
  ...base,
  create: async (data) => {
    const record = await RepairStatus.create(data);
    const populatedRecord = await RepairStatus.findById(record._id).populate({
      path: "appointmentId",
      populate: [
        { path: "userId" },
        { path: "deviceTemplateId" },
        { path: "employeeId" },
        { path: "serviceId" },
      ],
    });

    // Send email for initial status
    if (populatedRecord.appointmentId?.userId?.email) {
      await sendMail(
        populatedRecord.appointmentId.userId.email,
        "checking",
        populatedRecord.appointmentId.userId.fullName,
        populatedRecord.appointmentId.orderCode
      );
    }

    return populatedRecord;
  },

  updateStatusWithLog: async (id, data) => {
    const record = await RepairStatus.findById(id).populate({
      path: "appointmentId",
      populate: [
        { path: "userId" },
        { path: "deviceTemplateId" },
        { path: "employeeId" },
        { path: "serviceId" },
      ],
    });

    if (!record) throw new Error("RepairStatus not found");

    if (data.status && data.status !== record.status) {
      record.status = data.status;
      record.statusLog.push({
        status: data.status,
        time: new Date(),
      });

      // Send email based on status change
      if (record.appointmentId?.userId?.email) {
        const emailTemplate = data.status.toLowerCase().replace(/\s+/g, "");
        await sendMail(
          record.appointmentId.userId.email,
          emailTemplate,
          record.appointmentId.userId.fullName,
          record.appointmentId.orderCode
        );
      }
    }

    if (data.estimatedCompletionTime) {
      record.estimatedCompletionTime = data.estimatedCompletionTime;
    }

    return await record.save();
  },
};

export default repairStatusService;
