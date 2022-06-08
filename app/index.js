/* eslint-disable no-await-in-loop */
// 'use strict';

require('dotenv').config();

const {DateTime} = require('luxon');

const axios = require('axios');

const client = require('prom-client');

// Enable prom-client to expose default application metrics
const {collectDefaultMetrics} = client;

// Define a custom prefix string for application metrics
collectDefaultMetrics();

const express = require('express');
const app = express();

const infoDevice = new client.Gauge({
	name: 'info_devices',
	help: 'Devices information for each enrolled device',
	labelNames: [
		'tenant',
		'deviceName',
		'assetnumber',
		'serialnumber',
		'imei',
		'lastseen',
		'online',
		'deltaMinutes',
	],
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

	// For devices in devicesList set the IMEI tag of imeiDevices to the imei of the Device
	for (const device of devicesList) {
		const now = DateTime.local();
		// Correct the timezone of the LastSeen value by increasing it by 2 hours
		const lastSeenVal = DateTime.fromISO(device.LastSeen).plus({hours: 2});
		// If LastSeen Value is greater than now by WS1_INTERVAL in minutes, set online to false
		const onlineState = now.diff(lastSeenVal).as('minutes') < process.env.WS1_INTERVAL;
		infoDevice.set({
			tenant: process.env.WS1_TENANT_NAME,
			deviceName: device.DeviceFriendlyName,
			assetnumber: device.AssetNumber,
			serialnumber: device.SerialNumber,
			imei: device.Imei,
			lastseen: lastSeenVal,
			online: onlineState,
			deltaMinutes: now.diff(lastSeenVal).as('minutes'),
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
