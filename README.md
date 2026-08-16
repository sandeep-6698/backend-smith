
# Backend Smith (CLI Tool)

**Backend Smith** is a CLI tool, invoked using the command `bs`, that scaffolds a production-ready Express.js backend and generates CRUD modules (schemas/entities/models, DTOs, services, controllers, routes, and validation) from a simple field syntax. The base project supports **Mongoose, TypeORM, or Prisma**, and every command adapts its output to whichever ORM the project was created with.

## What's new

- **Choice of ORM** at `bs create` time — Mongoose (MongoDB), TypeORM (PostgreSQL/MySQL/SQLite/MSSQL), or Prisma (same four engines). `create:module`/`create:schema`/`create:dto`/`create:service` remember the choice (via `.backend-smith.json`) and generate matching code from then on.
- **Relationships / foreign keys** — `category:ref(Category)` generates a `categoryId` field wired up correctly for whichever ORM is active (Mongoose `ObjectId` + `ref`, TypeORM `@ManyToOne`, Prisma `@relation`, inverse relation included automatically for Prisma).
- **Swagger/OpenAPI docs** generated automatically from your field list — every `create:route` (and `create:module`) produces `@swagger` annotations, served at `/api-docs`.
- **Interactive project setup** — `bs create <name>` prompts for ORM/database, email provider (SMTP/SendGrid/Mailchimp), file storage (S3/Cloudinary/none), and whether to include Socket.IO. Only what you pick gets installed.
- **Background job queue** (BullMQ + Redis) — email sending is queued with automatic retries instead of fire-and-forget.
- **Standard pagination envelope** — every generated `getAll` endpoint returns `{ data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }`, with matching Swagger docs.
- **Centralized typed errors** (`AppError` and subclasses: `NotFoundError`, `BadRequestError`, `ValidationError`, etc.) wired into the error handler.
- **Docker Compose generated per project** — matches your chosen database (Postgres/MySQL/MSSQL/SQLite/MongoDB) plus Redis, with correct service names, env vars, and volumes.
- Production middleware baked in by default: Winston logger, Helmet, compression.
- The base template ships bundled with the CLI package itself — `bs create` no longer clones from GitHub, so it works offline and every CLI version produces a reproducible result.
- **TypeScript path aliases per module** — every folder under `app/` gets a matching `@module` alias (`app/common` → `@common`, `app/user` → `@user`). New modules are registered automatically the moment `bs create:module`/`create:schema`/etc. creates their folder. `bs setup:alias` retrofits aliases onto an existing project.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What You Get](#what-you-get)
- [Available Commands](#available-commands)
- [Field Notation](#field-notation)
- [Relationships (Foreign Keys)](#relationships-foreign-keys)
- [Path Aliases](#path-aliases)
- [ORM & Database Support](#orm--database-support)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Installation

To use Backend Smith, install it globally or locally.

### Global Installation

`npm install -g backend-smith`

### Local Installation

To use it locally in your project:

`npm install backend-smith --save-dev`

Then, you can run it with `npx`:

`npx bs <operation> <name> [fields...]`

## Quick Start

```
bs create my-app
```

This scaffolds a new project in `./my-app` and walks you through a short interactive setup:

1. **ORM / database** — Mongoose (MongoDB), TypeORM, or Prisma. If you pick TypeORM or Prisma, you're then asked which engine: PostgreSQL, MySQL, SQLite, or Microsoft SQL Server.
2. **Email provider** — SMTP (nodemailer), SendGrid, or Mailchimp Transactional.
3. **File storage** — Amazon S3, Cloudinary, or none.
4. **Socket.IO** — include websocket support or not.

Your choices are written to `.backend-smith.json` in the project root and to `docker-compose.yml`/`.env.local`, dependencies are installed automatically, and (for Prisma) `prisma generate` runs so `@prisma/client` types are ready immediately.

From inside the generated project, run `bs create:module <name> [fields...]` to scaffold new resources — they'll automatically match the ORM you picked.

## What You Get

Every project created with `bs create` includes, out of the box:

| Feature | Details |
|---|---|
| Auth | JWT access/refresh tokens, email/password login, Google/Facebook/LinkedIn/Apple social login, invite + password reset flows |
| API docs | Swagger UI at `/api-docs`, generated from your field definitions |
| Email | SMTP, SendGrid, or Mailchimp Transactional (your pick), with EJS templates and a BullMQ-backed queue + worker for reliable, retried delivery |
| File storage | S3 or Cloudinary (your pick), or omitted entirely |
| Real-time | Optional Socket.IO wiring |
| Logging | Winston, replacing raw `console.log` |
| Security/perf middleware | Helmet, compression, CORS |
| Pagination | Standard `{ data, pagination }` envelope on every generated list endpoint |
| Errors | Typed `AppError` subclasses (`NotFoundError`, `BadRequestError`, `ValidationError`, ...) with consistent `error_code`/`code` fields |
| Containers | `docker-compose.yml` matching your database (+ Redis for the job queue), `Dockerfile` |

## Available Commands

| Operation | Description |
|---|---|
| `create` | Scaffolds a new base project (interactive ORM/email/storage/socket setup) |
| `create:module` | Creates a full module — DTO, schema/entity/model, validation, service, controller, route — with Swagger docs |
| `create:schema` | Creates the data-layer file for the fields given: a Mongoose schema, a TypeORM entity, or a Prisma model (appended to `schema.prisma`), depending on the project's ORM |
| `create:dto` | Creates the DTO/type file (a plain interface for Mongoose, a re-export for TypeORM/Prisma) |
| `create:service` | Creates a CRUD service matching the project's ORM. Pass fields when using Prisma so JSON-encoded fields are handled correctly |
| `create:controller` | Creates a controller (identical output regardless of ORM) |
| `create:route` | Creates a route file with generated Swagger docs |
| `create:validation` | Creates `express-validator` validation logic for the fields |
| `setup:alias` | Registers `@module` path aliases for every existing folder under `app/` in the current project. For projects created before this feature, or upgraded from an older `backend-smith` version. Leaves existing imports untouched |

### Command Options

- **`<operation>`**: Specifies the type of component to create (e.g., `create:module`, `create:route`, etc.).
- **`<name>`**: The name of the component to be created.
- **`[fields...]`**: An optional list of fields to be used in schemas/entities/models, DTOs, validation, and Swagger docs. Fields are provided as `fieldName:fieldType` (e.g., `username:String`, `age:Number`).

To mark a field as required, prepend the field name with an asterisk (e.g., `*username:String`).

## Field Notation

| Notation | Meaning | Example |
|---|---|---|
| `*` | Marks a field as required | `*email:String` |
| `Type` | `String`, `Number`, `Boolean`, `Date`, etc. | `age:Number` |
| Enum | Pipe-separated values | `role:USER\|ADMIN` |
| Nested object | Wrap with `{}` | `profile:{bio:String website:String}` |
| Array | Wrap with `[]` | `tags:[String]` |
| Array of nested objects | Wrap with `[{}]` | `addresses:[{street:String city:String}]` |
| Reference (foreign key) | `ref(Model)` | `category:ref(Category)` |

> ⚠️ When using special characters like `[]`, `{}`, or `|` in the terminal, escape them or wrap the whole field in quotes:
> `bs create:schema product "tags:[String]" "profile:{bio:String website:String}" "*role:USER|ADMIN"`

## Relationships (Foreign Keys)

Reference another module with `fieldName:ref(ModelName)`:

```
bs create:module product *name:String *category:ref(Category)
```

This generates a `categoryId` field — the exact same client-facing field name and shape regardless of ORM — plus the ORM-specific wiring:

| ORM | Generated |
|---|---|
| Mongoose | `categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true }` |
| TypeORM | A `categoryId` column plus `@ManyToOne(() => Category) @JoinColumn(...)`, with `Category` auto-imported from `../category/category.entity` |
| Prisma | `categoryId String` + `category Category @relation(fields: [categoryId], references: [id])` on `Product`, and a `products Product[]` inverse field added automatically to `Category` (Prisma requires both sides of a relation to be declared) |

The referenced module name is matched by kebab-case — `ref(Category)` looks for `app/category/`. If that module doesn't exist yet, the CLI prints a warning and generates the field anyway, since you may be about to create it next.

## Path Aliases

Every module folder under `app/` gets a matching TypeScript path alias, e.g. `app/common` → `@common`, `app/user` → `@user`, `app/product` → `@product`. This means you can write:

```ts
import { NotFoundError } from "@common/errors";
import { type IUser } from "@user/user.dto";
```

instead of a relative `../../common/errors` / `../../user/user.dto` import.

**How it works:**

- `bs create <name>` generates a `tsconfig.json` with `baseUrl`/`paths` already set up for `@common` and `@user`, and wires `tsconfig-paths` + `tsc-alias` into `package.json`:
  - `pnpm start` runs `ts-node -r tsconfig-paths/register` so aliases resolve at dev time.
  - `pnpm run build` runs `tsc && tsc-alias`, so `tsc-alias` rewrites `@module/...` imports to relative paths in the compiled `dist/` output — no runtime resolver needed in production.
- Every `bs create:module`, `create:schema`, `create:route`, `create:service`, `create:controller`, `create:validation`, and `create:dto` command registers a `@<module>` alias in `tsconfig.json` the moment it creates that module's folder — nothing to do manually.
- Using the alias in your own imports is optional — plain relative imports keep working exactly as before. The CLI never rewrites imports for you.

**Retrofitting an existing project:**

If your project was created before this feature existed (or with an older `backend-smith` version), run this from the project root:

```
bs setup:alias
```

This scans `app/*`, registers a `@module` alias for every folder found, and adds `tsconfig-paths`/`tsc-alias` plus the matching `start`/`build` script wiring to `package.json` if they're missing. Run your package manager's install afterward to pull in the new dev dependencies. **It never touches existing import statements** — it only sets up the alias configuration; converting relative imports to aliases in your existing code is up to you.

## ORM & Database Support

| ORM | Databases | Notes |
|---|---|---|
| Mongoose | MongoDB | Default choice |
| TypeORM | PostgreSQL, MySQL, SQLite, MSSQL | Entities use portable column types (`simple-enum`, `simple-json`, `simple-array`) so the same generated code works across all four engines |
| Prisma | PostgreSQL, MySQL, SQLite, MSSQL | `create:schema` appends models to a single `prisma/schema.prisma` and re-runs `prisma generate` |

Your choice is written to `.backend-smith.json` at the project root:

```json
{
  "orm": "typeorm",
  "database": "postgres"
}
```

Every subsequent `create:*` command run from inside that project reads this file, so generated code always matches. Connection config lives in a single `DATABASE_URL` environment variable, regardless of ORM.

## Examples

1. **Create a base project** (interactive setup):

    `bs create app-name`

2. **Create a full module with required fields, enums, and a relationship**:

    `bs create:module product *name:String price:Number *category:ref(Category)`

3. **Create just the data layer** (schema/entity/model, matching the project's ORM):

    `bs create:schema user *username:String age:Number *email:String *role:USER|ADMIN`

4. **Nested object**:

    `bs create:schema user profile:{bio:String website:String}`

5. **Array of primitives**:

    `bs create:schema user tags:[String]`

6. **Array of nested objects**:

    `bs create:schema user addresses:[{street:String city:String zip:String}]`

7. **Create a route** (with generated Swagger docs):

    `bs create:route user`

8. **Create a service** (pass fields if the project uses Prisma and has array/nested fields):

    `bs create:service user`

9. **Create a controller**:

    `bs create:controller user`

10. **Create validation for fields**:

    `bs create:validation user *username:String age:Number *email:String *role:USER|ADMIN`

11. **Create a DTO**:

    `bs create:dto user *username:String age:Number *email:String *role:USER|ADMIN`

12. **Register path aliases for an existing project** (run from the project root):

    `bs setup:alias`

## Error Handling

- If no operation is provided, the CLI will log:

    `Operation is required!`

- If no name is provided for the component, the CLI will log:

    `Name is required!`

- If an invalid operation is provided, the CLI will log:

    `Invalid <operation> operation`

- **Bad pattern**: When using special characters like `[]`, `{}`, `|`, or `()` in the terminal, make sure to escape them or wrap the entire field in quotes.
    Example:
    `bs create:schema test "tags:[String]" "profile:{bio:String website:String}" "*role:USER|ADMIN" "addresses:[{street:String *city:String}]" "category:ref(Category)"`

## Contributing

Contributions are welcome! To contribute to Backend Smith, feel free to fork the repository and submit a pull request.

Repository: [Backend Smith GitHub](https://github.com/sandeep-6698/backend-smith)
