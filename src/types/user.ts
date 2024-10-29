export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  ttd: string;
  verified: boolean;
  authcode: string;
  createdAt: string;
  updatedAt: string;
};

export type WithToken = {
  token: string;
};
