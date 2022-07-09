# my TODO list

- [ ] lastSeen value is reported in UTC, I will have to mind that in the next iteration. That explain why all online value are offline as delta will always be > than now + 30 minutes
- [ ] will have to find a way to accomodate a config value file and integrate it appropriately in the chart as I want the container to be agnostic as much as possible
- [ ] config dirrectory created with config.json file (see above), nothing yet to be added
- [ ] find a way to make the device list in a file on local, my idea is to reduce the apicall const like if the file is not older than you mdm refresh time, you don't need to call the api and build a bypass for it aswell if you want to burn your api quotat (yes there is a limit on how many time you can call ws1 api)
- [ ] improve the docker-compose to integrate the config value file
- [ ] improvement to be made on the README, find a way to automate the creation / update value from build or tag
- [ ] update the README from informations of the config done
- [ ] integrate testing (nice to have) and how to make it
- [ ] find some sleep
- [ ] Make the following metrics:
- [ ] **mdm_device_count**: Number of devices in the park
- [ ] **device_count_by_type**: Number of devices by type
- [ ] **device_count_by_status**: Number of devices by status
- [ ] **devices_count_offline**: Number of offline devices
- [ ] **devices_count_online**: Number of online devices