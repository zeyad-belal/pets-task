import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  TextInput,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pet, BodyConditionLog, WeightLog, VetVisitLog } from "../../types";
import { petService } from "../../services/petService";
import { useAuth } from "../../contexts/AuthContext";

type RootStackParamList = {
  SingleProfile: { id: string };
  AddPet: undefined;
  PetsList: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "SingleProfile">;


function getThisMonthLogs(
  logs_bodycondition: BodyConditionLog[],
  logs_weight: WeightLog[]
) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const latestBodyConditionLog = logs_bodycondition
    .filter(
      (log) =>
        new Date(log.date).getMonth() === currentMonth &&
        new Date(log.date).getFullYear() === currentYear
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestWeightLog = logs_weight
    .filter(
      (log) =>
        new Date(log.date).getMonth() === currentMonth &&
        new Date(log.date).getFullYear() === currentYear
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return { latestBodyConditionLog, latestWeightLog };
}

const PetCard = ({ pet }: { pet: Pet }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{pet.name}</Text>
    <Text>Species: {pet.species}</Text>
    {pet.breed && <Text>Breed: {pet.breed}</Text>}
    <Text>Age: {pet.age} years</Text>
  </View>
);

// Tab components
const WeightLogsTab = ({ logs, onAddNew }: { logs: WeightLog[], onAddNew: (weight: number) => void }) => {
  const [weight, setWeight] = useState('');

  const handleAddWeight = () => {
    if (weight.trim() === '') return;
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue)) return;
    
    onAddNew(weightValue);
    setWeight('');
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
        <TouchableOpacity style={styles.addLogButton} onPress={handleAddWeight}>
          <Text style={styles.addLogButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BodyConditionTab = ({ logs, onAddNew }: { logs: BodyConditionLog[], onAddNew: (condition: string) => void }) => {
  const [bodyCondition, setBodyCondition] = useState('');

  const handleAddBodyCondition = () => {
    if (bodyCondition.trim() === '') return;
    onAddNew(bodyCondition);
    setBodyCondition('');
  };

  return (
    <View style={styles.tabContentContainer}>
      <ScrollView style={styles.tabContent}>
        {logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <Text style={styles.logValue}>
                Body Condition: {log.body_condition}
              </Text>
              <Text style={styles.logDate}>
                {new Date(log.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No body condition logs available</Text>
        )}
      </ScrollView>
      
      <View style={styles.addLogContainer}>
        <TextInput
          style={styles.logInput}
          placeholder="Enter body condition"
          value={bodyCondition}
          onChangeText={setBodyCondition}
        />
        <TouchableOpacity style={styles.addLogButton} onPress={handleAddBodyCondition}>
          <Text style={styles.addLogButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VetVisitsTab = ({
  logs,
  onAddNew,
}: {
  logs: VetVisitLog[] | null;
  onAddNew: (notes: string) => void;
}) => {
  const [notes, setNotes] = useState('');

  const handleAddVetVisit = () => {
    if (notes.trim() === '') return;
    onAddNew(notes);
    setNotes('');
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
        <TouchableOpacity style={styles.addLogButton} onPress={handleAddVetVisit}>
          <Text style={styles.addLogButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HealthStatus = ({ pet }: { pet: Pet }) => {
  const lastVetVisit =
    pet.logs_vet_visits && pet.logs_vet_visits.length > 0
      ? new Date(pet.logs_vet_visits[0].date).toLocaleDateString()
      : "No data";

  return (
    <View style={styles.healthStatus}>
      <Text style={styles.tableHeader}>Health Status</Text>
      <Text>
        Overall Health:{" "}
        {pet?.logs_weight.length > 3 ? "Good" : "Needs More Data"}
      </Text>
      <Text>Last Vet Visit: {lastVetVisit}</Text>
    </View>
  );
};

export const SingleProfile: React.FC<Props> = ({ route, navigation }) => {
  const { signOut } = useAuth();
  const { id } = route.params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogsCollapsed, setIsLogsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "weight" | "bodyCondition" | "vetVisits"
  >("weight");
  const [thisMonthLogs, setThisMonthLogs] = useState<{
    latestBodyConditionLog: BodyConditionLog | null;
    latestWeightLog: WeightLog | null;
  }>({
    latestBodyConditionLog: null,
    latestWeightLog: null,
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Supabase to fetch the pet data
        const fetchedPet = await petService.getPetById(id);

        if (fetchedPet) {
          setPet(fetchedPet);
        } else {
          // For demo purposes, if no pet is found in Supabase, use mock data
          // In a real app, you would show an error message
          const mockPet: Pet = {
            id: "1",
            name: "Max",
            species: "Dog",
            breed: "Golden Retriever",
            age: 3,
            created_at: new Date().toISOString(),
            owner_id: "123",
            logs_weight: [
              {
                id: "1",
                pet_id: "1",
                weight: 25.5,
                date: "2024-02-25T10:00:00Z",
              },
              {
                id: "2",
                pet_id: "1",
                weight: 26.0,
                date: "2024-01-25T10:00:00Z",
              },
            ],
            logs_bodycondition: [
              {
                id: "1",
                pet_id: "1",
                body_condition: "3",
                date: "2024-02-25T10:00:00Z",
              },
              {
                id: "2",
                pet_id: "1",
                body_condition: "4",
                date: "2024-01-25T10:00:00Z",
              },
            ],
            logs_vet_visits: [
              {
                id: "1",
                pet_id: "1",
                notes: "Annual checkup. All vaccinations updated.",
                date: "2024-02-15T14:30:00Z",
              },
            ],
          };
          setPet(mockPet);
        }
      } catch (err) {
        console.error("Error fetching pet:", err);
        setError("Failed to load pet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  useEffect(() => {
    if (pet) {
      setThisMonthLogs(
        getThisMonthLogs(pet.logs_bodycondition, pet.logs_weight)
      );
    }
  }, [pet]);

  const handleAddWeightLog = useCallback(async (weight: number) => {
    if (!pet) return;

    try {
      const newWeightLog = {
        pet_id: pet.id,
        weight: weight,
        date: new Date().toISOString(),
      };

      const addedWeightLog = await petService.addWeightLog(newWeightLog);

      // Update the pet state with the new weight log
      setPet((prevPet) => {
        if (!prevPet) return null;

        const updatedWeightLogs = [addedWeightLog, ...prevPet.logs_weight];

        return {
          ...prevPet,
          logs_weight: updatedWeightLogs,
        };
      });

      console.log('Added new weight log:', addedWeightLog);
    } catch (err) {
      console.error('Error adding weight log:', err);
      // In a real app, you would show an error message to the user
    }
  }, [pet]);

  const handleAddBodyConditionLog = useCallback(async (condition: string) => {
    if (!pet) return;

    try {
      const newBodyConditionLog = {
        pet_id: pet.id,
        body_condition: condition,
        date: new Date().toISOString(),
      };

      const addedBodyConditionLog = await petService.addBodyConditionLog(newBodyConditionLog);

      // Update the pet state with the new body condition log
      setPet((prevPet) => {
        if (!prevPet) return null;

        const updatedBodyConditionLogs = [addedBodyConditionLog, ...prevPet.logs_bodycondition];

        return {
          ...prevPet,
          logs_bodycondition: updatedBodyConditionLogs,
        };
      });

      console.log('Added new body condition log:', addedBodyConditionLog);
    } catch (err) {
      console.error('Error adding body condition log:', err);
      // In a real app, you would show an error message to the user
    }
  }, [pet]);

  const handleAddVetVisit = useCallback(async (notes: string) => {
    if (!pet) return;

    try {
      const newVetVisit = {
        pet_id: pet.id,
        notes: notes,
        date: new Date().toISOString(),
      };

      const addedVetVisit = await petService.addVetVisitLog(newVetVisit);

      // Update the pet state with the new vet visit
      setPet((prevPet) => {
        if (!prevPet) return null;

        const updatedVetVisits = prevPet.logs_vet_visits
          ? [addedVetVisit, ...prevPet.logs_vet_visits]
          : [addedVetVisit];

        return {
          ...prevPet,
          logs_vet_visits: updatedVetVisits,
        };
      });

      console.log("Added new vet visit:", addedVetVisit);
    } catch (err) {
      console.error("Error adding vet visit:", err);
      // In a real app, you would show an error message to the user
    }
  }, [pet]);

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "weight":
        return <WeightLogsTab logs={pet?.logs_weight || []} onAddNew={handleAddWeightLog} />;
      case "bodyCondition":
        return <BodyConditionTab logs={pet?.logs_bodycondition || []} onAddNew={handleAddBodyConditionLog} />;
      case "vetVisits":
        return (
          <VetVisitsTab
            logs={pet?.logs_vet_visits || null}
            onAddNew={handleAddVetVisit}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Retry"
          onPress={() => navigation.replace("SingleProfile", { id })}
        />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pet not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.headerSection, isLogsCollapsed && styles.expandedHeaderSection]}>
        <ScrollView>
          <View style={styles.headerRow}>
            <PetCard pet={pet} />
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.addPetButton} 
                onPress={() => navigation.navigate('AddPet')}
              >
                <Text style={styles.addPetButtonText}>Add Pet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.monthSummary}>
            <Text style={styles.tableHeader}>This Month's Summary</Text>
            <Text>
              Latest Weight:{" "}
              {thisMonthLogs.latestWeightLog?.weight || "No data"} kg
            </Text>
            <Text>
              Body Condition:{" "}
              {thisMonthLogs.latestBodyConditionLog?.body_condition ||
                "No data"}
            </Text>
          </View>

          <HealthStatus pet={pet} />
        </ScrollView>
      </View>

      <View style={[styles.logsSection, isLogsCollapsed && styles.collapsedLogsSection]}>
        <TouchableOpacity 
          style={styles.logsHeader}
          onPress={() => setIsLogsCollapsed(!isLogsCollapsed)}
        >
          <Text style={styles.logsHeaderText}>Health Logs</Text>
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-glyphs/30/000000/chevron-down.png' }}
            style={[
              styles.arrowIcon,
              isLogsCollapsed && styles.arrowIconCollapsed
            ]}
          />
        </TouchableOpacity>
        
        {!isLogsCollapsed && (
          <View style={styles.logsContent}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "weight" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("weight")}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "weight" && styles.activeTabButtonText,
                  ]}
                >
                  Weight Logs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "bodyCondition" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("bodyCondition")}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "bodyCondition" && styles.activeTabButtonText,
                  ]}
                >
                  Body Condition
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "vetVisits" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("vetVisits")}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "vetVisits" && styles.activeTabButtonText,
                  ]}
                >
                  Vet Visits
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContentWrapper}>{renderTabContent()}</View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerSection: {
    height: "40%",
    padding: 16,
    paddingBottom: 0,
  },
  expandedHeaderSection: {
    height: "90%",
  },
  logsSection: {
    height: "60%",
    padding: 0,
  },
  collapsedLogsSection: {
    height: "10%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  logsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#007AFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logsHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  logsContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerButtons: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  backButton: {
    backgroundColor: "#5856d6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  addPetButton: {
    backgroundColor: "#34c759",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addPetButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabButtonText: {
    color: "#8E8E93",
    fontWeight: "600",
  },
  activeTabButtonText: {
    color: "#007AFF",
  },
  tabContentWrapper: {
    flex: 1,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  arrowIconCollapsed: {
    transform: [{ rotate: "-90deg" }],
  },
  tabContentContainer: {
    flex: 1,
    position: "relative",
  },
  tabContent: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Add padding to ensure content isn't hidden behind the add button
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
});
