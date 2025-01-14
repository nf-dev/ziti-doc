# Consuming

## Consuming Configuration Data
Configuration data can be retrieved directly, but it will usually be consumed by applications via the SDK. When an SDK authenticates, it will indicate which configuration types it can process. Then, when listing services, the SDK will receive configuration data in-line. This can be done from the CLI as well.

If we've set up a service `ssh` as follows:

```
    $ ziti edge create config ssh-client my-app \
        '{ 
            "hostname" : "ssh.company.com", 
            "port" : 22 
         }'
    
    $ ziti edge create service ssh --configs ssh
 ```

The SDKs will present this configuration in language specific ways. You can see the data the SDK are working with from the SDK, by specifying configuration types when listing services. 

**NOTES**
* You can specify `all` to see all the configuration data.
* In addition to the `config` block which has the embedded configuration data there's also a `configs` section which lists all the associated configurations by ID. All associated configurations will always be listed here, regardless of which configuration types are requested.

```
    $ ziti edge list services -j --config-types my-app 'name="ssh"'
    {
        "meta": {
            "filterableFields": [
                "id",
                "createdAt",
                "updatedAt",
                "name"
            ],
            "pagination": {
                "limit": 10,
                "offset": 0,
                "totalCount": 1
            }
        },
        "data": [
            {
                "id": "5d802b56-2ce2-4d28-b95c-01c968948ecc",
                "createdAt": "2020-06-01T14:36:36.856984972Z",
                "updatedAt": "2020-06-01T14:36:36.856984972Z",
                "_links": {
                    "configs": {
                        "href": "./services/5d802b56-2ce2-4d28-b95c-01c968948ecc/configs"
                    },
                    "self": {
                        "href": "./services/5d802b56-2ce2-4d28-b95c-01c968948ecc"
                    },
                    "service-edge-router-policies": {
                        "href": "./services/5d802b56-2ce2-4d28-b95c-01c968948ecc/service-edge-router-policies"
                    },
                    "service-policies": {
                        "href": "./services/5d802b56-2ce2-4d28-b95c-01c968948ecc/service-policies"
                    },
                    "terminators": {
                        "href": "./services/5d802b56-2ce2-4d28-b95c-01c968948ecc/terminators"
                    }
                },
                "tags": {},
                "name": "ssh",
                "terminatorStrategy": "smartrouting",
                "roleAttributes": null,
                "permissions": [
                    "Bind",
                    "Dial"
                ],
                "configs": [
                    "e471379b-3f40-4ddf-8bae-621491127543"
                ],
                "config": {
                    "my-app": {
                        "hostname": "ssh.company.com",
                        "port": 22
                    }
                }
            }
        ]
    }
```
 