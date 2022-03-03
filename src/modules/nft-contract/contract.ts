const ERC721_ABI = [
  {
    constant: true,
    name: 'owner',
    outputs: [
      {
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'name',
    outputs: [
      {
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'symbol',
    outputs: [
      {
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'totalSupply',
    outputs: [
      {
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as any;

export type ContractType = 'ERC721' | 'ERC1155' | 'CryptoPunks';
export const getContractAbi = (type: ContractType) => {
  switch (type) {
    case 'ERC721':
    case 'ERC1155':
      return ERC721_ABI;
  }
};
