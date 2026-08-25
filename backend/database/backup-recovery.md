# Backup & Recovery

## Backups
- Daily full backup: `pg_dump -Fc`
- 15-minute WAL archiving for PITR
- Retention: 30 daily + 12 monthly

## Point-in-time recovery (PITR)
1. Restore latest full backup.
2. Configure `restore_command` for WAL source.
3. Set `recovery_target_time` and start PostgreSQL in recovery mode.

## Export/import
- Export table: `\copy table TO 'file.csv' CSV HEADER`
- Import table: `\copy table FROM 'file.csv' CSV HEADER`

## Cloning
- `createdb str_platform_clone`
- `pg_restore -d str_platform_clone backup.dump`
