# param-manager.js
Small library for handling url hash parameters on single page applications


# Methods





* * *

### ParamManager() 

ParamManager Class that lets you manage pseudo parameters using a fake path on the hash



### has(key) 

Check if a single parameter exist
NOTE: returns true even if does not have a value ("" or undefined)

**Parameters**

**key**: `String`, name of the parameter

**Returns**: `Boolean`, true if parameter exist


### get(key) 

Get a single parameter

**Parameters**

**key**: `String/Number/Array/Boolean`, Parameter name

**Returns**: `String`, [description]


### set(key, val) 

Set a single parameter

**Parameters**

**key**: `String`, Parameter name

**val**: `String/Number/Array/Boolean`, Value of the parameter



### getArray(key) 

Get a single parameter that contains an array

**Parameters**

**key**: `String`, Parameter name

**Returns**: `Array`, [description]


### setArray(key, val) 

Set a single parameter with an array

**Parameters**

**key**: `String`, Parameter name

**val**: `Array`, Values of the parameter



### remove(key, val) 

Remove a single parameter

**Parameters**

**key**: `String`, The key of the parameter to be removed

**val**: `String`, The value of the object removed or undefined



### getAll() 

Get all parameters specified on the URL

**Returns**: `Object`, Object containing keys and values from the url parameters


### setAll(obj) 

Set all parameters on the url from a object

**Parameters**

**obj**: `Object`, An object containing keys and values



### update(obj) 

Set multiple parameters on the url from a object and keep other values unaltered

**Parameters**

**obj**: `Object`, An object containing keys and values to be updated



### removeAll() 

Remove all parameters from the url



### createParamString(obj) 

Create a string containig all the parameters from a given object

**Parameters**

**obj**: `Object`, An object containing keys and values

**Returns**: `String`, The built string


### createLink(hash, paramsObj) 

Create a hash url string containig parameters

**Parameters**

**hash**: `String`, A hash url

**paramsObj**: `Object`, An object containing keys and values

**Returns**: `String`, The built string



* * *










