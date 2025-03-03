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

export const BodyConditionTab = ({
  logs,
  onAddNew,
}: {
  logs: BodyConditionLog[];
  onAddNew: (condition: string, date: Date) => void;
}) => {
  const [bodyCondition, setBodyCondition] = useState("");
  const [date, setDate] = useState(new Date());

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

  return (
    <View style={styles.tabContentContainer}>
      <ScrollView style={styles.tabContent}>
        {logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <Text style={styles.logValue}>{log.body_condition}</Text>
              <Text style={styles.logDate}>
                {new Date(log.date).toLocaleDateString()}
              </Text>
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
