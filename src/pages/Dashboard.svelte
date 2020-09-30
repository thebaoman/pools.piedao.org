<script>
  import BigNumber from 'bignumber.js';
  import BalanceSmall from '../components/BalanceSmall.svelte';
  import { currentRoute } from '../stores/routes.js';
  import poolsConfig from "../config/pools.json";
  import { CoinGecko, piesMarketDataStore } from '../stores/coingecko.js';
  import { pools } from '../stores/eth.js';
  import images from "../config/images.json";

  import {
    getTokenImage,
    formatFiat
  } from "../components/helpers.js";

  $: pies = (poolsConfig.selectable.map(address => {
    return {
      ...poolsConfig[address],
      address,
      icon: getTokenImage(address),
      totalLiquidity: $pools[`${address}-usd`] ? formatFiat( $pools[`${address}-usd`].toFixed(2).toString() ) : '-'
    };
  }) || [])

  const tokensSwapOut = [
    {
      symbol: "DOUGH/ETH",
      address: "",
      balance: '0',
      type: 'Balancer',
      weeklyRewards: '200,000',
      containing: [
        {
          symbol: "DOUGH",
          address: "0xad32A8e6220741182940c5aBF610bDE99E737b2D",
          balance: '0',
          icon: getTokenImage('0xad32A8e6220741182940c5aBF610bDE99E737b2D')
        },
        {
          symbol: "ETH",
          address: "0x0000000000000000000000000000000000000000",
          balance: '0',
          icon: getTokenImage('eth')
        },
      ]
    },
    {
      symbol: "DEFI+S/ETH",
      address: "",
      balance: '0',
      weeklyRewards: '25,000',
      type: 'Balancer',
      containing: [
        {
          symbol: "DEFI+S",
          address: "0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c",
          balance: '0',
          icon: getTokenImage('0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c')
        },
        {
          symbol: "ETH",
          address: "0x0000000000000000000000000000000000000000",
          balance: '0',
          icon: getTokenImage('eth')
        },
      ]
    },
    {
      symbol: "DEFI+S/DAI",
      address: "",
      type: 'UniswapV2',
      weeklyRewards: '25,000',
      balance: '0',
      containing: [
        {
          symbol: "DEFI+S",
          address: "0xaD6A626aE2B43DCb1B39430Ce496d2FA0365BA9C",
          balance: '0',
          icon: getTokenImage('0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c')
        },
        {
          symbol: "DAI",
          address: "0x6b175474e89094c44da98b954eedeac495271d0f",
          balance: '0',
          icon: getTokenImage('0x6B175474E89094C44Da98b954EedeAC495271d0F')
        },
      ]
    },
  ];
</script>

<div class="content flex flex-col spl">

  <img alt="ready to diversify?" src={images.banner} />
  <!-- <div class="flex flex-row hidden md:flex content-between justify-between flex-wrap w-full">
    <BalanceSmall token={'0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c'} />
    <BalanceSmall token={'0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd'} />
    <BalanceSmall token={'0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e'} />
  </div> -->
  <div class="w-99pc m-4">

    <div class="my-10">
      <h1 class="text-lg">🥧 Explore Pies</h1>
      <p class="font-thin">An Entire Portfolio in a Single Token</p>
    </div>
    <table class="breakdown-table table-auto w-full">
      <thead>
        <tr>
          <th class="font-thin border-b-2 px-4 py-2 text-left">Pie name</th>
          <th class="font-thin border-b-2 px-4 py-2 hidden md:block">Assets</th>
          <th class="font-thin border-b-2 px-4 py-2">Liquidity</th>
          <th class="font-thin border-b-2 px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {#each pies as pie}
          <tr>
            <td class="border border-gray-800 px-2 py-2 text-left">
                <img
                  class="inline icon ml-2 mr-2"
                  src={pie.icon}
                  alt={pie.symbol} />
                  ({pie.symbol})
            </td>
            <td class="border text-center px-4 py-2 hidden md:block">
              {#each pie.composition as coin}
                <img
                  class="close-icons inline icon"
                  src={getTokenImage(coin.address)}
                  alt={coin.symbol} />
              {/each}
            </td>
            <td class="border text-center px-4 py-2">
              {pie.totalLiquidity}
            </td>
            <td class="border text-center px-4 py-2">
              <a href={`#/pools/${pie.address}`}>
                <button class="table-btn">
                  Mint
                </button>
              </a>
            </td>
            <td class="border text-center py-2">
              <a href={`#/pools/${pie.address}/withdraw/multi`}>
                <button class="table-btn">
                  Redeem
                </button>
              </a>
            </td>
            <!-- <td class="border text-center py-2">
              <button disabled class="table-btn">
                Stake
              </button>
            </td> -->
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="my-10">
      <h1 class="text-lg">👨‍🌾 Honest worker? Explore Pie Farming Opportunities</h1>
      <p class="font-thin">Add liquidity to earn fees and DOUGH incentives.</p>
    </div>

    <table class="breakdown-table table-auto w-full">
      <thead>
        <tr>
          <th class="font-thin border-b-2 px-4 py-2 text-left hidden md:block">Asset name</th>
          <th class="font-thin border-b-2 px-4 py-2">DEX</th>
          <th class="font-thin border-b-2 px-4 py-2">Weekly Rewards</th>
          <th class="font-thin border-b-2 px-4 py-2">APY</th>
          <th class="font-thin border-b-2 px-4 py-2">Date of launch</th>
        </tr>
      </thead>
      <tbody>
        {#each tokensSwapOut as pool}
          <tr>
            <td class="border border-gray-800 px-2 py-2 text-left hidden md:block">
              {#each pool.containing as coins}
                <img
                  class="inline icon ml-2 mr-2"
                  src={coins.icon}
                  alt={pool.symbol} />
                  ({coins.symbol})
              {/each}
            </td>
            <td class="border text-center px-4 py-2">
              {#if pool.type === 'UniswapV2'}
                🦄 Uniswap V2
              {/if}
              {#if pool.type === 'Balancer'}
                ⚖️ Balancer
              {/if}
            </td>
            <td class="border text-center px-4 py-2">
              {pool.weeklyRewards}
            </td>
            <td class="border text-center px-4 py-2">
              N/A
            </td>
            <td class="border text-center px-4 py-2">
              <button class="table-btn">
                3rd October 2020
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>