/**
 * Created by aurum on 2018/3/15.
 */
const assert = require('assert');
const SOAClient = require('../index.js').SOAClient;
const config = require('../config');

const client = new SOAClient();

const privateKey = `your privateKey`;
const publicKey = `your publicKey`;
const serverAddress = '***';
const sysid = '***';
const signMethod = "RSA-SHA1";


describe('通联云账户', function () {
    before(async () => {
        try{
			client.setServerAddress(serverAddress);
			client.setPrivateKey(privateKey);
			client.setPublicKey(publicKey);
			client.setSysId(sysid);
            client.setSignMethod(signMethod);
            client.setVersion(config.YUN.VERSION);
		}catch(err){
			console.error(err);
		}
    });
    it('创建个人会员，ok', async () => {
        const soaName = "MemberService";
        const param = {
            bizUserId: '张三66666666',
            memberType: '3',
            source: '2',
        };

        const result = await client.request(soaName, "createMember", param);
        assert.strictEqual(result.status, 'OK');
    });
});