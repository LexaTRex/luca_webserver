# Changelog

### 1.7.0 (2021-08-05)
* **backend:** feat: instrument with metrics
* **health-department:** feat: update route access restrictions for employees
* **health-department:** feat: unified buttons and updated designs
* **locations:** fix: qr code labels and names
* **locations:** feat: inform venue owners about unusally long request times from health departments before sharing data
* **locations:** feat: support special characters in location creation
* **contact-form:** feat: updated string validation
* **webapp:** fix: checkin timer starting time
* **webapp:** fix: timer resets after refresh
* **scanner:** fix: improve camera resolution to scan badges faster

### 1.6.2 (2021-07-29)
* **backend:** ref: split checkin route for scanner and contact-form

### 1.6.1 (2021-07-28)
* **backend:** feat: lower redis usage by adding etag caching for large values

### 1.6.0 (2021-07-27)
* **backend:** fix: schema validation mismatch
* **backend:** feat: added dev setup for signing tool
* **backend:** feat: added route to delete test redeems
* **backend:** feat: global rate limit configuraable via feature flag
* **backend:** feat: send notifications on authentication change
* **backend:** feat: increase user TAN validity to 48h
* **backend:** feat: add authenticated checkin route for operators
* **backend:** feat: add version endpoint for signing tool
* **backend:** chore: setup typescript
* **health-department:** fix: possible duplicate index case due to name comparison
* **health-department:** fix: time format in location search modal
* **health-department:** fix: input validation and error handling based on backend validations
* **health-department:** feat: enabled SORMAS api for latest SORMAS versions
* **health-department:** feat: added version, commit hash and GitLab link
* **health-department:** feat: added download for signing tool
* **health-department:** feat: updated designs for the contact person view
* **contact-form:** feat: added version, commit hash and GitLab link
* **contact-form:** feat: updated data privacy link
* **locations:** fix: removed whitespace overflow when downloading QR codes
* **locations:** fix: sorting for share data requests
* **locations:** fix: input validation and error handling based on backend validations
* **locations:** fix: improved naming in guestlist
* **locations:** fix: improved checkin and checkout visualization
* **locations:** fix: store emails case sensitive
* **locations:** feat: added help button to header with specific contact information
* **locations:** feat: added version, commit hash and GitLab link
* **locations:** feat: improved QR code generation by using web workers
* **locations:** feat: unified buttons and updated designs
* **locations:** feat: updated designs of the location card components
* **locations:** feat: updated data privacy link for badge registration
* **locations:** chore: enabled sonar
* **webapp:** feat: added version, commit hash and GitLab link
* **webapp:** feat: updated data privacy link
* **scanner:** feat: added version, commit hash and GitLab link

### 1.5.4 (2021-07-21)
* **scanner:** feat: deny checkins from unregistered badges via bloomfilter

### 1.5.3 (2021-07-16)
* **health-department:** feat: add utf-8 BOM for better excel compatibility

### 1.5.2 (2021-07-14)
* **backend:** fix: mark expireAt as optional for test redeem request

### 1.5.1 (2021-07-13)
* **backend:** ref: refactor input validations
* **health-department:** fix: SORMAS import file

### 1.5.0 (2021-07-06)
* **backend:** feat: replace node-mailjet with axios
* **backend:** feat: move some error handling to cryto package
* **backend:** feat: add GTX SMS provider
* **backend:** feat: add route to provide download url for signing tool
* **backend:** feat: return a different status code for expired SMS challenges
* **backend:** feat: moved traceId calculation to backend
* **backend:** feat: completely delete tracing processes after 28 days
* **backend:** ref: move json parse middleware into validateSchema middleware
* **backend:** chore: colorize and improve dev logging output
* **backend:** chore: publish traceIds for notifications when data was shared
* **health-department:** fix: add missing mac check
* **health-department:** chore: add limit for private key file size
* **health-department:** feat: visualise signed public keys
* **health-department:** feat: set main font and remove duplicate definitions
* **locations:** fix: "forgot password" displaying incorrect error message for not activated users
* **locations:** fix: typos in registration email step
* **locations:** fix: private key modal issue
* **locations:** chore: add limit for private key file size
* **locations:** feat: redesign header
* **locations:** feat: checkin options for guests are directly accessible via location view
* **locations:** feat: provide link to checkin options via qr code
* **webapp:** chore: fix typos
* **webapp:** feat: add gitlab link
* **webapp:** feat: validate that private meeting is not spoofing a location
* **webapp:** feat: add a consent modal for data sharing with the health department
* security: update container base images and install security patches
* feat: add husky for git hooks

### 1.4.0 (2021-06-29)
* **backend:** feat: add test provider key route
* **backend:** feat: add isTrusted to Operators
* **backend:** chore: remove LocationTransferGroups table
* **health-department:** fix: added missing mac check
* **health-department:** fix: session not cleared correctly after automatic checkout due to inactivity
* **health-department:** fix: order of locations changed after contacting venues
* **health-department:** feat: add hover effect to process list for better usability
* **health-department:** feat: new designs for location search
* **health-department:** feat: locations can be search by zip code as additional parameter to the location name 
* **health-department:** feat: new designs for profile view
* **health-department:** feat: select profile view got moved from tab to header
* **health-department:** feat: improved locales
* **locations:** fix: session not cleared correctly after automatic checkout due to inactivity
* **locations:** fix: incorrect download file names when downloading qr codes
* **locations:** fix: clear session storage after session timed out
* **locations:** fix: forgot password view displayed a wrong error message if the user is not activated
* **locations:** feat: updated DPA document
* **locations:** feat: updated terms and conditions links for venues
* **locations:** feat: trusted venues can register badges without phone validation

### 1.3.0 (2021-06-20)
* **backend:** feat: improve IP blocks
* **backend:** feat: improve email storage in postgres
* **backend:** feat: updated API documentation
* **backend:** feat: removed unused LocationTransferGroups
* **backend:** feat: add expireAt functionality to test redeems
* **contact-form:** fix: handle input starting with mutated vowels
* **contact-form:** feat: improved input validation
* **health-department:** fix: use secure-json-parse to prevent prototype pollution
* **health-department:** fix: replace react-csv with papaparse and improve csv output encoding
* **health-department:** fix: typo in error notification
* **health-department:** fix: status names in process table and filter were not identical
* **health-department:** feat: validate object schema directly after decryption and apply sanitization
* **health-department:** feat: new designs for process details
* **locations:** fix: input fields for manual input are disabled under certain conditions
* **locations:** fix: password not persisted after back action in registration
* **locations:** fix: password criterias were not updated after back action in registration
* **locations:** fix: password criterias were not updated after clearing password in registration
* **locations:** fix: button to checkout all guests was clickable even though no active guest where at the location
* **locations:** fix: redirection to correct location/area after editing locations or areas
* **locations:** feat: phone number validation for contact person of a location and area
* **locations:** feat: new designs for share data view
* **webapp:** fix: error message when visiting a scanner link with an unregistered webapp
* **development:** feature: improve project cloning on windows machine

### 1.2.3 (2021-06-19)
* **health-department:** fix: disable SORMAS CSV export

### 1.2.2 (2021-06-18)
* **health-department:** fix: fix trying to trim a non-string
* **health-department:** chore: upgrade xlsx package
* **backend:** feat: add expireAt functionality to test redeems

### 1.2.1 (2021-06-17)
* **backend:** feat: add v4 signed keys upload

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
