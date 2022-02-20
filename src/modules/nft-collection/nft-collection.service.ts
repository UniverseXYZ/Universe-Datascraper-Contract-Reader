import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  public async findUnprocessedOne() {
    return await this.nftCollectionModel.findOne({
      name: { $exists: false },
      tokenType: 'ERC721',
    });
  }

  public async markAsProcessed(
    contractAddress: string,
    name: string,
    symbol: string,
  ) {
    await this.nftCollectionModel.updateOne(
      {
        contractAddress,
      },
      {
        name,
        symbol,
      },
    );
  }
}
