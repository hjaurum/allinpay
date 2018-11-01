/**
 * Created by aurum on 2018/3/21.
 */
const crypto = require('crypto');
const _ = require('lodash');
const request = require('request-promise');
const config = require('../config');
const iconv = require('iconv-lite');
const moment = require('moment');

class SOAClient {
    constructor() {
        this.serverAddress = '';
        this.signMethod = '';
        this.publicKey = '';
        this.sysId = '';
        this.timeStr = '';
        this.privateKey = '';
        this.privateKeyPassphrase = '';
    }

    async setServerAddress(serverAddress) {
        this.serverAddress = serverAddress;
    }     

    async setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }   

    async setSysId(sysId) {
        this.sysId = sysId;
    }   

    async setSignMethod(signMethod) {
        this.signMethod = signMethod;
    }
    
    setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }

    setPrivateKey(privateKey) {
        this.privateKey = privateKey;
    }

    setVersion(version) {
        this.version = version;
    }

    setTimeStr(timeStr) {
        this.timeStr = timeStr;
    }

    setPrivateKeyPassphrase(privateKeyPassphrase) {
        this.privateKeyPassphrase = privateKeyPassphrase;
    }

    async request(service, method, param){
        if (_.isEmpty(this.serverAddress)) {
            throw new Error('请设置serverAddress');
        }
        if (_.isEmpty(this.sysId)) {
            throw new Error('请设置sysId');
        }
        if (_.isEmpty(this.publicKey)) {
            throw new Error('请设置publicKey');
        }
        if (_.isEmpty(this.privateKey)) {
            throw new Error('请设置privateKey');
        }
        const req = {
            service,
            method,
            param,
        };
        const query = {
            sysid: this.sysId,
            sign: await this.getSignature(req),
            timestamp: moment().format(config.YUN.TIME_TYPE),
            v: this.version,
            req: JSON.stringify(req),
        };
        
        return await this._request(query);
    }
    
    getSignature(req) {
        const originStr = this.sysId + JSON.stringify(req) + moment().format(config.YUN.TIME_TYPE);
    
        // sign
        return crypto.createSign(this.signMethod)
          .update(originStr)
          .sign({key: this.privateKey, passphrase: this.privateKeyPassphrase }, 'base64');
    }

    async _request(query) {
        const serverAddress = this.serverAddress;
        const resStr = await new Promise((resolve, reject) => {
            const resStream = request.get({url: serverAddress, qs:query, json:true, rejectUnauthorized: false});
            const decodeStream = iconv.decodeStream('utf-8');
            resStream.pipe(decodeStream);

            let decodedStr = '';
            decodeStream.on('data', function (data) {
                decodedStr += data;
            });

            decodeStream.on('end', function () {
                resolve(decodedStr);
            });
        });
        return JSON.parse(resStr);
    }

    async rsaEncrypt(str) {
        return crypto.createSign(this.signMethod)
          .update(str)
          .sign({key: this.privateKey, passphrase: this.privateKeyPassphrase }, 'base64');
    }

    async verify(data) {
        if (_.isEmpty(data.sysid)) {
            throw new Error('缺少验签参数，sysid');
        }
        if (_.isEmpty(data.rps)) {
            throw new Error('缺少验签参数，rps');
        }
        if (_.isEmpty(data.timestamp)) {
            throw new Error('缺少验签参数，timestamp');
        }
        if (_.isEmpty(data.sign)) {
            throw new Error('缺少验签参数，sign');
        }
        const verify = crypto.createVerify(this.signMethod);
        const verifyStr = data.sysid + data.rps + data.timestamp;
        verify.update(verifyStr);
        const signature = data.sign;
        return verify.verify(this.publicKey, signature, 'base64');
    }

}

module.exports = SOAClient;