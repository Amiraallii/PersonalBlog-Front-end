export interface ContactInfo {
  contactWayType: number;
  contactWay: string;
}

export interface PersonalInfo {
  name: string;
  lastName: string;
  jobTitle: string;
  aboutMe: string;
  contactInfo: ContactInfo[];
}