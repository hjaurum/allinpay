# Allinpay Node.js SDK 通联支付 Node.js SDK

## Install
```
npm install allinpay
```
## Usage
```javascript
const AllInPay = require('allinpay');
const GateWayPay = AllInPay.GatewayPay; // 网关支付
const AccountPay = AllInPay.AccountPay; // 账户支付
```
## 网关支付

```javascript
const allInPay = new GatewayPay(merchantId, md5Key, {
    isTest: true, // 是否开启测试模式，默认false，测试模式下所有请求发至通联测试环境url
    signType: 0 // 目前只支持0，使用md5签名、验签
});

// 以后的调用中都不需要传merchantId、signType、version参数
```

#### 获取创建支付单所需form参数 getOnePayOrderParameters
```javascript
let paymentFormData = allInPay.getOnePayOrderParameters(parameters);
// paymentFormData.fields = [] // form 的字段，按顺序放到表单
// paymentFormData.values = [] // form 的值
// paymentFormData.postUrl = '' // form post 到的url
```

#### 获取一个订单信息 getOnePayOrder

```javascript
// Note: 此接口只返回已支付成功的订单
let payOrder = await allInPay.getOnePayOrder(data);
/**
返回：
{ credentialsType: '',
  payAmount: '1200000',
  extTL: '',
  payDatetime: '20180314155026',
  signType: '0',
  returnDatetime: '20180329171728',
  credentialsNo: '',
  paymentOrderId: '201803141550202205',
  pan: '',
  version: 'v1.0',
  issuerId: '',
  orderNo: '20180314200130',
  payResult: '1',
  ext1: '附加参数',
  ext2: '附加参数2',
  orderAmount: '1200000',
  signMsg: 'B362885C7A780944B28C5D830A0AA81F',
  txOrgId: '',
  errorCode: '',
  userName: '',
  payType: '0',
  merchantId: '100020091218001',
  language: '1',
  orderDatetime: '20180314150122' }
  **/
```

#### 单笔订单退款 refundOnePayOrder

```javascript
let refundResult = await allInPay.refundOnePayOrder(data);
/**
返回:
{ merchantId: '100020091218001',
  version: 'v2.3',
  signType: '0',
  orderNo: '20180314200130',
  orderAmount: '1200000',
  orderDatetime: '20180314150122',
  refundAmount: '20',
  refundDatetime: '20180329172803',
  refundResult: '20',
  mchtRefundOrderNo: '201803132001321',
  returnDatetime: '20180329171856',
  signMsg: '7812ABB2B34ADA7E8D3DA19BDC139BED' }
**/
```

#### 获取退款单的状态 getRefundStatus

```javascript
let result = await allInPay.getRefundStatus(data);
console.log(result);
/**
返回： 
[ { version: 'v2.4',
    signType: '0',
    merchantId: '100020091218001',
    orderNo: '20180314200130',
    refundAmount: '200000',
    refundDatetime: '20180314051417',
    mchtRefundOrderNo: '20180313200130' } ]
**/
```
#### 验签
```javascript
const pass = verifySignature(stringResult, functions);
/**
 functions取值：
 this.functions = {
             createOnePayOrder: 'createOnePayOrder', // 获取创建支付单参数
             getOnePayOrder: 'getOnePayOrder', // 查询一个支付单
             batchGetPayOrders: 'batchGetPayOrders', // 批量查询支付单
             refundOnePayOrder: 'refundOnePayOrder', // 退款单个支付单
             getRefundStatus: 'getRefundStatus', // 获得退款状态
             payCallback: 'payCallback', // 支付回调
             }
 **/
// example:
// 验证
```
## 账户支付
```javascript
const accountPay = new AccountPay(merchantId, cert, certPassphrase, username, password, {
    isTest: true // 是否开启测试，默认false)
});
// 以后的调用中不用传merchantId、USER_NAME、USER_PASS、VERSION、TRX_CODE、DATA_TYPE
```
#### 申请实时单笔代付

```javascript
const result = await accountPay.pay(info,trans);
console.log(result);
/**
{ AIPG: 
   { INFO: 
      { TRX_CODE: '100014',
        VERSION: '04',
        DATA_TYPE: '2',
        REQ_SN: '20060400000362813',
        RET_CODE: '0000',
        ERR_MSG: '处理成功',
        SIGNED_MSG: '3134b0fd928a4bda5bdeaa70f205cea2661cf13005a4ea577cec568478354c2ab4eb751717e5a3104e300abdbe0c8e1310f0822fe65735566a0029a10a45590f705b139843a3c3433ee522d70c33fcc37a64b661c407b03cd05915678c55eaf81500e3aad515d82ce69878ea1c0853489e6b5e501c17f05d37dda163cf417f9191dd46a8b6bc8a6825039d604effd6b7fbaefab1b6e65118c32646a633058176f7ae5f35694c401f6363039b3a2adfb6325e7c2de8ca19971ec3a38dd2a271ca7a61e637f83c568383a7376882def9676060fec64d4f1e6d0a464a3015445700263da418cf3095b52c977917718cce6b36a72bd89c9c734dc5ea877ae1cbe9e7' },
     TRANSRET: { RET_CODE: '0000', SETTLE_DAY: '20180329', ERR_MSG: '处理成功' } } } 
**/
```

## 收银宝
```javascript
const shouyinbao = new Shouyinbao('商户号', 'appId', '交易密钥');
```
#### 创建支付
```javascript
// 仅三项必填，其他的视情况选填
const result = await shouyinbao.createPayment({
            trxamt: 100,
            reqsn: '20060400000362813',
            paytype: 'A01'
        });
```
