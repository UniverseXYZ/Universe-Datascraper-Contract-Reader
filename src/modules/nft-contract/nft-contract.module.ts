import { Module } from '@nestjs/common';
import { EthereumModule } from '../ethereum/ethereum.module';
import { NFTContractService } from './nft-contract.service';

@Module({
  imports: [EthereumModule],
  providers: [NFTContractService],
  exports: [NFTContractService],
})
export class NFTContractModule {}
