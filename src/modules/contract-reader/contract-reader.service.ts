import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NFTCollectionService } from '../nft-collection/nft-collection.service';
import { NFTContractService } from '../nft-contract/nft-contract.service';
import { ContractType } from '../nft-contract/contract';
import { EtherscanService } from '../etherscan/etherscan.service';
import R from 'ramda';
import { EthereumService } from '../ethereum/ethereum.service';
import { ConfigService } from '@nestjs/config';
import { Utils } from 'src/utils';

@Injectable()
export class ContractReaderService {
  private readonly logger = new Logger(ContractReaderService.name);
  private readonly recentBlockGap: number;
  private readonly queryLimit: number;
  
  private skippingCounter: number = 0;
  private isProcessing: boolean = false;

  constructor(
    private configService: ConfigService,
    private readonly nftCollectionService: NFTCollectionService,
    private readonly nftContractService: NFTContractService,
    private readonly etherscanService: EtherscanService,
    private readonly ethereumService: EthereumService,
  ) {
    this.recentBlockGap = this.configService.get('recent_block_gap');
    this.queryLimit = this.configService.get('query_limit');
  }

  /**
   * #1. check if there is any collection has no name yet
   * #2. read from contract to get name
   * #3. save to DB
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  public async checkCollection() {
    if (this.isProcessing) {
      if (
        this.skippingCounter <
        Number(this.configService.get('skippingCounterLimit'))
      ) {
        this.skippingCounter++;
        this.logger.log(
          `[CRON Collection Name] Task is in process, skipping (${this.skippingCounter}) ...`,
        );
      } else {
        // when the counter reaches the limit, restart the pod.
        this.logger.log(
          `[CRON Collection Name] Task skipping counter reached its limit. The process is not responsive, restarting...`,
        );
        Utils.shutdown();
      }

      return;
    }

    this.isProcessing = true;

    try {
      // Check if there is any unprocessed collection
      const contracts = await this.nftCollectionService.findContractsWithoutMetadata(this.queryLimit);
      
      if (!contracts || !contracts.length) {
        this.logger.log("[CRON Collection Name] No contracts found without metadata");
        this.isProcessing = false;
        this.skippingCounter = 0;
        return;
      }
  
      for (let i = 0; i < contracts.length; i++) {
        const unprocessed = contracts[i];
  
        this.logger.log(
          `[CRON Collection Name] Processing collection without name: ${unprocessed.contractAddress}, type: ${unprocessed.tokenType}`,
        );
    
        // read contract to get name
        const meta = await this.nftContractService.getIERC721Metadata(
          unprocessed.contractAddress,
          unprocessed.tokenType as ContractType,
        );
        const name = meta.success ? meta.name : null;
        const symbol = meta.success ? meta.symbol : null;
    
        // read contract to get owner
        const moreMeta = await this.nftContractService.getContractOwner(
          unprocessed.contractAddress,
          unprocessed.tokenType as ContractType,
        );
        const owner = moreMeta.success ? moreMeta.owner : null;
    
        // save to DB
        await this.nftCollectionService.updateContractMetadata(
          unprocessed.contractAddress,
          name,
          symbol,
          owner,
        );    
  
        this.logger.log(
          `[CRON Collection Name] Processed collection succefully`,
        );
      }
    } catch(err) {
      this.logger.error("Failed to process metadata:");
      this.logger.error(err);
    } finally {
      this.isProcessing = false;
      this.skippingCounter = 0;
    }
  }

  /**
   * #1. check if there is any collection has no createdBlock yet
   * #2. read from etherscan to get block number
   * #3. save to DB
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  public async checkContractWithoutCreateBlock() {
    const contracts = await this.nftCollectionService.findContractWithoutCreateBlock(this.queryLimit);

    if (!contracts || !contracts.length) {
      return;
    }

    for (let i = 0; i < contracts.length; i++) {
      const contract = contracts[i];
      
      this.logger.log(
        `[CRON Collection Block Number] Find one collection without block number: ${contract.contractAddress}, type: ${contract.tokenType}`,
      );
  
      const result = await this.etherscanService.getTxList(
        contract.contractAddress,
      );
  
      if (!result.success) {
        const message = result.message
          ? `[CRON Collection Block Number] failed to get the transaction list from: ${contract.contractAddress}; Error: ${result.message}`
          : `[CRON Collection Block Number] failed to get the transaction list from: ${contract.contractAddress}; Error: Unkonwn`;
        this.logger.error(`${message}`);
        return;
      }
  
      const blockNumber: number = R.path(['data', '0', 'blockNumber'], result);
  
      if (!blockNumber) {
        const message = `[CRON Collection Block Number] failed to get the block number from Etherscan`;
        this.logger.error(`${message}`);
        await this.nftCollectionService.updateIgnoreCreatedAtBlock(
          contract.contractAddress,
        );
        return;
      }

      // As per Ryan, we only take care of the recent created NFT, e.g. created within 1000 blocks
      // const currentBlock = await this.ethereumService.getBlockNum();
      // if (blockNumber < currentBlock - this.recentBlockGap) {
      //   const message = `[CRON Collection Block Number] Ignore NFT Collection ${contract.contractAddress}, ${contract.tokenType} as it is too old. Created at ${blockNumber}`;
      //   this.logger.log(`${message}`);
      //   await this.nftCollectionService.updateIgnoreCreatedAtBlock(
      //     contract.contractAddress,
      //   );
      //   return;
      // }
  
      await this.nftCollectionService.updateCreateBlock(
        blockNumber,
        contract.contractAddress,
      );
    }

  }
}
