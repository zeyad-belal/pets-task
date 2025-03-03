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

const styles = StyleSheet.create(logsStyles);
