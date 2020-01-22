# Configuration

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

####Project tree
After all the configuration steps please make sure the folder tree looks like this:

```
├─ resources
|   └─ templates
|       └─ consolidated-report.html
├─ config.json
├─ cxsast_consolidated_report_v{version}_win_x64.exe
```
