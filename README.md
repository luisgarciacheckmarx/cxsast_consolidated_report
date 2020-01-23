# CxSAST Consolidated Report

An utility to generate consolidated reports from the CxSast scanned projects.

This tool looks for the **last finished scans** of the selected projects and sends a consolidated report to a given mailing list. This way, its possible to combine scan results of multiple projects into one unique report giving the user(s) a full results overview of the selected projects.

This maybe more useful when a project is composed by multiple sub-projects for instance a project composed by multiple microservices that are being scanned independently.

## Installation

To get started with **CxSAST Consolidated Report** you just need to download the latest release and execute the `.exe` file.

## Configuration

In order to configure the **CxSAST Consolidated Report** utility please follow the instructions described bellow:

1. Duplicate the `config-sample.json` and name it as `config.json`
2. Edit the `config.json` file according to the following options:

### Available Options

| Option                 | Type   | Required | Description                                                                      |
| ---------------------- | ------ | -------- | -------------------------------------------------------------------------------- |
| host                   | String | required | The cxSast host url                                                              |
| username               | String | required | The cxSast username                                                              |
| password               | String | required | The cxSast password                                                              |
| email.host             | String | required | The email smtp server                                                            |
| email.port             | String | required | The email port                                                                   |
| email.sender           | String | required | The email address of the sender                                                  |
| email.password         | String | required | The email password                                                               |
| email.fallbackLocation | String | optional | The location where the reports will be saved in case of email(s) sending failure |

3. Create a `resources/templates` folder and place the template inside of it. By default the template is the consolidated-report.html file.

After all the configuration steps please make sure the folder tree looks like this:

```
├─ resources
|   └─ templates
|       └─ consolidated-report.html
├─ config.json
├─ cxsast_consolidated_report_v{version}_win_x64.exe
```

# Utilization

In order to use the **CxSAST Consolidated Report** you just need to run the executable `cxsast_consolidated_report_v{latestVersion}_win_x64.exe` passing the following mandatory arguments prefixed with `--`

### Available Arguments

| Option          | Type   | Required | Description                                                                                                                                                                                                           |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| projectPattern  | String | required | Should be a string to match project's name beginning. This will be used by [str.startsWith()](https://www.w3schools.com/jsref/jsref_startswith.asp) node function to select all the projects started with this string |
| appName         | String | required | The name of the app that will be displayed on the report                                                                                                                                                              |
| emailSubject    | String | required | The email subject of the report                                                                                                                                                                                       |
| emailRecipients | String | required | A list of comma separated emails of the recipients of the report                                                                                                                                                       |

So the full command will look like this:

```
.\cxsast_consolidated_report_v{latestVersion}_win_x64.exe --projectPattern "Test project" --appName "Test Project Reports" --emailSubject "Emails Test Subject" --emailRecipients "email1@mail.com, email2@mail.com"
```
