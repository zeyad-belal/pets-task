import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { WeightLog } from "../../types";
import DateTimePicker from "@react-native-community/datetimepicker";

export const WeightLogsTab = ({
  logs,
  onAddNew,
}: {
  logs: WeightLog[];
  onAddNew: (weight: number, date: Date) => void;
}) => {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());

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

  return (
    <View style={styles.tabContentContainer}>
      <ScrollView style={styles.tabContent}>
        {logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <Text style={styles.logValue}>{log.weight} kg</Text>
              <Text style={styles.logDate}>
                {new Date(log.date).toLocaleDateString()}
              </Text>
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

const styles = StyleSheet.create({
  tabContentContainer: {
    flex: 1,
    position: "relative",
  },
  tabContent: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
    marginBottom: 90,
    paddingTop: 12,
  },
  addLogContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#f8f8f8",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  logInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  logInputMultiline: {
    height: 60,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  addLogButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addLogButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  monthSummary: {
    padding: 16,
    backgroundColor: "#e6f3ff",
    borderRadius: 8,
    marginBottom: 16,
  },
  healthStatus: {
    padding: 16,
    backgroundColor: "#f0fff0",
    borderRadius: 8,
    marginBottom: 16,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  vetLogItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  logDate: {
    color: "#8E8E93",
  },
  vetLogNotes: {
    fontSize: 16,
    marginBottom: 8,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 24,
    color: "#8E8E93",
  },
  errorText: {
    textAlign: "center",
    marginTop: 24,
    color: "red",
    fontSize: 16,
  },
  datePicker: {
    marginRight: 12,
    alignSelf: "center",
  },
});
