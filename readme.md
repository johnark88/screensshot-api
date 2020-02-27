# Take & Compare Screenshot API

## TODO

------

- GCP Endpoint setup w/ cloud functions
  - <https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-functions>
  - OpenApi - swagger
  - <https://swagger.io/docs/specification/2-0/basic-structure/>

## Take Screenshot Steps

------------

Function Name: `take-screenshot`  
Background Function Name: `watch-storage`

- Take screenshot
- Save image to tmp/screen-shot-name.png
  - Temp directory avalible to gcp functions - read/write
- Save that image to GCP Storage bucket
  - Main project bucket name: `temp-screenshot-storage`
- Background function watches for `storage.object.finalize`
  - Once image is save, function is triggered
- Save image temporarily
  - if keep
    - save image to storage bucket
    - Remove from image from function temp folder
  - if delete
    - Remove from image from function temp folder
    - Remove from image from `temp-screenshot-storage` storage bucket
