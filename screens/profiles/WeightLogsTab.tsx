import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { logsStyles, WeightLog } from "../../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/contexts/AuthContext";
import { handleLogsDelete, handleLogsUpdate } from "@/utils/utils";

export const WeightLogsTab = ({
  logs,
  onAddNew,
  petId,
}: {
  petId: string;
  logs: WeightLog[];
  onAddNew: (weight: number, date: Date) => void;
}) => {
  const { user } = useAuth();

  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<WeightLog | null>(null);

  const handleAddWeight = () => {
    if (weight.trim() === "") return;
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue)) return;

    onAddNew(weightValue, date);
    setWeight("");
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.tabContentContainer}>
      <ScrollView style={styles.tabContent}>
        {logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              {editingLog?.id === log.id ? (
                // Edit mode
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editingLog.weight}
                    onChangeText={(text) =>
                      setEditingLog({ ...editingLog, weight: text })
                    }
                    keyboardType="numeric"
                  />
                  <DateTimePicker
                    value={new Date(editingLog.date)}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setEditingLog({ ...editingLog, date: selectedDate.toString() });
                      }
                    }}
                  />
                    <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() =>
                      handleLogsUpdate(log.id, petId, editingLog, setEditingLog)
                    }
                    >
                    <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
              ) : (
                // View mode
                <View style={styles.logItemContent}>
                  <View>
                    <Text style={styles.logValue}>{log.weight} kg</Text>
                    <Text style={styles.logDate}>
                      {new Date(log.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setShowDropdown(showDropdown === log.id ? null : log.id)
                    }
                    style={styles.menuButton}
                  >
                    <Text style={styles.menuDots}>⋮</Text>
                  </TouchableOpacity>

                  {showDropdown === log.id && (
                    <View style={styles.dropdown}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setEditingLog({
                            id: log.id,
                            weight: log.weight.toString(),
                            date: log.date.toString(),
                            pet_id: petId,
                          });
                          setShowDropdown(null);
                        }}
                      >
                        <Text>Update</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dropdownItem, styles.deleteItem]}
                        onPress={() => {
                          handleLogsDelete(log.id, user.id);
                          setShowDropdown(null);
                        }}
                      >
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No weight logs available</Text>
        )}
      </ScrollView>

      <View style={styles.addLogContainer}>
        <TextInput
          style={styles.logInput}
          placeholder="Enter weight in kg"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <View style={styles.datePicker}>
          <DateTimePicker value={date} mode="date" onChange={onDateChange} />
        </View>

        <TouchableOpacity style={styles.addLogButton} onPress={handleAddWeight}>
          <Text style={styles.addLogButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(logsStyles);
