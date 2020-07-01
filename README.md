### [UNMAINTAINED]

This code can still be used but is no longer being maintained!

This type of report/functionality was added to the [CxSAST Custom Reporting](https://github.com/cxpsemea/cxsast_custom_reporting) tool because,  it made sense to have a ability to generate more than one type of report in the same tool instead of having it separated in two repositories.

Thee behavior and the report itself is pretty similar to this one but there are some minor particularities:

- **the data is no longer being fetched via SAST API**. Instead we are fetching by direct connection to the database due to some performance issues.
- the .html report file is no longer saved. Instead we (optionally) save the report as a pdf file but for this we need to have the Google Chrome .exe installed. See the [Configuration](https://cxpsemea.github.io/cxsast_custom_reporting/#/pages/CONFIGURATION) page for more details.

If none of this changes is a "deal breaker" for you, we strongly advise you to change to the [CxSAST Custom Reporting](https://github.com/cxpsemea/cxsast_custom_reporting). 

Please be sure to check the  [CxSAST Custom Reporting Documentation](https://cxpsemea.github.io/cxsast_custom_reporting/#/) an please contact us if you need any assistance.

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
| nameRegex  | String | required | A regex (/regularExpression/) that should match all projects names that will be used/selected for the report ex. /^app-.*/ |
| appName         | String | required | The name of the app that will be displayed on the report                                                                                                                                                              |
| emailSubject    | String | required | The email subject of the report                                                                                                                                                                                       |
| emailRecipients | String | required | A list of comma separated emails of the recipients of the report                                                                                                                                                       |

So the full command will look like this:

```powershell
.\cxsast_consolidated_report_v{latestVersion}_win_x64.exe --nameRegex '/^testProject-.*/' --appName "Test Project Reports" --emailSubject "Emails Test Subject" --emailRecipients "email1@mail.com, email2@mail.com"
```
