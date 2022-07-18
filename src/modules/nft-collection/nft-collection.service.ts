import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import R from 'ramda';
import {
  NFTCollection,
  NFTCollectionDocument,
} from './schemas/nft-collection.shema';

@Injectable()
export class NFTCollectionService {
  private readonly logger = new Logger(NFTCollectionService.name);

  constructor(
    @InjectModel(NFTCollection.name)
    private readonly nftCollectionModel: Model<NFTCollectionDocument>,
  ) {}

  public async findContractsWithoutMetadata(limit: number) {
    return await this.nftCollectionModel.find({
      name: { $exists: false },
      tokenType: { $in: ['ERC721', 'ERC1155'] },
    },
    {},
    {
      limit,
    });
  }

  public async updateContractMetadata(
    contractAddress: string,
    name: string,
    symbol: string,
    owner: string,
  ) {
    await this.nftCollectionModel.updateOne(
      {
        contractAddress,
      },
      {
        name,
        symbol,
        owner,
      },
    );
  }

  public async findContractWithoutCreateBlock(limit: number) {
    return await this.nftCollectionModel.find({
      $or: [
        { createdAtBlock: { $exists: false } },
        { createdAtBlock: { $eq: null } },
      ],
      ignoreForRetrieveCreatedAtBlock: { $in: [null, false] },
    },
    {},
    {
      limit
    });
  }

  public async updateCreateBlock(blockNumber: number, contractAddress: string) {
    try {
      const result = await this.nftCollectionModel.updateOne(
        {
          contractAddress,
        },
        {
          createdAtBlock: blockNumber,
        },
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(error);
      const message =
        R.prop('message', error) || 'failed to update the block number';
      return { success: false, message };
    }
  }

  public async updateIgnoreCreatedAtBlock(contractAddress: string) {
    try {
      const result = await this.nftCollectionModel.updateOne(
        {
          contractAddress,
        },
        {
          ignoreForRetrieveCreatedAtBlock: true,
        },
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(error);
      const message =
        R.prop('message', error) || 'failed to update the ignoreCreatedAtBlock';
      return { success: false, message };
    }
  }
}
