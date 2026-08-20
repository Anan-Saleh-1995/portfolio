# Security Policy

## Supported Branch

Security fixes target the `main` branch.

## Reporting a Vulnerability

Please do not open a public issue with exploit details, secrets, or private
configuration. Report security concerns privately through GitHub Security
Advisories when available, or contact the repository owner directly.

## Secrets

Real `.env` files are intentionally ignored. Use `.env.example` as the safe
template for local setup and keep API keys, tokens, DSNs, and production values
out of Git.
