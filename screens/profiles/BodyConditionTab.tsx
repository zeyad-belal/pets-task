import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { BodyConditionLog, logsStyles } from "../../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { handleLogsDelete, handleLogsUpdate } from "@/utils/utils";
import { useAuth } from "@/contexts/AuthContext";

export const BodyConditionTab = ({
  logs,
  onAddNew,
  petId,
}: {
  logs: BodyConditionLog[];
  onAddNew: (condition: string, date: Date) => void;
  petId: string;
}) => {
  const { user } = useAuth();

  const [bodyCondition, setBodyCondition] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<BodyConditionLog | null>(null);

  const handleAddBodyCondition = () => {
    if (bodyCondition.trim() === "") return;
    onAddNew(bodyCondition, date);
    setBodyCondition("");
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
                    value={editingLog.body_condition.toString()}
                    onChangeText={(text) =>
                      setEditingLog({ ...editingLog, body_condition: text })
                    }
                  />
                  <DateTimePicker
                    value={new Date(editingLog.date)}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setEditingLog({
                          ...editingLog,
                          date: selectedDate.toString(),
                        });
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
                  <View >
                    <Text style={styles.logValue}>{log.body_condition}</Text>
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
                            body_condition: log.body_condition.toString(),
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
                        onPress={() => handleLogsDelete(log.id, user.id)}
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
          <Text style={styles.noDataText}>
            No body condition logs available
          </Text>
        )}
      </ScrollView>

      <View style={styles.addLogContainer}>
        <TextInput
          style={styles.logInput}
          placeholder="Enter body condition"
          value={bodyCondition}
          onChangeText={setBodyCondition}
        />
        <View style={styles.datePicker}>
          <DateTimePicker value={date} mode="date" onChange={onDateChange} />
        </View>
        <TouchableOpacity
          style={styles.addLogButton}
          onPress={handleAddBodyCondition}
        >
          <Text style={styles.addLogButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(logsStyles);
