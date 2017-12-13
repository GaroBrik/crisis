#!/bin/bash

ROOT="$(cd "$(dirname "$0")"; pwd -P )"

STATIC_DIR="${ROOT}/static"
IMAGE_PATH="${ROOT}/imgs"
mkdir -p $STATIC_DIR
mkdir -p $IMAGE_PATH
WEBCONTENT_DIR="${ROOT}/webcontent"

echo "-----> compiling scss"
sass "${WEBCONTENT_DIR}/css/main.scss" "${STATIC_DIR}/main.css"

echo "-----> compiling js"
pushd "${WEBCONTENT_DIR}/js" > /dev/null
{
    OUTPUT="${STATIC_DIR}/compiled.js"
    INPUT="goog.js \
           main.js \
           prototypes.js \
           controls.js \
           event.js \
           coords.js \
           bounds.js \
           ajax.js \
           division.js \
           divisionMapMarker.js \
           divisiondetails.js \
           unittype.js \
           unittype-li.js \
           unit-type-chooser.js \
           faction.js \
           faction-li.js \
           faction-selector.js \
           faction-visibility-selector.js \
           unit.js \
           details-unit-li.js \
           map.js \
           routepoint.js"
    EXTERNS="jquiexterns.js \
             jsonexterns.js \
             jquery-1.9.js \
             underscore-1.5.1.js \
             bucketsexterns.js"
    java -jar thirdparty/closure-compiler/closure-compiler.jar \
         --compilation_level SIMPLE_OPTIMIZATIONS \
         --js $INPUT --externs $EXTERNS --js_output_file $OUTPUT \
         --generate_exports --warning_level VERBOSE \
         --jscomp_warning=checkTypes --jscomp_warning=missingProperties
    cp "${WEBCONTENT_DIR}/js/thirdparty/"/*.js "${STATIC_DIR}/"
    mkdir -p "${STATIC_DIR}/bgs"
    mkdir -p "${IMAGE_PATH}"
    # cp -r "${IMAGE_PATH}/." "${STATIC_DIR}/bgs/"
}
