#!/bin/bash
mongo <<EOF
use admin;
db.auth("root","zhanghuiquan")
db.createUser({ user: 'btUser', pwd: 'btPass', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
db.grantRolesToUser("btUser",[{role:"dbOwner",db:"stack-learning"}]);
use stack-learning;
db.createCollection("courses");
EOF

# mongoimport --db stack-learning --collection courses --file $WORKSPACE/courses.json