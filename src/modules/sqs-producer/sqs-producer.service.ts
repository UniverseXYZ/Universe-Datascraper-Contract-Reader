import { Injectable, Logger } from '@nestjs/common';
import { Producer } from 'sqs-producer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NFTCollectionService } from '../nft-collection/nft-collection.service';
import { NFTContractService } from '../nft-contract/nft-contract.service';
import { ContractType } from '../nft-contract/contract';

@Injectable()
export class SqsProducerService {
  public sqsProducer: Producer;
  private readonly logger = new Logger(SqsProducerService.name);

  constructor(
    private readonly nftCollectionService: NFTCollectionService,
    private readonly nftContractService: NFTContractService,
  ) {}

  /**
   * #1. check if there is any collection has no name yet
   * #2. read from contract to get name
   * #3. save to DB
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  public async checkCollection() {
    // Check if there is any unprocessed collection
    const unprocessed = await this.nftCollectionService.findUnprocessedOne();
    if (!unprocessed) {
      return;
    }
    this.logger.log(
      `[CRON Collection Name] Find one collection without name: ${unprocessed.contractAddress}, type: ${unprocessed.tokenType}`,
    );

    // read contract to get name
    const info = await this.nftContractService.getCollectionInfo(
      unprocessed.contractAddress,
      unprocessed.tokenType as ContractType,
    );
    const name = info.success ? info.name : '';
    const symbol = info.success ? info.symbol : '';

    // save to DB
    await this.nftCollectionService.markAsProcessed(
      unprocessed.contractAddress,
      name,
      symbol,
    );
  }
}
