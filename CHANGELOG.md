# Changelog

### 1.2.0 (2021-05-31)

* **backend:** feature: split generic locations route into specific routes for apps and healthdepartment
* **backend:** fix: only include app traceIds in notification endpoint
* **backend:** security: added jsonbigint resolution
* **backend:** security: added redis resolution
* **health-department:** fix: floating dropdown menu for filter
* **health-department:** security: added hosted-git-info resolution
* **health-department:** feature: escape download filenames
* **health-department:** feature: update the designs of the modal to track an infection
* **health-department:** feature: escape all data provided by operators and users
* **health-department:** feature: added the possibility for an admin to change name and phone of other users
* **health-department:** feature: added the possibility to assign processes to users
* **health-department:** feature: added the possibility for an admin to generate a new password for other users
* **health-department:** feature: update the designs of the modal to add new users
* **health-department:** feature: order processes by creation time and process name
* **health-department:** feature: show additional data infos in the contact person view
* **health-department:** feature: filter processes by assignee
* **locations:** fix: qr code download on edge
* **locations:** fix: private key download on iPad x Safari
* **locations:** security: added hosted-git-info resolution
* **locations:** feature: link FAQs in menu
* **locations:** feature: improve error messages in login and registration
* **locations:** feature: added the possibility to delete an account
* **locations:** feature: added a "Whats new modal" to inform about the AVV's
* **webapp:** security: added hosted-git-info resolution
* **webapp:** feature: support cwa qr codes
* **webapp:** feature: prefer native apps modal
* **webapp:** feature: improved accessibility
* **scanner:** security: added hosted-git-info resolution
* **contact-form:** security: added hosted-git-info resolution
* **development:** feature: added script to run yarn in all services at once
* **development:** feature: speed up rebuilding images by using common yarn cache

### 1.1.16 (2021-06-02)
* **backend:** feat: expire sms challenges
* **health-department:** feat: include additional check in data directly in contact person view and not only in the download files
* **health-department:** feat: include address information directly in contact person view and not only in the download files
* **health-department:** fix: dependency tree
* **scanner:** fix: update check ins counter after scanning badges
* **scanner:** fix: refocus after outbounds clicks in hardware scanner   
* **webapp:** feat: support international phone numbers
* **webapp:** feat: handle unsupported deeplinks

### 1.1.15 (2021-05-28)
* **locations:** chore: improved location locales
* **health-department:** chore: update tests for sanitization

### 1.1.14 (2021-05-27)
* **health-department:** chore: improved health department locales
* **health-department:** fix: add more error handling in csv generation

### 1.1.13 (2021-05-26)
* **health-department:** fix: whitlisted special characters for csv 

### 1.1.12 (2021-05-26)
* **health-department:** fix: csv sanitization

### 1.1.11 (2021-05-25)
* **locations:** feat: checkout users from tables
* **locations:** feat: checkout single users from locations
* **locations:** feat: generate qr codes compatible with CWA
* **locations:** perf: improve fetching of current guest count
* **scanner:** perf: improve fetching of current and total guest count

### 1.1.10 (2021-05-21)
* **backend** chore: improve text for fixed line voice message

### 1.1.9 (2021-05-21)
* **backend** chore: add rate limit
* **backend** chore: add additional status code to delete user route
* **locations:** chore: add support for legacy private operator keys

### 1.1.8 (2021-05-20)

* **locations:** feat: show current table allocation
* **locations:** feat: updated DPA and privacy policies files for download
* **locations:** feat: added TOMs file for download in profile
* **locations:** feat: added explaination for external printing service for qr codes
* **webapp:** feat: delete user account data

### 1.1.7 (2021-05-20)

* **backend:** feat: implement allow list for IP addresses
* **backend:** chore: increase rate limit for SMS tan requests

### 1.1.6 (2021-05-18)

* **health-department:** fix: filter contact persons by overlapping time
* **health-department:** fix: sorting of locations in history view by name
* **scanner:** fix: scan field not cleared after scan
* **locations:** feat: download qr code content as csv file

### 1.1.5 (2021-05-14)

* **backend:** fix: deny updating data on static badges via create route

### 1.1.4 (2021-05-11)

* **health-department:** fix: use correct base32 decoding

### 1.1.3 (2021-05-10)

* **backend:** feat: add route to redeem tests
* **backend:** feat: allow to dynamically set dummy rates
* **backend:** perf: further improvement of the notifications endpoint
* **backend:** fix: pin json-bigint version to 1.0.0

### 1.1.2 (2021-05-07)

* **backend:** perf: add multiple indizes to improve query performance
* **backend:** fix: pin redis version to 3.1.2
* **frontend:** fix: return promises in validation handler
* **frontend:** fix: pin hosted-git-info to 4.0.2

### 1.1.1 (2021-05-03)

* **backend:** fix: ignore expired traces in notifications route

### 1.1.0 (2021-05-03)

* **locations:** feat: improved serial code input for badge registration
* **locations:** feat: the download of the private key needs to be confirmed
* **locations:** feat: new checkbox for data processing agreement (DPA) in registration
* **locations:** feat: operators can provide indoor or outdoor information for a location
* **locations:** feat: share all open data requests at once
* **locations:** fix: limit checkout radius to a maximum of 5000
* **locations:** fix: add loading spinner for opening guest list modal
* **locations:** fix: notifications for errors during registration
* **health-department:** feat: download a selection of contacts
* **health-department:** feat: filter processes by type and status and updated designs for filter section
* **health-department:** feat: visualise expiration time (28 days) to history view to indicate the remaining time of a process
* **health-department:** feat: improved serial code input to create a process via tan
* **health-department:** feat: increase search limit for locations from 10 to 100
* **health-department:** feat: enable admins to change roles of employees
* **health-department:** feat: included indoor/outdoor information of locations to history
* **health-department:** feat: add creation date to process table
* **health-department:** fix: resolved console error in contact person list
* **health-department:** fix: improve flow of requesting a location manually
* **webapp:** fix: styling for reset device text
* **webapp:** feat: tests for the onboarding flow
* **contact-form:** feat: mark additional checkin questions to be generated by the venue owner
* **contact-form:** feat: additional checkin questions are not mandatory anymore
* **contact-form:** fix: fixed checkin with additional checkin data
* **scanner:** feat: improved error and qr data handling
* **scanner:** feat: additional checkin questions are not mandatory anymore
* **backend:** feat: cleanup deleted users after 28 days
* **backend:** feat: add node inspect for debugging
* **backend:** fix: use safer entropy
* **backend:** fix: add missing parameter validations
* **backend:** fix: error handling for traces
* **backend:** fix: increase maximum requestable period from 6 to 24
* chore: add Jenkinsfile to repository
* chore: speedup build time for local environment

### 1.0.5 (2021-04-29)

* **locations:** fix: handle decryption errors

### 1.0.4 (2021-04-27)

* **backend:** fix: allow larger body size

### 1.0.3 (2021-04-27)

* **backend:** chore: add separate rate limit for fixed line phone numbers

### 1.0.2 (2021-04-23)

* **backend:** fix: pin netmask package to patched version
* **backend:** fix: increase maximum requestable period for traces
* **backend:** feat: add dummy traces for the notifications endpoint

### 1.0.1 (2021-04-16)

* **locations:** fix: use correct base32 decoding
* **scanner:** fix: add v3b signature format support
* **backend:** fix: fix redis initialization
* **backend:** feat: add rate limit by phone number

### 1.0.0 (2021-04-14)

* initial public release
