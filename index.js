'use strict';

require('dotenv').config();

const fs = require('fs');
const axios = require('axios');

const config = JSON.parse(fs.readFileSync('./config/config.json'));

const configApi = {
	method: 'get',
	url: process.env.WS1_URL + '/mdm/devices/search?pagesize=' + config.pagesize + '&lgid=' + process.env.LGID,
	headers: {
		'aw-tenant-code': process.env.WS1_TENANT_KEY,
		Accept: 'application/json',
		Authorization: process.env.WS1_AUTH_KEY,
	},
};

axios(configApi)
	.then(response => {
		console.log(JSON.stringify(response.data));
	})
	.catch(error => {
		console.log(error);
	});

