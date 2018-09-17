Example:

```javascript
import { get } from 'networking/fetch';
import { HTTPError } from 'networking/utils';
get('url')
  .then(response => {
    if (response.status >= 200 && response.status < 400) {
      return response.json();
    } else {
      // Re-throw bad status
      throw new HTTPError(response);
    }
  })
  .then(payload => {
    // Do something with response.json() returned value
  })
  .catch(err => {
    if (err.name === 'AbortError') {
      // Request was aborted
    } else if (err.name === 'HTTPError') {
      // Bad response status
    } else {
      // Network problem or something else
    }
  });
```
