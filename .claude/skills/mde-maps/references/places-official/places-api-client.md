# Places API (New): Nodejs Client

2.4.0 (latest) 1.10.0 1.9.1 1.8.0 1.7.0 1.6.0 This library is considered to be in **preview**. This means it is still a
work-in-progress and under active development. Any release is subject to
backwards-incompatible changes at any time.

[](https://www.npmjs.org/package/@googlemaps/places)

Places API (New) client for Node.js

A comprehensive list of changes in each version may be found in
[the CHANGELOG](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/CHANGELOG.md).

- [Places API (New) Nodejs Client API Reference](https://cloud.google.com/nodejs/docs/reference/places/latest)
- [Places API (New) Documentation](https://developers.google.com/maps/documentation/places/web-service/)

Read more about the client libraries for Cloud APIs, including the older
Google APIs Client Libraries, in [Client Libraries Explained](https://cloud.google.com/apis/docs/client-libraries-explained).

**Table of contents:**

- [Quickstart](https://docs.cloud.google.com/nodejs/docs/reference/places/latest#quickstart)

  - [Before you begin](https://docs.cloud.google.com/nodejs/docs/reference/places/latest#before-you-begin)
  - [Installing the client library](https://docs.cloud.google.com/nodejs/docs/reference/places/latest#installing-the-client-library)
- [Versioning](https://docs.cloud.google.com/nodejs/docs/reference/places/latest#versioning)

- [Contributing](https://docs.cloud.google.com/nodejs/docs/reference/places/latest#contributing)
- [License](https://docs.cloud.google.com/nodejs/docs/reference/places/latest#license)

## Quickstart

### Before you begin

1. [Select or create a Cloud Platform project](https://console.cloud.google.com/project).
2. [Enable billing for your project](https://support.google.com/cloud/answer/6293499#enable-billing).
3. [Enable the Places API (New) API](https://console.cloud.google.com/flows/enableapi?apiid=places.googleapis.com).
4. [Set up authentication](https://cloud.google.com/docs/authentication/external/set-up-adc-local) so you can access the API from your local workstation. ### Installing the client library

    npm install @googlemaps/places

## Terms of Service

`@googlemaps/places` uses Google Maps Platform services. Use of Google
Maps Platform services through this library is subject to the
[Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms).

This library is not a Google Maps Platform Core Service.
Therefore, the Google Maps Platform Terms of Service (e.g., Technical
Support Services, Service Level Agreements, and Deprecation Policy)
do not apply to this library.

### European Economic Area (EEA) developers

If your billing address is in the European Economic Area, effective on
8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea)
will apply to your use of the Services. Functionality varies by region.
[Learn more](https://developers.google.com/maps/comms/eea/faq).

## Samples

Samples are in the [`samples/`](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples) directory. Each sample's `README.md` has instructions for running its sample.

| Sample | Source Code |
|---|---|
| autocomplete places | [source code](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples/generated/v1/places.autocomplete_places.js) |
| get photo media | [source code](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples/generated/v1/places.get_photo_media.js) |
| get place | [source code](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples/generated/v1/places.get_place.js) |
| search nearby | [source code](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples/generated/v1/places.search_nearby.js) |
| search text | [source code](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples/generated/v1/places.search_text.js) |
| maps | [source code](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/samples/generated/v1/snippet_metadata_google.maps.places.v1.json) |

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://github.com/nodejs/release#release-schedule).
Libraries are compatible with all current *active* and *maintenance* versions of
Node.js.
If you are using an end-of-life version of Node.js, we recommend that you update
as soon as possible to an actively supported LTS version.

Google's client libraries support legacy versions of Node.js runtimes on a
best-efforts basis with the following warnings:

- Legacy versions are not tested in continuous integration.
- Some security patches and features cannot be backported.
- Dependencies cannot be kept up-to-date.

Client libraries targeting some end-of-life versions of Node.js are available, and
can be installed through npm [dist-tags](https://docs.npmjs.com/cli/dist-tag).
The dist-tags follow the naming convention `legacy-(version)`.
For example, `npm install @googlemaps/places@legacy-8` installs client libraries
for versions compatible with Node.js 8.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).

More Information: [Google Cloud Platform Launch Stages](https://cloud.google.com/terms/launch-stages)

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/CONTRIBUTING.md).

Please note that this `README.md`
and a variety of configuration files in this repository (including `.nycrc` and `tsconfig.json`)
are generated from a central template.

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/google-cloud-node/blob/main/packages/google-maps-places/LICENSE)