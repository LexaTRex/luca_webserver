# Changelog

### 1.0.0 (2021-04-14)

* initial public release

### 1.0.1 (2021-04-16)

* **locations:** fix: use correct base32 decoding
* **scanner:** fix: add v3b signature format support
* **backend:** fix: fix redis initialization
* **backend:** feat: add rate limit by phone number

### 1.0.2 (2021-04-23)

* **backend:** fix: pin netmask package to patched version
* **backend:** fix: increase maximum requestable period for traces
* **backend:** feat: add dummy traces for the notifications endpoint

### 1.0.3 (2021-04-27)

* **backend:** chore: add separate rate limit for fixed line phone numbers

### 1.0.4 (2021-04-27)

* **backend:** fix: allow larger body size