export interface ContractSpec {
  multiplier: number;
  tickSize: number;
  tickValue: number;
  margin: number;
}

export const CONTRACTS = {
  NQ:  { multiplier: 20,   tickSize: 0.25, tickValue: 5.00,  margin: 18000 },
  MNQ: { multiplier: 2,    tickSize: 0.25, tickValue: 0.50,  margin: 1800  },
  ES:  { multiplier: 50,   tickSize: 0.25, tickValue: 12.50, margin: 14000 },
  MES: { multiplier: 5,    tickSize: 0.25, tickValue: 1.25,  margin: 1400  },
  GC:  { multiplier: 100,  tickSize: 0.10, tickValue: 10.00, margin: 11000 },
  MGC: { multiplier: 10,   tickSize: 0.10, tickValue: 1.00,  margin: 1100  },
  CL:  { multiplier: 1000, tickSize: 0.01, tickValue: 10.00, margin: 7000  },
  MCL: { multiplier: 100,  tickSize: 0.01, tickValue: 1.00,  margin: 700   },
} as const satisfies Record<string, ContractSpec>;

export type ContractSymbol = keyof typeof CONTRACTS;
