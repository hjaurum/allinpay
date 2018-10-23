/**
 * Created by aurum on 2018/3/14.
 */
const GatewayPay = require('./libs/gateway_pay');
const AccountPay = require('./libs/account_pay');
const Shouyinbao = require('./libs/shouyinbao');
const Wanjiantong = require('./libs/wanjiantong');
const SOAClient = require('./libs/SOAClient');

module.exports = {
    GatewayPay,
    AccountPay,
    Shouyinbao,
    Wanjiantong,
    SOAClient,
};