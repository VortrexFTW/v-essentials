# v-servernames
## Cycles through a list of mottos/names and adds them to the server name every X seconds

### Config
* changeInterval = (Integer) time interval between name changes in milliseconds (1000ms = 1 second)
* randomNames = (Array) list of names to cycle through for changing server name

### Notes
* This resource does NOT change your original server name. It only appends a motto on the end.
* Starting the resource will append an entry from the list to the server name and begin the interval timer
* Stopping the resource will stop the interval timer and reset the server name back to whatever it was before this resource was started.