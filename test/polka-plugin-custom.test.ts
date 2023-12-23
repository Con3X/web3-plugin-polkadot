import { Web3 } from 'web3';
import { PolkaPlugin } from '../src';
import { SubstrateSimpleRpcInterface } from '../src/interfaces/substrate/augment-api-rpc';
import { MyLimitedNodeRpcMethods } from './fixtures/limited-rpc-methods';

describe('PolkaPlugin Custom Provider Tests', () => {
  it('should be able to register custom rpc methods at a custom namespace inside the plugin', async () => {
    const polka = new PolkaPlugin();
    // there would be some work later to enhance the typescript types for this.
    const web3 = polka.registerAt<'myLimitedNode', typeof MyLimitedNodeRpcMethods, SubstrateSimpleRpcInterface>(
      new Web3('ws://127.0.0.1:9944/'),
      'myLimitedNode',
      MyLimitedNodeRpcMethods
    );
    web3.provider?.on('error', (error: any) => {
      console.log('Caught provider error: ', error.message || error);
    });

    expect((web3.polka.myLimitedNode.rpc as any)?.author).toBeUndefined();
    expect(web3.polka.myLimitedNode.rpc.chain).toBeDefined();

    const response = await web3.polka.substrate.rpc.chain.getBlock(/*hash*/);
    expect(response).toBeDefined();
    expect(response.block).toBeDefined();
    expect(typeof response.block.header.stateRoot).toBe('string');

    web3.provider?.disconnect();
  });
});
