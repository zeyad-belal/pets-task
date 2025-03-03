export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age: number | string;
  created_at: any;
  owner_id: string;
  logs_weight: Array<WeightLog>;
  logs_bodycondition: Array<BodyConditionLog>;
  logs_vet_visits: VetVisitLog[] | null;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name?: string | null | undefined;
  avatar_url?: string;
  updated_at?: any;
}

export interface WeightLog {
  id: string;
  pet_id: string;
  weight: any;
  date: string;
}

export interface BodyConditionLog {
  date: string;
  id: string;
  body_condition: string | number;
  pet_id: string;
}

export type LogType = 'weight' | 'body' | 'vet' | any;

export interface VetVisitLog {
  id: string;
  pet_id: string;
  notes: string | null;
  date: string;
} 



export const logsStyles : any  = {
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
}