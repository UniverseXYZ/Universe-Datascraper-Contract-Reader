import { Module } from '@nestjs/common';
import { EthereumModule } from '../ethereum/ethereum.module';
import { NFTCollectionTaskModule } from '../nft-collection-task/nft-collection-task.module';
import { NFTCollectionModule } from '../nft-collection/nft-collection.module';
import { NFTContractModule } from '../nft-contract/nft-contract.module';
import { SqsProducerService } from './sqs-producer.service';

@Module({
  providers: [SqsProducerService],
  exports: [SqsProducerService],
  imports: [
    NFTCollectionTaskModule,
    NFTCollectionModule,
    EthereumModule,
    NFTContractModule,
  ],
})
export class SqsProducerModule {}
