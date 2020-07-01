# Utilization

In order to use the **CxSAST Consolidated Report** you just need to run the executable `cxsast_consolidated_report_v{latestVersion}_win_x64.exe` passing the following mandatory arguments prefixed with `--`

### Available Arguments

| Option          | Type   | Required | Description                                                                                                                                                                                                           |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nameRegex  | String | required | A regex (/regularExpression/) that should match all projects names that will be used/selected for the report ex. /^app-.*/ |
| appName         | String | required | The name of the app that will be displayed on the report                                                                                                                                                              |
| emailSubject    | String | required | The email subject of the report                                                                                                                                                                                       |
| emailRecipients | String | required | A list of comma separated emails of the recipients of the report                                                                                                                                                       |

So the full command will look like this:

```powershell
.\cxsast_consolidated_report_v{latestVersion}_win_x64.exe --nameRegex '/^testProject-.*/' --appName "Test Project Reports" --emailSubject "Emails Test Subject" --emailRecipients "email1@mail.com, email2@mail.com"
```
