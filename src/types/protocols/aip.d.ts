// src/types/protocols/aip.d.ts
export type AIP = {
  address?: string;
  algorithm?: string;
  signing_algorithm?: string;
  signing_address?: string;
  index?: number[];
  hashing_algorithm?: string;
  index_unit_size?: number;
  signature?: string;
  verified?: boolean;
};
