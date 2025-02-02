# china-railway-lib

> [!WARNING]
> This project is still in development, and its features are not yet complete.
> Expect any breaking changes!

This is a JavaScript/TypeScript library to provide a simple way to access the
[China Railway 12306](https://www.12306.cn/index/) API.

This project is licensed under the terms of the MIT license.

## Installation

`pnpm` is recommended to install this library.

```bash
pnpm add china-railway-lib
```

## Building

This project uses `pnpm` as the package manager. To build the project, run:

```bash
pnpm build
```

You can find the bundled files in the `dist/` directory.

## Testing

This project uses `jest` as the testing framework. To run the tests, run:

```bash
pnpm test
```

## Usage

```typescript
import { Railway12306, PurposeCodes } from 'china-railway-lib';

const helper = new Railway12306();

const standardTrainList = await helper.getStandardTrainList(
  '2025-02-05',
  'BJP',
  'QYS',
  PurposeCodes.STUDENT,
);
console.log(standardTrainList);
```
