---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: maps-datasets-api
title: Maps Datasets API — Data-driven styling datasets
description: "Create/manage datasets for data-driven styling (REST). Tertiary: verify against live developers.google.com."
---

Datasets are containers for data that you want to use in your
Google Maps Platform apps as part of **data-driven styling**.
Maps Datasets API lets you create and manage datasets using a REST API.

> [!NOTE]
> **Note:** There is no charge for using the Maps Datasets API.

For example, with data-driven styling for datasets, you upload your own
geospatial data to a dataset, apply custom styling to the data features, and
display those data features on maps. You can create data visualizations based on
point, polyline, and polygon geometries, and make data features respond to click
events.

Creating a dataset is a two step process:

1. Make a request to create the dataset.

2. Make a request to upload data to the dataset from your desktop or Google
   Cloud Storage. Your upload data must be represented by a CSV, GeoJSON, or
   KML file.

For more on using datasets as part of data-driven styling, see:

- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/dds-datasets/overview).
- [Maps SDK for Android](https://developers.google.com/maps/documentation/android-sdk/dds-datasets/overview)
- [Maps SDK for iOS](https://developers.google.com/maps/documentation/ios-sdk/dds-datasets/overview)

## How the Maps Datasets API works

The Maps Datasets API has the following methods:

- **Create dataset** : Use the
  [create](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/projects.datasets/create) endpoint
  to create a dataset.

- **Upload data** : Use the [upload](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/media/upload) endpoint
  to upload data to your dataset.

- **List datasets** : Use the [list](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/projects.datasets/list)
  endpoint to fetch a list of all datasets.

- **Get dataset** : Use the [get](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/projects.datasets/get)
  endpoint to retrieve information about a specific dataset.

- **Get dataset errors** : Use the
  [fetchDatasetErrors](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/projects.datasets/fetchDatasetErrors)
  endpoint to retrieve error information about a dataset.

- **Update dataset** : Use the [patch](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/projects.datasets/patch)
  endpoint to update information about a specific dataset.

- **Download dataset** : Use the [download](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/media/download)
  endpoint to download the data from a dataset.

- **Delete dataset** : Use the [delete](https://developers.google.com/maps/documentation/datasets/reference/rest/v1/projects.datasets/delete)
  endpoint to delete a dataset.

## How to use the Maps Datasets API

|---|---|---|
| 1 | **Get set up** | Start with [Set up your Google Cloud project](https://developers.google.com/maps/documentation/datasets/cloud-setup) and complete the instructions that follow. |
| 2 | **Create a dataset and upload your data** | See [Create a dataset](https://developers.google.com/maps/documentation/datasets/create). |
| 3 | **Get dataset information and status** | See [Get a dataset](https://developers.google.com/maps/documentation/datasets/get). |

## What's next

- [Set up your Google Cloud project](https://developers.google.com/maps/documentation/datasets/cloud-setup)
- [Use OAuth](https://developers.google.com/maps/documentation/datasets/oauth-token)