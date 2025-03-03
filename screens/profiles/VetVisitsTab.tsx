import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { logsStyles, VetVisitLog } from "../../types";
import DateTimePicker from "@react-native-community/datetimepicker";

export const VetVisitsTab = ({
  logs,
  onAddNew,
}: {
  logs: VetVisitLog[] | null;
  onAddNew: (notes: string, date: Date) => void;
}) => {
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());

  const handleAddVetVisit = () => {
    if (notes.trim() === "") return;
    onAddNew(notes, date);
    setNotes("");
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.tabContentContainer}>
      <ScrollView style={styles.tabContent}>
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.vetLogItem}>
              <Text style={styles.vetLogNotes}>{log.notes}</Text>
              <Text style={styles.logDate}>
                {new Date(log.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No vet visit logs available</Text>
        )}
      </ScrollView>

      <View style={styles.addLogContainer}>
        <TextInput
          style={[styles.logInput, styles.logInputMultiline]}
          placeholder="Enter vet visit notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
        />

        <View style={styles.datePicker}>
          <DateTimePicker value={date} mode="date" onChange={onDateChange} />
        </View>

        <TouchableOpacity
          style={styles.addLogButton}
          onPress={handleAddVetVisit}
        >
          <Text style={styles.addLogButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(logsStyles);
