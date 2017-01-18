#Dynamo Utilities

Simple scripts to export and import dynamo db content
## Requirements

$ ruby --version
ruby 2.2.5p319 (2016-04-26 revision 54774) [x86_64-darwin13]

Ruby > 2.0. Macs have this by default, most Linuces do as well; if you get errors from AWS sdk installation
check that you're not trying to run against Ruby 1.8.x
Sometimes you have to run ruby2 and gem2 (or ruby2.2 gem2.2) instead of the ruby and gem commands below


You need the following gems installed:
 - aws-sdk-resources
 - trollop
 - awesome_print

you can do this by running:
```sudo gem install aws-sdk-resources trollop awesome_print``` at the commandline

## dynamo_export.rb

Dumps out the data content of a table into a JSON file

Usage:

```ruby ./dynamo_export.rb -t {table-name} > table_data.json```

## dynamo_import.rb

Imports the contents of a JSON data dump into a dynamodb table.  This is done using the BatchWrite functionality,
in batches of 25

Usage:

```ruby ./dynamo_import.rb -t {table-name} -d {data-file}.json```

