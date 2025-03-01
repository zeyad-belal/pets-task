import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { petService } from "../../services/petService";
import { useAuth } from "../../contexts/AuthContext";

type RootStackParamList = {
  AddPet: undefined;
  SingleProfile: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "AddPet">;

export const AddPetScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyCondition, setBodyCondition] = useState("");
  const [vetNotes, setVetNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPet = async () => {
    if (!name || !species || !age || !weight) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (name, species, age, weight)"
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to add a pet");
      return;
    }

    try {
      setLoading(true);

      const newPet = {
        name,
        species,
        breed: breed || null,
        age: parseInt(age, 10),
        owner_id: user.id,
      };

      const pet = await petService.createPet(newPet);

      // Add initial weight log
      if (weight) {
        const weightLog = {
          pet_id: pet.id,
          weight: parseFloat(weight),
          date: new Date().toISOString(),
        };

        await petService.addWeightLog(weightLog);
      }

      // Add initial body condition log
      if (bodyCondition) {
        const bodyConditionLog = {
          pet_id: pet.id,
          body_condition: bodyCondition,
          date: new Date().toISOString(),
        };

        await petService.addBodyConditionLog(bodyConditionLog);
      }

      // Add initial vet visit log
      if (vetNotes) {
        const vetVisitLog = {
          pet_id: pet.id,
          notes: vetNotes,
          date: new Date().toISOString(),
        };

        await petService.addVetVisitLog(vetVisitLog);
      }

      // Navigate to the pet profile screen with the new pet's ID
      navigation.replace("SingleProfile", { id: pet.id });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to add pet"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add a New Pet</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet's name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Species *</Text>
        <TextInput
          style={styles.input}
          placeholder="Dog, Cat, etc."
          value={species}
          onChangeText={setSpecies}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Breed</Text>
        <TextInput
          style={styles.input}
          placeholder="Optional"
          value={breed}
          onChangeText={setBreed}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Age (years) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Age in years"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Weight (kg) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Current weight in kg"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Body Condition</Text>
        <TextInput
          style={styles.input}
          placeholder="Body condition (e.g., 'Normal', 'Overweight')"
          value={bodyCondition}
          onChangeText={setBodyCondition}
        />

        <Text style={styles.label}>Vet Visit Notes</Text>
        <TextInput
          style={styles.inputMultiline}
          placeholder="Initial vet visit notes (optional)"
          value={vetNotes}
          onChangeText={setVetNotes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddPet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Pet</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#007AFF",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
