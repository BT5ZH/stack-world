#!/bin/bash
mongo <<EOF
use admin;
db.createUser({ user: 'btUser', pwd: 'btPass', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
db.auth("btUser","btPass")
use stack-learning;
db.createCollection("courses");
EOF

mongoimport --db stack-learning --collection courses --file $WORKSPACE/courses.json
