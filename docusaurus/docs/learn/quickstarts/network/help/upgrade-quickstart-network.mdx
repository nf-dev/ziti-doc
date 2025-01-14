---
title: Upgrade a Quickstart Network
id: upgrade-quickstart-network
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This document explains the process for backing up, and upgrading your controller and router(s).

<Tabs groupId="backup-network">
<TabItem value="non-docker-quickstart" label="Non-Docker Quickstart">

## Backup Existing Network

While you can certainly back up every file relating to your network, there are only a few that would be necessary. To
back up the necessary files follow these steps:

1. Backup the database:
    1. Run the following
   ```
   ziti edge db snapshot
   ```
    1. This will create a backup file in the same directory as your controller's DB file. It will have the same name as
       the controller DB file (usually `ctrl.db`) with a date and timestamp appended to it in the following format
       `ctrl.db-YYYYMMDD-HHMMSS`. If you're not sure where your DB file is located, you can find the location in
       the `db`
       section of your controller config.
1. Backup the controller PKI.
    1. Copy the PKI directory to a safe backup location (Default path: `$ZITI_HOME/quickstart/$(hostname -s)/pki/`).
1. Backup the controller config file (default path: `$ZITI_HOME/$(hostname -s).yaml`).
1. Backup the environment file (default path `$ZITI_HOME/$(hostname -s).env`).
1. Backup any router config files.
    1. If you used one of our quickstarts, the single edge router created defaults
       to `$ZITI_HOME/$(hostname -s)-edge-router.yaml`

## Stop Existing Services

If your network is using services to run your controller and/or router(s), stop those services.

## Obtain the Desired Binary

Releases can be found [here](https://github.com/openziti/ziti/releases). There is a helpful script function
called `getZiti` that will obtain the binary,
and determine the correct architecture and OS for you.


Here is the process for using `getZiti` to obtain the latest binary. You may optionally add `yes` as an argument to
the `getZiti` function to have the new ziti binary automatically added to your $PATH

```
source /dev/stdin <<< "$(wget -qO- https://get.openziti.io/quick/ziti-cli-functions.sh)"
getZiti
```

:::note
After upgrading the binary, be sure to check your PATH to ensure it is pointing to the new binary.
:::

## Update Services

If you have services to start up the network, update them to use the new binary file.

<Tabs groupId="update-services">
<TabItem value="28.2" label="v0.28.2 or Later">

The `ExecStart` section on a `systemd` service will point to the full path to the old binary. Update this line to
point to the path of the newly downloaded binary. Any path in the service file needs to be updated similarly.

For example, the following portion of the `ExecStart`

```
.../ziti-v0.28.0/ziti" controller run 
```

will be updated to the following for `v0.28.2` and later.

```
.../ziti-v0.30.4/ziti" controller run
```

</TabItem>
<TabItem value="pre28.2" label="v0.28.1 or Earlier">

In version `v0.28.2`, `ziti-controller`, `ziti-router`, and `ziti-tunnel` were bundled into the `ziti` binary.
Therefore, in these earlier versions, the path to the binary will not only point to the older version of the binary
but the executable used will be `ziti-router` and `ziti-controller`. When upgrading, it is important to update the
path(s) to use the new binary along with the command (ex. `ziti controller` rather than `ziti-controller`).

For example, the following portion of the `ExecStart` on a `systemd` file

```
.../ziti-v0.27.0/ziti-controller" run 
```

will be updated to the following when upgrading `v0.28.1` or earlier. Notice the version and executable change.

```
.../ziti-v0.30.4/ziti" controller run
```

</TabItem>
</Tabs>

## Reload and Start Services

To reflect changes made to the services, reload the service daemon and start your services.

</TabItem>
<TabItem value="docker-quickstart" label="Docker Quickstart">

## Backup Existing Network

All the files used for the network are stored in the `/persistent` directory of the docker containers. You may back up
the files if desired.

1. Exec into the controller container
1. Backup the database:
    1. Create a database snapshot by running `ziti edge db snapshot`. Here's one example of how you can do that.
   ```
   docker exec <ziti-controller-container> /var/openziti/ziti-bin/ziti edge db snapshot
   # List the files to find the snapshot filename
   docker exec <ziti-controller-container> ls -la /persistent/db
   ```
    1. This will create a backup file in the same directory as your controller's DB file. It will have the same name as
       the controller DB file (usually `ctrl.db`) with a date and timestamp appended to it in the following format
       `ctrl.db-YYYYMMDD-HHMMSS`. If you're not sure where your DB file is located, you can find the location in
       the `db` section of your controller config.
    1. Copy the backup file to a safe location outside the docker container, here's an example.
   ```
   docker cp <ziti-controller-container>:/persistent/db/ctrl.db-YYYYMMDD-HHMMSS <local-backup-location>
   ```
1. Backup the controller PKI.
    1. Copy the PKI as was done with the database file (Default path: `/persistent/pki/`).
1. Backup the controller config file (default path: `/persistent/ziti-controller.yaml`).
1. Backup the environment file (default path `/persistent/ziti.env`).
1. Backup the router config files, depending on which quickstart you performed, you may have more than one. (default
   path `/persistent/*-router*.yaml`). Unfortunately, docker does not support wildcard characters when using
   `docker cp`. However, this command will allow you to list the files in `/persistent`, from which, you can craft your
   docker cp commands for each router config.
   ```
   docker exec -it ziti-controller ls -la
   ```

### Stop the Containers

1. Stop, and remove the docker containers but **do not** remove the volume.
    1. For docker-compose users, use `docker compose down` (do not use the `-v` option)
    1. For standalone docker users, use `docker stop <container1>, <container2>, ...`

### Obtain the Desired Version

1. If you used a `.env` file, update the `.env` file to use the desired OpenZiti version. Otherwise, the OpenZiti
   version is likely specified in your run command. The line containing the OpenZiti version will look like this
   `openziti/quickstart:<version>`. If the `:<version>` portion is not showing in your command, it will pull the
   latest version.
1. Pull the desired image
    1. For docker compose: `docker compose pull`
    1. For standalone docker: `docker pull openziti/quickstart:<version>`

### Start the OpenZiti Containers

1. Start the network back up
    1. Compose: `docker compose up`
    1. Standalone: modify the `docker run` command replacing this line `openziti/quickstart:latest` with your desired
       version.

### Verify the Upgrade

1. Confirmation of the upgrade can be made
   by `docker exec <ziti-controller-container> /var/openziti/ziti-bin/ziti version`

</TabItem>
</Tabs>

## Upgrading Versions <=`v0.28.2`

If your old Ziti network was `v0.28.3` or later, this section can be ignored

A major change to environment variables names was performed on `v0.28.3` so, if your network was `v0.28.2` or earlier,
then you may optionally run the following commands to update your env file to use the updated environment variable
names.

```
source /dev/stdin <<< "$(wget -qO- https://get.openziti.io/quick/ziti-cli-functions.sh)"
performMigration
```