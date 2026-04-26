export default interface Candidate {
  id: string;
  name: string;
  description: string;
  photoURL: string;
  vision: string;
  mission: string;
  type: 'MP' | 'MLA';
  partyName: string;
  partySymbolURL: string;
  state: string;
  constituency: string;
  biography: string;
  education: string;
  assets: string;
  liabilities: string;
  criminal_records: string;
  district: string;
}
