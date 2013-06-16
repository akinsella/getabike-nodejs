// Generated by CoffeeScript 1.6.3
var buildOptions, cache, fetchDataFromUrl, getCacheKey, getContentType, getData, getIfUseCache, getParameterByName, getRandomInt, getUrlToFetch, isContentTypeJsonOrScript, processRequest, removeParameters, request, responseData, sendJsonResponse, uid, useCache;

request = require('request');

cache = require('./cache');

removeParameters = function(url, parameters) {
  var i, parameter, pars, prefix, queryString, result, urlBase, urlparts, _i, _len;
  for (_i = 0, _len = parameters.length; _i < _len; _i++) {
    parameter = parameters[_i];
    urlparts = url.split('?');
    if (urlparts.length >= 2) {
      urlBase = urlparts.shift();
      queryString = urlparts.join("?");
      prefix = encodeURIComponent(parameter) + '=';
      pars = queryString.split(/[&;]/g);
      i = pars.length;
      i--;
      while (i > 0) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
        i--;
      }
      result = pars.join('&');
      url = urlBase + (result ? '?' + result : '');
    }
  }
  return url;
};

getParameterByName = function(url, name) {
  var regex, results;
  name = name.replace(/[\[]/, "\\\\[").replace(/[\]]/, "\\\\]");
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  results = regex.exec(url);
  if (results === null) {
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};

sendJsonResponse = function(options, data) {
  var callback, response;
  callback = getParameterByName(options.req.url, 'callback');
  response = data;
  if (callback) {
    options.res.setHeader('Content-Type', 'application/javascript');
    response = callback + '(' + response + ');';
  } else {
    options.res.setHeader('Content-Type', 'application/json');
  }
  console.log("[" + options.url + "] Response sent: " + response);
  return options.res.send(response);
};

getContentType = function(response) {
  if (response) {
    return response.headers["content-type"];
  } else {
    return void 0;
  }
};

isContentTypeJsonOrScript = function(contentType) {
  return contentType.indexOf('json') >= 0 || contentType.indexOf('script') >= 0;
};

getCacheKey = function(req) {
  return removeParameters(req.url, ['callback', '_']);
};

getUrlToFetch = function(req) {
  return removeParameters(req.url, ['callback']);
};

getIfUseCache = function(req) {
  return getParameterByName(req.url, 'cache') === 'false';
};

useCache = function(options) {
  return !options.forceNoCache;
};

responseData = function(statusCode, statusMessage, data, options) {
  if (statusCode === 200) {
    if (options.contentType) {
      options.res.setHeader('Content-Type', options.contentType);
    }
    return sendJsonResponse(options, data);
  } else {
    console.log("Status code: " + statusCode + ", message: " + statusMessage);
    return options.res.send(statusMessage, statusCode);
  }
};

getData = function(options) {
  var err, errorMessage;
  try {
    if (!useCache(options)) {
      return fetchDataFromUrl(options);
    } else {
      console.log("[" + options.cacheKey + "] Cache Key is: " + options.cacheKey);
      console.log("Checking if data for cache key [" + options.cacheKey + "] is in cache");
      return cache.get(options.cacheKey, function(err, data) {
        if (!err && data) {
          console.log("[" + options.url + "] A reply is in cache key: '" + options.cacheKey + "', returning immediatly the reply");
          return options.callback(200, "", data, options);
        } else {
          console.log("[" + options.url + "] No cached reply found for key: '" + options.cacheKey + "'");
          return fetchDataFromUrl(options);
        }
      });
    }
  } catch (_error) {
    err = _error;
    errorMessage = err.name + ": " + err.message;
    return options.callback(500, errorMessage, void 0, options);
  }
};

fetchDataFromUrl = function(options) {
  console.log("[" + options.url + "] Fetching data from url");
  return request.get({
    url: options.url,
    json: true,
    headers: {
      "User-Agent": "getabike-nodejs"
    }
  }, function(error, response, data) {
    var contentType, jsonData;
    contentType = getContentType(response);
    console.log("[" + options.url + "] Http Response - Content-Type: " + contentType);
    console.log("[" + options.url + "] Http Response - Headers: ", response.headers);
    if (!isContentTypeJsonOrScript(contentType)) {
      console.log("[" + options.url + "] Content-Type is not json or javascript: Not caching data and returning response directly");
      options.contentType = contentType;
      options.callback(500, "", void 0, options);
    } else {
      if (options.transform) {
        data = options.transform(data);
      }
      jsonData = JSON.stringify(data);
      console.log("[" + options.url + "] Fetched Response from url: " + jsonData);
      options.callback(200, "", jsonData, options);
      if (useCache(options)) {
        cache.set(options.cacheKey, jsonData, options.cacheTimeout ? options.cacheTimeout : 60 * 60);
      }
    }
  });
};

buildOptions = function(req, res, url, cacheTimeout, transform) {
  var options;
  if (cacheTimeout == null) {
    cacheTimeout = 5;
  }
  options = {
    req: req,
    res: res,
    url: url,
    cacheKey: getCacheKey(req),
    forceNoCache: getIfUseCache(req),
    cacheTimeout: cacheTimeout,
    callback: responseData,
    transform: transform
  };
  return options;
};

processRequest = function(options) {
  var err, errorMessage;
  try {
    return getData(options);
  } catch (_error) {
    err = _error;
    errorMessage = err.name + ": " + err.message;
    return responseData(500, errorMessage, void 0, options);
  }
};

/*
Return a random int, used by `utils.uid()`

@param {Number} min
@param {Number} max
@return {Number}
@api private
*/


getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
Return a unique identifier with the given `len`.

utils.uid(10);
// => "FDaS435D2z"

@param {Number} len
@return {String}
@api private
*/


uid = function(len) {
  var buf, charlen, chars, i;
  buf = [];
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  charlen = chars.length;
  i = 0;
  while (i < len) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
    ++i;
  }
  return buf.join("");
};

module.exports = {
  getData: getData,
  responseData: responseData,
  getIfUseCache: getIfUseCache,
  fetchDataFromUrl: fetchDataFromUrl,
  getCacheKey: getCacheKey,
  getUrlToFetch: getUrlToFetch,
  buildOptions: buildOptions,
  processRequest: processRequest,
  getParameterByName: getParameterByName,
  uid: uid,
  getContentType: getContentType,
  isContentTypeJsonOrScript: isContentTypeJsonOrScript
};