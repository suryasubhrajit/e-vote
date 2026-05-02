export default interface User {
  uid: string;
  name: string;
  email: string;
  password?: string;
  votedMP: boolean;
  votedMLA: boolean;
  state: string;
  constituency: string;
  isAdmin: boolean;
}
