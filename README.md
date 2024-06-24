# Official DSNP over Frequency Schemas

**Matching DSNP Version: v1.2.0**

## Use Schemas as Library

### Install
```sh
npm install @dsnp/frequency-schemas
```

### Use Schema

```typescript
import { dsnp } from "@dsnp/frequency-schemas";

console.log(dsnp.getSchema("broadcast"));
```

### Get Schema Id from Chain

```typescript
import { dsnp } from "@dsnp/frequency-schemas";
import { ApiPromise } from "@polkadot/api";

const api = ApiPromise.create(/* ... */);
console.log(await dsnp.getSchemaId(api, "broadcast"));
```

Frequency mainnet and testnet have well-known Ids defined in `dsnp/index.ts`.
Other configurations default to assuming `npm run deploy` has been run on a fresh chain (which is usually the case for a localhost instance), but can be overridden:

```
dsnp.setSchemaMapping(api.genesisHash.toString(), {
  // format is dsnpName: { version: schemaId, ... }
  "tombstone": { "1.2": 64 },
  "broadcast": { "1.2": 67 },
  // ...
});

console.log(await dsnp.getSchemaId(api, "broadcast")); // yields 67
```

### With Parquet Writer

```sh
npm install @dsnp/parquetjs
```

```typescript
import { parquet } from "@dsnp/frequency-schemas";
import { ParquetWriter } from "@dsnp/parquetjs";

const [parquetSchema, writerOptions] = parquet.fromFrequencySchema("broadcast");
const writer = await ParquetWriter.openFile(parquetSchema, "./file.parquet", writerOptions);
writer.appendRow({
  announcementType: 2,
  contentHash: "0x1234567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  fromId: 78187493520,
  url: "https://spec.dsnp.org/DSNP/Types/Broadcast.html",
});
await writer.close();
```

## Use to Deploy Schemas

### Setup

1. Pull the repository
1. Install dependencies `npm install`

## Usage

### To deploy/register all schemas

```sh
npm run deploy
```

by default it will deploy to the `localhost` node on port 9944 using the Alice sudo test account.

Two environment variables allow you to change these defaults:

```sh
DEPLOY_SCHEMA_ACCOUNT_URI="//Alice"
DEPLOY_SCHEMA_ENDPOINT_URL="ws://localhost:9944"
```

e.g.

```sh
DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run deploy profile-resources
```

### To register a single schema

e.g. To register the "profile-resources" schema

    npm run deploy profile-resources

**Note:** Requires a sudo key if deploying to a testnet.
Mainnet will use the proposal system (`proposeToCreateSchema`).

## Additional Tools

## Help

```sh
npm run deploy help
```

## Read all Schemas from a Chain

```sh
DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run read
```

Will output various information about the schemas on the chain as well as attempt to match known DSNP schemas.

### Example Output

```
## Connection Information
┌─────────┬─────────────────────┬────────────────────────────────────────────┐
│ (index) │         key         │                   value                    │
├─────────┼─────────────────────┼────────────────────────────────────────────┤
│    0    │    'endpointUrl'    │ 'wss://frequency-seal.liberti.social:9944' │
│    1    │   'clientVersion'   │            '0.1.0-377bbe37fbe'             │
│    2    │     'specName'      │             'frequency-rococo'             │
│    3    │    'specVersion'    │                    '1'                     │
│    4    │ 'latestBlockNumber' │                    '16'                    │
└─────────┴─────────────────────┴────────────────────────────────────────────┘

## Schema Information
There are 8 schemas on the connected chain.

## Schema Id 1
┌─────────┬──────────────────────┬───────────────────────────────┐
│ (index) │         key          │             value             │
├─────────┼──────────────────────┼───────────────────────────────┤
│    0    │     'schema_id'      │              '1'              │
│    1    │     'model_type'     │           'Parquet'           │
│    2    │  'payload_location'  │            'IPFS'             │
│    3    │ 'matchesDSNPSchemas' │       'dsnp.broadcast'        │
└─────────┴──────────────────────┴───────────────────────────────┘

## Schema Model
[
  {
    "name": "announcementType",
    "column_type": {"INTEGER": {"bit_width": 32, "sign": true}},
    "compression": "GZIP",
    "bloom_filter": false
  },
  {
    "name": "contentHash",
    "column_type": "BYTE_ARRAY",
    "compression": "GZIP",
    "bloom_filter": true
  },
  {
    "name": "fromId",
    "column_type": {"INTEGER": {"bit_width": 64, "sign": false}},
    "compression": "GZIP",
    "bloom_filter": true
  },
  {
    "name": "url",
    "column_type": "STRING",
    "compression": "GZIP",
    "bloom_filter": false
  }
]
...
```

## Find Frequency Schema Ids that Match DSNP Schema Versions

This script will look up and verify schemas in the schema registry that match the DSNP names and versions defined in `dsnp/index.ts`.

```sh
DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run find
```

## Use with Docker

This repo deploys `dsnp/instant-seal-node-with-deployed-schemas` to Docker Hub.
It is based on a [Frequency Standalone Docker](https://hub.docker.com/r/frequencychain/standalone-node) with the schemas automatically deployed on top of it with the image defaults including using "instant sealing" mode.

Note: `--platform=linux/amd64` is because as `frequencychain` images are only published for the `linux/amd64` platform.

### Run Locally
For any local testing do the following:
1. `docker pull --platform=linux/amd64 dsnp/instant-seal-node-with-deployed-schemas:latest`
2. `docker run  --platform=linux/amd64 --rm -p 9944:9944 dsnp/instant-seal-node-with-deployed-schemas:latest`

### Build Locally
1. `docker build --platform=linux/amd64 -t dsnp/instant-seal-node-with-deployed-schemas:latest -t dsnp/instant-seal-node-with-deployed-schemas:<versionNumberHere> .`

### Pushing Docker Image

To match with the Frequency version, a new tag should be pushed to update the docker version of this image each time frequency releases a new version.
The following steps explain how to properly do a release for this.
1. Go to the [Frequency repo](https://github.com/frequency-chain/frequency/releases) to see what the latest release version is.
2. In this repo, check that main is properly [passing its tests and building here](https://github.com/LibertyDSNP/schemas/actions)
3. Go to main: `git checkout main && git pull --rebase`
4. Make sure to pull all latest tags as well: `git pull --tags`
5. Tag the build to match the frequency version but appended with "docker/": `git tag docker/{insert version number}`. For example, if the version number is v1.0.0, then the tag should be `docker/v1.0.0`
Push the tag up: `git push --tags`
6. Monitor the [build](https://github.com/LibertyDSNP/schemas/actions)
7. When that finishes successfully, check [Docker Hub](https://hub.docker.com/r/dsnp/instant-seal-node-with-deployed-schemas/tags) to verify that the image was pushed up
