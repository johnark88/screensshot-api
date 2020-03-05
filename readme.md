# Take & Compare Screenshot API

## TODO

------

- GCP Endpoint setup w/ cloud functions
  - <https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-functions>
  - OpenApi - swagger
  - <https://swagger.io/docs/specification/2-0/basic-structure/>
- GCP Pub/Sub setup
- GCP Signed URLs - Storage
  - <https://cloud.google.com/storage/docs/access-control/signed-urls>
- Make Image's publicly viewable - try to avoid making whole bucket shared
- Authorization/Securing all endpoints/functions
account for duplicated name
user hitting the button twice
have progress wheel/bar
naming convention
multiple screen shots of same site with same name

## Take Screenshot Steps

------------;

Function Name: `take-screenshot`
Background Function Name: `watch-storage`

- Take screenshot
- Save image to tmp/screen-shot-name.png
  - Temp directory avalible to gcp functions - read/write
- Save that image to GCP Storage bucket
  - Main project bucket name: `temp-screenshot-storage`
- Background function watches for `storage.object.finalize`
  - Once image is saved, function is triggered
- Save image temporarily
  - if keep
    - save image to storage bucket
    - Remove from image from function temp folder
  - if delete
    - Remove from image from function temp folder
    - Remove from image from `temp-screenshot-storage` storage bucket

watch-storage is publisher
new function is the subscriber
watch sends the ok with data(`Object`)
new function accepts it, and sends it down to application

1. create topic - this will happen in seperate function? or `take-screenshot`?
2. Publish message
3. recieve message
4. react/respond to message
<https://cloud.google.com/pubsub/docs/publisher>
Background Functions:
<https://cloud.google.com/functions/docs/writing/background>
