export const wethAbi = [
  {
    type: "event",
    name: "Withdrawal",
    inputs: [
      { name: "src", type: "address", indexed: true },
      { name: "wad", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { name: "dst", type: "address", indexed: true },
      { name: "wad", type: "uint256", indexed: false },
    ],
  },
];
