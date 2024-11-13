    echo "--------------------------------------------------------------"

    export COURSE_SHEET_URL=$1
    echo $COURSE_SHEET_URL

    export TRIP_SHEET_URL=$2
    echo $TRIP_SHEET_URL

    export SCK_API_URL=$3
    echo $SCK_API_URL


    envsubst ' ${COURSE_SHEET_URL} ${TRIP_SHEET_URL} ${SCK_API_URL}' < ../projects/sck-app/src/environments/environment.template.ts > ../projects/sck-app/src/environments/environment.prod.ts

    echo "--------------------------------------------------------------"

    cat ../projects/sck-app/src/environments/environment.prod.ts
