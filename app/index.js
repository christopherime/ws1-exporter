/* eslint-disable no-await-in-loop */
// 'use strict';

require('dotenv').config();

const axios = require('axios');

const client = require('prom-client');

// Enable prom-client to expose default application metrics
const {collectDefaultMetrics} = client;

// Define a custom prefix string for application metrics
collectDefaultMetrics();

const express = require('express');
const app = express();

const nDevices = new client.Gauge({
	name: 'mdm_number_devices',
	help: 'Number of devices',
	labelNames: ['tenant'],
});

const imeiDevices = new client.Gauge({
	name: 'mdm_imei_devices',
	help: 'IMEI of devices',
	labelNames: ['tenant', 'deviceName', 'imei'],
});

// CallAPI is a helper function to call the API
function callAPI(urlIn, methodIn, headersIn, bodyIn) {
	const config = {
		method: methodIn,
		url: urlIn,
		headers: headersIn,
		data: bodyIn,
	};
	try {
		return axios(config);
	} catch (error) {
		console.error(error);
	}
}

// GetDevices is a helper function to get the devices, it takes into account the number of pages
function getDevices(nbPage) {
	return callAPI(
		process.env.WS1_URL + '/mdm/devices/search?Page=' + nbPage,
		'GET',
		{
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: process.env.WS1_AUTH_KEY,
			'aw-tenant-code': process.env.WS1_TENANT_KEY,
		},
	);
}

async function main() {
	// Get the inventory of the devices in the tenant
	const responseBody = await getDevices(0);
	const response = responseBody.data;
	const devicesList = response.Devices;
	const totalDevices = response.Total;
	// TotalPages is the number of pages in the response, default and max PageSize is 500
	const totalPages = Math.ceil(totalDevices / response.PageSize);

	// Loop through the pages and get the devices from the other pages in deviceslist
	if (totalPages > 1) {
		for (let i = 1; i < totalPages; i++) {
			const devices = await getDevices(i);
			devicesList.push(...devices.data.Devices);
		}
	}

	console.log(devicesList.length);

	nDevices.set({tenant: process.env.WS1_TENANT_NAME}, devicesList.length);

	// For devices in devicesList set the IMEI tag of imeiDevices to the imei of the Device
	for (const device of devicesList) {
		imeiDevices.set({
			tenant: process.env.WS1_TENANT_NAME,
			deviceName: device.DeviceFriendlyName,
			imei: device.Imei,
		}, 0);
	}

	app.get('/healthz', (req, res) => {
		res.send('OK');
	});
	
	// Expose our metrics at the default URL for Prometheus
	app.get('/metrics', async (req, res) => {
		res.set('Content-Type', client.register.contentType);
		res.send(await client.register.metrics());
	});
}

app.listen(process.env.WS1_EXPORTER_PORT, () => {
	console.log('Listening on port ' + process.env.WS1_EXPORTER_PORT);
});

main();
