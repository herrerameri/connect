/* @flow */
'use strict';

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import type { Success } from '../../types/trezor';
import type { CoreMessage } from '../../types';

type Params = {
    publicKey: string,
    signature: string,
    message: string,
}

export default class CardanoVerifyMessage extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];
        this.requiredFirmware = ['0', '2.0.8'];
        this.info = 'Verify Cardano message';

        const payload: Object = message.payload;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'publicKey', type: 'string', obligatory: true },
            { name: 'signature', type: 'string', obligatory: true },
            { name: 'message', type: 'string', obligatory: true },
        ]);

        // TODO: check if message is already in hex format
        const messageHex: string = new Buffer(payload.message, 'utf8').toString('hex');
        this.params = {
            publicKey: payload.publicKey,
            signature: payload.signature,
            message: messageHex,
        };
    }

    async run(): Promise<Success> {
        return await this.device.getCommands().cardanoVerifyMessage(
            this.params.publicKey,
            this.params.signature,
            this.params.message,
        );
    }
}
