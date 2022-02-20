import { Injectable } from '@nestjs/common';
import { EthereumNetworkType } from './interface';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthereumService {
  public ether: any;

  constructor(private configService: ConfigService) {
    const key = this.configService.get('ethereum_network');

    const projectId = this.configService.get('infura.project_id');

    if (!projectId) {
      throw new Error('Infura project id or secret is not defined');
    }

    const ethersProvider = ethers.getDefaultProvider(EthereumNetworkType[key], {
      infura: {
        projectId,
      },
    });
    this.ether = ethersProvider;
  }

  public async getBlockNum() {
    return this.ether.getBlockNumber();
  }
}
