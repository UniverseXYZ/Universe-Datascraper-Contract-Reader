import { Module } from '@nestjs/common';
import { EthereumModule } from '../ethereum/ethereum.module';
import { EtherscanService } from '../etherscan/etherscan.service';
import { NFTCollectionTaskModule } from '../nft-collection-task/nft-collection-task.module';
import { NFTCollectionModule } from '../nft-collection/nft-collection.module';
import { NFTContractModule } from '../nft-contract/nft-contract.module';
import { ContractReaderService } from './contract-reader.service';

@Module({
  providers: [ContractReaderService, EtherscanService],
  exports: [ContractReaderService],
  imports: [
    NFTCollectionTaskModule,
    NFTCollectionModule,
    EthereumModule,
    NFTContractModule,
  ],
})
export class ContractReaderModule {}
