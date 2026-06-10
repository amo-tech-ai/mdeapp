---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: digital-signature
description: "Offline Google Maps Platform doc export (digital-signature). Tertiary: verify against live developers.google.com and curated references/*.md."
---

## Digitally sign your request with an API key

Depending on your usage, a digital signature - in addition to an API key - may be required to
authenticate requests. See the following
articles:

- [Maps Static API Other Usage Limits](https://developers.google.com/maps/documentation/maps-static/usage-and-billing#other-usage-limits)
- [Street View Static API Other Usage Limits](https://developers.google.com/maps/documentation/streetview/usage-and-billing#other-usage-limits)

### How digital signatures work

Digital signatures are generated using a *URL signing secret*, which is available on the
Google Cloud console. This secret is essentially a private key, only shared between you and Google,
and is unique to your project.

The signing process uses an encryption algorithm to combine the URL and your
shared secret. The resulting unique signature allows our servers to verify
that any site generating requests using your API key is authorized to do so.

> [!CAUTION]
> **We strongly recommend that you use both an API key and digital signature,
> regardless of your usage.**

### Limit unsigned requests

To ensure that your API key only accepts signed requests:

1. Go to the [Google Maps Platform Quotas page](https://console.cloud.google.com/project/_/google/maps-apis/quotas) in the Cloud console.
2. Click the project drop-down and select the same project you used when you created the API key for your application or site.
3. Select the **Maps Static API** or **Street View Static API** from the APIs drop-down.
4. Expand the **Unsigned requests** section.
5. In the **Quota Name** table, click the edit button next to the quota you want to edit. For example, **Unsigned requests per day.**
6. Update **Quota limit** in the **Edit Quota Limit** pane.
7. Select **Save**.

### Signing your requests

Signing your requests comprises the following steps:

- **Step 1:** [Get your URL signing secret](https://developers.google.com/maps/digital-signature#get-secret)
- **Step 2:** [Construct an unsigned request](https://developers.google.com/maps/digital-signature#construct-unsigned-request)
- **Step 3:** [Generate the signed request](https://developers.google.com/maps/digital-signature#generate-signed-request)

#### Step 1: Get your URL signing secret

> [!WARNING]
> **Warning:** Please keep your URL signing secret secure. Do **not** pass it in any requests, store it on any websites, or post it to any public forum. Anyone obtaining your URL signing secret could spoof requests using your identity.

To get your project URL signing secret:

1. Go to the [Google Maps Platform Credentials page](https://console.cloud.google.com/project/_/google/maps-apis/credentials?utm_source=Docs_Credentials) in the Cloud console.
2. Select the project drop-down and select the same project you used when you created the API key for the Maps Static API or Street View Static API.
3. Scroll down to the **Secret Generator** card. The **Current secret** field contains your current URL signing secret.
4. The page also features the **Sign a URL now** widget that allows you to automatically sign the Maps Static API or Street View Static API request using your current signing secret. Scroll down to the **Sign a URL now** card to access it.

To get a new URL signing secret, select **Regenerate Secret**.
The previous secret will expire 24 hours after you've generated a new secret.
After the 24 hours have passed, requests containing the old secret no longer work.

#### Step 2: Construct your unsigned request

> [!WARNING]
> **Warning:** Requests containing both a client ID and an API key may result in unexpected API behavior or unintended billing behavior. To prevent this, make sure your requests use only one of these parameters.

> [!IMPORTANT]
> **Important:** All Google services require UTF-8 character encoding (which implicitly includes ASCII). If your applications operate using non-ASCII character sets, make sure they construct URLs using UTF-8 and properly [URL-encode](https://developers.google.com/maps/url-encoding) them!

Characters *not* listed in the table below must be URL-encoded:
Summary of Valid URL Characters

| Set | characters | URL usage |
|---|---|---|
| Alphanumeric | a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 | Text strings, scheme usage (`http`), port (`8080`), etc. |
| Unreserved | - _ . \~ | Text strings |
| Reserved | ! \* ' ( ) ; : @ \& = + $ , / ? % # \[ \] | Control characters and/or Text Strings |

The same applies to any characters in the **Reserved** set, if they are passed inside a text
string. For more info, see
[Special characters](https://developers.google.com/maps/url-encoding#special-characters).

Construct your unsigned request URL without the signature.

For instructions, see the following developer documentation:

- [Maps Static API](https://developers.google.com/maps/documentation/maps-static/overview)
- [Street View Static API](https://developers.google.com/maps/documentation/streetview/overview)

<br />

Make sure to also include the API key in the
`key` parameter. For example:

```
https://maps.googleapis.com/maps/api/staticmap?center=Z%C3%BCrich&size=400x400&key=YOUR_API_KEY
```

#### Generate the signed request

For one-off use cases, such as hosting a simple
Maps Static API or Street View Static API image on your
web page, or troubleshooting purposes, you can generate a digital signature
automatically using the available
[**Sign a URL now**](https://developers.google.com/maps/digital-signature#using-signing-widget) widget.

For dynamically generated requests, you need [server-side](https://developers.google.com/maps/digital-signature#server-side-signing)
signing, which requires a few additional intermediate steps

Either way, you should end up with a request URL that has a `signature` parameter
appended to the end. For example:

```
https://maps.googleapis.com/maps/api/staticmap?center=Z%C3%BCrich&size=400x400&key=YOUR_API_KEY
&signature=BASE64_SIGNATURE
```

##### Using the Sign a URL now widget

To generate a digital signature with
an API key
using the **Sign a URL now** widget
in the Google Cloud console:

1. Locate the **Sign a URL now** widget, as described in [Step 1: Get your URL signing secret](https://developers.google.com/maps/digital-signature#get-secret).
2. In the **URL** field, paste your unsigned request URL from [Step 2: Construct your unsigned request](https://developers.google.com/maps/digital-signature#construct-unsigned-request).
3. The **Your Signed URL** field that appears will contain your digitally signed URL. Be sure to make a copy.

##### Generate digital signatures server-side

Compared to the **Sign a URL now** widget, you will need to take a few additional
actions when generating digital signatures server-side:

1. Strip off the protocol scheme and host portions of the URL,
   leaving only the path and the query:

```
/maps/api/staticmap?center=Z%C3%BCrich&size=400x400&key=YOUR_API_KEY
```
2. The displayed URL signing secret is encoded in a modified
   [Base64](https://en.wikipedia.org/wiki/Base64) for URLs.

   As most cryptographic libraries require the key to be in raw byte format, you will likely
   need to decode your URL signing secret into its original raw format before signing.
3. Sign the above stripped request using HMAC-SHA1.
4. As most cryptographic libraries generate a signature in raw byte format, you will need to
   convert the resulting binary signature using the modified
   [Base64](https://en.wikipedia.org/wiki/Base64) for URLs to convert
   it into something that can be passed within the URL.

   > [!NOTE]
   > **Note:** Modified Base64 for URLs replaces the `+` and `/` characters of standard Base64 with `-` and `_` respectively, so that these Base64 no longer need to be URL-encoded.

5. Append the Base64-encoded signature to the original unsigned request URL in the
   `signature` parameter. For example:

   ```
   https://maps.googleapis.com/maps/api/staticmap?center=Z%C3%BCrich&size=400x400&key=YOUR_API_KEY
   &signature=BASE64_SIGNATURE
   ```

For samples showing ways to implement URL signing using server-side code, see
[Sample code for URL signing](https://developers.google.com/maps/digital-signature#sample-code-for-url-signing) below.

### Sample code for URL signing

The following sections show ways to implement URL signing using
server-side code. URLs should always be signed server-side to avoid
exposing your URL signing secret to users.

### Python

The example below uses standard Python libraries to sign a URL.
([Download](https://github.com/googlemaps/url-signing/blob/gh-pages/urlsigner.py)
the code.)

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
""" Signs a URL using a URL signing secret """

import hashlib
import hmac
import base64
import urllib.parse as urlparse


def sign_url(input_url=None, secret=None):
    """ Sign a request URL with a URL signing secret.
      Usage:
      from urlsigner import sign_url
      signed_url = sign_url(input_url=my_url, secret=SECRET)
      Args:
      input_url - The URL to sign
      secret    - Your URL signing secret
      Returns:
      The signed request URL
  """

    if not input_url or not secret:
        raise Exception("Both input_url and secret are required")

    url = urlparse.urlparse(input_url)

    # We only need to sign the path+query part of the string
    url_to_sign = url.path + "?" + url.query

    # Decode the private key into its binary format
    # We need to decode the URL-encoded private key
    decoded_key = base64.urlsafe_b64decode(secret)

    # Create a signature using the private key and the URL-encoded
    # string using HMAC SHA1. This signature will be binary.
    signature = hmac.new(decoded_key, str.encode(url_to_sign), hashlib.sha1)

    # Encode the binary signature into base64 for use within a URL
    encoded_signature = base64.urlsafe_b64encode(signature.digest())

    original_url = url.scheme + "://" + url.netloc + url.path + "?" + url.query

    # Return signed URL
    return original_url + "&signature=" + encoded_signature.decode()


if __name__ == "__main__":
    input_url = input("URL to Sign: ")
    secret = input("URL signing secret: ")
    print("Signed URL: " + sign_url(input_url, secret))
```

### Java

The example below uses the `java.util.Base64` class available
since JDK 1.8 - older versions may need to use Apache Commons or similar.
([Download](http://googlemaps.github.io/url-signing/UrlSigner.java)
the code.)

```java
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;  // JDK 1.8 only - older versions may need to use Apache Commons or similar.
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class UrlSigner {

  // Note: Generally, you should store your private key someplace safe
  // and read them into your code

  private static String keyString = "YOUR_PRIVATE_KEY";
  
  // The URL shown in these examples is a static URL which should already
  // be URL-encoded. In practice, you will likely have code
  // which assembles your URL from user or web service input
  // and plugs those values into its parameters.
  private static String urlString = "YOUR_URL_TO_SIGN";

  // This variable stores the binary key, which is computed from the string (Base64) key
  private static byte[] key;
  
  public static void main(String[] args) throws IOException,
    InvalidKeyException, NoSuchAlgorithmException, URISyntaxException {
    
    BufferedReader input = new BufferedReader(new InputStreamReader(System.in));
    
    String inputUrl, inputKey = null;

    // For testing purposes, allow user input for the URL.
    // If no input is entered, use the static URL defined above.    
    System.out.println("Enter the URL (must be URL-encoded) to sign: ");
    inputUrl = input.readLine();
    if (inputUrl.equals("")) {
      inputUrl = urlString;
    }
    
    // Convert the string to a URL so we can parse it
    URL url = new URL(inputUrl);
 
    // For testing purposes, allow user input for the private key.
    // If no input is entered, use the static key defined above.   
    System.out.println("Enter the Private key to sign the URL: ");
    inputKey = input.readLine();
    if (inputKey.equals("")) {
      inputKey = keyString;
    }
    
    UrlSigner signer = new UrlSigner(inputKey);
    String request = signer.signRequest(url.getPath(),url.getQuery());
    
    System.out.println("Signed URL :" + url.getProtocol() + "://" + url.getHost() + request);
  }
  
  public UrlSigner(String keyString) throws IOException {
    // Convert the key from 'web safe' base 64 to binary
    keyString = keyString.replace('-', '+');
    keyString = keyString.replace('_', '/');
    System.out.println("Key: " + keyString);
    // Base64 is JDK 1.8 only - older versions may need to use Apache Commons or similar.
    this.key = Base64.getDecoder().decode(keyString);
  }

  public String signRequest(String path, String query) throws NoSuchAlgorithmException,
    InvalidKeyException, UnsupportedEncodingException, URISyntaxException {
    
    // Retrieve the proper URL components to sign
    String resource = path + '?' + query;
    
    // Get an HMAC-SHA1 signing key from the raw key bytes
    SecretKeySpec sha1Key = new SecretKeySpec(key, "HmacSHA1");

    // Get an HMAC-SHA1 Mac instance and initialize it with the HMAC-SHA1 key
    Mac mac = Mac.getInstance("HmacSHA1");
    mac.init(sha1Key);

    // compute the binary signature for the request
    byte[] sigBytes = mac.doFinal(resource.getBytes());

    // base 64 encode the binary signature
    // Base64 is JDK 1.8 only - older versions may need to use Apache Commons or similar.
    String signature = Base64.getEncoder().encodeToString(sigBytes);
    
    // convert the signature to 'web safe' base 64
    signature = signature.replace('+', '-');
    signature = signature.replace('/', '_');
    
    return resource + "&signature=" + signature;
  }
}
```

### Node JS

The example below uses native Node modules to sign a URL.
([Download](https://github.com/googlemaps/url-signing/blob/gh-pages/urlSigner.js)
the code.)

> [!NOTE]
> **Note:** If you are using strict type checking:
>
> - In `decodeBase64Hash(code)`, change the type of the return value to `{Buffer}`.
> - In `encodeBase64Hash(key, data)`, change the type value of `key` to `{Buffer}`.

```javascript
'use strict'

const crypto = require('crypto');
const url = require('url');

/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string}
 */
function removeWebSafe(safeEncodedString) {
  return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string}
 */
function makeWebSafe(encodedString) {
  return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {string}
 */
function decodeBase64Hash(code) {
  // "new Buffer(...)" is deprecated. Use Buffer.from if it exists.
  return Buffer.from ? Buffer.from(code, 'base64') : new Buffer(code, 'base64');
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {string} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string}
 */
function encodeBase64Hash(key, data) {
  return crypto.createHmac('sha1', key).update(data).digest('base64');
}

/**
 * Sign a URL using a secret key.
 *
 * @param  {string} path   The url you want to sign.
 * @param  {string} secret Your unique secret key.
 * @return {string}
 */
function sign(path, secret) {
  const uri = url.parse(path);
  const safeSecret = decodeBase64Hash(removeWebSafe(secret));
  const hashedSignature = makeWebSafe(encodeBase64Hash(safeSecret, uri.path));
  return url.format(uri) + '&signature=' + hashedSignature;
}
```

### C#

The example below uses the default
`System.Security.Cryptography` library to sign a URL request.
Note that we need to convert the default Base64 encoding to implement a
URL-safe version.
([Download](https://github.com/googlemaps/url-signing/blob/gh-pages/UrlSigner.cs)
the code.)

```c#
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace SignUrl {

  public struct GoogleSignedUrl {

    public static string Sign(string url, string keyString) {
      ASCIIEncoding encoding = new ASCIIEncoding();

      // converting key to bytes will throw an exception, need to replace '-' and '_' characters first.
      string usablePrivateKey = keyString.Replace("-", "+").Replace("_", "/");
      byte[] privateKeyBytes = Convert.FromBase64String(usablePrivateKey);

      Uri uri = new Uri(url);
      byte[] encodedPathAndQueryBytes = encoding.GetBytes(uri.LocalPath + uri.Query);

      // compute the hash
      HMACSHA1 algorithm = new HMACSHA1(privateKeyBytes);
      byte[] hash = algorithm.ComputeHash(encodedPathAndQueryBytes);

      // convert the bytes to string and make url-safe by replacing '+' and '/' characters
      string signature = Convert.ToBase64String(hash).Replace("+", "-").Replace("/", "_");
            
      // Add the signature to the existing URI.
      return uri.Scheme+"://"+uri.Host+uri.LocalPath + uri.Query +"&signature=" + signature;
    }
  }

  class Program {

    static void Main() {
    
      // Note: Generally, you should store your private key someplace safe
      // and read them into your code

      const string keyString = "YOUR_PRIVATE_KEY";
  
      // The URL shown in these examples is a static URL which should already
      // be URL-encoded. In practice, you will likely have code
      // which assembles your URL from user or web service input
      // and plugs those values into its parameters.
      const  string urlString = "YOUR_URL_TO_SIGN";
      
      string inputUrl = null;
      string inputKey = null;
    
      Console.WriteLine("Enter the URL (must be URL-encoded) to sign: ");
      inputUrl = Console.ReadLine();
      if (inputUrl.Length == 0) {
        inputUrl = urlString;
      }     
    
      Console.WriteLine("Enter the Private key to sign the URL: ");
      inputKey = Console.ReadLine();
      if (inputKey.Length == 0) {
        inputKey = keyString;
      }
      
      Console.WriteLine(GoogleSignedUrl.Sign(inputUrl,inputKey));
    }
  }
}
```

#### Examples in additional languages

Examples that cover more languages are available in the
[url-signing](https://googlemaps.github.io/url-signing/index.html)
project.

## Troubleshooting

> [!IMPORTANT]
> **Important:** Verify that the used URL signing secret and API key are from the same Google Cloud project.

If the request includes an invalid signature, the API returns an
`HTTP 403 (Forbidden)` error. This error most likely occurs if the used signing
secret isn't linked to the passed API key,
or if non-ASCII input isn't URL-encoded *before* signing.

To troubleshoot the issue, copy the request URL, strip the `signature` query
parameter, and regenerate a valid signature following the instructions below:

To generate a digital signature with
an API key
using the **Sign a URL now** widget
in the Google Cloud console:

1. Locate the **Sign a URL now** widget, as described in [Step 1: Get your URL signing secret](https://developers.google.com/maps/digital-signature#get-secret).
2. In the **URL** field, paste your unsigned request URL from [Step 2: Construct your unsigned request](https://developers.google.com/maps/digital-signature#construct-unsigned-request).
3. The **Your Signed URL** field that appears will contain your digitally signed URL. Be sure to make a copy.