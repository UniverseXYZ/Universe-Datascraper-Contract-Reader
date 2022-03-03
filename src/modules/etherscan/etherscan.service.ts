import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ethers } from 'ethers';
import R from 'ramda';

@Injectable()
export class EtherscanService {
  constructor(protected readonly configService: ConfigService) {}

  public async getContractAbi(address: string) {
    const isValidAddress = ethers.utils.isAddress(address);

    if (!isValidAddress) {
      return { success: false, message: 'Invalid address' };
    }

    const etherscan_api_key = this.configService.get('etherscan_api_key');

    if (!etherscan_api_key) {
      return { success: false, message: 'Etherscan API key is not defined' };
    }

    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${etherscan_api_key}`;
    const response = await axios.get(url);
    return { success: true, abi: response.data.result };
  }

  public async getTxList(
    address: string,
    page = 1,
    fromBlock = 0,
    toBlock = 999999999,
    offset = 1,
    sort = 'asc',
  ) {
    const etherscan_api_key = this.configService.get('etherscan_api_key');

    if (!etherscan_api_key) {
      return { success: false, message: 'Etherscan API key is not defined' };
    }

    const isValidAddress = ethers.utils.isAddress(address);

    if (!isValidAddress) {
      return { success: false, message: 'Invalid address' };
    }

    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${fromBlock}&endblock=${toBlock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${etherscan_api_key}`;
    try {
      const response = await axios.get(url);

      const data = R.path(['data', 'result'], response);

      if (!data) {
        return {
          success: false,
          message: 'No data return from etherscan endpoint',
        };
      }

      return { success: true, data };
    } catch (error) {
      let message = '';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { data, status, headers } = error.response;
        message = `status: ${status}; headers: ${headers}; data: ${data}`;
        return { success: false, message };
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return { success: false, message: error.request };
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        return { success: false, message: error.message };
      } else {
        console.log(error.config);
        return { success: false, message: error.config };
      }
    }
  }
}
