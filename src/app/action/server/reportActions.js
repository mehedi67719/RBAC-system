import { dbconnection } from "@/Components/lib/dbconnection";
import { ObjectId } from "mongodb";

// Get all reports
export const getReports = async () => {
  try {
    const col = await dbconnection("reports");
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();

    return docs.map((r) => ({
      id: r._id.toString(),
      name: r.reportName || r.name || '',
      type: r.reportType || r.type || 'Sales',
      dateRange: r.dateRange || 'Last 30 Days',
      format: r.format || 'PDF',
      status: r.status || 'Generated',
      size: r.size || '1.5 MB',
      includeCharts: r.includeCharts || false,
      includeTables: r.includeTables || false,
      sendEmail: r.sendEmail || false,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error in getReports:", error);
    return [];
  }
};

// Get single report by ID
export const getReportById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const col = await dbconnection("reports");
    const report = await col.findOne({ _id: new ObjectId(id) });

    if (!report) return null;

    return {
      id: report._id.toString(),
      reportName: report.reportName || '',
      reportType: report.reportType || 'Sales',
      dateRange: report.dateRange || 'Last 30 Days',
      format: report.format || 'PDF',
      includeCharts: report.includeCharts || false,
      includeTables: report.includeTables || false,
      sendEmail: report.sendEmail || false,
    };
  } catch (error) {
    console.error("Error in getReportById:", error);
    return null;
  }
};

// Create new report
export const createReport = async (formData, actor) => {
  try {
    const reportName = formData.get("reportName")?.toString().trim();
    const reportType = formData.get("reportType")?.toString() || 'Sales';
    const dateRange = formData.get("dateRange")?.toString() || 'Last 30 Days';
    const format = formData.get("format")?.toString() || 'PDF';
    const includeCharts = formData.get("includeCharts") === 'on';
    const includeTables = formData.get("includeTables") === 'on';
    const sendEmail = formData.get("sendEmail") === 'on';

    if (!reportName) {
      return { success: false, message: "Report name is required" };
    }

    const col = await dbconnection("reports");

    // Generate random size based on format
    const size = generateRandomSize(format);

    const doc = {
      reportName,
      reportType,
      dateRange,
      format,
      status: 'Generated',
      size,
      includeCharts,
      includeTables,
      sendEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: actor?.id || null,
    };

    const result = await col.insertOne(doc);

    return { 
      success: true, 
      id: result.insertedId.toString(),
      message: "Report created successfully"
    };
  } catch (error) {
    console.error("Error in createReport:", error);
    return { success: false, message: "Failed to create report" };
  }
};

// Update report
export const updateReport = async (id, formData, actor) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid report ID" };
    }

    const reportName = formData.get("reportName")?.toString().trim();
    const reportType = formData.get("reportType")?.toString() || 'Sales';
    const dateRange = formData.get("dateRange")?.toString() || 'Last 30 Days';
    const format = formData.get("format")?.toString() || 'PDF';
    const includeCharts = formData.get("includeCharts") === 'on';
    const includeTables = formData.get("includeTables") === 'on';
    const sendEmail = formData.get("sendEmail") === 'on';

    if (!reportName) {
      return { success: false, message: "Report name is required" };
    }

    const col = await dbconnection("reports");

    const existingReport = await col.findOne({ _id: new ObjectId(id) });
    if (!existingReport) {
      return { success: false, message: "Report not found" };
    }

    const updateDoc = {
      $set: {
        reportName,
        reportType,
        dateRange,
        format,
        includeCharts,
        includeTables,
        sendEmail,
        updatedAt: new Date(),
      }
    };

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Report not found" };
    }

    return { 
      success: true, 
      message: "Report updated successfully" 
    };
  } catch (error) {
    console.error("Error in updateReport:", error);
    return { success: false, message: "Failed to update report" };
  }
};

// Delete report
export const deleteReport = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid report ID" };
    }

    const col = await dbconnection("reports");
    
    const report = await col.findOne({ _id: new ObjectId(id) });
    if (!report) {
      return { success: false, message: "Report not found" };
    }

    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, message: "Report not found" };
    }

    return { 
      success: true, 
      message: "Report deleted successfully",
      data: { name: report.reportName }
    };
  } catch (error) {
    console.error("Error in deleteReport:", error);
    return { success: false, message: "Failed to delete report" };
  }
};

// Helper function to generate random file size
function generateRandomSize(format) {
  const sizes = {
    'PDF': (Math.random() * 3 + 1).toFixed(1) + ' MB',
    'Excel': (Math.random() * 2 + 0.5).toFixed(1) + ' MB',
    'CSV': (Math.random() * 1 + 0.2).toFixed(1) + ' MB',
    'JSON': (Math.random() * 1.5 + 0.3).toFixed(1) + ' MB',
  };
  return sizes[format] || '1.5 MB';
}