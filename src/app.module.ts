import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import configuration from './modules/configuration';
import { DatabaseModule } from './modules/database/database.module';
import { EthereumModule } from './modules/ethereum/ethereum.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './modules/database/database.service';
import { ContractReaderModule } from './modules/contract-reader/contract-reader.module';
import { NFTCollectionModule } from './modules/nft-collection/nft-collection.module';
import { NFTCollectionTaskModule } from './modules/nft-collection-task/nft-collection-task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NFTContractModule } from './modules/nft-contract/nft-contract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [configuration],
    }),
    TerminusModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: DatabaseService,
    }),
    HealthModule,
    EthereumModule,
    ContractReaderModule,
    NFTCollectionModule,
    NFTCollectionTaskModule,
    ScheduleModule.forRoot(),
    NFTContractModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
