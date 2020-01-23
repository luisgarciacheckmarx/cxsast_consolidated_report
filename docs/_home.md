# CxSAST Consolidated Report

An utility to generate consolidated reports from the CxSast scanned projects.

This tool looks for the **last finished scans** of the selected projects and sends a consolidated report to a given mailing list. This way, its possible to combine scan results of multiple projects into one unique report giving the user(s) a full results overview of the selected projects.

This maybe more useful when a project is composed by multiple sub-projects for instance a project composed by multiple microservices that are being scanned independently.