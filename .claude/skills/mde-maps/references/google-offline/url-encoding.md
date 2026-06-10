---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: url-encoding
description: "Offline Google Maps Platform doc export (url-encoding). Tertiary: verify against live developers.google.com and curated references/*.md."
---

Some characters cannot be part of a URL (for example, the space) and some other
characters have a special meaning in a URL. In HTML forms, the character `=` is
used to separate a name from a value. The URI generic syntax uses URL encoding
to deal with this problem, while HTML forms make some additional substitutions
rather than applying percent encoding for all such characters.

For example, spaces in a string are either encoded with `%20` or replaced with
the plus sign (`+`). If you use a pipe character (`|`) as a separator, be sure
to encode the pipe as `%7C`. A comma in a string should be encoded as `%2C`.

It is recommended you use your platform's normal URL building libraries to
automatically encode your URLs, to ensure the URLs are properly escaped for your
platform.

## Building a valid URL

You may think that a "valid" URL is self-evident, but
that's not quite the case. A URL entered within an address bar in a
browser, for example, may contain special characters (e.g.
`"上海+中國"`); the browser needs to internally translate
those characters into a different encoding before transmission.
By the same token, any code that generates or accepts UTF-8 input
might treat URLs with UTF-8 characters as "valid", but would also need
to translate those characters before sending them out to a web server.
This process is called [URL-encoding](https://en.wikipedia.org/wiki/Query_string#URL_encoding) or [percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding).

### Special characters

We need to translate special characters because
all URLs need to conform to the syntax specified by the
[Uniform
Resource Identifier (URI)](http://tools.ietf.org/html/rfc3986) specification. In effect, this means that URLs
must contain only a special subset of ASCII characters: the familiar
alphanumeric symbols, and some reserved characters for use as control
characters within URLs. This table summarizes these characters:
Summary of Valid URL Characters

| Set | characters | URL usage |
|---|---|---|
| Alphanumeric | a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 | Text strings, scheme usage (`http`), port (`8080`), etc. |
| Unreserved | - _ . \~ | Text strings |
| Reserved | ! \* ' ( ) ; : @ \& = + $ , / ? % # \[ \] | Control characters and/or Text Strings |

When building a valid URL, you must ensure that it contains only those characters shown in the
table. Conforming a URL to use this set of characters generally
leads to two issues, one of omission and one of substitution:

- Characters that you wish to handle exist outside of the above set. For example, characters in foreign languages such as `上海+中國` need to be encoded using the above characters. By popular convention, spaces (which are not allowed within URLs) are often represented using the plus `'+'` character as well.
- Characters exist within the above set as reserved characters, but need to be used literally. For example, `?` is used within URLs to indicate the beginning of the query string; if you wish to use the string "? and the Mysterions," you'd need to encode the `'?'` character.

All characters to be URL-encoded are encoded
using a `'%'` character and a two-character hex
value corresponding to their UTF-8 character. For example,
`上海+中國` in UTF-8 would be URL-encoded as
`%E4%B8%8A%E6%B5%B7%2B%E4%B8%AD%E5%9C%8B`. The
string `? and the Mysterians` would be URL-encoded as
`%3F+and+the+Mysterians` or `%3F%20and%20the%20Mysterians`.

### Common characters that need encoding

Some common characters that must be encoded are:

| Unsafe character | Encoded value |
|---|---|
| Space | `%20` |
| " | `%22` |
| \< | `%3C` |
| \> | `%3E` |
| # | `%23` |
| % | `%25` |
| \| | `%7C` |

Converting a URL that you receive from user input is sometimes
tricky. For example, a user may enter an address as "5th\&Main St."
Generally, you should construct your URL from its parts, treating
any user input as literal characters.

Additionally, URLs are limited to 16384 characters for all Google Maps Platform web services
and static web APIs. For most services, this character limit will seldom be approached. However,
note that certain services have several parameters that may result in long URLs.