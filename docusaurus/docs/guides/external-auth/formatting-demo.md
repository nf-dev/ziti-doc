# Code Block Formatting Demo

This here is a "plain" code block
```
results: total 12
drwxr-xr-x  5 user staff 160 Jan 28 12:34 .
drwxr-xr-x 20 user staff 640 Jan 28 12:34 ..
-rw-r--r--  1 user staff   0 Jan 28 12:34 file.txt
```

This here is a "example" block. an example with just results and no
matching "language" ends up rendering like a plain code block
```example
results: total 12
drwxr-xr-x  5 user staff 160 Jan 28 12:34 .
drwxr-xr-x 20 user staff 640 Jan 28 12:34 ..
-rw-r--r--  1 user staff   0 Jan 28 12:34 file.txt
```

This here is a "example" block that has bash attached to it but does
not have a command/code section
```example-bash
results: total 12
drwxr-xr-x  5 user staff 160 Jan 28 12:34 .
drwxr-xr-x 20 user staff 640 Jan 28 12:34 ..
-rw-r--r--  1 user staff   0 Jan 28 12:34 file.txt
```

This is the paragraph leading up to the example. the example
is down below this text. here is more text just to emulate
what a long bit of text before the example might look like.

```example-python
description:
this is a longer description. it's long. it's trying to be really,
really long just to put some words between you and the upcoming
example. more than the code below it. I'm just typing a bunch of stuff
here so that it is a lot

command:
ls -l

code:
print("Hello, World!")  # Python
print("Hello, World!")  # Python
print("Hello, World!")  # Python
results: the results go here
and this is fundd
```

```javascript
console.log("Hello, World!"); // JavaScript
```

```c
#include <stdio.h>
int main() { printf("Hello, World!\n"); return 0; } // C
```

```sh
echo "Hello, World!" # Bash
```
