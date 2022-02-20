const ERC721_ABI = [
  {
    constant: true,
    name: 'name',
    outputs: [
      {
        name: '',
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
        name: '',
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
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as any;

const ERC1155_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        name: '',
        type: 'string',
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
      return ERC721_ABI;
    case 'ERC1155':
      return ERC1155_ABI;
  }
};
