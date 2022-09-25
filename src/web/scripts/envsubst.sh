    cd ..
    echo "--------------------------------------------------------------"

    export COURSE_SHEET_URL=$1
    echo $COURSE_SHEET_URL

    export TRIP_SHEET_URL=$2
    echo $TRIP_SHEET_URL

    envsubst '${COURSE_SHEET_URL} ${TRIP_SHEET_URL}' < app-config.template.json >> app-config.prod.json

    echo "--------------------------------------------------------------"

    cat app-config.template.json