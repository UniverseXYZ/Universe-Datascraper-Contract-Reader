import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EthereumService } from '../ethereum/ethereum.service';
import { NFTContractService } from './nft-contract.service';
import configuration from '../configuration';

describe('NFT Contract', () => {
  let service: NFTContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: false,
          ignoreEnvVars: false,
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [NFTContractService, EthereumService],
    }).compile();

    service = module.get<NFTContractService>(NFTContractService);
  });

  it('should get token uri successfully', async () => {
    const contractAddress = '0xe51Aac67b09EaEd6d3D43e794D6bAe679Cbe09D8';
    const contractType = 'ERC721';
    const tokenId = '0';
    const res = await service.getTokenUri(
      contractAddress,
      contractType,
      tokenId,
    );
    expect(res.success).toBe(true);
  });

  it('should be failed when contract address is invalid', async () => {
    const contractAddress = '0xe51Aac67b09EaEd6d3D43e794D6bAe679Cbe09D88';
    const contractType = 'ERC721';
    const tokenId = '0';
    const res = await service.getTokenUri(
      contractAddress,
      contractType,
      tokenId,
    );
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('should be successful when contract address is invalid - ERC1155', async () => {
    const contractAddress = '0x495f947276749Ce646f68AC8c248420045cb7b5e';
    const contractType = 'ERC1155';
    const tokenId =
      '102676433867259323931171365895354757783778570312312576485042789456911181807617';
    const res = await service.getTokenUri(
      contractAddress,
      contractType,
      tokenId,
    );
    expect(res.success).toBe(true);
  });
});
