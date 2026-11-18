---
name: Package-manager bootstrap
description: Avoid recursive pnpm self-installation when pinning the project's package manager.
---

Check the installed pnpm version before introducing or changing a
`packageManager` pin.

**Why:** In this environment, requesting a different pnpm version triggered
recursive pnpm self-installation until process/thread limits were exhausted.
The existing pnpm executable worked when automatic version management was
disabled.

**How to apply:** If a version query starts bootstrapping another pnpm, inspect
the installed version with
`npm_config_manage_package_manager_versions=false pnpm --version` and choose
an intentional compatible pin rather than repeatedly retrying the bootstrap.
