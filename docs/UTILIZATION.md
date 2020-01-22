# Utilization

In order to use the **CxSAST Consolidated Report** you just need to run the executable `cxsast_consolidated_report_v{latestVersion}_win_x64.exe` passing the following mandatory arguments prefixed wth `--`

### Available Arguments

| Option         | Type   | Required | Description                                                                        |
| -------------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| projectPattern | String | required | Should be a string to match project's name begining. This will be used by [str.startsWith()](https://www.w3schools.com/jsref/jsref_startswith.asp) node function to select all the projects started with this string|
| appName        | String | required | The name of the app that will be displayed on the report                           |
| emailSubject   | String | required | The email subject of the report                                                    |
| recievers      | String | required | A list of comma separated emails of the recievers of the report                    |

So the full command will look like this:

```shell
.\cxsast_consolidated_report_v{latestVersion}_win_x64.exe --projectPattern "Test project" --appName "Test Project Reports" --emailSubject "Emails Test Subject" --recievers "reciever1@mail.com, reciever1@mail.com"
```
