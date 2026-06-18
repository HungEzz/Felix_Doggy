# Recommended Folder Structure

```
backend/
├── docs/                              # ← NEW: API documentation
│   ├── openapi.yaml                   #    OpenAPI 3.1 spec (single source of truth)
│   └── swagger-integration.md         #    Integration guide
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   ├── env.ts
│   │   ├── mail.ts
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   └── swagger.ts                 # ← NEW: Swagger UI setup
│   │
│   ├── middlewares/
│   │   ├── auth.ts                    #    verifyUser, verifyAdmin
│   │   ├── rateLimit.ts               #    generalLimiter, strictLimiter, otpLimiter
│   │   └── upload.ts                  #    Multer + Cloudinary
│   │
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.repository.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── admin.service.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── otp.repository.ts
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── chat.service.ts
│   │   │   └── chat.tools.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.repository.ts
│   │   │   ├── order.routes.ts
│   │   │   └── order.service.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.cache.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── product.routes.ts
│   │   │   └── product.service.ts
│   │   │
│   │   └── statistics/
│   │       ├── statistics.controller.ts
│   │       ├── statistics.repository.ts
│   │       ├── statistics.routes.ts
│   │       └── statistics.service.ts
│   │
│   ├── types/
│   │   └── auth.ts                    #    AuthenticatedRequest
│   │
│   ├── utils/
│   │   └── retry.ts                   #    withRetry helper
│   │
│   ├── app.ts                         #    Express app setup + route mounting
│   └── index.ts                       #    Server entrypoint
│
├── package.json
└── tsconfig.json
```

## Notes

- **`docs/openapi.yaml`** is the canonical API specification. It is read at
  runtime by `src/config/swagger.ts` to serve Swagger UI.
- The existing module structure (`controller → service → repository`)
  maps 1:1 to OpenAPI tags: `Auth`, `Products`, `Orders`, `Admin`,
  `Statistics`, `Chat`.
- No structural changes to existing source files are required — only
  two new files are added (`docs/openapi.yaml` and `src/config/swagger.ts`)
  plus a single import line in `app.ts`.
