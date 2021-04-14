CREATE TABLE public."AdditionalDataSchemas" (
    uuid uuid NOT NULL,
    "locationId" uuid NOT NULL,
    key character varying(255) DEFAULT ''::character varying NOT NULL,
    label character varying(255) DEFAULT ''::character varying NOT NULL,
    type character varying(255) DEFAULT 'string'::character varying NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."BadgeGenerators" (
    token character varying(44) NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."BadgePublicKeys" (
    "keyId" integer DEFAULT 0 NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    "issuerId" uuid NOT NULL,
    signature character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."BadgeRegistrators" (
    uuid uuid NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."DailyPublicKeys" (
    "keyId" integer DEFAULT 0 NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    "issuerId" uuid NOT NULL,
    signature character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."EmailActivations" (
    uuid uuid NOT NULL,
    "operatorId" uuid NOT NULL,
    email character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    closed boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."EncryptedBadgePrivateKeys" (
    "keyId" integer DEFAULT 0 NOT NULL,
    "healthDepartmentId" uuid NOT NULL,
    "issuerId" uuid NOT NULL,
    data character varying(44) NOT NULL,
    iv character varying(24) NOT NULL,
    mac character varying(44) NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    signature character varying(120) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."EncryptedDailyPrivateKeys" (
    "keyId" integer DEFAULT 0 NOT NULL,
    "healthDepartmentId" uuid NOT NULL,
    "issuerId" uuid NOT NULL,
    data character varying(44) NOT NULL,
    iv character varying(24) NOT NULL,
    mac character varying(44) NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    signature character varying(120) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."FeatureFlags" (
    key character varying(255) NOT NULL,
    value character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."HealthDepartmentEmployees" (
    uuid uuid NOT NULL,
    username character varying(255) NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    salt character varying(255) NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "departmentId" uuid NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    phone character varying(255)
);




CREATE TABLE public."HealthDepartments" (
    uuid uuid NOT NULL,
    name character varying(255) NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publicHDEKP" character varying(88),
    "publicHDSKP" character varying(88),
    "privateKeySecret" character varying(44) NOT NULL
);




CREATE TABLE public."LocationGroups" (
    uuid uuid NOT NULL,
    "operatorId" uuid NOT NULL,
    name character varying(255) NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type character varying(128)
);




CREATE TABLE public."LocationTransferGroupMappings" (
    "groupId" uuid NOT NULL,
    "transferId" uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."LocationTransferGroups" (
    uuid uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tracingProcessId" uuid
);




CREATE TABLE public."LocationTransferTraces" (
    uuid uuid NOT NULL,
    "locationTransferId" uuid NOT NULL,
    "traceId" character varying(24) NOT NULL,
    "time" tstzrange NOT NULL,
    data character varying(44),
    verification character varying(12),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publicKey" character varying(88),
    "keyId" integer,
    "deviceType" integer,
    "additionalData" character varying(4096),
    "additionalDataPublicKey" character varying(88),
    "additionalDataMAC" character varying(44),
    "additionalDataIV" character varying(24),
    version integer
);




CREATE TABLE public."LocationTransfers" (
    uuid uuid NOT NULL,
    "departmentId" uuid NOT NULL,
    "tracingProcessId" uuid NOT NULL,
    "locationId" uuid NOT NULL,
    "time" tstzrange NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "contactedAt" timestamp with time zone
);




CREATE TABLE public."Locations" (
    uuid uuid NOT NULL,
    operator uuid,
    name character varying(255),
    "firstName" character varying(255),
    "lastName" character varying(255),
    phone character varying(255),
    "streetName" character varying(255),
    "streetNr" character varying(255),
    "zipCode" character varying(255),
    city character varying(255),
    state character varying(255) DEFAULT NULL::character varying,
    lat double precision,
    lng double precision,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    radius integer DEFAULT 0 NOT NULL,
    "endsAt" timestamp with time zone,
    "scannerId" uuid NOT NULL,
    "tableCount" integer,
    "shouldProvideGeoLocation" boolean DEFAULT false NOT NULL,
    "isPrivate" boolean DEFAULT false NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    "accessId" uuid NOT NULL,
    "groupId" uuid,
    "scannerAccessId" uuid NOT NULL,
    "formId" uuid NOT NULL
);




CREATE TABLE public."Operators" (
    uuid uuid NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publicKey" character varying(88),
    salt character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    activated boolean DEFAULT false NOT NULL,
    "privateKeySecret" character varying(44) NOT NULL,
    "supportCode" character varying(12) NOT NULL
);




CREATE TABLE public."PasswordResets" (
    uuid uuid NOT NULL,
    "operatorId" uuid NOT NULL,
    email character varying(255) NOT NULL,
    closed boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."SMSChallenges" (
    uuid uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    tan character varying(255),
    "messageId" character varying(255),
    provider character varying(255) DEFAULT 'mm'::character varying
);




CREATE TABLE public."SupportedZipCodes" (
    zip character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);




CREATE TABLE public."TraceData" (
    "traceId" character varying(24) NOT NULL,
    data character varying(4096) NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mac character varying(44),
    iv character varying(24)
);




CREATE TABLE public."Traces" (
    "traceId" character varying(24) NOT NULL,
    "locationId" uuid NOT NULL,
    "time" tstzrange NOT NULL,
    data character varying(128) NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mac character varying(44),
    iv character varying(24),
    "deviceType" integer
);




CREATE TABLE public."TracingProcesses" (
    uuid uuid NOT NULL,
    "departmentId" uuid NOT NULL,
    "userTransferId" uuid,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isCompleted" boolean
);




CREATE TABLE public."UserTransfers" (
    uuid uuid NOT NULL,
    "departmentId" uuid,
    tan character varying(12),
    data character varying(2048),
    iv character varying(24) NOT NULL,
    "publicKey" character varying(88) NOT NULL,
    "keyId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mac character varying(44)
);




CREATE TABLE public."Users" (
    uuid uuid NOT NULL,
    data character varying(1024) NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publicKey" character varying(88),
    signature character varying(255),
    iv character varying(255),
    mac character varying(255),
    "deviceType" character varying(255)
);


ALTER TABLE ONLY public."AdditionalDataSchemas"
    ADD CONSTRAINT "AdditionalData_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."BadgeGenerators"
    ADD CONSTRAINT "BadgeGenerators_pkey" PRIMARY KEY (token);



ALTER TABLE ONLY public."BadgePublicKeys"
    ADD CONSTRAINT "BadgePublicKeys_pkey" PRIMARY KEY ("keyId");



ALTER TABLE ONLY public."BadgeRegistrators"
    ADD CONSTRAINT "BadgeRegistrators_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."DailyPublicKeys"
    ADD CONSTRAINT "DailyPublicKeys_pkey" PRIMARY KEY ("keyId");



ALTER TABLE ONLY public."EmailActivations"
    ADD CONSTRAINT "EmailActivations_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."EncryptedBadgePrivateKeys"
    ADD CONSTRAINT "EncryptedBadgePrivateKeys_primary_key" UNIQUE ("keyId", "healthDepartmentId");



ALTER TABLE ONLY public."FeatureFlags"
    ADD CONSTRAINT "FeatureFlags_pkey" PRIMARY KEY (key);



ALTER TABLE ONLY public."HealthDepartmentEmployees"
    ADD CONSTRAINT "HealthDepartmentEmployees_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."HealthDepartmentEmployees"
    ADD CONSTRAINT "HealthDepartmentEmployees_username_key" UNIQUE (username);



ALTER TABLE ONLY public."HealthDepartments"
    ADD CONSTRAINT "HealthDepartments_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."HealthDepartments"
    ADD CONSTRAINT "HealthDepartments_privateKeySecret_key" UNIQUE ("privateKeySecret");



ALTER TABLE ONLY public."LocationGroups"
    ADD CONSTRAINT "LocationGroups_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."LocationTransferGroupMappings"
    ADD CONSTRAINT "LocationTransferGroupMappings_pkey" PRIMARY KEY ("groupId", "transferId");



ALTER TABLE ONLY public."LocationTransferGroups"
    ADD CONSTRAINT "LocationTransferGroups_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."LocationTransferTraces"
    ADD CONSTRAINT "LocationTransferTraces_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."LocationTransfers"
    ADD CONSTRAINT "LocationTransfers_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_dataId_key" UNIQUE ("accessId");



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_formId_key" UNIQUE ("formId");



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_formId_key1" UNIQUE ("formId");



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_scannerAccessId_key" UNIQUE ("scannerAccessId");



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_scannerAccessId_key1" UNIQUE ("scannerAccessId");



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_scannerId_key" UNIQUE ("scannerId");



ALTER TABLE ONLY public."Operators"
    ADD CONSTRAINT "Operators_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."Operators"
    ADD CONSTRAINT "Operators_privateKeySecret_key" UNIQUE ("privateKeySecret");



ALTER TABLE ONLY public."Operators"
    ADD CONSTRAINT "Operators_supportCode_key" UNIQUE ("supportCode");



ALTER TABLE ONLY public."Operators"
    ADD CONSTRAINT "Operators_supportCode_key1" UNIQUE ("supportCode");



ALTER TABLE ONLY public."Operators"
    ADD CONSTRAINT "Operators_username_key" UNIQUE (username);



ALTER TABLE ONLY public."PasswordResets"
    ADD CONSTRAINT "PasswordResets_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."SMSChallenges"
    ADD CONSTRAINT "SMSChallenges_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."SupportedZipCodes"
    ADD CONSTRAINT "SupportedZipCodes_pkey" PRIMARY KEY (zip);



ALTER TABLE ONLY public."TraceData"
    ADD CONSTRAINT "TraceData_pkey" PRIMARY KEY ("traceId");



ALTER TABLE ONLY public."Traces"
    ADD CONSTRAINT "Traces_pkey" PRIMARY KEY ("traceId");



ALTER TABLE ONLY public."TracingProcesses"
    ADD CONSTRAINT "TracingProgress_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."UserTransfers"
    ADD CONSTRAINT "UserTransfers_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."UserTransfers"
    ADD CONSTRAINT "UserTransfers_tan_key" UNIQUE (tan);



ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (uuid);



ALTER TABLE ONLY public."EncryptedDailyPrivateKeys"
    ADD CONSTRAINT unique_primary_key UNIQUE ("keyId", "healthDepartmentId");



CREATE INDEX email_activations_operator_id ON public."EmailActivations" USING btree ("operatorId");



CREATE INDEX locations_group_id ON public."Locations" USING btree ("groupId");



CREATE INDEX traces_location_id ON public."Traces" USING btree ("locationId");



CREATE INDEX traces_time ON public."Traces" USING gist ("time");



CREATE INDEX users_public_key ON public."Users" USING btree ("publicKey");



ALTER TABLE ONLY public."AdditionalDataSchemas"
    ADD CONSTRAINT "AdditionalDataSchemas_locationId_Locations_fk" FOREIGN KEY ("locationId") REFERENCES public."Locations"(uuid) ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationGroups"
    ADD CONSTRAINT "LocationGroups_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES public."Operators"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationTransferGroupMappings"
    ADD CONSTRAINT "LocationTransferGroupMappings_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."LocationTransferGroups"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationTransferGroupMappings"
    ADD CONSTRAINT "LocationTransferGroupMappings_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES public."LocationTransfers"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationTransferGroups"
    ADD CONSTRAINT "LocationTransferGroups_tracingProcessId_fkey" FOREIGN KEY ("tracingProcessId") REFERENCES public."TracingProcesses"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationTransfers"
    ADD CONSTRAINT "LocationTransfers_departmentId_HealthDepartments_fk" FOREIGN KEY ("departmentId") REFERENCES public."HealthDepartments"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationTransfers"
    ADD CONSTRAINT "LocationTransfers_locationId_Locations_fk" FOREIGN KEY ("locationId") REFERENCES public."Locations"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."LocationTransfers"
    ADD CONSTRAINT "LocationTransfers_tracingProcessId_TracingProcesses_fk" FOREIGN KEY ("tracingProcessId") REFERENCES public."TracingProcesses"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."LocationGroups"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_operator_fkey" FOREIGN KEY (operator) REFERENCES public."Operators"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public."TraceData"
    ADD CONSTRAINT "TraceData_traceId_fkey" FOREIGN KEY ("traceId") REFERENCES public."Traces"("traceId") ON UPDATE CASCADE ON DELETE CASCADE;



