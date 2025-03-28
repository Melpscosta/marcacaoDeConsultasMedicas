export type Appointment = {
    id: string;
    doctorId: string;
    date: string;
    time: string;
    description: string;
    status: string;
  };
  
  // src/types/doctors.ts
  export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    image: string;
  };
  
  // src/types/navigation.ts
  export type RootStackParamList = {
    Home: undefined;
    CreateAppointment: undefined;
    Profile: undefined;
  };