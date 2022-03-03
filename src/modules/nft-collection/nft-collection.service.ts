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

  public async findContractWithoutMetadata() {
    return await this.nftCollectionModel.findOne({
      name: { $exists: false },
      tokenType: { $in: ['ERC721', 'ERC1155'] },
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

  public async findContractWithoutCreateBlock() {
    return await this.nftCollectionModel.findOne({
      $or: [
        { createdAtBlock: { $exists: false } },
        { createdAtBlock: { $eq: null } },
      ],
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
}
