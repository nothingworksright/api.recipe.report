# Successfully created PostgreSQL dev virtual machine.

Your PostgreSQL database has been setup and can be accessed on your local machine on the forwarded port (default: 15432)  

```
Host:     localhost
Port:     15432
Database: recipedb
Username: dbuser
Password: dbpass
```

## Access the Vagrant VM  

Admin access to postgres user via VM:  

```bash
vagrant ssh
sudo su - postgres
```

psql access to app database user via VM:  

```bash
vagrant ssh
sudo su - postgres
PGUSER=dbuser PGPASSWORD=dbpass psql -h localhost recipedb
```

## Connection string for development  

Env variable for application development:  

```
PGURL=postgresql://dbuser:dbpass@localhost:15432/recipedb
```

## Access the db via local command

Connect via psql as dbuser:  

```
PGUSER=dbuser PGPASSWORD=dbpass psql -h localhost -p 15432 recipedb
```

Connect via psql as dbowner:  

```
PGUSER=dbowner PGPASSWORD=dbpass psql -h localhost -p 15432 recipedb
```

## Rollback all migrations  

First, connect to the database via psql as dbowner. Then run these SQL commands.  

```sql
DROP SCHEMA rr CASCADE;
DROP TABLE flyway_schema_history;
```

## Example queries  

```sql
recipedb=> \dn
  List of schemas
  Name  |  Owner   
--------+----------
 public | postgres
 rr     | dbowner
(2 rows)
```

```sql
recipedb=> \dt rr.*
              List of relations
 Schema |       Name        | Type  |  Owner  
--------+-------------------+-------+---------
 rr     | accounts          | table | dbowner
 rr     | features          | table | dbowner
 rr     | recipes           | table | dbowner
 rr     | roles             | table | dbowner
 rr     | roles_to_features | table | dbowner
 rr     | users             | table | dbowner
 rr     | users_to_roles    | table | dbowner
(7 rows)
```

```sql
recipedb=> \d rr.accounts
                                      Table "rr.accounts"
         Column          |           Type           | Collation | Nullable |      Default      
-------------------------+--------------------------+-----------+----------+-------------------
 id                      | uuid                     |           | not null | gen_random_uuid()
 name                    | character varying(50)    |           | not null | 
 description             | text                     |           |          | 
 contact_user_id         | uuid                     |           | not null | 
 location_code           | text                     |           |          | 
 time_zone               | text                     |           |          | 
 address_country         | text                     |           |          | 
 address_locality        | text                     |           |          | 
 address_region          | text                     |           |          | 
 address_post_office_box | text                     |           |          | 
 address_postal_code     | text                     |           |          | 
 address_street          | text                     |           |          | 
 date_created            | timestamp with time zone |           | not null | CURRENT_TIMESTAMP
 date_deleted            | timestamp with time zone |           |          | 
Indexes:
    "accounts_pkey" PRIMARY KEY, btree (id)
    "accounts_name_index" btree (name)
    "accounts_name_key" UNIQUE CONSTRAINT, btree (name)
Foreign-key constraints:
    "fk_contact_user_accounts" FOREIGN KEY (contact_user_id) REFERENCES rr.users(id)
Referenced by:
    TABLE "rr.users_to_roles" CONSTRAINT "fk_account_users_to_roles" FOREIGN KEY (account_id) REFERENCES rr.accounts(id)
Typed table of type: rr.account_type
```

```sql
recipedb=> select a.name as "Account Name", u.name as "User Name" from rr.accounts as a left join rr.users as u on u.id = a.contact_user_id;
  Account Name  | User Name 
----------------+-----------
 Kitchen of foo | foo
(1 row)
```
