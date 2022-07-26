import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { EthereumService } from '../ethereum/ethereum.service';
import { ContractType, getContractAbi } from './contract';

@Injectable()
export class NFTContractService {
  private readonly logger = new Logger(NFTContractService.name);
  constructor(protected readonly ethService: EthereumService) {}

  public async getTokenUri(
    contractAddress: string,
    contractType: ContractType,
    tokenId: string,
  ): Promise<{ success: boolean; tokenUri?: string; error?: string }> {
    const contractAbi = getContractAbi(contractType);
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      this.ethService.ether,
    );
    if (!contract) {
      this.logger.log(
        `Contract instance ${contractAddress} ${contractType} cannot be constructued.`,
      );
      return {
        success: false,
        error: 'Contract instance cannot be constructued.',
      };
    }
    try {
      let tokenUri;
      if (contractType === 'ERC721') {
        tokenUri = await contract.tokenURI(tokenId);
      } else if (contractType === 'ERC1155') {
        tokenUri = await contract.uri(tokenId);
      }

      return { success: true, tokenUri };
    } catch (err) {
      this.logger.log('Get tokenUri from contract failed', JSON.stringify(err));

      if (err?.error?.reason === 'timeout' || err?.error?.code === 429 || err?.error?.status === 403 || err?.error?.code === 'TIMEOUT') {
        return await this.ethService.connectToProvider(() => this.getTokenUri(contractAddress, contractType, tokenId));
      }

      return {
        success: false,
        error: JSON.stringify(err),
      };
    }
  }

  public async getIERC721Metadata(
    contractAddress: string,
    contractType: ContractType,
  ): Promise<{
    success: boolean;
    name?: string;
    symbol?: string;
    totalSupply?: number;
    error?: string;
  }> {
    const contractAbi = getContractAbi(contractType);
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      this.ethService.ether,
    );
    if (!contract) {
      this.logger.log(
        `Contract instance ${contractAddress} ${contractType} cannot be constructued.`,
      );
      return {
        success: false,
        error: 'Contract instance cannot be constructued.',
      };
    }
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      // const totalSupply = await contract.totalSupply();

      return { success: true, name, symbol };
    } catch (err) {
      this.logger.log(
        'Get name/symbol from contract failed',
        JSON.stringify(err),
      );
      if (err?.error?.reason === 'timeout' || err?.error?.code === 429 || err?.error?.status === 403 || err?.error?.code === 'TIMEOUT') {
        return await this.ethService.connectToProvider(() => this.getIERC721Metadata(contractAddress, contractType));
      }
      return {
        success: false,
        error: JSON.stringify(err),
      };
    }
  }

  public async getContractOwner(
    contractAddress: string,
    contractType: ContractType,
  ): Promise<{
    success: boolean;
    owner?: string;
    error?: string;
  }> {
    const contractAbi = getContractAbi(contractType);
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      this.ethService.ether,
    );
    if (!contract) {
      this.logger.log(
        `Contract instance ${contractAddress} ${contractType} cannot be constructued.`,
      );

      return {
        success: false,
        error: 'Contract instance cannot be constructued.',
      };
    }
    try {
      const owner = await contract.owner();
      // const totalSupply = await contract.totalSupply();

      return { success: true, owner };
    } catch (err) {
      this.logger.log('Get owner from contract failed', JSON.stringify(err));

      if (err?.error?.reason === 'timeout' || err?.error?.code === 429 || err?.error?.status === 403 || err?.error?.code === 'TIMEOUT') {
        return await this.ethService.connectToProvider(() => this.getContractOwner(contractAddress, contractType));
      }

      return {
        success: false,
        error: JSON.stringify(err),
      };
    }
  }
}
