import { petService } from "@/services/petService";
import { BodyConditionLog, VetVisitLog, WeightLog } from "@/types";



export const handleLogsUpdate = async (
  logId: string,
  editingLog: WeightLog | BodyConditionLog | VetVisitLog,
  setEditingLog: React.Dispatch<React.SetStateAction<any>>
) => {
  if (!editingLog) return;

  try {
    if ('weight' in editingLog) {
      await petService.updateLog("weight", logId, {
        weight: parseFloat(editingLog.weight),
        date: editingLog.date.toString(),
      });
    }
    if ('body_condition' in editingLog) {
      await petService.updateLog("body", logId, {
        body_condition: editingLog.body_condition,
        date: editingLog.date.toString(),
      });
    }
    if ('notes' in editingLog) {
      await petService.updateLog("vet", logId, {
        notes: editingLog.notes,
        date: editingLog.date.toString(),
      });
    }
    setEditingLog(null);
  } catch (error) {
    console.error("Error updating log:", error);
  }
};

export const handleLogsDelete = async (logId: string, logType:'weight' | 'body' | 'vet') => {
  try {
    await petService.deleteLog(logType, logId);

  } catch (error) {
    console.error("Error deleting log:", error);
  }
};
