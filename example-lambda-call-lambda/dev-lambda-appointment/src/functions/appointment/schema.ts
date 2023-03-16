export default {
  type: "object",
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
} as const;


export enum ISO_COUNTRY {
  COLOMBIA = "CO",
  MEXICO = "MX",
  PERU = "PE",
}

export interface Message {
  isoCountry: ISO_COUNTRY;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  nameSpecialty: string;
  nameDoctor: string;
  appointmentDate: string;
}
