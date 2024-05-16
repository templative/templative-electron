Pyinstaller runs Python in an unsigned way.

https://haim.dev/posts/2020-08-08-python-macos-app/
https://stackoverflow.com/questions/62203321/pyinstaller-giving-error-error-loading-python-no-suitable-image-found/65663314#65663314
https://stackoverflow.com/questions/72973466/pyinstaller-error-mapped-file-has-no-team-id-and-is-not-a-platform-binary
https://github.com/pyinstaller/pyinstaller/wiki/Recipe-OSX-Code-Signing

The upshot is we need to add an entitlement:

```
<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<true/>
```
And sign the pysintaller `--codesign-identity "Developer ID Application: Go Next Games LLC (829PN2W7LK)"`

To prevent this error:
```
Error loading Python lib '/var/folders/4g/p6tq8s_j4tqf78675mcggp8m0000gn/T/_MEIGGXtjh/Python': 
    dlopen: dlopen(/var/folders/4g/p6tq8s_j4tqf78675mcggp8m0000gn/T/_MEIGGXtjh/Python, 0x000A): 
        tried: 
            '/var/folders/4g/p6tq8s_j4tqf78675mcggp8m0000gn/T/_MEIGGXtjh/Python' (code signature in <0535F2FD-5D8D-377D-A63D-F81C869BB8F7> '/private/var/folders/4g/p6tq8s_j4tqf78675mcggp8m0000gn/T/_MEIGGXtjh/Python.framework/Versions/3.11/Python' not valid for use in process: mapped file has no Team ID and is not a platform binary (signed with custom identity or adhoc?)), 
            '/private/var/folders/4g/p6tq8s_j4tqf78675mcggp8m0000gn/T/_MEIGGXtjh/Python.framework/Versions/3.11/Python' (code signature in <0535F2FD-5D8D-377D-A63D-F81C869BB8F7> '/private/var/folders/4g/p6tq8s_j4tqf78675mcggp8m0000gn/T/_MEIGGXtjh/Python.framework/Versions/3.11/Python' not valid for use in process: mapped file has no Team ID and is not a platform binary (signed with custom identity or adhoc?)), 
            '/System/Library/Frameworks/Python.framework/Versions/3.11/Python' (no such file)
```